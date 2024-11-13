import { InterviewType } from "@/types/interview";
import { selfIntroInterview } from './self-intro';
import { projectInterview } from "./project";
import { salaryInterview } from "./salary";

// 面试类型配置
export const INTERVIEW_TYPES = {
    'self-intro': selfIntroInterview,
    'project': projectInterview,
    'salary': salaryInterview
} as const;

export const getInterviewType = (type: string): InterviewType | undefined => {
    return INTERVIEW_TYPES[type as keyof typeof INTERVIEW_TYPES];
};

export type InterviewTypeId = keyof typeof INTERVIEW_TYPES;