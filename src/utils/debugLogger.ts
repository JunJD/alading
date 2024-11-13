/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import path from 'path';
import { IndustryLogic, InterviewType, Stage } from '@/types/interview';

class DebugLogger {
    private logDir: string;
    private sessionId: string;

    constructor() {
        this.logDir = path.join(process.cwd(), 'logs');
        this.sessionId = this.getFormattedDateTime();
        this.initLogDir();
    }

    private getFormattedDateTime(): string {
        const date = new Date();
        const utc8Date = new Date(date.getTime() + (8 * 60 * 60 * 1000));
        
        const year = utc8Date.getFullYear();
        const month = String(utc8Date.getMonth() + 1).padStart(2, '0');
        const day = String(utc8Date.getDate()).padStart(2, '0');
        const hours = String(utc8Date.getHours()).padStart(2, '0');
        const minutes = String(utc8Date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}`;
    }

    private async initLogDir() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }

    private formatMultilineString(str: string): string {
        return str.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n        ');
    }

    private formatLogContent(data: any): string {
        if (typeof data === 'string') {
            return this.formatMultilineString(data);
        }

        const formatValue = (value: any): any => {
            if (typeof value === 'string') {
                return this.formatMultilineString(value);
            }
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    return value.map(formatValue);
                }
                const formatted: any = {};
                for (const [key, val] of Object.entries(value)) {
                    formatted[key] = formatValue(val);
                }
                return formatted;
            }
            return value;
        };

        return JSON.stringify(formatValue(data), null, 4);
    }

    public async writeLog(type: string, data: any) {
        try {
            const logPath = path.join(this.logDir, `${this.sessionId}_${type}.log`);
            const timestamp = this.getFormattedDateTime();
            const formattedData = this.formatLogContent(data);
            const logEntry = `[${timestamp}]\n${formattedData}\n\n`;
            
            await fs.appendFile(logPath, '='.repeat(80) + '\n' + logEntry);
        } catch (error) {
            console.error('Failed to write log:', error);
        }
    }

    async logInterviewConfig(industry: string, type: string, interviewLogic?: IndustryLogic, interviewType?: InterviewType) {
        await this.writeLog('interview_config', {
            industry,
            type,
            interviewLogic: interviewLogic ? {
                basePrompt: interviewLogic.basePrompt,
                openingResponse: interviewLogic.openingResponse,
                criteriaCount: interviewLogic.evaluationCriteria.length,
                criteria: interviewLogic.evaluationCriteria
            } : 'Not found',
            interviewType: interviewType ? {
                id: interviewType.id,
                name: interviewType.name,
                stagesCount: interviewType.stages.length,
                stages: interviewType.stages.map(s => ({
                    id: s.id,
                    name: s.name,
                    evaluationPoints: s.evaluationPoints.map(ep => ep.criteriaId)
                }))
            } : 'Not found'
        });
    }

    async logSystemMessage(phase: Stage, content: string, evaluationPoints: any[]) {
        const formattedContent = content.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n        ');

        await this.writeLog('system_message', JSON.stringify(
            {
                phase: {
                    id: phase.id,
                    name: phase.name,
                    evaluationPoints: evaluationPoints.map(ep => ({
                        criteriaId: ep.criteriaId,
                        criterionName: ep.criterion || '未找到对应的评估标准',
                        weight: ep.weight,
                        details: phase.evaluationPoints
                            .find(p => p.criteriaId === ep.criteriaId)?.details || []
                    }))
                },
                messagePreview: formattedContent.slice(0, 200) + '...',
                fullMessage: formattedContent
            },
            null,
            2
        ));
    }

    async logPhaseTransition(
        messageCount: number,
        currentPhaseId: string,
        stageChecks: Array<{
            stageId: string,
            previousLength: number,
            stageDuration: number,
            threshold: number,
            shouldBeInThisStage: boolean
        }>,
        phaseChange?: { from: string, to: string }
    ) {
        await this.writeLog('phase_transition', {
            messageCount,
            currentPhaseId,
            stageChecks,
            phaseChange
        });
    }
}

export const debugLogger = new DebugLogger();