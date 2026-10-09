'use server';

import { generateTextWithGemini } from '@/lib/gemini';

export interface SyllabusInput {
  board: string;
  className: string;
  subject: string;
}

export type SyllabusOutput = string;

export async function generateSyllabus(
  input: SyllabusInput
): Promise<SyllabusOutput> {
  try {
    const prompt = `You are an expert curriculum consultant on Indian school education boards (including NCERT, CBSE, and State Boards like AP SCERT).
Provide the official, comprehensive syllabus curriculum breakdown for:
- Board: ${input.board}
- Class / Grade: ${input.className}
- Subject: ${input.subject}

Structure your response in clear, well-organized Markdown:
1. Course Overview & Key Learning Competencies
2. Unit-by-Unit Breakdown with Chapter Titles, Core Concepts, and Subtopics
3. Practical / Laboratory / Project Work Guidelines (if applicable)
4. Recommended Reference Textbooks and Teaching Hours per unit`;

    const syllabus = await generateTextWithGemini({
      prompt,
      systemInstruction:
        'You are an authoritative curriculum specialist with encyclopedic knowledge of Indian educational boards.',
    });

    return syllabus;
  } catch (error) {
    console.error('Syllabus generation failed in generateSyllabus:', error);
    throw new Error('Failed to generate syllabus with AI. Please try again.');
  }
}

export interface TextbookSearchInput {
  board: string;
  className: string;
  subject: string;
  query: string;
}

export type TextbookSearchOutput = string;

export async function searchNcertTextbook(
  input: TextbookSearchInput
): Promise<TextbookSearchOutput> {
  try {
    const prompt = `You are an expert textbook tutor specialized in school textbooks for ${input.board}.
Board: ${input.board}
Grade/Class: ${input.className}
Subject: ${input.subject}

Student Question / Topic Query:
"${input.query}"

Provide a pedagogical explanation that:
1. Directly addresses the query aligned with how it is taught in official textbooks for this class level.
2. Explains the core scientific/mathematical/historical facts clearly with stepwise logic.
3. Highlights key terms, definitions, formulas, or timeline dates.
4. Includes 2-3 self-test revision questions for the student at the end.

Format with clear Markdown headers, bold terms, and structured bullet points.`;

    const result = await generateTextWithGemini({
      prompt,
      systemInstruction:
        'You are an expert school tutor answering student textbook questions directly from curriculum sources.',
    });

    return result;
  } catch (error) {
    console.error('Textbook search failed in searchNcertTextbook:', error);
    throw new Error('Failed to search textbook concepts with AI. Please try again.');
  }
}
