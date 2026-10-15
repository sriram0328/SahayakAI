'use server';

import {
  generateTextWithGemini,
  generateSpeechWithGemini,
  generateEducationalImageUrl,
} from '@/lib/gemini';
import { searchEducationalWebImages } from '@/lib/educational-images';

export interface GenerateAnswerForLaterInput {
  question: string;
  language?: string;
}

export interface GenerateAnswerForLaterOutput {
  answer: string;
  imageUrl: string;
  audioDataUri: string;
}

export async function generateAnswerForLater(
  input: GenerateAnswerForLaterInput
): Promise<GenerateAnswerForLaterOutput> {
  try {
    const language = input.language || 'English';

    const prompt = `You are an AI co-teacher answering a curious student question that was saved for later review.
Student's Question: "${input.question}"
Language: ${language}

Provide a comprehensive, engaging, and clear pedagogical answer:
1. Explain the answer directly and accurately in ${language}.
2. Provide a memorable analogy or real-life comparison to cement understanding.
3. Suggest an easy thought experiment or practical observation the student can try.
4. Format in clean, readable Markdown with headings and bullet points.`;

    const answer = await generateTextWithGemini({
      prompt,
      systemInstruction:
        'You are an expert, encouraging teacher resolving queued classroom questions thoroughly.',
    });

    // 1. Try to fetch high quality educational diagram from web first
    let visualUrl = '';
    try {
      const webResults = await searchEducationalWebImages(input.question, 1);
      if (webResults.length > 0 && webResults[0].url) {
        visualUrl = webResults[0].url;
      }
    } catch (err) {
      console.error('Web image lookup for Ask Later failed, falling back to AI:', err);
    }

    // 2. Fall back to AI image if no web diagram found
    if (!visualUrl) {
      try {
        const aiImg = await generateEducationalImageUrl(
          `Educational diagram explaining: ${input.question}`,
          'textbook',
          '16:9'
        );
        visualUrl = aiImg.url;
      } catch (err) {
        console.error('AI image generation for Ask Later failed:', err);
        visualUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/768/432`;
      }
    }

    const audioUri = await generateSpeechWithGemini(answer.substring(0, 400), 'Kore').catch((err) => {
      console.error('Audio generation for Ask Later failed:', err);
      return '';
    });

    return {
      answer,
      imageUrl: visualUrl,
      audioDataUri: audioUri,
    };
  } catch (error) {
    console.error('Ask later resolution failed in generateAnswerForLater:', error);
    throw new Error('Failed to generate answer for queued question with AI. Please try again.');
  }
}
