import { CompleteInterviewConfig, InterviewType, IndustryLogic } from '@/types/interview';

export function combineInterviewConfig(
    type: InterviewType,
    industry: IndustryLogic
): CompleteInterviewConfig {
    const systemPrompt = `
${industry.basePrompt}

面试环节：${type.name}

当前面试流程：
${type.stages.map(stage => {
    const evaluationDetails = stage.evaluationPoints.map(point => {
        const criterion = industry.evaluationCriteria.find(c => c.id === point.criteriaId);
        return `  - ${criterion?.name}(权重${point.weight})：\n    ${point.details.join('\n    ')}`;
    }).join('\n');

    return `${stage.name}：
  目标：${stage.description}
  评估重点：\n${evaluationDetails}`;
}).join('\n\n')}`;

    return {
        type,
        industry,
        systemPrompt
    };
} 