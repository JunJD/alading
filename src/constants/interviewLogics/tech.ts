import { IndustryLogic } from "@/types/interview";
import { IndustryBuilder } from "@/builders/IndustryBuilder";
import { TECH_CRITERIA } from "../evaluationCriteria";

export const techInterviewLogic: IndustryLogic = new IndustryBuilder()
    .setBasePrompt(`作为技术面试官，你需要：
    1. 关注候选人的技术深度和广度
    2. 评估问题解决能力和技术思维
    3. 考察系统设计和架构能力
    4. 了解技术学习能力和发展潜力`)
    .setOpeningResponse("您好，我是今天的技术面试官。让我们开始技术面试吧。")
    .addCriterion(
        TECH_CRITERIA.TECH_FOUNDATION,
        "技术基础",
        "技术基础的扎实程度",
        0.3
    )
    .addCriterion(
        TECH_CRITERIA.PROBLEM_SOLVING,
        "解决问题",
        "问题解决的能力",
        0.3
    )
    .addCriterion(
        TECH_CRITERIA.SYSTEM_DESIGN,
        "系统设计",
        "系统设计的思维和能力",
        0.2
    )
    .addCriterion(
        TECH_CRITERIA.LEARNING_ABILITY,
        "学习能力",
        "学习新知识的能力",
        0.2
    )
    .build(); 