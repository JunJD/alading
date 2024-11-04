"use client";
import { motion } from "framer-motion";

export interface LoadingState {
  id: string;
  text: string;
  status: 'pending' | 'loading' | 'completed';
}

interface MultiStepLoaderProps {
  steps?: string[];
  loadingStates?: LoadingState[];
  _loading?: boolean;
  _duration?: number;
  _loop?: boolean;
}

export function MultiStepLoader({ 
  steps,
  loadingStates,
  _loading = true,
  _duration = 2000,
  _loop = false 
}: MultiStepLoaderProps) {
  // 如果提供了 steps，将其转换为 loadingStates
  const states = loadingStates || steps?.map((text) => ({
    id: `step-${Math.random().toString(36).substr(2, 9)}`,
    text,
    status: 'pending' as const
  })) || [];

  return (
    <div className="space-y-4">
      {states.map((state) => (
        <motion.div
          key={state.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: state.status !== 'pending' ? 1 : 0.5,
            y: 0 
          }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            {state.status === 'loading' && (
              <motion.div
                className="absolute inset-0 border-2 border-blue-500 rounded-full"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
            {state.status === 'completed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 bg-green-500 rounded-full"
              />
            )}
            {state.status === 'pending' && (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
            )}
          </div>
          <span className={`text-sm ${
            state.status === 'completed' 
              ? 'text-green-500' 
              : state.status === 'loading'
                ? 'text-blue-500'
                : 'text-gray-500'
          }`}>
            {state.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
} 