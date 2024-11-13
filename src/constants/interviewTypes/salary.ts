import { InterviewType } from "@/types/interview";
import { InterviewBuilder, StageBuilder } from "@/builders/InterviewBuilder";
import { PRODUCT_CRITERIA } from "../evaluationCriteria";

export const salaryInterview: InterviewType = new InterviewBuilder()
    .setId("salary")
    .setName("薪资谈判")
    .setIcon("💼")
    .setDescription("学习如何进行薪资谈判")
    .addStage(
        new StageBuilder()
            .setId("expectation")
            .setName("期望了解")
            .setDescription("了解候选人的薪资期望")
            .setPrompts([
                "您对薪资待遇有什么期望？",
                "您现在的薪资结构是怎样的？"
            ])
            .setDuration(2)
            .addEvaluationPoint(PRODUCT_CRITERIA.PRODUCT_THINKING, 0.3, [
                "是否有理有据",
                "是否考虑双方立场",
                "表达是否清晰"
            ])
    )
    .addStage(
        new StageBuilder()
            .setId("negotiation")
            .setName("具体谈判")
            .setDescription("深入讨论薪资细节")
            .setPrompts([
                "除了基本薪资，您还关注哪些福利待遇？",
                "对于我们提供的薪资方案，您怎么看？"
            ])
            .setDuration(3)
            .addEvaluationPoint(PRODUCT_CRITERIA.EXECUTION, 0.4, [
                "是否能合理争取",
                "是否能灵活调整",
                "是否有谈判策略"
            ])
            .setFinal()
    )
    .build(); 