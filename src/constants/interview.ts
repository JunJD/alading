import { Industry, InterviewType } from "@/types/interview";
import { techInterviewLogic } from './interviewLogics/tech';
import { productInterviewLogic } from './interviewLogics/product';
// ... 导入其他行业的面试逻辑

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
  },
  // ... 其他行业
];

export const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: "self-intro",
    name: "自我介绍",
    icon: "👋",
    description: "练习如何简洁有力地介绍自己",
  },
  {
    id: "project",
    name: "项目经验",
    icon: "📊",
    description: "展示您的项目经验和解决问题的能力",
  },
  {
    id: "salary",
    name: "薪资谈判",
    icon: "💼",
    description: "学习如何进行薪资谈判",
  },
]; 