// 技术面试评估标准ID
export const TECH_CRITERIA = {
    TECH_FOUNDATION: 'tech-foundation',
    PROBLEM_SOLVING: 'problem-solving',
    SYSTEM_DESIGN: 'system-design',
    LEARNING_ABILITY: 'learning-ability'
} as const;

// 产品面试评估标准ID
export const PRODUCT_CRITERIA = {
    PRODUCT_THINKING: 'product-thinking',
    EXECUTION: 'execution',
    DATA_ANALYSIS: 'data-analysis',
    COMMUNICATION: 'communication'
} as const;

// 评估标准ID类型
export type TechCriteriaId = typeof TECH_CRITERIA[keyof typeof TECH_CRITERIA];
export type ProductCriteriaId = typeof PRODUCT_CRITERIA[keyof typeof PRODUCT_CRITERIA]; 