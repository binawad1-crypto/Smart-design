/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AspectRatio = '16:9' | '9:16' | '1:1' | '3:4' | '4:3';

export type ComplexityLevel = 'Elementary' | 'High School' | 'College' | 'Expert';

export type VisualStyle = 'Default' | 'Minimalist' | 'Realistic' | 'Cartoon' | 'Vintage' | 'Futuristic' | '3D Render' | 'Sketch';

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Mandarin' | 'Japanese' | 'Hindi' | 'Arabic' | 'Portuguese' | 'Russian';

export type UiLanguage = 'en' | 'ar';

export interface GeneratedImage {
  id: string;
  data: string; // Base64 data URL
  prompt: string;
  timestamp: number;
  level?: ComplexityLevel;
  style?: VisualStyle;
  language?: Language;
}

export interface SearchResultItem {
  title: string;
  url: string;
}

export interface ResearchResult {
  imagePrompt: string;
  facts: string[];
  searchResults: SearchResultItem[];
}

export type ToolView = 'home' | 'infographic' | 'article' | 'logo' | 'marketing';

export type ArticleTone = 'Professional' | 'Casual' | 'Academic' | 'Creative' | 'Journalistic';

export type LogoStyle = 'Minimalist' | 'Vintage' | '3D' | 'Abstract' | 'Mascot' | 'Emblem';

// Marketing Types
export type MarketingModel = 'Arab Male' | 'Arab Female' | 'Hand Model' | 'No Model';
export type MarketingBackground = 'Luxury Studio' | 'Minimal Modern' | 'Spotlight Cinematic' | 'Outdoor Lifestyle' | 'Restaurant' | 'Office' | 'Desert' | 'Kitchen' | 'Retail Store';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}