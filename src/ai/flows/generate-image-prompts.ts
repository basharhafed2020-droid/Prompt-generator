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
  unique: z.boolean().describe('Whether to generate unique, original compositions that do not resemble stock images.'),
});
export type GenerateImagePromptsInput = z.infer<typeof GenerateImagePromptsInputSchema>;

const GenerateImagePromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of generated image generation prompts.'),
});
export type GenerateImagePromptsOutput = z.infer<typeof GenerateImagePromptsOutputSchema>;

export async function generateImagePrompts(input: GenerateImagePromptsInput): Promise<GenerateImagePromptsOutput> {
  const result = await generateImagePromptsFlow(input);
  // Post-process to ensure numbering is correct and content adheres to rules.
  // The model can sometimes fail to follow numbering instructions perfectly.
  const cleanedPrompts = result.prompts.map((p) => {
    // Remove any existing numbering like "1. " or "1) "
    const textOnly = p.replace(/^\d+[\.\)]\s*/, '');
    // The main function will add numbering back.
    return textOnly;
  });
  return { prompts: cleanedPrompts };
}

const generateImagePromptsPrompt = ai.definePrompt({
  name: 'generateImagePromptsPrompt',
  input: {schema: GenerateImagePromptsInputSchema},
  output: {schema: GenerateImagePromptsOutputSchema},
  prompt: `You are an AI assistant specialized in generating unique, highly-detailed, and artistic image generation prompts for landscapes, architecture, and inanimate objects.

I will give you a topic (niche, country, or theme) and a number. You will generate that number of unique image generation prompts suitable for AI image generators like Midjourney, Leonardo, Firefly, and DALL·E.

Topic: {{{topic}}}
Number of prompts: {{{number}}}

**CRITICAL INSTRUCTIONS:**
1.  **NO LIVING BEINGS:** Absolutely NO humans, animals, spirits, or any living creatures in the prompts. Focus strictly on landscapes, cityscapes, architecture, nature, and inanimate objects. This is a strict rule.
2.  **Explicit Naming:** If the topic is a country, you MUST explicitly mention the country's name or a related adjective (e.g., "Yemeni" for Yemen) in every single prompt.
3.  **Incorporate Famous Landmarks:** When the topic is a country, you MUST prioritize and include its most famous and important historical and natural landmarks.
4.  **Detailed Paragraphs:** Each prompt must be a detailed paragraph. Describe the camera angle (e.g., Dutch angle, drone shot), the setting's specific details, textures, the sky (e.g., stormy, aurora borealis), lighting (e.g., dramatic backlighting, chiaroscuro), color palette, overall mood, and a specific artistic style (e.g., afrofuturism, vaporwave, magical realism).
{{#if unique}}
5.  **Originality is Key:** Generate prompts for unique, original compositions that do not closely resemble existing stock images. Think about unexpected combinations, surreal concepts, and unconventional perspectives. Avoid generic scenes.
6.  **Example of a good, detailed, and original prompt:** "A cinematic low-angle shot from inside a bioluminescent cave on Socotra Island, Yemen, where glowing crystalline structures illuminate an ancient, moss-covered library filled with stone tablets. The air is thick with shimmering spores, and the lighting is a mix of cool blues from the crystals and warm golds from a single beam of dawn light, creating a stark contrast. The mood is one of quiet discovery and ancient mystery, rendered in a style that blends science fiction with dark fantasy."
{{/if}}
7.  Use English only.
8.  Do not add any extra text other than the prompts themselves.
9.  Do not use any unnecessary symbols.
10. Do not include inappropriate content.
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
