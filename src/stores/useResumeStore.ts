import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeInfo } from '@/types/resume';

interface ResumeState extends ResumeInfo {
  // 状态
  isLoading: boolean;
  error?: string;
  
  // 操作
  setResume: (resume: Partial<ResumeInfo>) => void;
  clearResume: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      isLoading: false,
      
      setResume: (resume) => set((state) => ({ ...state, ...resume })),
      clearResume: () => set({ name: undefined, age: undefined, text: undefined, industry: undefined, pdfBase64: undefined }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'resume-storage',
    }
  )
); 