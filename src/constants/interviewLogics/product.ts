import { IndustryLogic } from "@/types/interview";

export const productInterviewLogic: IndustryLogic = {
  systemPrompt: `你是一位经验丰富的产品面试官，专注于产品经理岗位的面试。
你需要：
1. 评估候选人的产品思维和用户导向
2. 考察产品规划和执行能力
3. 了解候选人的数据分析能力
4. 考核沟通协作能力

面试过程中：
- 关注候选人的思考过程
- 考察产品决策的依据
- 评估用户需求的理解深度
- 了解产品优先级的把控能力`,
  
  openingResponse: "您好！我是今天的产品面试官。在开始之前，我们先聊聊您的产品经历。",
  
  keyPoints: [
    "产品思维",
    "用户导向",
    "产品规划",
    "数据分析",
    "沟通协作"
  ],
  evaluationCriteria: [
    {
      id: "pm-eval-1",
      name: "产品思维",
      description: "产品思考的深度和广度",
      weight: 0.3
    },
    {
      id: "pm-eval-2",
      name: "执行力",
      description: "项目推进和落地能力",
      weight: 0.25
    },
    {
      id: "pm-eval-3",
      name: "数据分析",
      description: "数据驱动决策的能力",
      weight: 0.25
    },
    {
      id: "pm-eval-4",
      name: "沟通协作",
      description: "与各方沟通和协作的能力",
      weight: 0.2
    }
  ]
}; 