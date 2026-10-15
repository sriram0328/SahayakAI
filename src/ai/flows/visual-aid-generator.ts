'use server';

import {
  generateVisualAidAsset,
  VisualAidStyle,
} from '@/lib/gemini';
import {
  searchEducationalWebImages,
  EducationalWebImage,
} from '@/lib/educational-images';

export type SourceMode = 'web-first' | 'ai-only' | 'web-only';

export interface GenerateVisualAidInput {
  prompt: string;
  sourceMode?: SourceMode;
  style?: VisualAidStyle;
  outputType?: 'image' | 'svg';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export interface GenerateVisualAidOutput {
  mediaUrl: string;
  title: string;
  source: 'web' | 'ai';
  sourceLabel: string;
  webImages?: EducationalWebImage[];
  enrichedPrompt?: string;
}

export async function generateVisualAid(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  const sourceMode: SourceMode = input.sourceMode || 'web-first';

  // 1. Try web educational library first unless explicitly requested 'ai-only'
  if (sourceMode !== 'ai-only') {
    try {
      const webResults = await searchEducationalWebImages(input.prompt, 6);
      if (webResults.length > 0) {
        return {
          mediaUrl: webResults[0].url,
          title: webResults[0].title,
          source: 'web',
          sourceLabel: 'Verified Web Educational Library (Wikimedia Commons)',
          webImages: webResults,
        };
      }
    } catch (webErr) {
      console.error('Educational web image search failed, falling back to AI generation:', webErr);
    }
  }

  // 2. Fall back to AI generation
  try {
    const aiResult = await generateVisualAidAsset({
      prompt: input.prompt,
      style: input.style || 'textbook',
      outputType: input.outputType || 'image',
      aspectRatio: input.aspectRatio || '4:3',
    });

    return {
      mediaUrl: aiResult.mediaUrl,
      title: input.prompt,
      source: 'ai',
      sourceLabel: 'AI Generated Educational Illustration',
      enrichedPrompt: aiResult.enrichedPrompt,
    };
  } catch (aiErr) {
    console.error('Visual aid generation failed in generateVisualAid flow:', aiErr);
    throw new Error('Failed to generate visual aid. Please try again.');
  }
}
