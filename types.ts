export interface EssayParams {
  topic: string;
  outline: string;
  length: string;
  language: string;
}

export interface GeneratedEssay {
  content: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark';

export const LENGTH_OPTIONS = [
  'Ngắn (Short - approx 200 words)',
  'Trung bình (Medium - approx 500 words)',
  'Dài (Long - approx 1000 words)',
  'Chi tiết (Detailed - based on outline depth)'
];

export const LANGUAGE_OPTIONS = [
  'Tiếng Việt',
  'English',
  'Français',
  'Español',
  'Deutsch',
  '中文',
  '日本語'
];