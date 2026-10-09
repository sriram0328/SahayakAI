'use server';

import {
  GenerateHyperlocalContentInput,
  GenerateHyperlocalStoryAndImageOutput,
  GenerateAudioForStoryOutput,
} from './hyperlocal-content-generator.types';
import {
  generateTextWithGemini,
  generateSpeechWithGemini,
  generateEducationalImageUrl,
} from '@/lib/gemini';

export async function generateHyperlocalStoryAndImage(
  input: GenerateHyperlocalContentInput
): Promise<GenerateHyperlocalStoryAndImageOutput> {
  try {
    const prompt = `You are an acclaimed educator, cultural historian, and storyteller.
Create an engaging, rich, culturally grounded educational story for children in the language: ${input.language}.
Topic / Request: "${input.prompt}"

Guidelines:
1. Write entirely in ${input.language} (unless English is selected, then in English).
2. Ground the narrative in local traditions, geography, everyday community life, and inspiring values.
3. Structure the story with an intriguing beginning, an exciting dilemma or learning adventure, and a heartwarming, educational moral.
4. Keep the prose expressive yet accessible for school students.`;

    const [story, imageResult] = await Promise.all([
      generateTextWithGemini({
        prompt,
        systemInstruction:
          'You are a master storyteller creating vibrant, culturally relevant stories for young learners in their mother tongue.',
      }),
      generateEducationalImageUrl(
        `Heartwarming children's storybook illustration about: "${input.prompt}". Traditional cultural setting, colorful folk art style, expressive characters, scenic landscape`,
        'pencil',
        '16:9'
      ).catch((err) => {
        console.error('Visual image generation for story failed:', err);
        return {
          url: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/450`,
          enrichedPrompt: '',
        };
      }),
    ]);

    return {
      story,
      imageUrl: imageResult.url,
    };
  } catch (error) {
    console.error('Story generation failed in generateHyperlocalStoryAndImage:', error);
    throw new Error('Failed to generate story with AI. Please try again.');
  }
}

export async function generateAudioForStory(
  story: string,
  language: string
): Promise<GenerateAudioForStoryOutput> {
  try {
    const audioDataUri = await generateSpeechWithGemini(story, 'Kore');
    return { audioDataUri };
  } catch (error) {
    console.error('Audio generation for story failed in generateAudioForStory:', error);
    return { audioDataUri: undefined };
  }
}
