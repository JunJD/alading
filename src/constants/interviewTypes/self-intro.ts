import { InterviewType } from "@/types/interview";

export const selfIntroInterview: InterviewType = {
  id: "self-intro",
  name: "自我介绍",
  icon: "👋",
  description: "练习如何简洁有力地介绍自己",
  systemPrompt: `作为面试官，在自我介绍环节需要：
    1. 引导候选人完整地介绍自己
    2. 关注表达的逻辑性和清晰度
    3. 评估信息的重点突出程度
    4. 观察时间控制能力`,
  stages: [
    {
      id: "opening",
      name: "开场",
      description: "初步自我介绍",
      prompts: [
        "请简单介绍一下你自己",
        "能否用1分钟时间做个自我介绍？",
      ],
      expectedDuration: 2,
      evaluationPoints: [
        {
          name: "结构完整性",
          weight: 0.3,
          criteria: ["是否包含关键信息", "逻辑顺序是否清晰"]
        },
        {
          name: "时间控制",
          weight: 0.2,
          criteria: ["是否控制在合适时长"]
        }
      ]
    },
    {
      id: "detail",
      name: "细节探讨",
      description: "深入了解关键点",
      prompts: [
        "能具体说说你提到的{X}经历吗？",
        "为什么选择这个{行业/领域}？",
      ],
      expectedDuration: 3,
      evaluationPoints: [
        {
          name: "表达深度",
          weight: 0.3,
          criteria: ["答案是否具体", "是否有独特见解"]
        }
      ]
    }
  ],
  processRules: [
    {
      id: "intro-1",
      description: "开场阶段",
      action: "引导候选人进行简要的自我介绍"
    },
    {
      id: "intro-2",
      description: "细节探讨",
      action: "针对关键点进行深入提问"
    }
  ]
}; 