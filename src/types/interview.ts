export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  interview: IndustryLogic;
}

export interface IndustryLogic {
  systemPrompt: string;
  openingResponse: string;
  evaluationCriteria: IndustryCriterion[];
  keyPoints: string[];
}

export interface IndustryCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface InterviewType {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  stages: InterviewStage[];
  processRules: InterviewRule[];
}

export interface InterviewStage {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  expectedDuration: number;
  evaluationPoints: {
    name: string;
    weight: number;
    criteria: string[];
  }[];
}

export interface InterviewRule {
  id: string;
  description: string;
  condition?: string;
  action: string;
}

export type InterviewConfig = {
  industry: Industry;
  type: InterviewType;
  userProfile?: {
    name: string;
    experience: number;
    skills: string[];
    education: string;
  };
};

export type InterviewState = 'idle' | 'userSpeaking' | 'aiSpeaking' | 'processing' | 'connected' | 'pending';
export type RecordingMode = 'manual' | 'vad';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
} 