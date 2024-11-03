export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  interview: InterviewLogic;
}

export interface InterviewLogic {
  systemPrompt: string;
  openingPrompt: string;
  openingResponse: string;
  processRules: InterviewRule[];
  evaluationCriteria: EvaluationCriterion[];
}

export interface InterviewRule {
  id: string;
  description: string;
  condition?: string;
  action: string;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export type InterviewType = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export type InterviewConfig = {
  industry?: Industry;
  type?: InterviewType;
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