export interface RealTimeMessage {
  type: 'audio' | 'text' | 'response';
  event_id: string;
  author: 'Server' | 'Client';
  content?: string;
  audio?: string;
  text?: string;
  messageType?: 'transcription' | 'response';
}

export interface RealTimeError {
  type: 'error';
  message: string;
}

export type RealTimeResponse = RealTimeMessage | RealTimeError; 