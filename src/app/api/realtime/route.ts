import OpenAI from 'openai';
import fs from 'fs';
import { generateId, base64ToInt16Array, int16ArrayToWavBuffer, int16ArrayToBase64 } from '@/lib/utils';
import { join } from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
});

console.log('openai.baseURL', openai.baseURL, openai.apiKey);

console.log('在路由模块加载时初始化 WebSocket Server');


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
    audio?: string;
}

export function SOCKET(
    client: import('ws').WebSocket,
    _request: import('node:http').IncomingMessage,
    server: import('ws').WebSocketServer,
) {
    const { send, broadcast } = createHelpers(client, server);

    // 当新客户端连接时广播消息
    broadcast({
        author: 'Server',
        type: 'text',
        content: 'A new client has connected.',
        event_id: generateId('evt_'),
    });
    send({
        author: 'Server',
        type: 'text',
        content: 'Welcome!',
        event_id: generateId('evt_'),
    });

    // 处理客户端消息
    client.on('message', async (message: Buffer) => {
        try {
            const payload = JSON.parse(message.toString()) as RealTimePayload;

            if (payload.type === 'audio' && payload.audio) {
                console.log(JSON.stringify(Object.keys(payload), null, 2));

                // 将 base64 转回 Int16Array
                const audioData = base64ToInt16Array(payload.audio);

                // 转换为 WAV 格式，确保采样率为 16kHz
                const wavBuffer = int16ArrayToWavBuffer(audioData, 16000);

                console.log('wavBuffer.length', wavBuffer.length);
                
                const file = new File([wavBuffer], "audio.wav", { type: "audio/wav" });

                console.log('file', file);

                // save to local
                fs.writeFileSync(join(process.cwd(), 'audio.wav'), wavBuffer);
                
                // 1. 语音转文本
                const transcription = await openai.audio.transcriptions.create({
                    file: new File([wavBuffer], "audio.wav", { type: "audio/wav" }),
                    model: "whisper-1",
                });

                console.log('transcription.text', transcription.text);

                // 发送语音识别结果到前端
                send({
                    author: 'Server',
                    type: 'text',
                    content: transcription.text,
                    messageType: 'transcription',
                    event_id: generateId('evt_'),
                });

                // 2. 生成 AI 回复
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: transcription.text }
                    ],
                });

                const aiResponse = completion.choices[0].message.content ?? '';

                send({
                    author: 'Server',
                    type: 'text',
                    content: aiResponse,
                    messageType: 'response',
                    event_id: generateId('evt_'),
                });
                // 3. 文本转语音，指定采样率为 16kHz
                const mp3 = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "alloy",
                    input: aiResponse,
                    response_format: "pcm", // 使用 PCM 格式
                    speed: 1.0,
                });

                // 4. 发送音频响应
                const audioBuffer = await mp3.arrayBuffer();
                const base64Audio = int16ArrayToBase64(new Int16Array(audioBuffer));
                
                send({
                    author: 'Server',
                    type: 'audio',
                    content: aiResponse,
                    audio: base64Audio,
                    event_id: generateId('evt_'),
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