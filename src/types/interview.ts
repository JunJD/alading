import { ResumeInfo } from "./resume";

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  interview: IndustryLogic;
}

export interface IndustryLogic {
  basePrompt: string;
  openingResponse: string;
  evaluationCriteria: {
    id: string;
    name: string;
    description: string;
    weight: number;
  }[];
}

export interface EvaluationPoint {
  criteriaId: string;
  weight: number;
  details: string[];
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  expectedDuration: number;
  evaluationPoints: EvaluationPoint[];
  finalStage?: boolean;
}

export interface InterviewType {
  id: string;
  name: string;
  icon: string;
  description: string;
  stages: Stage[];
}

export interface CompleteInterviewConfig {
  type: InterviewType;
  industry: IndustryLogic;
  systemPrompt: string;
}

export type InterviewConfig = {
  industry: Industry | null;
  type: InterviewType;
  resume: ResumeInfo | null;
};

export type InterviewState = 'idle' | 'userSpeaking' | 'aiSpeaking' | 'processing' | 'connected' | 'pending';
export type RecordingMode = 'manual' | 'vad';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

// 在 RealTimePayload 接口中添加进度信息
export interface RealTimePayload {
    type: 'audio' | 'text';
    event_id: string;
    author: 'Server' | 'Client';
    content?: string;
    messageType?: 'transcription' | 'response' | 'phase_change';
    audio?: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
    progress?: {
        currentStage: number;
        totalStages: number;
        stageName: string;
        progressPercent: number;
    };
} 