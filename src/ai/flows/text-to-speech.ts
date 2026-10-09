'use server';

import { generateSpeechWithGemini } from '@/lib/gemini';

export type GenerateSpeechInput = string;

export interface GenerateSpeechOutput {
  audioDataUri: string;
}

export async function generateSpeech(
  input: GenerateSpeechInput
): Promise<GenerateSpeechOutput> {
  try {
    const audioDataUri = await generateSpeechWithGemini(input, 'Kore');
    return { audioDataUri };
  } catch (error) {
    console.error('Text-to-speech flow failed in generateSpeech:', error);
    throw new Error('Failed to generate speech with AI. Please try again.');
  }
}
