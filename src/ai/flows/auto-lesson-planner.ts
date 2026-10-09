'use server';

import { generateTextWithGemini } from '@/lib/gemini';

export interface GenerateLessonPlanInput {
  weeklySyllabus: string;
}

export type GenerateLessonPlanOutput = string;

export async function generateLessonPlan(
  input: GenerateLessonPlanInput
): Promise<GenerateLessonPlanOutput> {
  try {
    const plan = await generateTextWithGemini({
      prompt: `You are an expert pedagogical curriculum designer and co-teacher assistant. Create a detailed, highly structured, practical lesson plan based on this weekly syllabus:

Syllabus:
"""
${input.weeklySyllabus}
"""

Include:
- 🎯 Core Learning Objectives & Key Competencies
- 📚 Day-by-Day Structured Teaching Breakdown
- 💡 Interactive Classroom Activities, Demonstrations, and Discussion Questions
- 📝 Formative Assessments, Homework, and Exit Tickets
- 🌟 Inclusive Differentiation Strategies for Diverse Learners

Format the response in clean, rich Markdown with clear sections, tables or bullet points.`,
      systemInstruction:
        'You are an experienced master teacher creating practical, comprehensive school lesson plans.',
    });
    return plan;
  } catch (error) {
    console.error('Lesson plan generation failed in generateLessonPlan:', error);
    throw new Error('Failed to generate lesson plan with AI. Please try again.');
  }
}
