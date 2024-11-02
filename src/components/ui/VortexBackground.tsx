import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { InterviewState } from "@/types/interview";

interface VortexProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  voiceState: InterviewState;
}

export const Vortex = ({ children, className, containerClassName, voiceState }: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noise3D = createNoise3D();
  let animationId: number;

  // 根据不同的语音状态返回不同的动画参数
  const getStateParams = () => {
    switch (voiceState) {
      case 'userSpeaking':
        return {
          particleCount: 500,
          baseSpeed: 2.0,
          baseHue: 220, // 蓝色
          rangeHue: 60,
          blur: 8,
          opacity: 0.8,
          particleSize: 2,
        };
      case 'aiSpeaking':
        return {
          particleCount: 400,
          baseSpeed: 1.5,
          baseHue: 120, // 绿色
          rangeHue: 40,
          blur: 6,
          opacity: 0.7,
          particleSize: 1.8,
        };
      case 'pending':
        return {
          particleCount: 300,
          baseSpeed: 1.2,
          baseHue: 45, // 黄色
          rangeHue: 30,
          blur: 4,
          opacity: 0.6,
          particleSize: 1.5,
        };
      default:
        return {
          particleCount: 200,
          baseSpeed: 0.8,
          baseHue: 240, // 深蓝色
          rangeHue: 20,
          blur: 3,
          opacity: 0.4,
          particleSize: 1.2,
        };
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const params = getStateParams();
    const time = Date.now() * 0.001 * params.baseSpeed;

    // 清除画布
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - params.opacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制粒子
    for (let i = 0; i < params.particleCount; i++) {
      const x = (noise3D(i * 0.1, 0, time) + 1) * 0.5 * canvas.width;
      const y = (noise3D(0, i * 0.1, time) + 1) * 0.5 * canvas.height;
      const hue = params.baseHue + noise3D(x * 0.01, y * 0.01, time) * params.rangeHue;

      ctx.beginPath();
      ctx.arc(x, y, params.particleSize, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${params.opacity})`;
      ctx.fill();
    }

    // 添加发光效果
    ctx.filter = `blur(${params.blur}px)`;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    animationId = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置画布尺寸
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-black", containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        ref={containerRef}
        className="absolute inset-0 z-0"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />
      </motion.div>
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};
