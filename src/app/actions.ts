
'use server';

import { personalizeTestimonial, PersonalizeTestimonialInput, PersonalizeTestimonialOutput } from '@/ai/flows/personalize-testimonial';
import { z } from 'zod';
import { headers } from 'next/headers';

const ActionInputSchema = z.object({
  age: z.coerce.number()
    .min(18, "La edad debe ser mayor a 18.")
    .max(100, "La edad no puede ser mayor a 100."),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Por favor seleccione un género." })}),
  painLocation: z.string().min(3, "La ubicación del dolor es requerida."),
  painLevel: z.coerce.number().min(1).max(10),
  activityLevel: z.string().min(3, "El nivel de actividad es requerido."),
});

export async function getPersonalizedTestimonial(
  input: PersonalizeTestimonialInput
): Promise<{ success: boolean; data: PersonalizeTestimonialOutput | null; error: string | null }> {
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the environment.');
    return { success: false, data: null, error: 'La configuración del servidor está incompleta. El servicio de IA no está disponible.' };
  }

  const validationResult = ActionInputSchema.safeParse(input);

  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors.map(e => e.message).join(' ');
    return { success: false, data: null, error: errorMessage };
  }
  
  try {
    const result = await personalizeTestimonial(validationResult.data);
    return { success: true, data: result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, data: null, error: 'No se pudo generar el testimonio. Intente de nuevo más tarde.' };
  }
}


const OrderFormSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio.').refine(value => value.trim().split(/\s+/).length >= 2, {
    message: 'Por favor, ingresa tu nombre y apellido.',
  }),
  whatsapp: z.string().min(10, 'El número de WhatsApp debe tener 10 dígitos.').max(10, 'El número de WhatsApp debe tener 10 dígitos.').regex(/^3\d{9}$/, 'El número de WhatsApp debe empezar por 3 y tener 10 dígitos.'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres.'),
  size: z.string({ required_error: "Por favor, selecciona una talla." }),
  additionalInfo: z.string().optional(),
  addBump: z.boolean().optional(),
  bumpSize: z.string().optional(),
}).refine(data => {
    if (data.addBump && !data.bumpSize) {
        return false;
    }
    return true;
}, {
    message: "Por favor, selecciona una talla para el segundo corrector.",
    path: ["bumpSize"],
});

async function sendOrderToUTMify(formData: z.infer<typeof OrderFormSchema>) {
  const head = headers();
  const ip = head.get('x-forwarded-for') ?? '127.0.0.1';

  const orderId = `PB-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const products = [
    {
      "id": "CORRETOR01",
      "name": "Corretor de Postura",
      "quantity": 1,
      "priceInCents": 11990000,
      "talla": formData.size
    }
  ];

  let totalPriceInCents = 11990000;

  if (formData.addBump && formData.bumpSize) {
    products.push({
      "id": "CORRETOR02",
      "name": "Corretor de Postura (Order Bump)",
      "quantity": 1,
      "priceInCents": 6990000,
      "talla": formData.bumpSize
    });
    totalPriceInCents += 6990000;
  }

  const payload = {
    "orderId": orderId,
    "platform": "PosturaBien",
    "paymentMethod": "contra_entrega",
    "status": "pending",
    "createdAt": createdAt,
    "approvedDate": null,
    "refundedAt": null,
    "customer": {
      "name": formData.fullName,
      "email": `${formData.whatsapp}@posturabien.com`, // Using whatsapp as a placeholder for email
      "phone": formData.whatsapp,
      "document": null,
      "country": "CO",
      "ip": ip
    },
    "products": products,
    "trackingParameters": {}, // UTM parameters are captured client-side by the script
    "commission": {
      "totalPriceInCents": totalPriceInCents,
      "gatewayFeeInCents": 0,
      "userCommissionInCents": totalPriceInCents,
      "currency": "COP"
    },
    "isTest": true
  };

  try {
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': 'WDCjG35TnYM5tgZISXenpT3revSPrkTeEwtO'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('UTMify API Error:', response.status, errorBody);
    } else {
        console.log('Order successfully sent to UTMify API');
    }
  } catch (error) {
    console.error('Failed to send order to UTMify API:', error);
  }
}

export async function submitOrder(
  formData: z.infer<typeof OrderFormSchema>
): Promise<{ success: boolean; error?: string }> {
  const validationResult = OrderFormSchema.safeParse(formData);

  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors.map(e => `-${e.message}`).join('\n');
    return { success: false, error: `⚠️ Por favor revisa tus datos:\n${errorMessage}` };
  }

  // Send to UTMify first
  await sendOrderToUTMify(validationResult.data);

  const webhookUrl = 'https://hooks.zapier.com/hooks/catch/24459468/uhppq43/';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationResult.data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Webhook response not OK:', response.status, errorBody);
      return { success: false, error: `No se pudo procesar el pedido (Error: ${response.status}). Por favor, verifica tus datos e intenta de nuevo.` };
    }

  } catch (error) {
    console.error('Error sending data to webhook:', error);
    if (error instanceof Error && 'cause' in error && (error.cause as any)?.code === 'ENOTFOUND') {
         return { success: false, error: 'Ocurrió un error de red. Por favor, revisa tu conexión a internet e inténtalo de nuevo.' };
    }
    return { success: false, error: 'Ocurrió un error inesperado al enviar tu pedido. Por favor, inténtelo de nuevo más tarde.' };
  }
  
  console.log("Order submitted:", validationResult.data);
  
  return { success: true };
}
