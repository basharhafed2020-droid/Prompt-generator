'use server';

/**
 * @fileOverview A flow that generates a specified number of unique and detailed image generation prompts based on a given niche, country, or theme.
 *
 * - generateImagePrompts - A function that generates image prompts.
 * - GenerateImagePromptsInput - The input type for the generateImagePrompts function.
 * - GenerateImagePromptsOutput - The return type for the generateImagePrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagePromptsInputSchema = z.object({
  topic: z.string().describe('The niche, country, or theme for generating image prompts.'),
  number: z.number().int().min(1).max(100).describe('The number of prompts to generate (1-100).'),
});
export type GenerateImagePromptsInput = z.infer<typeof GenerateImagePromptsInputSchema>;

const GenerateImagePromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of generated image generation prompts.'),
});
export type GenerateImagePromptsOutput = z.infer<typeof GenerateImagePromptsOutputSchema>;

export async function generateImagePrompts(input: GenerateImagePromptsInput): Promise<GenerateImagePromptsOutput> {
  return generateImagePromptsFlow(input);
}

const generateImagePromptsPrompt = ai.definePrompt({
  name: 'generateImagePromptsPrompt',
  input: {schema: GenerateImagePromptsInputSchema},
  output: {schema: GenerateImagePromptsOutputSchema},
  prompt: `You are an AI assistant specialized in generating unique image generation prompts.

  I will give you a topic (niche, country, or theme) and a number. You will generate that number of unique, detailed, and creative image generation prompts suitable for use in AI image generation sites like Midjourney, Leonardo, Firefly, and DALL·E.

  Topic: {{{topic}}}
  Number of prompts: {{{number}}}

  Instructions:
  1. Make each prompt unique and non-repetitive.
  2. Make each prompt detailed and concise, in the form of a command.
  3. Use English only.
  4. Start each prompt with a sequential number (1, 2, 3…).
  5. Do not add any extra text other than the prompts themselves.
  6. Do not use any unnecessary symbols.
  7. Do not include inappropriate content.
  8. Focus on visual details that help produce professional, high-quality images.
`,
});

const generateImagePromptsFlow = ai.defineFlow(
  {
    name: 'generateImagePromptsFlow',
    inputSchema: GenerateImagePromptsInputSchema,
    outputSchema: GenerateImagePromptsOutputSchema,
  },
  async input => {
    const {output} = await generateImagePromptsPrompt(input);
    return output!;
  }
);
