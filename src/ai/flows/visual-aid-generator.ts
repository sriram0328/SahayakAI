'use server';

import {
  generateVisualAidAsset,
  VisualAidStyle,
} from '@/lib/gemini';

export interface GenerateVisualAidInput {
  prompt: string;
  style?: VisualAidStyle;
  outputType?: 'image' | 'svg';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export interface GenerateVisualAidOutput {
  mediaUrl: string;
  enrichedPrompt?: string;
}

export async function generateVisualAid(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  try {
    const result = await generateVisualAidAsset({
      prompt: input.prompt,
      style: input.style || 'textbook',
      outputType: input.outputType || 'image',
      aspectRatio: input.aspectRatio || '4:3',
    });
    return result;
  } catch (error) {
    console.error('Visual aid generation failed in generateVisualAid flow:', error);
    throw new Error('Failed to generate visual aid. Please try again.');
  }
}
