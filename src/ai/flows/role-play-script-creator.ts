'use server';

import { generateTextWithGemini, generateSpeechWithGemini } from '@/lib/gemini';

export interface GenerateRolePlayScriptInput {
  topic: string;
  characters?: string;
  setting?: string;
  language: string;
}

export interface GenerateAudioForScriptOutput {
  audioDataUri?: string;
}

export async function generateRolePlayScript(
  input: GenerateRolePlayScriptInput
): Promise<string> {
  try {
    const charactersContext = input.characters
      ? `Characters to include: ${input.characters}`
      : 'Invent 2 to 3 appropriate, distinct characters for this scenario.';

    const settingContext = input.setting
      ? `Setting/Location: ${input.setting}`
      : 'Set in a realistic, relatable school or everyday community environment.';

    const prompt = `You are a creative drama teacher and scriptwriter for educational classroom performances.
Write a concise, engaging role-play script in ${input.language} based on the following:

Topic / Learning Objective: "${input.topic}"
${charactersContext}
${settingContext}

Requirements:
1. Target length: 8 to 14 lines of natural dialogue suitable for a quick classroom reading or performance.
2. Structure strictly in Markdown:
   **Character Name:** Dialogue line here.
   *(Optional stage direction in italics)*
3. Make each line easy to read aloud with expressive educational value.
4. Reinforce positive social values, clear communication, or subject-specific problem-solving.`;

    const script = await generateTextWithGemini({
      prompt,
      systemInstruction:
        'You are an expert educational scriptwriter creating role-play dialogues for students.',
    });

    return script;
  } catch (error) {
    console.error('Role-play script generation failed in generateRolePlayScript:', error);
    throw new Error('Failed to generate role-play script with AI. Please try again.');
  }
}

export async function generateAudioForScript(
  scriptText: string
): Promise<GenerateAudioForScriptOutput> {
  try {
    const audioDataUri = await generateSpeechWithGemini(scriptText, 'Kore');
    return { audioDataUri };
  } catch (error) {
    console.error('Role-play audio generation failed in generateAudioForScript:', error);
    return { audioDataUri: undefined };
  }
}
