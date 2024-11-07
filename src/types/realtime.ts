// 进度信息类型
export interface InterviewProgress {
    currentStage: number;
    totalStages: number;
    stageName: string;
    progressPercent: number;
}

// 基础消息类型
export interface RealTimeMessage {
    type: 'audio' | 'text';
    event_id: string;
    author: 'Server' | 'Client';
    content?: string;
    audio?: string;
}

// 服务器响应消息
export interface RealTimeResponse extends RealTimeMessage {
    author: 'Server';
    messageType: 'transcription' | 'response' | 'phase_change' | 'begin' | 'end';
    progress?: InterviewProgress;
}

// 客户端发送消息
export interface RealTimeRequest extends RealTimeMessage {
    author: 'Client';
    messageType?: 'begin';
    history?: { role: 'user' | 'assistant'; content: string }[];
}

// 错误消息
export interface RealTimeError {
    type: 'error';
    event_id: string;
    message: string;
}

// 联合类型，用于处理所有可能的消息
export type RealTimePayload = RealTimeRequest | RealTimeResponse | RealTimeError;