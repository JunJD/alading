import { InterviewType } from "@/types/interview";

export const projectInterview: InterviewType = {
  id: "project",
  name: "项目经验",
  icon: "📊",
  description: "展示您的项目经验和解决问题的能力",
  systemPrompt: `作为面试官，在项目经验环节需要：
    1. 了解项目背景和目标
    2. 评估技术选型和架构设计
    3. 考察问题解决能力
    4. 关注团队协作表现`,
  stages: [
    {
      id: "overview",
      name: "项目概述",
      description: "了解项目背景和目标",
      prompts: [
        "请介绍一个你最有挑战性的项目",
        "在这个项目中你担任什么角色？"
      ],
      expectedDuration: 2,
      evaluationPoints: [
        {
          name: "项目描述",
          weight: 0.3,
          criteria: ["项目背景是否清晰", "目标是否明确"]
        }
      ]
    },
    {
      id: "technical",
      name: "技术细节",
      description: "深入技术实现",
      prompts: [
        "项目中最大的技术挑战是什么？",
        "为什么选择这样的技术方案？"
      ],
      expectedDuration: 3,
      evaluationPoints: [
        {
          name: "技术深度",
          weight: 0.4,
          criteria: ["技术理解程度", "方案合理性"]
        }
      ]
    }
  ],
  processRules: [
    {
      id: "project-1",
      description: "项目概述",
      action: "了解项目背景、目标和候选人的角色"
    },
    {
      id: "project-2",
      description: "技术细节",
      action: "深入探讨技术实现和解决方案"
    }
  ]
}; 