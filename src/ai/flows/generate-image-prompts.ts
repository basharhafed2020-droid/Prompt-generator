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
  prompt: `You are an AI assistant specialized in generating unique, highly-detailed image generation prompts.

I will give you a topic (niche, country, or theme) and a number. You will generate that number of unique, detailed, and creative image generation prompts suitable for use in AI image generation sites like Midjourney, Leonardo, Firefly, and DALL·E.

Topic: {{{topic}}}
Number of prompts: {{{number}}}

Instructions:
1.  Make each prompt unique and non-repetitive.
2.  Each prompt must be very descriptive and detailed, like a paragraph. Describe the camera angle (e.g., low-angle, wide-shot), the setting, the architecture, textures, the sky, lighting conditions (e.g., bright, diffused), color palette, overall mood, and artistic style.
3.  Use English only.
4.  Start each prompt with a sequential number (1., 2., 3., etc.).
5.  Do not add any extra text other than the prompts themselves.
6.  Do not use any unnecessary symbols.
7.  Do not include inappropriate content.
8.  Focus on visual details that help produce professional, high-quality, and photorealistic images.
9.  Here is an example of a good, detailed prompt: "A low-angle, wide-shot perspective captures the imposing Makkah Royal Clock Tower against a bright sky. The architecture is a blend of modern skyscraper design with Islamic architectural motifs, featuring intricate detailing on its facade, including decorative arches and patterned stonework in bright, sandy beige and terracotta tones. The tower itself is a colossal structure, its clock face prominently displayed at its apex, beneath a golden spire topped with a crescent moon. Adjacent to the main tower, older, more traditional minarets with slender, towering spires punctuate the skyline, their stone surfaces weathered and aged. The sky is a vibrant, dynamic canvas of bright blue, heavily textured with voluminous, white cumulus clouds that cast subtle brights, suggesting a bright, mid-day sun. The lighting is bright and slightly diffused, highlighting the architectural textures and casting distinct brights that add depth to the scene. The overall color palette is dominated by bright earth tones of the buildings, contrasting with the cool blues and whites of the sky, creating a visually striking and grand atmosphere. The mood is one of awe, grandeur, and spiritual significance, with a sense of bustling activity suggested by the blurred figures at the base of the buildings. The style is realistic, with a slightly saturated color saturation that enhances the vibrancy of the scene."
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
