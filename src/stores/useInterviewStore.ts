import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InterviewType, Industry } from '@/types/interview';

interface InterviewState {
  type: InterviewType | null;
  industry: Industry | null;
  currentPhaseIndex: number;
  
  // 操作
  setType: (type: InterviewType) => void;
  setIndustry: (industry: Industry) => void;
  setPhaseIndex: (index: number) => void;
  clearInterview: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      type: null,
      industry: null,
      currentPhaseIndex: 0,
      
      setType: (type) => set({ type }),
      setIndustry: (industry) => set({ industry }),
      setPhaseIndex: (currentPhaseIndex) => set({ currentPhaseIndex }),
      clearInterview: () => set({ type: null, industry: null, currentPhaseIndex: 0 }),
    }),
    {
      name: 'interview-storage',
    }
  )
); 