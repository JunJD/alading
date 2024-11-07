import { InterviewType } from "@/types/interview";

export const salaryInterview: InterviewType = {
  id: "salary",
  name: "薪资谈判",
  icon: "💼",
  description: "学习如何进行薪资谈判",
  systemPrompt: `作为面试官，在薪资谈判环节需要：
    1. 了解候选人的期望
    2. 评估市场价值
    3. 探讨综合福利
    4. 达成双赢方案`,
  stages: [
    {
      id: "expectation",
      name: "期望了解",
      description: "了解候选人的薪资期望",
      prompts: [
        "您对薪资待遇有什么期望？",
        "您现在的薪资结构是怎样的？"
      ],
      expectedDuration: 2,
      evaluationPoints: [
        {
          name: "表达技巧",
          weight: 0.3,
          criteria: ["是否有理有据", "是否考虑双方立场"]
        }
      ]
    },
    {
      id: "negotiation",
      name: "具体谈判",
      description: "深入讨论薪资细节",
      prompts: [
        "除了基本薪资，您还关注哪些福利待遇？",
        "对于我们提供的薪资方案，您怎么看？"
      ],
      expectedDuration: 3,
      evaluationPoints: [
        {
          name: "谈判能力",
          weight: 0.4,
          criteria: ["是否能合理争取", "是否能灵活调整"]
        }
      ],
      finalStage: true
    }
  ],
  processRules: [
    {
      id: "salary-1",
      description: "期望了解",
      action: "了解候选人的薪资期望和当前情况"
    },
    {
      id: "salary-2",
      description: "具体谈判",
      action: "讨论具体薪资方案和福利待遇"
    }
  ]
}; 