
import {z} from 'genkit';

export const GenerateHyperlocalContentInputSchema = z.object({
  prompt: z.string().describe('The prompt for the story in the local language.'),
  language: z.string().describe('The local language of the prompt.'),
});
export type GenerateHyperlocalContentInput = z.infer<typeof GenerateHyperlocalContentInputSchema>;

export const GenerateHyperlocalStoryAndImageOutputSchema = z.object({
  story: z.string().describe('The generated story in the local language.'),
  imageUrl: z.string().describe('A data URI of an illustration for the story.'),
});
export type GenerateHyperlocalStoryAndImageOutput = z.infer<typeof GenerateHyperlocalStoryAndImageOutputSchema>;

export const GenerateAudioForStoryOutputSchema = z.object({
    audioDataUri: z.string().optional().describe('A data URI of the spoken story.'),
});
export type GenerateAudioForStoryOutput = z.infer<typeof GenerateAudioForStoryOutputSchema>;
