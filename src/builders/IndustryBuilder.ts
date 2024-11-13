import { IndustryLogic } from '@/types/interview';

export class IndustryBuilder {
    private industry: Partial<IndustryLogic> = {
        evaluationCriteria: []
    };
    
    setBasePrompt(prompt: string) {
        this.industry.basePrompt = prompt;
        return this;
    }
    
    setOpeningResponse(response: string) {
        this.industry.openingResponse = response;
        return this;
    }
    
    addCriterion(id: string, name: string, description: string, weight: number) {
        this.industry.evaluationCriteria!.push({
            id,
            name,
            description,
            weight
        });
        return this;
    }
    
    build(): IndustryLogic {
        if (!this.industry.basePrompt || !this.industry.openingResponse) {
            throw new Error('Industry must have basePrompt and openingResponse');
        }
        return this.industry as IndustryLogic;
    }
} 