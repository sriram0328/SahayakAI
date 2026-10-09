'use server';

import { generateTextWithGemini } from '@/lib/gemini';

export interface KnowledgeAssistantInput {
  question: string;
  language: string;
}

export interface KnowledgeAssistantOutput {
  answer: string;
}

export async function knowledgeAssistant(
  input: KnowledgeAssistantInput
): Promise<KnowledgeAssistantOutput> {
  try {
    const answer = await generateTextWithGemini({
      prompt: `You are Sahayak.AI, a warm, patient, and knowledgeable AI co-teacher for school students.
Please answer the following question in ${input.language || 'English'}:

Question: "${input.question}"

Guidelines:
1. Explain the core concept clearly and accurately at a school student's comprehension level.
2. Include a vivid, relatable real-world analogy to make it easy to understand and remember.
3. Add an interesting follow-up thought or fun fact.
4. Format using clean Markdown with clear headings and bullet points.`,
      systemInstruction:
        'You are Sahayak.AI, an empathetic, encouraging, and clear school teaching assistant.',
    });

    return { answer };
  } catch (error) {
    console.error('Knowledge assistant generation failed in knowledgeAssistant:', error);
    throw new Error('Failed to generate answer with AI. Please try again.');
  }
}
