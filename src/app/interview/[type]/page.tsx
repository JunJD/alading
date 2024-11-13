"use client"

import { InterviewRoom } from "@/components/interview/InterviewRoom"
import { useEffect, useState } from "react"
import { InterviewConfig } from "@/types/interview"
import { useResumeStore } from "@/stores/useResumeStore"

export default function InterviewPage() {

  const [config, setConfig] = useState<InterviewConfig>()
  const resume = useResumeStore();
  
  useEffect(() => {
    console.log(resume, 'resume')
    // 从 localStorage 获取面试配置
    const savedConfig = localStorage.getItem('interviewConfig')

    if (savedConfig) {
      setConfig({
        ...JSON.parse(savedConfig),
        resume: resume
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume])

  if (!config || typeof config === 'undefined' || !config.resume || !config.resume.text) return null

  return <InterviewRoom config={config} />
} 