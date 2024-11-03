import { Industry } from '@/types/interview';
import { techInterviewLogic } from './interviewLogics/tech';
import { productInterviewLogic } from './interviewLogics/product';

export const INDUSTRIES: Industry[] = [
    {
        id: 'tech',
        name: '技术开发',
        icon: '💻',
        description: '软件开发、系统架构等技术岗位',
        interview: techInterviewLogic
    },
    {
        id: 'product',
        name: '产品经理',
        icon: '📱',
        description: '产品设计、用户体验、需求分析',
        interview: productInterviewLogic
    }
];

export const getInterview = (industryId: string) => {
    return INDUSTRIES.find(industry => industry.id === industryId)?.interview;
};