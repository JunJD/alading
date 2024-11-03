"use client"

import { InterviewRoom } from "@/components/interview/InterviewRoom"
import { useEffect, useState } from "react"
import { InterviewConfig } from "@/types/interview"
import { useResumeStore } from "@/stores/useResumeStore"

export default function InterviewPage() {

  const [config, setConfig] = useState<InterviewConfig>()
  const resume = useResumeStore();
  useEffect(() => {
    // 从 localStorage 获取面试配置
    const savedConfig = localStorage.getItem('interviewConfig')
    console.log(resume, 'resume')
    if (savedConfig) {
      setConfig({
        ...JSON.parse(savedConfig),
        resume: resume
      })
    }
  }, [])

  if (!config) return null

  return <InterviewRoom config={config} />
} 