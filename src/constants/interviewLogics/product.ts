import { IndustryLogic } from "@/types/interview";
import { IndustryBuilder } from "@/builders/IndustryBuilder";
import { PRODUCT_CRITERIA } from "../evaluationCriteria";

export const productInterviewLogic: IndustryLogic = new IndustryBuilder()
    .setBasePrompt(`作为产品面试官，你需要：
    1. 评估候选人的产品思维和用户导向
    2. 考察产品规划和执行能力
    3. 了解候选人的数据分析能力
    4. 考核沟通协作能力
    
    面试过程中：
    - 关注候选人的思考过程
    - 考察产品决策的依据
    - 评估用户需求的理解深度
    - 了解产品优先级的把控能力`)
    .setOpeningResponse("您好！我是今天的产品面试官。在开始之前，我们先聊聊您的产品经历。")
    .addCriterion(
        PRODUCT_CRITERIA.PRODUCT_THINKING,
        "产品思维",
        "产品思考的深度和广度",
        0.3
    )
    .addCriterion(
        PRODUCT_CRITERIA.EXECUTION,
        "执行力",
        "项目推进和落地能力",
        0.25
    )
    .addCriterion(
        PRODUCT_CRITERIA.DATA_ANALYSIS,
        "数据分析",
        "数据驱动决策的能力",
        0.25
    )
    .addCriterion(
        PRODUCT_CRITERIA.COMMUNICATION,
        "沟通协作",
        "与各方沟通和协作的能力",
        0.2
    )
    .build(); 