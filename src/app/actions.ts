
'use server';

import { personalizeTestimonial, PersonalizeTestimonialInput, PersonalizeTestimonialOutput } from '@/ai/flows/personalize-testimonial';
import { z } from 'zod';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

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
  size: z.string({ required_error: "Por favor, selecciona una talla." }).min(1, "Por favor, selecciona una talla."),
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

type OrderFormData = z.infer<typeof OrderFormSchema>;

async function sendOrderToUtmify(formData: OrderFormData) {
  const utmifyApiToken = 'foNPekl8GfmVjd3ttVRczxDwPXBV5Thspwh6';
  const utmifyEndpoint = 'https://api.utmify.com.br/api-credentials/orders';
  const headerList = headers();
  const userIp = headerList.get('x-forwarded-for') || '0.0.0.0';

  const orderId = "FORM-" + Date.now();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const products = [
    {
      id: "CORRECTOR01",
      name: "Corrector de Postura",
      quantity: 1,
      priceInCents: 11990000,
      planId: null,
      planName: null,
    }
  ];

  let totalPriceInCents = 11990000;

  if (formData.addBump && formData.bumpSize) {
    products.push({
      id: "CORRECTOR02_BUMP",
      name: "Corrector de Postura (Order Bump)",
      quantity: 1,
      priceInCents: 6990000,
      planId: null,
      planName: null,
    });
    totalPriceInCents += 6990000;
  }

  const payload = {
    orderId: orderId,
    platform: "PosturaBien",
    paymentMethod: "free_price",
    status: "paid",
    createdAt: now,
    approvedDate: now,
    refundedAt: null,
    customer: {
      name: formData.fullName,
      email: `${formData.whatsapp}@email.com`, // Placeholder email
      phone: formData.whatsapp,
      document: null,
      country: "CO",
      ip: userIp
    },
    products: products,
    trackingParameters: { // UTMify script on client-side will capture these. Sending empty is fine.
      src: null,
      sck: null,
      utm_source: null,
      utm_campaign: null,
      utm_medium: null,
      utm_content: null,
      utm_term: null
    },
    commission: {
      totalPriceInCents: totalPriceInCents,
      gatewayFeeInCents: 0,
      userCommissionInCents: totalPriceInCents,
      currency: "COP"
    },
    isTest: false
  };
  
  try {
    const response = await fetch(utmifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': utmifyApiToken,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('UTMify API Error:', response.status, JSON.stringify(errorBody, null, 2));
    } else {
        const successBody = await response.json();
        console.log('Order successfully sent to UTMify API:', JSON.stringify(successBody, null, 2));
    }
  } catch (error) {
    console.error('Error sending data to UTMify API:', error);
  }
}

async function sendUtmifyConversion(values: OrderFormData) {
  const payload = {
    orderId: "FORM-" + Date.now(),
    platform: "firebase_form",
    paymentMethod: "cash_on_delivery",
    status: "paid",
    createdAt: new Date().toISOString(),
    approvedDate: new Date().toISOString(),
    customer: {
      name: values.fullName,
      email: `${values.whatsapp}@email.com`,
    },
    products: [{
      id: "P001",
      name: "Corrector de Postura",
      quantity: 1,
      priceInCents: 0
    }],
    isTest: false
  };

  try {
    const response = await fetch("https://api.utmify.com.br/v1/conversions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": "OKO1TOpLyGjmWOScW0M9m8z0mL8xtORqD3ai"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("Venda registrada na UTMfy 🚀");
    } else {
      console.error("UTMify API Error:", await response.json());
    }
  } catch (error) {
    console.error("Network error sending to UTMify:", error);
  }
}


export async function submitOrder(
  formData: OrderFormData
): Promise<{ success: boolean; error?: string }> {
  const validationResult = OrderFormSchema.safeParse(formData);

  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors.map(e => `-${e.message}`).join('\n');
    return { success: false, error: `⚠️ Por favor revisa tus datos:\n${errorMessage}` };
  }
  
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
  
  console.log("Order submitted to Zapier:", validationResult.data);
  
  // Send data to UTMify API after successful Zapier submission
  await sendOrderToUtmify(validationResult.data);
  // Send conversion data to UTMify
  await sendUtmifyConversion(validationResult.data);


  return { success: true };
}
