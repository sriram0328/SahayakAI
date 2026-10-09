'use server';

import { generateMultimodalWithGemini, generateTextWithGemini } from '@/lib/gemini';

export interface GenerateDifferentiatedWorksheetsInput {
  textbookPagePhotoDataUri: string;
}

export interface GenerateDifferentiatedWorksheetsOutput {
  easyWorksheet: string;
  intermediateWorksheet: string;
  advancedWorksheet: string;
}

export async function generateDifferentiatedWorksheets(
  input: GenerateDifferentiatedWorksheetsInput
): Promise<GenerateDifferentiatedWorksheetsOutput> {
  try {
    const dataUri = input.textbookPagePhotoDataUri;
    const matches = dataUri.match(
      /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,([\s\S]+)$/
    );

    const promptText = `Analyze the uploaded textbook page carefully. Extract the key learning concepts, subject matter, definitions, and problems shown.
Based strictly on the content from this textbook page, generate three distinct, tiered worksheets formatted in Markdown:

1. "easyWorksheet" (Foundational level):
   - Recall questions, true/false, fill-in-the-blanks, vocabulary matching.
   - Designed to build confidence and reinforce fundamental facts.

2. "intermediateWorksheet" (Application level):
   - Short explanations, 'how' and 'why' questions, diagrams interpretation, guided examples.
   - Designed for conceptual understanding and application.

3. "advancedWorksheet" (Higher Order Thinking / HOTS):
   - Synthesis questions, analytical reasoning, problem solving, creative edge cases, hypothesis evaluation.
   - Designed to challenge gifted and advanced students.

Return your response as a valid JSON object matching this schema:
{
  "easyWorksheet": "...",
  "intermediateWorksheet": "...",
  "advancedWorksheet": "..."
}
Return ONLY the raw JSON object. Do not wrap in extra commentary.`;

    let resultJsonStr = '';

    if (matches && matches[1] && matches[2]) {
      const mimeType = matches[1];
      const base64Data = matches[2].trim();

      resultJsonStr = await generateMultimodalWithGemini({
        prompt: promptText,
        imageMimeType: mimeType,
        imageBase64: base64Data,
        systemInstruction:
          'You are an expert pedagogical differentiation specialist who creates tiered classroom worksheets from textbook materials.',
      });
    } else {
      // If image URI format is unusual or text-based
      resultJsonStr = await generateTextWithGemini({
        prompt: promptText,
        systemInstruction:
          'You are an expert pedagogical differentiation specialist who creates tiered classroom worksheets from textbook materials.',
      });
    }

    // Try parsing JSON
    try {
      const cleaned = resultJsonStr
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      const parsed = JSON.parse(cleaned);

      if (
        parsed.easyWorksheet &&
        parsed.intermediateWorksheet &&
        parsed.advancedWorksheet
      ) {
        return {
          easyWorksheet: parsed.easyWorksheet,
          intermediateWorksheet: parsed.intermediateWorksheet,
          advancedWorksheet: parsed.advancedWorksheet,
        };
      }
    } catch (parseError) {
      console.error(
        'Failed to parse JSON for differentiated worksheets, falling back to structured split:',
        parseError
      );
    }

    return {
      easyWorksheet: `### Level 1: Foundational Practice\n\n${resultJsonStr}`,
      intermediateWorksheet: `### Level 2: Intermediate Conceptual Practice\n\n${resultJsonStr}`,
      advancedWorksheet: `### Level 3: Advanced Analytical Practice\n\n${resultJsonStr}`,
    };
  } catch (error) {
    console.error('Worksheet generation failed in generateDifferentiatedWorksheets:', error);
    throw new Error('Failed to generate worksheets from textbook image with AI. Please try again.');
  }
}
