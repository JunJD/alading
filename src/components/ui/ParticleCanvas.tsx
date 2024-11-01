"use client"
import { useEffect, useRef, useMemo } from "react"
import { VoiceState } from "@/types/interview"
import { particleActions } from "@/lib/particle-manager"

interface ParticleCanvasProps {
  voiceState: VoiceState;
  className?: string;
}

export const ParticleCanvas = ({ voiceState, className }: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const dimensionsRef = useRef({ width: 0, height: 0, projCenterX: 0, projCenterY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // 使用 useMemo 缓存设备像素比
  const dpr = useMemo(() => typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, [])

  const updateCanvasSize = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !contextRef.current || !container) return

    // 使用容器的尺寸而不是窗口尺寸
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()

    // 设置画布的实际大小（考虑设备像素比）
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr

    // 设置画布的显示大小
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

    // 根据设备像素比缩放上下文
    contextRef.current.scale(dpr, dpr)

    // 更新投影中心点
    dimensionsRef.current = {
      width: containerWidth,
      height: containerHeight,
      projCenterX: containerWidth / 2,
      projCenterY: containerHeight / 2
    }
  }

  const render = (timestamp: number) => {
    if (!contextRef.current) return

    // 控制帧率，限制在每秒60帧
    const deltaTime = timestamp - lastTimeRef.current
    if (deltaTime < 16) { // 约60fps
      animationFrameRef.current = requestAnimationFrame(render)
      return
    }

    lastTimeRef.current = timestamp

    const { width, height, projCenterX, projCenterY } = dimensionsRef.current
    particleActions.draw(
      contextRef.current,
      width,
      height,
      projCenterX,
      projCenterY
    )

    animationFrameRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 获取并缓存上下文
    contextRef.current = canvas.getContext('2d', {
      alpha: true,
      antialias: true,
      desynchronized: true,
    }) as CanvasRenderingContext2D

    if (!contextRef.current) return

    // 设置上下文属性
    contextRef.current.imageSmoothingEnabled = true
    contextRef.current.imageSmoothingQuality = 'high'

    updateCanvasSize()

    // 根据语音状态更新粒子效果
    switch (voiceState) {
      case 'userSpeaking':
        particleActions.onUserSpeaking()
        break
      case 'aiSpeaking':
        particleActions.onAiSpeaking()
        break
      case 'pending':
        particleActions.onProcessing()
        break
      default:
        particleActions.reset()
    }

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    lastTimeRef.current = performance.now()
    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      resizeObserver.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState, dpr])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
      style={{
        background: 'black',
      }}
    >
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          willChange: 'transform',
        }}
      />
    </div>
  )
} 