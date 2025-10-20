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
  prompt: `You are an AI assistant specialized in generating unique, highly-detailed, and artistic image generation prompts. Your goal is to create prompts that result in original compositions, avoiding clichés and generic stock photo aesthetics.

I will give you a topic (niche, country, or theme) and a number. You will generate that number of unique image generation prompts suitable for AI image generators like Midjourney, Leonardo, Firefly, and DALL·E.

Topic: {{{topic}}}
Number of prompts: {{{number}}}

Instructions:
1.  **Originality is Key:** Generate prompts for unique, original compositions that do not closely resemble existing stock images. Think about unexpected combinations, surreal concepts, and unconventional perspectives. Avoid generic scenes (e.g., "business people shaking hands").
2.  **Highly Descriptive:** Each prompt must be a detailed paragraph. Describe the camera angle (e.g., Dutch angle, drone shot), the setting's specific details, textures, the sky (e.g., stormy, aurora borealis), lighting (e.g., dramatic backlighting, chiaroscuro), color palette, overall mood, and a specific artistic style (e.g., afrofuturism, vaporwave, magical realism).
3.  **Use English only.**
4.  Start each prompt with a sequential number (1., 2., 3., etc.).
5.  Do not add any extra text other than the prompts themselves.
6.  Do not use any unnecessary symbols.
7.  Do not include inappropriate content.
8.  **Example of a good, detailed, and original prompt:** "A cinematic low-angle shot from inside a bioluminescent cave, where glowing crystalline structures illuminate an ancient, moss-covered library. A lone scholar, dressed in futuristic robes, is studying a holographic star map projected from a floating artifact. The air is thick with shimmering spores, and the lighting is a mix of cool blues from the crystals and warm golds from the hologram, creating a stark contrast. The mood is one of quiet discovery and ancient mystery, rendered in a style that blends science fiction with dark fantasy."
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
