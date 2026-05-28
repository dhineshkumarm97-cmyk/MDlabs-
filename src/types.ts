export interface UserAnswers {
  source: string;
  age: string;
  name: string;
  village: string;
}

export interface TrendingPrompt {
  id: string;
  title: string;
  promptText: string;
  imageUrl: string;
  category: string;
  likes: number;
  tags: string[];
}

export type SurveyStep = 
  | 'BOOT'
  | 'SOURCE_QUESTION'
  | 'AGE_QUESTION'
  | 'NAME_QUESTION'
  | 'VILLAGE_QUESTION'
  | 'PROMPT_GALLERY';
