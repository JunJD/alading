import { Industry } from '@/types/interview';
import { INTERVIEW_LOGICS } from './interviewLogics';

// 行业配置
export const INDUSTRIES: Industry[] = Object.entries(INTERVIEW_LOGICS).map(([id, logic]) => ({
    id,
    name: id === 'tech' ? '技术开发' : '产品经理',
    icon: id === 'tech' ? '💻' : '📱',
    description: id === 'tech' ? '软件开发、系统架构等技术岗位' : '产品设计、用户体验、需求分析',
    interview: logic
}));

export const getInterview = (industryId: string) => {
    return INDUSTRIES.find(industry => industry.id === industryId)?.interview;
};