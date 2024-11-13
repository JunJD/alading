import { InterviewConfig, Industry, InterviewType } from '@/types/interview';
import { ResumeInfo } from '@/types/resume';

const STORAGE_KEY = 'interview_state';

interface StoredInterviewState {
    type: string;
    industry: string;
    resume: ResumeInfo | null;
    timestamp: number;
}

export class InterviewStateManager {
    private static instance: InterviewStateManager;
    
    private constructor() {}
    
    static getInstance(): InterviewStateManager {
        if (!this.instance) {
            this.instance = new InterviewStateManager();
        }
        return this.instance;
    }

    saveState(config: InterviewConfig) {
        const state: StoredInterviewState = {
            type: config.type.id,
            industry: config.industry?.id || '',
            resume: config.resume,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save interview state:', error);
        }
    }

    loadState(): StoredInterviewState | null {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;

            const state = JSON.parse(stored) as StoredInterviewState;
            
            // 可以添加状态过期检查，比如24小时后过期
            const ONE_DAY = 24 * 60 * 60 * 1000;
            if (Date.now() - state.timestamp > ONE_DAY) {
                this.clearState();
                return null;
            }

            return state;
        } catch (error) {
            console.error('Failed to load interview state:', error);
            return null;
        }
    }

    clearState() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear interview state:', error);
        }
    }

    updateResume(resume: ResumeInfo) {
        const currentState = this.loadState();
        if (currentState) {
            this.saveState({
                type: { id: currentState.type } as InterviewType,
                industry: { id: currentState.industry } as Industry,
                resume
            });
        }
    }
}

export const interviewStateManager = InterviewStateManager.getInstance(); 