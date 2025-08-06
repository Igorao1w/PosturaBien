'use server';

import { personalizeTestimonial, PersonalizeTestimonialInput, PersonalizeTestimonialOutput } from '@/ai/flows/personalize-testimonial';
import { z } from 'zod';

const ActionInputSchema = z.object({
  age: z.number().min(18, "La edad debe ser mayor a 18.").max(100),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Por favor seleccione un género." })}),
  painLocation: z.string().min(3, "La ubicación del dolor es requerida."),
  painLevel: z.number().min(1).max(10),
  activityLevel: z.string().min(3, "El nivel de actividad es requerido."),
});

export async function getPersonalizedTestimonial(
  input: PersonalizeTestimonialInput
): Promise<{ success: boolean; data: PersonalizeTestimonialOutput | null; error: string | null }> {
  
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
