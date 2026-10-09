import { GoogleGenAI } from '@google/genai';

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENAI_API_KEY ||
  '';

export const aiClient = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Text generation with automatic model fallback to handle demand spikes seamlessly.
 */
export async function generateTextWithGemini({
  prompt,
  systemInstruction,
  preferredModel = 'gemini-3.8-flash',
}: {
  prompt: string;
  systemInstruction?: string;
  preferredModel?: string;
}): Promise<string> {
  const modelsToTry = [
    preferredModel,
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      console.error(`Gemini generation failed on model ${model}:`, err);
      lastError = err;
    }
  }

  console.error('All Gemini model attempts exhausted for prompt:', prompt, lastError);
  throw lastError || new Error('Failed to generate text using Gemini models.');
}

/**
 * Multimodal generation with an image and text prompt.
 */
export async function generateMultimodalWithGemini({
  prompt,
  imageMimeType,
  imageBase64,
  systemInstruction,
}: {
  prompt: string;
  imageMimeType: string;
  imageBase64: string;
  systemInstruction?: string;
}): Promise<string> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: unknown = null;

  const imagePart = {
    inlineData: {
      mimeType: imageMimeType,
      data: imageBase64,
    },
  };
  const textPart = { text: prompt };

  for (const model of modelsToTry) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] },
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      console.error(`Gemini multimodal generation failed on model ${model}:`, err);
      lastError = err;
    }
  }

  console.error('All multimodal attempts failed:', lastError);
  throw lastError || new Error('Failed to process image with Gemini.');
}

/**
 * Text to speech generation using gemini-3.8-flash-lite-tts.
 */
export async function generateSpeechWithGemini(
  text: string,
  voiceName: string = 'Kore'
): Promise<string> {
  try {
    const cleanText = text
      .replace(/[*#_~`\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500);

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: cleanText }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
    throw new Error('No audio data received from Gemini TTS.');
  } catch (err) {
    console.error('Gemini TTS error:', err);
    throw err;
  }
}

export type VisualAidStyle =
  | 'chalkboard'
  | 'textbook'
  | 'realistic'
  | 'pencil'
  | 'vector';

/**
 * Enriches an educational visual prompt for maximum artistic and instructional fidelity.
 */
export async function enrichImagePrompt(
  topic: string,
  style: VisualAidStyle = 'textbook'
): Promise<string> {
  try {
    const styleDescriptions: Record<VisualAidStyle, string> = {
      chalkboard:
        'A magnificent, artistic chalkboard illustration drawn with detailed colored and white chalk on a dark slate blackboard, authentic classroom feel, delicate chalk textures, beautiful shading, clearly labeled educational parts',
      textbook:
        'A professional, highly detailed scientific and biological textbook illustration, clean white background, vibrant educational color grading, anatomical cross-sections, sharp lines, medical-grade clarity with labeled annotations',
      realistic:
        'A photorealistic 3D scientific macro render, cinematic volumetric lighting, raytraced subsurface scattering, hyper-detailed anatomical textures, National Geographic educational documentary quality',
      pencil:
        'An academic vintage hand-drawn botanical/scientific colored pencil and watercolor sketch, fine cross-hatching, natural paper texture, Leonardo da Vinci anatomical sketchbook study style',
      vector:
        'A sleek, high-contrast infographic vector diagram, clean lines, flat modern colors, clear callouts and arrows, minimalist educational design',
    };

    const enrichmentPrompt = `You are a world-class educational illustrator and art director.
Create an evocative, highly specific image generation prompt based on this topic:
"${topic}"

Style requirement:
${styleDescriptions[style]}

Instructions:
- Describe the exact subject, cross-sections or key components, lighting, color palette, and pedagogical details.
- Avoid buzzwords like "photorealistic 8k"; instead describe tangible visual elements, accurate anatomy, textures, and composition.
- Return ONLY the enriched prompt in 1 to 2 descriptive sentences. No quotes or introductory text.`;

    const enriched = await generateTextWithGemini({
      prompt: enrichmentPrompt,
      systemInstruction:
        'You write clear, vivid, and scientifically accurate prompts for educational illustrations.',
      preferredModel: 'gemini-3.1-flash-lite',
    });

    return enriched.trim();
  } catch (err) {
    console.error('Failed to enrich image prompt, using fallback template:', err);
    return `Detailed educational illustration of ${topic}, high quality, clear scientific details, textbook style`;
  }
}

/**
 * Generates high-fidelity AI educational images using enriched prompts.
 */
export async function generateEducationalImageUrl(
  topic: string,
  style: VisualAidStyle = 'textbook',
  aspectRatio: '16:9' | '4:3' | '1:1' = '4:3'
): Promise<{ url: string; enrichedPrompt: string }> {
  try {
    const enrichedPrompt = await enrichImagePrompt(topic, style);

    let width = 1024;
    let height = 768;

    if (aspectRatio === '16:9') {
      width = 1024;
      height = 576;
    } else if (aspectRatio === '1:1') {
      width = 768;
      height = 768;
    }

    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(enrichedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

    return { url: imageUrl, enrichedPrompt };
  } catch (err) {
    console.error('Error generating educational image URL:', err);
    throw err;
  }
}

/**
 * Generates an intricate, high-detail SVG diagram with proper anatomical/technical paths and labels.
 */
export async function generateDetailedSvgDiagram(
  topic: string
): Promise<string> {
  try {
    const prompt = `You are an expert scientific and medical illustrator.
Create an intricate, beautiful, educational SVG vector diagram for: "${topic}".

STRICT DESIGN RULES:
1. DO NOT draw crude, simple geometric outlines or basic dotted ovals.
2. Draw detailed, realistic curves using smooth cubic beziers (<path d="...">) to accurately portray the organ, system, or structure.
3. Differentiate anatomical chambers, layers, or components with distinct contrasting colors (e.g., deep ruby red, rich navy blue, warm amber, violet, cyan) with subtle opacity or stroke accents.
4. Add clear callout lines with circular pin heads leading to readable text labels (<text font-family="system-ui, sans-serif" font-size="12" fill="#f8fafc">).
5. Background: A rich chalkboard slate (<rect width="100%" height="100%" fill="#0f172a" rx="12"/>).
6. Include an elegant title header and a neat color-coded legend box.
7. Output MUST be ONLY valid SVG starting with <svg viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg"> and ending with </svg>. No markdown formatting or extra text.`;

    const rawSvg = await generateTextWithGemini({
      prompt,
      systemInstruction:
        'You write clean, highly detailed, beautifully styled SVG diagrams with accurate biological and scientific forms.',
      preferredModel: 'gemini-3.1-flash-lite',
    });

    const svgMatch = rawSvg.match(/<svg[\s\S]*?<\/svg>/i);
    const svgContent = svgMatch ? svgMatch[0] : rawSvg;

    const base64Svg = Buffer.from(svgContent).toString('base64');
    return `data:image/svg+xml;base64,${base64Svg}`;
  } catch (err) {
    console.error('Failed to generate detailed SVG diagram:', err);
    throw err;
  }
}

/**
 * Universal visual aid generator supporting both high-res illustrations and vector diagrams.
 */
export async function generateVisualAidAsset({
  prompt,
  style = 'textbook',
  outputType = 'image',
  aspectRatio = '4:3',
}: {
  prompt: string;
  style?: VisualAidStyle;
  outputType?: 'image' | 'svg';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}): Promise<{ mediaUrl: string; enrichedPrompt?: string }> {
  try {
    if (outputType === 'svg' || style === 'vector') {
      const mediaUrl = await generateDetailedSvgDiagram(prompt);
      return { mediaUrl };
    }

    const { url, enrichedPrompt } = await generateEducationalImageUrl(
      prompt,
      style,
      aspectRatio
    );
    return { mediaUrl: url, enrichedPrompt };
  } catch (err) {
    console.error('Error generating visual aid asset:', err);
    // Fallback to detailed SVG if image generation fails
    const mediaUrl = await generateDetailedSvgDiagram(prompt);
    return { mediaUrl };
  }
}
