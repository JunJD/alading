import { InterviewType } from "@/types/interview";
import { InterviewBuilder, StageBuilder } from "@/builders/InterviewBuilder";
import { TECH_CRITERIA } from "../evaluationCriteria";

export const projectInterview: InterviewType = new InterviewBuilder()
    .setId("project")
    .setName("项目经验")
    .setIcon("📊")
    .setDescription("考察候选人的项目经验")
    .addStage(
        new StageBuilder()
            .setId("overview")
            .setName("项目概述")
            .setDescription("了解项目背景和目标")
            .setPrompts([
                "请介绍一个你最有挑战性的项目",
                "在这个项目中你担任什么角色？"
            ])
            .setDuration(2)
            .addEvaluationPoint(TECH_CRITERIA.PROBLEM_SOLVING, 0.4, [
                "项目背景是否清晰",
                "目标是否明确",
                "角色职责是否清楚"
            ])
    )
    .addStage(
        new StageBuilder()
            .setId("technical")
            .setName("技术细节")
            .setDescription("深入技术实现")
            .setPrompts([
                "项目中最大的技术挑战是什么？",
                "为什么选择这样的技术方案？"
            ])
            .setDuration(3)
            .addEvaluationPoint(TECH_CRITERIA.TECH_FOUNDATION, 0.3, [
                "技术方案是否合理",
                "技术理解是否深入"
            ])
            .addEvaluationPoint(TECH_CRITERIA.SYSTEM_DESIGN, 0.3, [
                "架构设计是否合理",
                "技术选型是否恰当"
            ])
            .setFinal()
    )
    .build(); 