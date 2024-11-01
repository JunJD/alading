"use client";
import { useMicVAD } from "@ricky0123/vad-react";
import { useEffect, useRef } from "react";

interface UseVADProps {
  onSpeechStart: () => void;
  onSpeechEnd: (audio: Float32Array) => void;
  onError?: (error: Error) => void;
  enabled: boolean;
}

export const useVAD = ({ onSpeechStart, onSpeechEnd, enabled }: UseVADProps) => {
  const loadingRef = useRef(false);

  const vad = useMicVAD({
    workletURL: "/vad.worklet.bundle.min.js",
    modelURL: "/silero_vad.onnx",
    preSpeechPadFrames: 5,
    positiveSpeechThreshold: 0.90,
    negativeSpeechThreshold: 0.75,
    minSpeechFrames: 4,
    startOnLoad: enabled,
    onSpeechStart: () => {
      console.log("VAD: Speech started");
      onSpeechStart();
    },
    onSpeechEnd: (audio) => {
      console.log("VAD: Speech ended", audio.length);
      onSpeechEnd(audio);
    },
    onVADMisfire: () => {
      console.log("VAD: Misfire");
    }
  });

  useEffect(() => {
    if (loadingRef.current !== vad.loading) {
      console.log("VAD loading state:", vad.loading);
      loadingRef.current = vad.loading;
    }
  }, [vad.loading]);

  return vad;
}; 