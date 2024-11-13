import { InterviewType } from "@/types/interview";
import { InterviewBuilder, StageBuilder } from "@/builders/InterviewBuilder";
import { PRODUCT_CRITERIA } from "../evaluationCriteria";

export const selfIntroInterview: InterviewType = new InterviewBuilder()
    .setId("self-intro")
    .setName("自我介绍")
    .setIcon("👋")
    .setDescription("练习如何简洁有力地介绍自己")
    .addStage(
        new StageBuilder()
            .setId("opening")
            .setName("开场")
            .setDescription("初步自我介绍")
            .setPrompts([
                "请简单介绍一下你自己",
                "能否用1分钟时间做个自我介绍？"
            ])
            .setDuration(2)
            .addEvaluationPoint(PRODUCT_CRITERIA.PRODUCT_THINKING, 0.3, [
                "是否包含关键信息",
                "逻辑顺序是否清晰",
                "表达是否流畅"
            ])
            .addEvaluationPoint(PRODUCT_CRITERIA.DATA_ANALYSIS, 0.2, [
                "是否控制在合适时长",
                "重点是否突出"
            ])
    )
    .addStage(
        new StageBuilder()
            .setId("detail")
            .setName("细节探讨")
            .setDescription("深入了解关键点")
            .setPrompts([
                "能具体说说你提到的{X}经历吗？",
                "为什么选择这个{行业/领域}？"
            ])
            .setDuration(3)
            .addEvaluationPoint(PRODUCT_CRITERIA.COMMUNICATION, 0.3, [
                "答案是否具体",
                "是否有独特见解",
                "思考是否深入"
            ])
            .setFinal()
    )
    .build(); 