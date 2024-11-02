'use client'
import { RealTimeMessage, RealTimeResponse } from '@/types/realtime';
import { generateId, int16ArrayToBase64 } from './utils';

interface RealtimeClientOptions {
    url: string;
    onMessage?: (data: RealTimeResponse) => void;
    onError?: (error: WebSocket['onerror']) => void;
}

export class RealtimeClient {
    private ws: WebSocket | null = null;
    private options: RealtimeClientOptions;
    private messageHandlers: Set<(data: RealTimeResponse) => void> = new Set();

    constructor(options: RealtimeClientOptions) {
        this.options = options;
    }

    async connect() {
        return new Promise<void>((resolve, reject) => {
            try {
                if (globalThis.document) {
                    const WebSocket = globalThis.WebSocket;
                    this.ws = new WebSocket(this.options.url);

                    this.ws.onopen = () => {
                        console.log('WebSocket connected');
                        resolve();
                        this.ws?.send(JSON.stringify({
                            type: 'ping',
                            event_id: generateId('evt_'),
                        }));
                    };

                    this.ws.onmessage = (event: MessageEvent) => {
                        try {
                            const data = JSON.parse(event.data) as RealTimeResponse;
                            this.messageHandlers.forEach(handler => handler(data));
                            this.options.onMessage?.(data);
                        } catch (error) {
                            console.error('Failed to parse message:', error);
                        }
                    };

                    this.ws.onerror = (error) => {
                        console.error('WebSocket error:', error);
                        this.options.onError?.(error as unknown as WebSocket['onerror']);
                        reject(error);
                    };

                    this.ws.onclose = () => {
                        console.log('WebSocket closed');
                        this.ws = null;
                    };
                } else {
                    reject(new Error('WebSocket is not supported in this environment'));
                }
            } catch (error) {
                console.error('Connection failed:', error);
                reject(error);
            }
        });
    }

    addMessageHandler(handler: (data: RealTimeResponse) => void) {
        this.messageHandlers.add(handler);
    }

    removeMessageHandler(handler: (data: RealTimeResponse) => void) {
        this.messageHandlers.delete(handler);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.messageHandlers.clear();
    }

    sendAudio(audioData: Int16Array, history: { role: 'user' | 'assistant'; content: string }[] = []) {
        if (!this.ws) return;

        const message: RealTimeMessage = {
            type: 'audio',
            event_id: crypto.randomUUID(),
            author: 'Client',
            audio: int16ArrayToBase64(audioData),
            history,
        };

        this.ws.send(JSON.stringify(message));
    }
} 