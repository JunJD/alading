"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { VoiceState } from "@/types/interview"
import { VoiceStateIcon } from "../ui/VoiceStateIcon"
import { InterviewConfig } from "@/types/interview"
import { ParticleCanvas } from "../ui/ParticleCanvas"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function InterviewRoom({ config }: { config: InterviewConfig }) {
  const router = useRouter()
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [isVadMode, setIsVadMode] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  // 添加一个定时器引用
  const pendingTimerRef = useRef<NodeJS.Timeout>();

  // 添加自动滚动到底部的功能
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 修改 AI 回复逻辑
  const simulateAIResponse = async (userMessage: string) => {
    console.log("模拟 AI 响应:", userMessage);
    const responses = [
      "你的回答很有见地。不过，你能具体说说在实际工作中是如何应用这些经验的吗？",
      "这个观点很有意思。让我们深入探讨一下，你是如何处理相关的挑战的？",
      "听起来你在这个领域有不少经验。能分享一个具体的例子吗？",
      "你提到了一些关键点。在团队协作中，你是如何运用这些技能的？",
      "这个思路很好，不过在实际项目中可能会遇到一些困难，你是如何克服的？"
    ];
    
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    }]);
    setIsTyping(false);
    
    // AI 说完话后2秒设置为 pending 状态
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
    }
    pendingTimerRef.current = setTimeout(() => {
      // 只有当前状态是 aiSpeaking 时才切换到 pending
      setVoiceState(currentState => 
        currentState === 'aiSpeaking' ? 'pending' : currentState
      );
    }, 2000);
  };

  const handleTranscript = useCallback((text: string) => {
    console.log("收到语音识别结果:", text);
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
    }

    setTranscript(text);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    }]);
    
    setVoiceState('pending');
    setTimeout(() => {
      setVoiceState('aiSpeaking');
      simulateAIResponse(text);
    }, 1000);
  }, []);

  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    isVadLoading: vadLoading,
    isVadListening,
    vadError,
    toggleVadMode
  } = useVoiceInput({
    onTranscript: handleTranscript,
    isVadMode,
    setIsVadMode,
  });

  // 按键处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isVadMode && !isRecording) {
      e.preventDefault();
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
      }
      setVoiceState('userSpeaking');
      startRecording();
    }
  }, [isVadMode, isRecording, startRecording]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isVadMode && isRecording) {
      console.log("空格键释放，停止录音");
      e.preventDefault();
      stopRecording();
    }
  }, [isVadMode, isRecording, stopRecording]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (isVadMode) {
      console.log("VAD 模式状态:", { isVadListening, vadError });
    }
  }, [isVadMode, isVadListening, vadError]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
      }
    };
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
            <button
              onClick={toggleVadMode}
              disabled={vadLoading}
              className={`px-4 py-2 rounded-full ${
                isVadMode ? 'bg-blue-500/20' : 'bg-gray-600/20'
              } text-white backdrop-blur-sm border border-white/10 hover:bg-opacity-30 transition-colors`}
            >
              {vadLoading ? 'VAD 加载中...' : `VAD 模式 ${isVadMode ? '开启' : '关闭'}`}
            </button>
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
                      className={`max-w-[80%] p-4 rounded-lg backdrop-blur-sm ${
                        message.type === 'user'
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
                {isTyping && (
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
                )}
                <div key="messages-end" ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* 语音状态和输入区域 */}
            <div className="border-t border-white/10 pt-4 mt-4 flex-shrink-0">
              <div className="flex items-center justify-center space-x-4">
                <VoiceStateIcon state={voiceState} />
                <p className="text-center text-white/70">
                  {isVadMode ? '自动检测语音' : '按住空格键说话'}
                </p>
              </div>
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-black/20 backdrop-blur-sm rounded-lg p-4 mt-4 border border-white/10"
                >
                  <p className="text-white/90">{transcript}</p>
                </motion.div>
              )}
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