
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

function getUTCDateTimeStringWithBuffer(): string {
  const now = new Date();
  // Add a 5-second buffer to account for potential clock skew or network latency
  now.setSeconds(now.getSeconds() + 5);
  
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = now.getUTCDate().toString().padStart(2, '0');
  const hours = now.getUTCHours().toString().padStart(2, '0');
  const minutes = now.getUTCMinutes().toString().padStart(2, '0');
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


async function sendToZapierWebhook(formData: OrderFormData, orderId: string) {
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/24459468/uhppq43/';
    const payload = {
        orderId: orderId,
        ...formData
    };
    try {
        const response = await fetch(zapierWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            console.error('Zapier Webhook Error:', response.status, await response.text());
        } else {
            console.log('Order successfully sent to Zapier Webhook.');
        }
    } catch (error) {
        console.error('Error sending data to Zapier Webhook:', error);
    }
}


async function sendOrderToUtmify(formData: OrderFormData, orderId: string, utcTimestamp: string) {
  const utmifyApiToken = 'Kxg5AE6px0i8XfEfOIBO14JwwqsHpbQw2V0f';
  const utmifyEndpoint = `https://api.utmify.com.br/api-credentials/orders`;
  const headerList = headers();
  const userIp = headerList.get('x-forwarded-for') || '0.0.0.0';
  
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
    createdAt: utcTimestamp,
    approvedDate: utcTimestamp,
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
    trackingParameters: { 
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
      console.error('UTMify API Error (orders):', response.status, JSON.stringify(errorBody, null, 2));
    } else {
        const successBody = await response.json();
        console.log('Order successfully sent to UTMify API (orders):', JSON.stringify(successBody, null, 2));
    }
  } catch (error) {
    console.error('Error sending data to UTMify API (orders):', error);
  }
}

async function sendUtmifyConversion(values: OrderFormData, orderId: string, utcTimestamp: string) {
  const payload = {
    orderId: orderId,
    platform: "firebase_form",
    paymentMethod: "cash_on_delivery",
    status: "paid",
    createdAt: utcTimestamp,
    approvedDate: utcTimestamp,
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
      const errorBody = await response.json();
      console.error("UTMify API Error (conversions):", response.status, JSON.stringify(errorBody, null, 2));
    }
  } catch (error) {
    console.error("Network error sending to UTMify (conversions):", error);
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
  
  const uniqueOrderId = `FORM-${randomUUID()}`;
  const utcTimestamp = getUTCDateTimeStringWithBuffer();

  try {
    await sendToZapierWebhook(validationResult.data, uniqueOrderId);
    await sendOrderToUtmify(validationResult.data, uniqueOrderId, utcTimestamp);
    await sendUtmifyConversion(validationResult.data, uniqueOrderId, utcTimestamp);
  } catch (error) {
      console.error('An unexpected error occurred during submission process:', error);
      if (error instanceof Error && 'cause' in error && (error.cause as any)?.code === 'ENOTFOUND') {
           return { success: false, error: 'Ocurrió un error de red. Por favor, revisa tu conexión a internet e inténtalo de nuevo.' };
      }
      return { success: false, error: 'Ocurrió un error inesperado al enviar tu pedido. Por favor, inténtelo de nuevo más tarde.' };
  }
  
  console.log("Order submitted with ID:", uniqueOrderId);

  return { success: true };
}
