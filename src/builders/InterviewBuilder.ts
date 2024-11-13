import { InterviewType, Stage } from '@/types/interview';
export class StageBuilder {
    private stage: Partial<Stage> = {};

    setId(id: string) {
        this.stage.id = id;
        return this;
    }
    
    setName(name: string) {
        this.stage.name = name;
        return this;
    }
    
    setDescription(description: string) {
        this.stage.description = description;
        return this;
    }
    
    setPrompts(prompts: string[]) {
        this.stage.prompts = prompts;
        return this;
    }
    
    setDuration(duration: number) {
        this.stage.expectedDuration = duration;
        return this;
    }
    
    addEvaluationPoint(criteriaId: string, weight: number, details: string[]) {
        if (!this.stage.evaluationPoints) {
            this.stage.evaluationPoints = [];
        }
        this.stage.evaluationPoints.push({ criteriaId, weight, details });
        return this;
    }
    
    setFinal(isFinal: boolean = true) {
        this.stage.finalStage = isFinal;
        return this;
    }
    
    build(): Stage {
        if (!this.stage.id || !this.stage.name || !this.stage.description) {
            throw new Error('Stage must have id, name and description');
        }
        return this.stage as Stage;
    }
}

export class InterviewBuilder {
    private interview: Partial<InterviewType> = {
        stages: []
    };
    
    setId(id: string) {
        this.interview.id = id;
        return this;
    }
    
    setName(name: string) {
        this.interview.name = name;
        return this;
    }
    
    setIcon(icon: string) {
        this.interview.icon = icon;
        return this;
    }
    
    setDescription(description: string) {
        this.interview.description = description;
        return this;
    }
    
    addStage(stageBuilder: StageBuilder) {
        this.interview.stages!.push(stageBuilder.build());
        return this;
    }
    
    build(): InterviewType {
        if (!this.interview.id || !this.interview.name || this.interview.stages?.length === 0) {
            throw new Error('Interview must have id, name and at least one stage');
        }
        return this.interview as InterviewType;
    }
} 