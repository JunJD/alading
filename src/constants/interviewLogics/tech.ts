import { IndustryLogic } from "@/types/interview";

export const techInterviewLogic: IndustryLogic = {
  systemPrompt: `作为技术面试官，你需要：
  1. 关注候选人的技术深度和广度
  2. 评估问题解决能力和技术思维
  3. 考察系统设计和架构能力
  4. 了解技术学习能力和发展潜力`,
  
  openingResponse: "您好，我是今天的技术面试官。让我们开始技术面试吧。",
  
  keyPoints: [
    "技术基础知识",
    "系统设计能力",
    "问题解决思路",
    "代码质量意识",
    "技术学习能力"
  ],
  
  evaluationCriteria: [
    {
      id: "tech-foundation",
      name: "技术基础",
      description: "基础知识的掌握程度和理解深度",
      weight: 0.3
    },
    {
      id: "problem-solving",
      name: "解决问题",
      description: "分析问题和解决技术难题的能力",
      weight: 0.3
    },
    {
      id: "system-design",
      name: "系统设计",
      description: "架构设计和技术选型能力",
      weight: 0.2
    },
    {
      id: "learning-ability",
      name: "学习能力",
      description: "技术视野和学习新技术的能力",
      weight: 0.2
    }
  ]
}; 