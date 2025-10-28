
'use server';

import {
  generateImagePrompts,
} from '@/ai/flows/generate-image-prompts';
import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

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

  // This part is tricky as Server Actions don't have direct access to client-side auth state.
  // A common pattern is to pass the user ID or a session token, but for this app,
  // we'll rely on a placeholder `userId` as we don't have full session management in actions yet.
  // In a real app, you'd get this from a session.
  const userId = formData.get('userId');

  if (!userId || typeof userId !== 'string') {
      return {
          message: 'User not authenticated.',
          errors: null,
          prompts: [],
      }
  }


  try {
    const result = await generateImagePrompts(validatedFields.data);
    
    // Save to Firestore
    try {
        const adminApp = await initializeFirebaseAdmin();
        const firestore = getFirestore(adminApp);
        
        await firestore.collection(`users/${userId}/prompts`).add({
            userId: userId,
            topic: validatedFields.data.topic,
            number: validatedFields.data.number,
            unique: validatedFields.data.unique,
            prompts: result.prompts,
            createdAt: new Date().toISOString(),
        });
        
    } catch(e) {
        console.error("Firestore save error:", e);
        // We don't block the user if saving fails, but we log the error.
        // It could return a specific message if needed.
    }
    
    revalidatePath('/');

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
