import OpenAI from 'openai';
import { generateId, base64ToInt16Array, int16ArrayToWavBuffer, int16ArrayToBase64 } from '@/lib/utils';
import { getInterview } from '@/constants/interview';
import { getInterviewType } from '@/constants/interviewTypes';
import { InterviewProgress } from '@/types/realtime';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
});

console.log('openai.baseURL', openai.baseURL, openai.apiKey);

export function GET() {
    const headers = new Headers();
    headers.set('Connection', 'Upgrade');
    headers.set('Upgrade', 'websocket');
    return new Response('Upgrade Required', { status: 426, headers });
}

interface RealTimePayload {
    type: 'audio' | 'text';
    event_id: string;
    author: 'Server' | 'Client';
    content?: string;
    messageType?: 'transcription' | 'response' | 'phase_change' | 'begin' | 'end';
    audio?: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
    progress?: {
        currentStage: number;
        totalStages: number;
        stageName: string;
        progressPercent: number;
    };
}

export function SOCKET(
    client: import('ws').WebSocket,
    _request: import('node:http').IncomingMessage,
    server: import('ws').WebSocketServer,
) {
    const url = new URL(_request.url!, `http://${_request.headers.host}`);
    const industry = url.searchParams.get('industry');
    const type = url.searchParams.get('type');
    const resume = JSON.parse(url.searchParams.get('resume') || '{}');
    const model = url.searchParams.get('model') || 'gpt-3.5-turbo';
    const interview = getInterview(industry!);
    const interviewType = getInterviewType(type!);
    const { send, broadcast } = createHelpers(client, server);

    // 获取配置参数
    const apiKey = url.searchParams.get('apiKey');
    const baseUrl = url.searchParams.get('baseUrl');

    // 创建 OpenAI 实例时使用配置
    const openai = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        baseURL: baseUrl || process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
    });

    if (!interview || !interviewType) {
        send({
            author: 'Server',
            type: 'text',
            content: 'Interview not found',
            event_id: generateId('evt_'),
        });
        return;
    }

    // 初始化为第一个阶段
    let currentPhaseIndex = 0;
    let currentPhase = interviewType.stages[0];

    // 使用辅助函数创建初始进度信息
    const initialProgress = createProgressInfo(
        currentPhaseIndex,
        interviewType.stages.length,
        currentPhase.name
    );

    // 构建开场消息
    const openingMessage = `${interview.openingResponse}\n\n${currentPhase.prompts[0]}`;
    const openingResponseId = generateId('evt_');

    // 发送开场白和初始进度
    send({
        author: 'Server',
        type: 'text',
        content: openingMessage,
        messageType: 'begin',
        event_id: openingResponseId,
        progress: initialProgress
    });

    const determinePhase = (history: { role: string; content: string }[]) => {
        const messageCount = history.length;
        const currentStage = interviewType.stages.find(stage => {
            const previousStagesLength = interviewType.stages
                .slice(0, interviewType.stages.indexOf(stage))
                .reduce((acc, s) => acc + s.expectedDuration, 0);
            return messageCount < previousStagesLength + stage.expectedDuration;
        }) || interviewType.stages[interviewType.stages.length - 1];

        if (currentPhase.id !== currentStage.id) {
            currentPhase = currentStage;
            currentPhaseIndex = interviewType.stages.indexOf(currentStage);
            
            const progress = createProgressInfo(
                currentPhaseIndex,
                interviewType.stages.length,
                currentStage.name
            );
            
            const prompt = currentStage.prompts[Math.floor(Math.random() * currentStage.prompts.length)];
            
            send({
                author: 'Server',
                type: 'text',
                content: `现在进入${currentStage.name}环节：${prompt}`,
                messageType: 'phase_change',
                event_id: generateId('evt_'),
                progress
            });
        }

        return currentStage;
    };

    // 处理客户端消息
    client.on('message', async (message: Buffer) => {
        try {
            const payload = JSON.parse(message.toString()) as RealTimePayload;

            // 处理开始消息
            if (payload.type === 'text' && payload.messageType === 'begin') {
                // 发送开场白和初始进度
                const openingMessage = `${interview.openingResponse}\n\n${currentPhase.prompts[0]}`;
                const openingResponseId = generateId('evt_');

                send({
                    author: 'Server',
                    type: 'text',
                    content: openingMessage,
                    messageType: 'response',
                    event_id: openingResponseId,
                    progress: initialProgress
                });

                // 发送开场语音
                const mp3 = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "fable",
                    input: openingMessage,
                    response_format: "pcm",
                    speed: 2.0,
                });

                const audioBuffer = await mp3.arrayBuffer();
                const base64Audio = int16ArrayToBase64(new Int16Array(audioBuffer));
                
                send({
                    author: 'Server',
                    type: 'audio',
                    content: openingMessage,
                    audio: base64Audio,
                    event_id: openingResponseId,
                    progress: initialProgress
                });
                return;
            }

            if (payload.type === 'audio' && payload.audio) {
                // 生成本次会话的消息 ID
                const transcriptionId = generateId('evt_');
                const responseId = generateId('evt_');

                // 将 base64 转回 Int16Array
                const audioData = base64ToInt16Array(payload.audio);
                const wavBuffer = int16ArrayToWavBuffer(audioData, 16000);
                const file = new File([wavBuffer], "audio.wav", { type: "audio/wav" });

                // 1. 语音转文本
                const transcription = await openai.audio.transcriptions.create({
                    file,
                    model: "whisper-1",
                    language: "zh",
                });

                // 发送语音识别结果
                send({
                    author: 'Server',
                    type: 'text',
                    content: transcription.text,
                    messageType: 'transcription',
                    event_id: transcriptionId,
                });

                // 2. 生成 AI 回复
                const systemMessage = {
                    role: "system" as const,
                    content: `
                        ${interview.systemPrompt}
                        
                        ${interviewType.systemPrompt}
                        
                        候选人简历信息：
                        ${resume ? `
                        基本信息：
                        - 姓名：${resume.name || '未提供'}
                        - 年龄：${resume.age || '未提供'}
                        - 简历详情：${resume.text || '未提供'}
                        ` : '未提供简历信息'}
                        
                        当前面试环节：${currentPhase.name}
                        环节目标：${currentPhase.description}
                        
                        行业关注重点：
                        ${interview.keyPoints.map(point => `- ${point}`).join('\n')}
                        
                        行业评估标准：
                        ${interview.evaluationCriteria.map(criterion => 
                            `- ${criterion.name}(权重${criterion.weight}): ${criterion.description}`
                        ).join('\n')}
                        
                        当前环节评估重点：
                        ${currentPhase.evaluationPoints.map(point => 
                            `- ${point.name}(权重${point.weight}):\n  ${point.criteria.join('\n  ')}`
                        ).join('\n')}
                        
                        面试要求：
                        1. 始终以${industry}面试官的身份进行对话
                        2. 结合候选人背景和当前面试环节进行提问
                        3. 严格遵循评估标准进行评判
                        4. 控制每次回复在100字以内
                        5. ${interviewType.processRules.find(rule => rule.description === currentPhase.name)?.action || 
                            interviewType.processRules[0].action}
                        
                        注意事项：
                        1. 仔细阅读候选人的简历文本，从中提取关键信息
                        2. 根据简历内容进行针对性提问
                        3. 结合行业背景和面试类型设计问题
                    `
                };

                const messages = [
                    systemMessage,
                    ...(payload.history || []),
                    { role: "user" as const, content: transcription.text }
                ];

                // 更新面试阶段
                if (payload.history) {
                    const stage = determinePhase(payload.history);
                    
                    // 如果是新阶段的第一条消息，添加引导提示
                    if (stage.id !== currentPhase.id) {
                        const processRule = interviewType.processRules.find(
                            rule => rule.description === stage.name
                        );
                        
                        if (processRule) {
                            messages.push({
                                role: "system" as const,
                                content: `注意：现在进入${stage.name}阶段，${processRule.action}`
                            });
                        }
                    }
                }

                const completion = await openai.chat.completions.create({
                    model: model || 'gpt-3.5-turbo',
                    messages,
                    temperature: currentPhase.id === "detail" || currentPhase.id === "technical" ? 0.8 : 0.7,
                    max_tokens: 300,
                    presence_penalty: 0.6,
                    frequency_penalty: 0.3,
                });

                const aiResponse = completion.choices[0].message.content ?? '';

                const progress = createProgressInfo(
                    currentPhaseIndex,
                    interviewType.stages.length,
                    currentPhase.name
                );

                // 发送文本响应
                send({
                    author: 'Server',
                    type: 'text',
                    content: aiResponse,
                    messageType: 'response',
                    event_id: responseId,
                    progress
                });

                // 使用辅助函数创建并发送音频消息
                const audioMessage = await createAudioMessage(aiResponse, responseId, progress);
                send(audioMessage);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            send({
                author: 'Server',
                type: 'text',
                content: 'Error processing message',
                event_id: generateId('evt_'),
            });
        }
    });

    // 当客户端断开连接时广播消息
    client.on('close', () => {
        broadcast({
            author: 'Server',
            type: 'text',
            content: 'A client has disconnected.',
            event_id: generateId('evt_'),
        });
    });
}

function createHelpers(
    client: import('ws').WebSocket,
    server: import('ws').WebSocketServer,
) {
    const send = (payload: RealTimePayload) =>
        client.send(JSON.stringify(payload));

    const broadcast = async (payload: RealTimePayload) => {
        server.clients.forEach((c) => {
            if (c !== client && c.readyState === WebSocket.OPEN) {
                c.send(JSON.stringify(payload));
            }
        });
    };

    return { send, broadcast };
}

// 添加辅助函数
const createProgressInfo = (currentPhaseIndex: number, totalStages: number, stageName: string) => ({
    currentStage: currentPhaseIndex + 1,
    totalStages,
    stageName,
    progressPercent: Math.round(((currentPhaseIndex + 1) / totalStages) * 100)
});

const createAudioMessage = async (text: string, eventId: string, progress?: InterviewProgress) => {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "fable",
        input: text,
        response_format: "pcm",
        speed: 2.0,
    });

    const audioBuffer = await mp3.arrayBuffer();
    const base64Audio = int16ArrayToBase64(new Int16Array(audioBuffer));
    
    return {
        author: 'Server' as const,
        type: 'audio' as const,
        content: text,
        audio: base64Audio,
        event_id: eventId,
        progress
    };
}; 