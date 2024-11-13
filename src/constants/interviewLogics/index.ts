import { IndustryLogic } from "@/types/interview";
import { techInterviewLogic } from './tech';
import { productInterviewLogic } from './product';

// 行业逻辑配置
export const INTERVIEW_LOGICS = {
    'tech': techInterviewLogic,
    'product': productInterviewLogic
} as const;

export const getInterviewLogic = (industry: string): IndustryLogic | undefined => {
    return INTERVIEW_LOGICS[industry as keyof typeof INTERVIEW_LOGICS];
};

export type IndustryId = keyof typeof INTERVIEW_LOGICS; 