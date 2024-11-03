import OpenAI from 'openai';
import { generateId, base64ToInt16Array, int16ArrayToWavBuffer, int16ArrayToBase64 } from '@/lib/utils';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
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
    messageType?: 'transcription' | 'response';
    audio?: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
}

export function SOCKET(
    client: import('ws').WebSocket,
    _request: import('node:http').IncomingMessage,
    server: import('ws').WebSocketServer,
) {
    const { send, broadcast } = createHelpers(client, server);

    // 处理客户端消息
    client.on('message', async (message: Buffer) => {
        try {
            const payload = JSON.parse(message.toString()) as RealTimePayload;

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
                const messages = [
                    ...(payload.history || []),
                    { role: "user" as const, content: transcription.text }
                ];

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages,
                });

                const aiResponse = completion.choices[0].message.content ?? '';

                // 发送文本响应
                send({
                    author: 'Server',
                    type: 'text',
                    content: aiResponse,
                    messageType: 'response',
                    event_id: responseId,
                });

                // 3. 文本转语音
                const mp3 = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "fable",
                    input: aiResponse,
                    response_format: "pcm",
                    speed: 2.0,
                });

                // 4. 发送音频响应，使用相同的 responseId
                const audioBuffer = await mp3.arrayBuffer();
                const base64Audio = int16ArrayToBase64(new Int16Array(audioBuffer));
                
                send({
                    author: 'Server',
                    type: 'audio',
                    content: aiResponse,
                    audio: base64Audio,
                    event_id: responseId, // 使用相同的 responseId
                });
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