export type Industry = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

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

export type VoiceState = 'idle' | 'userSpeaking' | 'aiSpeaking' | 'pending'; 