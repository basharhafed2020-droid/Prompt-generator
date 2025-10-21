
'use server';

import {
  generateImagePrompts,
} from '@/ai/flows/generate-image-prompts';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty.'),
  number: z.coerce
    .number()
    .int()
    .min(1, 'Number must be at least 1.')
    .max(100, 'Number cannot exceed 100.'),
  unique: z.boolean(),
});

type FormState = {
    message: string | null;
    errors: {
        topic?: string[];
        number?: string[];
    } | null;
    prompts: string[];
}

export async function handleGeneratePrompts(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    topic: formData.get('topic'),
    number: formData.get('number'),
    unique: formData.get('unique') === 'on',
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      prompts: [],
    };
  }

  try {
    const result = await generateImagePrompts(validatedFields.data);
    return {
      message: 'Success',
      errors: null,
      prompts: result.prompts,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while generating prompts. Please try again.',
      errors: null,
      prompts: [],
    };
  }
}
