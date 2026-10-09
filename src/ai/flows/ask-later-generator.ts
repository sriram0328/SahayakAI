'use server';

import {
  generateTextWithGemini,
  generateSpeechWithGemini,
  generateEducationalImageUrl,
} from '@/lib/gemini';

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

    const [audioUri, imageResult] = await Promise.all([
      generateSpeechWithGemini(answer.substring(0, 400), 'Kore').catch((err) => {
        console.error('Audio generation for Ask Later failed:', err);
        return '';
      }),
      generateEducationalImageUrl(
        `Educational diagram explaining: ${input.question}`,
        'textbook',
        '16:9'
      ).catch((err) => {
        console.error('Image generation for Ask Later failed:', err);
        return {
          url: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/768/432`,
          enrichedPrompt: '',
        };
      }),
    ]);

    return {
      answer,
      imageUrl: imageResult.url,
      audioDataUri: audioUri,
    };
  } catch (error) {
    console.error('Ask later resolution failed in generateAnswerForLater:', error);
    throw new Error('Failed to generate answer for queued question with AI. Please try again.');
  }
}
