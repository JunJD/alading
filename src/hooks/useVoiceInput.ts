"use client";
import { useState, useCallback, useEffect, useRef } from 'react';
import { useMicVAD, type ReactRealTimeVADOptions } from "@ricky0123/vad-react";

interface UseVoiceInputProps {
  onTranscript: (text: string) => void;
  isVadMode: boolean;
  setIsVadMode: (value: boolean) => void;
}

export const useVoiceInput = ({ onTranscript, isVadMode, setIsVadMode }: UseVoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const loadingRef = useRef(false);

  // 处理 VAD 音频数据
  const handleVADAudio = useCallback(async (audio: Float32Array) => {
    // 这里可以添加实际的音频处理逻辑
    console.log("处理 VAD 音频数据:", audio.length);
    onTranscript("VAD 模式检测到的语音内容（模拟）");
  }, [onTranscript]);

  // VAD 配置
  const vadOptions: Partial<ReactRealTimeVADOptions> = {
    workletURL: "/vad.worklet.bundle.min.js",
    modelURL: "/silero_vad.onnx",
    preSpeechPadFrames: 5,
    positiveSpeechThreshold: 0.90,
    negativeSpeechThreshold: 0.75,
    minSpeechFrames: 4,
    startOnLoad: isVadMode,
    onSpeechStart: () => {
      console.log("VAD: Speech started");
      setIsRecording(true);
    },
    onSpeechEnd: handleVADAudio,
    onVADMisfire: () => {
      console.log("VAD: Misfire");
      setIsRecording(false);
    }
  };

  const vad = useMicVAD(vadOptions);

  // 切换 VAD 模式
  const toggleVadMode = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
    setIsVadMode(!isVadMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isVadMode, setIsVadMode]);

  // 初始化普通录音模式
  const initializeRecording = useCallback(async () => {
    if (isVadMode) return; // VAD 模式下不初始化普通录音

    console.log("初始化录音设备");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("获取到音频流");
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        console.log("收到音频数据", event.data.size);
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        console.log("录音停止");
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log("音频大小:", audioBlob.size);
        // 这里可以处理普通模式下的音频数据
        onTranscript("这是一个模拟的语音识别结果。");
        setAudioChunks([]);
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error('获取麦克风失败:', error);
    }
  }, [isVadMode, audioChunks, onTranscript]);

  const startRecording = useCallback(() => {
    if (isVadMode) {
      vad.start();
      return;
    }

    console.log("开始录音", mediaRecorder?.state);
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [mediaRecorder, isVadMode, vad]);

  const stopRecording = useCallback(() => {
    if (isVadMode) {
      vad.pause();
      return;
    }

    console.log("停止录音", mediaRecorder?.state);
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder, isVadMode, vad]);

  useEffect(() => {
    if (!isVadMode) {
      initializeRecording();
    }
    return () => {
      if (mediaRecorder) {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        mediaRecorder.stream.getTracks().forEach(track => {
          console.log("关闭音频轨道");
          track.stop();
        });
      }
    };
  }, [initializeRecording, mediaRecorder, isVadMode]);

  useEffect(() => {
    if (vad && loadingRef.current !== vad.loading) {
      console.log("VAD loading state:", vad.loading);
      loadingRef.current = vad.loading;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vad?.loading]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    isVadLoading: vad.loading,
    isVadListening: vad.listening,
    vadError: vad.errored,
    toggleVadMode,
  };
}; 