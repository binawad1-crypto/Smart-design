/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, ComplexityLevel, VisualStyle, ResearchResult, SearchResultItem, Language, ArticleTone, LogoStyle, MarketingModel, MarketingBackground } from "../types";

// Create a fresh client for every request to ensure the latest API key from process.env.API_KEY is used
const getAi = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Updated to use 'gemini-3-pro-image-preview' for all operations including search grounding and image generation as requested
const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const EDIT_MODEL = 'gemini-3-pro-image-preview';

const getLevelInstruction = (level: ComplexityLevel): string => {
  switch (level) {
    case 'Elementary':
      return "Target Audience: Elementary School (Ages 6-10). Style: Bright, simple, fun. Use large clear icons and very minimal text labels.";
    case 'High School':
      return "Target Audience: High School. Style: Standard Textbook. Clean lines, clear labels, accurate maps or diagrams. Avoid cartoony elements.";
    case 'College':
      return "Target Audience: University. Style: Academic Journal. High detail, data-rich, precise cross-sections or complex schematics.";
    case 'Expert':
      return "Target Audience: Industry Expert. Style: Technical Blueprint/Schematic. Extremely dense detail, monochrome or technical coloring, precise annotations.";
    default:
      return "Target Audience: General Public. Style: Clear and engaging.";
  }
};

const getStyleInstruction = (style: VisualStyle): string => {
  switch (style) {
    case 'Minimalist': return "Aesthetic: Bauhaus Minimalist. Flat vector art, limited color palette (2-3 colors), reliance on negative space and simple geometric shapes.";
    case 'Realistic': return "Aesthetic: Photorealistic Composite. Cinematic lighting, 8k resolution, highly detailed textures. Looks like a photograph.";
    case 'Cartoon': return "Aesthetic: Educational Comic. Vibrant colors, thick outlines, expressive cel-shaded style.";
    case 'Vintage': return "Aesthetic: 19th Century Scientific Lithograph. Engraving style, sepia tones, textured paper background, fine hatch lines.";
    case 'Futuristic': return "Aesthetic: Cyberpunk HUD. Glowing neon blue/cyan lines on dark background, holographic data visualization, 3D wireframes.";
    case '3D Render': return "Aesthetic: 3D Isometric Render. Claymorphism or high-gloss plastic texture, studio lighting, soft shadows, looks like a physical model.";
    case 'Sketch': return "Aesthetic: Da Vinci Notebook. Ink on parchment sketch, handwritten annotations style, rough but accurate lines.";
    default: return "Aesthetic: High-quality digital scientific illustration. Clean, modern, highly detailed.";
  }
};

export const researchTopicForPrompt = async (
  topic: string, 
  level: ComplexityLevel, 
  style: VisualStyle,
  language: Language
): Promise<ResearchResult> => {
  
  const levelInstr = getLevelInstruction(level);
  const styleInstr = getStyleInstruction(style);

  const systemPrompt = `
    You are an expert visual researcher.
    Your goal is to research the topic: "${topic}" and create a plan for an infographic.
    
    **IMPORTANT: Use the Google Search tool to find the most accurate, up-to-date information about this topic.**
    
    Context:
    ${levelInstr}
    ${styleInstr}
    Language: ${language}
    
    Please provide your response in the following format EXACTLY:
    
    FACTS:
    - [Fact 1]
    - [Fact 2]
    - [Fact 3]
    
    IMAGE_PROMPT:
    [A highly detailed image generation prompt describing the visual composition, colors, and layout for the infographic. Do not include citations in the prompt.]
  `;

  const response = await getAi().models.generateContent({
    model: TEXT_MODEL,
    contents: systemPrompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  
  // Parse Facts
  const factsMatch = text.match(/FACTS:\s*([\s\S]*?)(?=IMAGE_PROMPT:|$)/i);
  const factsRaw = factsMatch ? factsMatch[1].trim() : "";
  const facts = factsRaw.split('\n')
    .map(f => f.replace(/^-\s*/, '').trim())
    .filter(f => f.length > 0)
    .slice(0, 5);

  // Parse Prompt
  const promptMatch = text.match(/IMAGE_PROMPT:\s*([\s\S]*?)$/i);
  const imagePrompt = promptMatch ? promptMatch[1].trim() : `Create a detailed infographic about ${topic}. ${levelInstr} ${styleInstr}`;

  // Extract Grounding (Search Results)
  const searchResults: SearchResultItem[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  if (chunks) {
    chunks.forEach(chunk => {
      if (chunk.web?.uri && chunk.web?.title) {
        searchResults.push({
          title: chunk.web.title,
          url: chunk.web.uri
        });
      }
    });
  }

  // Remove duplicates based on URL
  const uniqueResults = Array.from(new Map(searchResults.map(item => [item.url, item])).values());

  return {
    imagePrompt: imagePrompt,
    facts: facts,
    searchResults: uniqueResults
  };
};

export const generateInfographicImage = async (prompt: string): Promise<string> => {
  const response = await getAi().models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to generate image");
};

export const editInfographicImage = async (currentImageBase64: string, editInstruction: string): Promise<string> => {
  const cleanBase64 = currentImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  
  const response = await getAi().models.generateContent({
    model: EDIT_MODEL,
    contents: {
      parts: [
         { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
         { text: editInstruction }
      ]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    }
  });
  
   const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to edit image");
};

// New Service: Article Generator
export const generateArticle = async (topic: string, tone: ArticleTone, language: Language): Promise<string> => {
    const prompt = `
        Write a comprehensive, engaging, and well-structured article about "${topic}".
        Tone: ${tone}
        Language: ${language}
        
        Format the output with clear headings, paragraphs, and bullet points where necessary. 
        Do not use Markdown code blocks (like \`\`\`markdown), just return the formatted text directly.
    `;

    const response = await getAi().models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }] // Enable grounding for accuracy
        }
    });

    return response.text || "Could not generate article.";
};

// New Service: Logo Generator
export const generateLogo = async (brandName: string, description: string, style: LogoStyle): Promise<string> => {
    const prompt = `
        Design a professional logo for a brand named "${brandName}".
        Industry/Description: ${description}.
        Visual Style: ${style}.
        
        Requirements:
        - High resolution, clear vector-like quality.
        - Centered on a clean background (white or dark depending on style).
        - Distinctive and memorable.
        - No gibberish text, focus on the icon/symbol and the brand name if legible text is possible, otherwise focus on the symbol.
    `;

    const response = await getAi().models.generateContent({
        model: IMAGE_MODEL,
        contents: { parts: [{ text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
            // Aspect ratio 1:1 is default and ideal for logos
        }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Failed to generate logo");
};

// New Service: Marketing Image Generator
export const generateMarketingImage = async (
  productDescription: string, 
  productUserImageBase64: string | null, 
  modelOption: MarketingModel, 
  backgroundStyle: MarketingBackground,
  aspectRatio: AspectRatio
): Promise<string> => {

  const prompt = `
    Create a highly professional, studio-grade marketing image designed for social media.
    
    The scene MUST feature the following hero product: ${productDescription}.
    ${productUserImageBase64 ? "Use the provided image as the exact reference for the product." : ""}
    
    Configuration:
    - Model: ${modelOption}
    - Background: ${backgroundStyle}
    - Style: Ultra-sharp details, 8K realism, Commercial photography, Clean reflections.
    
    Ensure the composition fits the aspect ratio perfectly.
    No typography or text overlays unless explicitly part of the product label.
    The lighting should be premium and cinematic.
  `;

  const parts: any[] = [];
  if (productUserImageBase64) {
     const cleanBase64 = productUserImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
     parts.push({
        inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
        }
     });
  }
  parts.push({ text: prompt });

  const response = await getAi().models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: parts },
    config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
            aspectRatio: aspectRatio === '1:1' ? '1:1' : 
                         aspectRatio === '16:9' ? '16:9' : 
                         aspectRatio === '9:16' ? '9:16' : 
                         '3:4' // Defaulting vertical/portrait requests like 4:5 to 3:4 as it is closest supported
        }
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to generate marketing image");
};