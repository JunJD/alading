"use client";
import { useState, useCallback, useRef } from 'react';
import { WavRecorder, WavStreamPlayer } from '@/lib/wavtools';
import { Whisper, WhisperLanguage } from '@/lib/localWhisper/whisper';

interface UseVoiceInputProps {
  onProcessAudio?: (audioData: Int16Array) => Promise<Int16Array>;
  onTranscript?: (text: string) => void;
}

export const useVoiceInput = ({
  onProcessAudio,
  onTranscript
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
  const requestCounterRef = useRef(0);
  const lastProcessedRequestRef = useRef(-1);

  const whisperRef = useRef<Whisper>(new Whisper('zh'));
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const textStorageRef = useRef<string[]>([]);
  const stabilizedTextRef = useRef<string>('');

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
    if (typeof window === 'undefined') return;
    
    try {
      await whisperRef.current.init();
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

      processingIntervalRef.current = setInterval(processAudioBuffer, 1000);
      console.log('开始录音成功');
    } catch (error) {
      console.error('开始录音失败:', error);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAudio = useCallback(async (audioData: Int16Array, requestId: number) => {
    try {
      if (isRecordingRef.current || requestId < lastProcessedRequestRef.current) {
        console.log('跳过播放，requestId:', requestId, '当前最新:', lastProcessedRequestRef.current);
        return;
      }

      lastProcessedRequestRef.current = requestId;
      latestAudioRef.current = audioData;

      if (isPlayingRef.current) {
        await wavStreamPlayerRef.current.interrupt();
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      isPlayingRef.current = true;
      
      let offset = 0;
      const len = audioData.byteLength;
      
      const silentFrames = new Int16Array(1600); // 100ms 的空白音频
      await wavStreamPlayerRef.current.add16BitPCM(
        silentFrames,
        'silent-prefix'
      );
      
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
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }

      isRecordingRef.current = false;
      setIsRecording(false);
      await wavRecorderRef.current.pause();
      
      if (localInt16Array.current.length > 0) {
        await processAudioBuffer();
      }

      if (localInt16Array.current.length > 0) {
        const currentAudio = localInt16Array.current.slice();
        localInt16Array.current = new Int16Array(0);
        
        if (onProcessAudio) {
          try {
            const currentRequestId = ++requestCounterRef.current;
            const processedAudio = await onProcessAudio(currentAudio);
            
            if (!isRecordingRef.current) {
              if (currentRequestId > lastProcessedRequestRef.current || !isRecordingRef.current) {
                await playAudio(processedAudio, currentRequestId);
                if (!isRecordingRef.current) {
                  appendAudio(processedAudio);
                }
              }
            }
          } catch (error) {
            console.error('音频处理失败:', error);
          }
        }
      }
    } catch (error) {
      console.error('停止录音失败:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onProcessAudio, playAudio, appendAudio]);

  const processAudioBuffer = async () => {
    if (!whisperRef.current || localInt16Array.current.length < 16000) return;

    try {
      const recentAudioLength = Math.min(32000, localInt16Array.current.length);
      const audioToProcess = localInt16Array.current.slice(-recentAudioLength);
      
      localInt16Array.current = localInt16Array.current.slice(0, -recentAudioLength);
      
      const transcriptionPromise = whisperRef.current.transcribe(audioToProcess);
      
      let processedAudioPromise;
      if (onProcessAudio) {
        processedAudioPromise = onProcessAudio(audioToProcess);
      }

      const text = await transcriptionPromise;
      console.log('text', text)
      if (text) {
        textStorageRef.current.push(text);
        
        if (textStorageRef.current.length >= 2) {
          const lastTwo = textStorageRef.current.slice(-2);
          const commonPrefix = findCommonPrefix(lastTwo[0], lastTwo[1]);
          
          if (commonPrefix.length > stabilizedTextRef.current.length) {
            stabilizedTextRef.current = commonPrefix;
            if (onTranscript) {
              console.log('commonPrefix', commonPrefix)
              onTranscript(commonPrefix);
            }
          }
        }
      }

      if (processedAudioPromise) {
        const processedAudio = await processedAudioPromise;
        const currentRequestId = ++requestCounterRef.current;
        
        if (!isRecordingRef.current && currentRequestId > lastProcessedRequestRef.current) {
          await playAudio(processedAudio, currentRequestId);
          if (!isRecordingRef.current) {
            appendAudio(processedAudio);
          }
        }
      }

    } catch (error) {
      console.error('音频处理失败:', error);
    }
  };

  const findCommonPrefix = (str1: string, str2: string): string => {
    let i = 0;
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++;
    }
    return str1.substring(0, i);
  };

  const switchLanguage = useCallback((language: WhisperLanguage) => {
    whisperRef.current.setLanguage(language);
  }, []);

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
    switchLanguage,
  };
};