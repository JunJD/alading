"use client";
import { useState, useCallback, useRef } from 'react';
import { WavRecorder, WavStreamPlayer } from '@/lib/wavtools';

interface UseVoiceInputProps {
  onProcessAudio?: (audioData: Int16Array) => Promise<Int16Array>;
}

export const useVoiceInput = ({
  onProcessAudio
}: UseVoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const isConnectedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 16000 }));
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 16000 }));
  const localInt16Array = useRef<Int16Array>(new Int16Array(0));
  const audioHistoryRef = useRef<Int16Array[]>([]);
  const latestAudioRef = useRef<Int16Array | null>(null);

  const appendAudio = useCallback((audioData: Int16Array) => {
    if (!isRecordingRef.current) {
      audioHistoryRef.current.push(audioData);
    }
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
      isConnectedRef.current = true;
      console.log('连接成功');
    } catch (error) {
      console.error('连接失败:', error);
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    try {
      if (isRecordingRef.current) {
        await wavRecorderRef.current.pause();
        isRecordingRef.current = false;
        setIsRecording(false);
      }
      if (isPlayingRef.current) {
        await wavStreamPlayerRef.current.interrupt();
        isPlayingRef.current = false;
      }
      await wavRecorderRef.current.end();
      localInt16Array.current = new Int16Array(0);
      audioHistoryRef.current = [];
      isConnectedRef.current = false;
      console.log('断开连接成功');
    } catch (error) {
      console.error('断开连接失败:', error);
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!isConnectedRef.current) return;

    try {
      if (isPlayingRef.current) {
        await wavStreamPlayerRef.current.interrupt();
        isPlayingRef.current = false;
      }

      localInt16Array.current = new Int16Array(0);
      isRecordingRef.current = true;
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
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  }, []);

  const playAudio = useCallback(async (audioData: Int16Array) => {
    try {
      if (isRecordingRef.current) {
        console.log('正在录音，跳过音频播放');
        return;
      }

      latestAudioRef.current = audioData;

      if (isPlayingRef.current) {
        await wavStreamPlayerRef.current.interrupt();
      }

      isPlayingRef.current = true;
      
      let offset = 0;
      const len = audioData.byteLength;
      
      while (offset < len && !isRecordingRef.current && latestAudioRef.current === audioData) {
        const chunk = audioData.slice(offset, offset + 16000);
        await wavStreamPlayerRef.current.add16BitPCM(
          chunk, 
          `audio-chunk-${offset / 16000}`
        );
        offset += 16000;
      }

      if (!isRecordingRef.current && latestAudioRef.current === audioData) {
        isPlayingRef.current = false;
      }
    } catch (error) {
      console.error('播放音频失败:', error);
      isPlayingRef.current = false;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!isRecordingRef.current) return;

    try {
      isRecordingRef.current = false;
      setIsRecording(false);
      await wavRecorderRef.current.pause();
      
      if (localInt16Array.current.length > 0) {
        const currentAudio = localInt16Array.current.slice();
        localInt16Array.current = new Int16Array(0);
        
        console.log('录音结束，数据长度:', currentAudio.length);
        
        if (onProcessAudio) {
          try {
            const processedAudio = await onProcessAudio(currentAudio);
            
            if (!isRecordingRef.current) {
              await playAudio(processedAudio);
              if (!isRecordingRef.current) {
                appendAudio(processedAudio);
              }
            } else {
              latestAudioRef.current = processedAudio;
            }
          } catch (error) {
            console.error('音频处理失败:', error);
          }
        }
      }
    } catch (error) {
      console.error('停止录音失败:', error);
    }
  }, [onProcessAudio, playAudio, appendAudio]);

  return {
    isRecording,
    isConnected: isConnectedRef.current,
    isPlaying: isPlayingRef.current,
    startRecording,
    stopRecording,
    connectConversation,
    disconnectConversation,
    playAudio,
    appendAudio,
  };
};