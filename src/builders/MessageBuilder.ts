import { IndustryLogic, InterviewType, Stage } from '@/types/interview';
import { ResumeInfo } from '@/types/resume';

export class SystemMessageBuilder {
    private content: string = '';
    private industry: IndustryLogic;
    private type: InterviewType;
    private currentPhase: Stage;
    private resume?: ResumeInfo;

    constructor(
        industry: IndustryLogic,
        type: InterviewType,
        currentPhase: Stage,
        resume?: ResumeInfo
    ) {
        this.industry = industry;
        this.type = type;
        this.currentPhase = currentPhase;
        this.resume = resume;
    }

    private addBasePrompt() {
        this.content += `${this.industry.basePrompt}\n\n`;
        return this;
    }

    private addResumeInfo() {
        this.content += `候选人简历信息：
        ${this.resume ? `
        基本信息：
        - 姓名：${this.resume.name || '未提供'}
        - 年龄：${this.resume.age || '未提供'}
        - 简历详情：${this.resume.text || '未提供'}
        ` : '未提供简历信息'}\n\n`;
        return this;
    }

    private addCurrentPhase() {
        this.content += `当前面试环节：${this.currentPhase.name}
        环节目标：${this.currentPhase.description}\n\n`;
        return this;
    }

    private addEvaluationCriteria() {
        const validCriteria = this.industry.evaluationCriteria.filter(criterion => 
            this.currentPhase.evaluationPoints.some(point => point.criteriaId === criterion.id)
        );

        if (validCriteria.length === 0) {
            console.warn(`Warning: No matching evaluation criteria found for phase ${this.currentPhase.name}`);
            return this;
        }

        this.content += `行业评估标准：
        ${validCriteria.map(criterion => 
            `- ${criterion.name}(权重${criterion.weight}): ${criterion.description}`
        ).join('\n')}\n\n`;
        return this;
    }

    private addPhaseEvaluationPoints() {
        const validPoints = this.currentPhase.evaluationPoints
            .map(point => {
                const criterion = this.industry.evaluationCriteria.find(c => c.id === point.criteriaId);
                if (!criterion) {
                    console.warn(`Warning: No matching criterion found for criteriaId ${point.criteriaId}`);
                    return null;
                }
                return {
                    criterion,
                    point
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        if (validPoints.length === 0) {
            console.warn(`Warning: No valid evaluation points found for phase ${this.currentPhase.name}`);
            return this;
        }

        this.content += `当前环节评估重点：
        ${validPoints.map(({ criterion, point }) => 
            `- ${criterion.name}(权重${point.weight}):\n    ${point.details.join('\n    ')}`
        ).join('\n')}\n\n`;
        return this;
    }

    private addInterviewRequirements(industryName: string) {
        this.content += `面试要求：
        1. 始终以${industryName}面试官的身份进行对话
        2. 结合候选人背景和当前面试环节进行提问
        3. 严格遵循评估标准进行评判
        4. 控制每次回复在100字以内`;
        return this;
    }

    build(industryName: string) {
        return this
            .addBasePrompt()
            .addResumeInfo()
            .addCurrentPhase()
            .addEvaluationCriteria()
            .addPhaseEvaluationPoints()
            .addInterviewRequirements(industryName)
            .content;
    }
} 