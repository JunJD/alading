"use client"
import { TypewriterEffect } from "@/components/ui/TypewriterEffect"
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient"
import { SparklesCore } from "@/components/ui/SparklesCore"
import { InterviewSimulator } from "@/components/interview/InterviewSimulator"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { BackgroundBeamsWithCollision } from "@/components/ui/BackgroundBeamsWithCollision"
import { motion } from "framer-motion"
import { useState } from "react"
import { InterviewSetup } from "@/components/interview/InterviewSetup"
import { InterviewConfig } from "@/types/interview"
const words = [
  { text: "准备好" },
  { text: "提升", className: "text-blue-500 dark:text-blue-500" },
  { text: "你的" },
  { text: "面试", className: "text-blue-500 dark:text-blue-500" },
  { text: "技巧了吗？" },
];
export default function AIInterviewSimulator() {
  const [currentView, setCurrentView] = useState<
    "home" | "setup" | "interview" | "completed"
  >("home");
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({});

  const startSetup = () => {
    setCurrentView("setup");
  };

  const handleSetupComplete = (config: InterviewConfig) => {
    setInterviewConfig(config);
    setCurrentView("interview");
  };

  const completeInterview = () => {
    setCurrentView("completed");
  };

  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
      <ThemeToggle />
      {currentView === "home" ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              AI 模拟面试
            </h1>
            <TypewriterEffect words={words} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-8"
          >
            使用最先进的 AI 技术，模拟真实面试场景，提升你的面试技能。
            无论你是刚开始找工作，还是想要在职场更上一层楼，我们都能帮助你做好充分准备。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <HoverBorderGradient onClick={startSetup}
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
              开始模拟面试
            </HoverBorderGradient>
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
              了解更多
            </HoverBorderGradient>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">为什么选择我们？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-blue-500">AI 驱动</h3>
                <p className="text-gray-600 dark:text-gray-300">使用最新的 AI 技术，提供个性化的面试体验。</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-blue-500">实时反馈</h3>
                <p className="text-gray-600 dark:text-gray-300">获得即时反馈，快速改进你的面试表现。</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-blue-500">多样化场景</h3>
                <p className="text-gray-600 dark:text-gray-300">覆盖各种行业和职位的面试场景。</p>
              </div>
            </div>
          </motion.div>
        </div>
      ) :  (
        <InterviewSetup
          onComplete={handleSetupComplete}
          onBack={() => setCurrentView("home")}
        />
      )}
    </BackgroundBeamsWithCollision>
  );
}
