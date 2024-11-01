"use client"

import { InterviewRoom } from "@/components/interview/InterviewRoom"
import { useEffect, useState } from "react"
import { InterviewConfig } from "@/types/interview"

export default function InterviewPage() {

  const [config, setConfig] = useState<InterviewConfig>()

  useEffect(() => {
    // 从 localStorage 获取面试配置
    const savedConfig = localStorage.getItem('interviewConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  if (!config) return null

  return <InterviewRoom config={config} />
} 