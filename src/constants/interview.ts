import { Industry, InterviewType, InterviewStage } from '@/types/interview';
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

export const getInterview = (industryId: string) => {
  return INDUSTRIES.find(industry => industry.id === industryId)?.interview;
};

// 面试类型定义
export const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: "self-intro",
    name: "自我介绍",
    icon: "👋",
    description: "练习如何简洁有力地介绍自己",
    systemPrompt: `你是一位专业的面试官，专注于评估候选人的自我介绍。
    请注意以下几点：
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
  },
  {
    id: "project",
    name: "项目经验",
    icon: "📊",
    description: "展示您的项目经验和解决问题的能力",
    systemPrompt: `你是一位专注于技术项目评估的面试官。
    重点关注：
    1. 项目架构和技术选型
    2. 解决问题的思路
    3. 个人贡献和团队协作
    4. 项目成果和影响`,
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
  },
  {
    id: "salary",
    name: "薪资谈判",
    icon: "💼",
    description: "学习如何进行薪资谈判",
    systemPrompt: `你是一位经验丰富的HR面试官。
    谈判重点：
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
        ]
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
  }
];

export const getInterviewType = (type: string): InterviewType | undefined => {
  return INTERVIEW_TYPES.find(t => t.id === type);
};