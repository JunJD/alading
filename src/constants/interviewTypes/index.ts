import { InterviewType } from "@/types/interview";
import { selfIntroInterview } from './self-intro';
import { projectInterview } from "./project";
import { salaryInterview } from "./salary";


export const INTERVIEW_TYPES = [
    selfIntroInterview,
    projectInterview,
    salaryInterview
] as const;

export const getInterviewType = (type: string): InterviewType | undefined => {
    return INTERVIEW_TYPES.find(t => t.id === type);
};

export {
    selfIntroInterview,
    projectInterview,
    salaryInterview
}