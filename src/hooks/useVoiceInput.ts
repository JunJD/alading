"use client";
import { useState, useCallback, useRef } from 'react';
import { WavRecorder, WavStreamPlayer } from '@/lib/wavtools';

interface UseVoiceInputProps {
  onProcessAudio?: (audioData: Int16Array) => Promise<Int16Array>;
}

interface UseVoiceInputReturn {
  isRecording: boolean;
  isConnected: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  connectConversation: () => Promise<void>;
  disconnectConversation: () => Promise<void>;
  playAudio: (audioData: Int16Array) => Promise<void>;
  appendAudio: (audioData: Int16Array) => void;
}

export const useVoiceInput = ({
  onProcessAudio
}: UseVoiceInputProps): UseVoiceInputReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 16000 }));
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 16000 }));
  const localInt16Array = useRef<Int16Array>(new Int16Array(0));
  const audioHistoryRef = useRef<Int16Array[]>([]);

  const appendAudio = useCallback((audioData: Int16Array) => {
    audioHistoryRef.current.push(audioData);
    localInt16Array.current = mergeInt16Arrays(
      localInt16Array.current,
      audioData,
    );
  }, []);

  const mergeInt16Arrays = (left: Int16Array | ArrayBuffer, right: Int16Array | ArrayBuffer) => {
    if (left instanceof ArrayBuffer) left = new Int16Array(left);
    if (right instanceof ArrayBuffer) right = new Int16Array(right);
    if (!(left instanceof Int16Array) || !(right instanceof Int16Array)) {
      throw new Error(`Both items must be Int16Array`);
    }
    const newValues = new Int16Array(left.length + right.length);
    for (let i = 0; i < left.length; i++) newValues[i] = left[i];
    for (let j = 0; j < right.length; j++) newValues[left.length + j] = right[j];
    return newValues;
  };

  const connectConversation = useCallback(async () => {
    try {
      await wavRecorderRef.current.begin();
      await wavStreamPlayerRef.current.connect();
      setIsConnected(true);
      console.log('连接成功');
    } catch (error) {
      console.error('连接失败:', error);
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    try {
      if (isRecording) {
        await wavRecorderRef.current.pause();
        setIsRecording(false);
      }
      await wavRecorderRef.current.end();
      await wavStreamPlayerRef.current.interrupt();
      localInt16Array.current = new Int16Array(0);
      audioHistoryRef.current = [];
      setIsConnected(false);
      console.log('断开连接成功');
    } catch (error) {
      console.error('断开连接失败:', error);
    }
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    if (!isConnected) return;

    try {
      localInt16Array.current = new Int16Array(0);
      setIsRecording(true);
      await wavRecorderRef.current.record((data) => {
        localInt16Array.current = mergeInt16Arrays(
          localInt16Array.current,
          data.mono,
        );
      });
      console.log('开始录音成功');
    } catch (error) {
      console.error('开始录音失败:', error);
      setIsRecording(false);
    }
  }, [isConnected]);

  const playAudio = useCallback(async (audioData: Int16Array) => {
    try {
      await wavStreamPlayerRef.current.interrupt();
      
      const len = audioData.byteLength;
      let offset = 0;
      while (offset < len) {
        const chunk = audioData.slice(offset, offset + 16000);
        await wavStreamPlayerRef.current.add16BitPCM(
          chunk, 
          `audio-chunk-${offset / 16000}`
        );
        offset += 16000;
      }
    } catch (error) {
      console.error('播放音频失败:', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    try {
        setIsRecording(false);
        await wavRecorderRef.current.pause();
        
        if (localInt16Array.current.length > 0) {
            const currentAudio = localInt16Array.current.slice();
            localInt16Array.current = new Int16Array(0);
            
            console.log('录音结束，数据长度:', currentAudio.length);
            
            if (onProcessAudio) {
                try {
                    const processedAudio = await onProcessAudio(currentAudio);
                    await playAudio(processedAudio);
                    appendAudio(processedAudio);
                } catch (error) {
                    console.error('音频处理失败:', error);
                }
            }
        }
    } catch (error) {
        console.error('停止录音失败:', error);
    }
}, [isRecording, onProcessAudio, appendAudio, playAudio]);


  return {
    isRecording,
    isConnected,
    startRecording,
    stopRecording,
    connectConversation,
    disconnectConversation,
    playAudio,
    appendAudio,
  };
}; 