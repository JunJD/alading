import { Industry, InterviewType } from "@/types/interview";

export const INDUSTRIES: Industry[] = [
  {
    id: "tech",
    name: "互联网/技术",
    icon: "💻",
    description: "包括软件开发、人工智能、数据科学等技术岗位",
  },
  {
    id: "finance",
    name: "金融/财务",
    icon: "💰",
    description: "包括银行、证券、投资等金融领域职位",
  },
  {
    id: "marketing",
    name: "市场营销",
    icon: "📈",
    description: "包括品牌营销、数字营销、市场分析等职位",
  },
  // 可以继续添加更多行业...
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