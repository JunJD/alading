"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { InterviewState } from "@/types/interview"
import { VoiceStateIcon } from "../ui/VoiceStateIcon"
import { InterviewConfig } from "@/types/interview"
import { ParticleCanvas } from "../ui/ParticleCanvas"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { RealtimeClient } from '@/lib/realtime-client';
import { RealTimeResponse } from '@/types/realtime';
import { base64ToInt16Array } from "@/lib/utils"

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function InterviewRoom({ config }: { config: InterviewConfig }) {
  const router = useRouter()
  const [voiceState, setVoiceState] = useState<InterviewState>('idle')
  const [messages, setMessages] = useState<Message[]>([])


  const pendingTimerRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isKeyDownRef = useRef(false);

  const handleProcessAudio = useCallback(async (audioData: Int16Array): Promise<Int16Array> => {
    return new Promise((resolve, reject) => {
        try {
            // 创建一个一次性的消息处理器
            const messageHandler = (data: RealTimeResponse) => {
                if (data.type === 'text' && data.content) {
                    // 处理文本响应
                    if (data.author === 'Server') {
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            type: data.messageType === 'transcription' ? 'user' : 'ai',
                            content: data.content || '',
                            timestamp: new Date()
                        }]);
                    }
                }
                else if (data.type === 'audio' && data.audio) {
                    // 收到服务器返回的处理后的音频
                    clientRef.current.removeMessageHandler(messageHandler);
                    const resAudioData = base64ToInt16Array(data.audio);
                    
                    // 只有在当前不是用户说话状态时，才设置为 AI 说话状态
                    setVoiceState(currentState => {
                        if (currentState === 'userSpeaking') {
                            // 如果用户正在说话，暂时不播放 AI 的回复
                            // 可以选择将音频缓存起来，等用户说完再播放
                            return currentState;
                        }
                        return 'aiSpeaking';
                    });
                    
                    // 播放完成后设置为等待状态，但也要检查用户是否在说话
                    const audioLength = resAudioData.length / 16000;
                    setTimeout(() => {
                        setVoiceState(currentState => {
                            if (currentState === 'userSpeaking') {
                                return currentState;
                            }
                            return 'pending';
                        });
                    }, audioLength * 1000 + 500);
                    
                    resolve(resAudioData);
                }
            };

            // 添加临时消息处理器
            clientRef.current.addMessageHandler(messageHandler);
            
            // 转换消息历史格式并发送
            const history = messages.map(msg => ({
                role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
                content: msg.content
            }));
            
            // 发送音频数据和历史记录到服务器
            clientRef.current.sendAudio(audioData, history);

            // 设置超时
            setTimeout(() => {
                clientRef.current.removeMessageHandler(messageHandler);
                reject(new Error('处理音频超时'));
            }, 30000);

        } catch (error) {
            console.error('音频处理失败:', error);
            reject(error);
        }
    });
}, [messages]);

  const {
    isRecording,
    startRecording,
    stopRecording,
    connectConversation,
    disconnectConversation,
    isConnected,
  } = useVoiceInput({
    onProcessAudio: handleProcessAudio,
  });

  const isMounted = useRef(false);

  useEffect(() => {
    return () => {
      if (!isMounted.current) {
        isMounted.current = true;
      }
    }
  }, []);

  // 组件挂载时连接，卸载时断开
  useEffect(() => {
    connectConversation();
    return () => {
      if (isMounted.current && isConnected) {
        disconnectConversation();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isRecording && !isKeyDownRef.current) {
      e.preventDefault();
      isKeyDownRef.current = true;
      console.log('空格键按下，开始录音');
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
      }
      // 强制设置为用户说话状态，无论当前是什么状态
      setVoiceState('userSpeaking');
      startRecording();
    }
  }, [isRecording, startRecording]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && isRecording) {
      e.preventDefault();
      isKeyDownRef.current = false;
      console.log('空格键释放，停止录音');
      setVoiceState("pending");
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  useEffect(() => {
    const handleBlur = () => {
      if (isKeyDownRef.current && isRecording) {
        stopRecording();
      }
      isKeyDownRef.current = false;
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, isRecording, stopRecording]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // const handleRealtimeMessage = useCallback((data: RealTimeResponse) => {
  //   console.log('handleRealtimeMessage 收到服务器消息:', data);
  //   if (data.type === 'response' && 'text' in data && 'audio' in data) {
  //     setMessages(prev => [...prev, {
  //       id: Date.now().toString(),
  //       type: 'ai',
  //       content: data.text || '',
  //       timestamp: new Date()
  //     }]);

  //     if (data.audio) {
  //       playAudio(base64ToInt16Array(data.audio));
  //     }
  //   }
  // }, [playAudio]);

  const handleRealtimeError = useCallback((error: WebSocket['onerror']) => {
    console.error('Realtime error:', error);
    // 可以添加错误提示UI
  }, []);

  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      url: `ws://${window.location.host}/api/realtime`,
      // onMessage: handleRealtimeMessage,
      onError: handleRealtimeError,
    })
  );

  useEffect(() => {
    if (isMounted.current) {
      clientRef.current.connect();
    }
  }, []);

  return (
    <div className="relative min-h-screen flex">
      {/* Canvas 背景 - 使用 flex-1 自适应宽度 */}
      <div className="relative flex-1 min-w-[500px]">
        <ParticleCanvas
          voiceState={voiceState}
          className="!absolute !w-full !h-full !inset-0"
        />
      </div>

      {/* 主内容区域 - 固定宽度，限制最大高度 */}
      <div className="w-[600px] h-screen bg-black/20 backdrop-blur-md flex flex-col overflow-hidden">
        <div className="p-6 flex flex-col h-full">
          {/* 标题栏 */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">
                {config.industry?.name} - {config.type?.name}
              </h1>
            </div>
          </div>

          {/* 对话展示区域 - 使用 flex-1 自动占据剩余空间 */}
          <div className="flex-1 bg-black/10 backdrop-blur-md rounded-lg border border-white/10 p-6 flex flex-col overflow-hidden">
            {/* 消息列表区域 - 添加自定义滚动条样式 */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={`message-${message.id}`}
                    initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`max-w-[80%] p-4 rounded-lg backdrop-blur-sm ${message.type === 'user'
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-gray-700/20 border border-gray-700/30'
                        }`}
                    >
                      <p className="text-white">{message.content}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
                {/* {isTyping && (
                  <motion.div
                    key="typing-indicator"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-700/20 backdrop-blur-sm p-4 rounded-lg border border-gray-700/30">
                      <div className="flex space-x-2">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-white/50 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                          className="w-2 h-2 bg-white/50 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                          className="w-2 h-2 bg-white/50 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )} */}
                <div key="messages-end" ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* 语音状态和输入区域 */}
            <div className="border-t border-white/10 pt-4 mt-4 flex-shrink-0">
              <div className="flex items-center justify-center space-x-4">
                <VoiceStateIcon state={voiceState} />
                <p className="text-center text-white/70">
                  按住空格键说话
                </p>
              </div>
            </div>
          </div>

          {/* 进度指示器 */}
          <div className="text-center mt-4 flex-shrink-0">
            <p className="text-white/70">面试进度: 1/5</p>
          </div>
        </div>
      </div>
    </div>
  );
} 