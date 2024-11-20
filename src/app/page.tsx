"use client"
import { TypewriterEffect } from "@/components/ui/TypewriterEffect"
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { BackgroundBeamsWithCollision } from "@/components/ui/BackgroundBeamsWithCollision"
import { motion } from "framer-motion"
import { useState } from "react"
import { InterviewSetup } from "@/components/interview/InterviewSetup"
import Link from 'next/link'
import { Icons } from '@/constants/icons'
import { BarChart, Users, Code } from 'lucide-react'
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"

const words = [
  { text: "Hi," },
  { text: "我是你的", className: "text-blue-500 dark:text-blue-500" },
  { text: "AI" },
  { text: "面试助手", className: "text-blue-500 dark:text-blue-500" },
];

export default function AIInterviewSimulator() {
  const [currentView, setCurrentView] = useState<"home" | "setup" | "interview" | "completed">("home");
  const [isLoaded, setIsLoaded] = useState(false);

  const startSetup = () => {
    setCurrentView("setup");
  };

  const handleSetupComplete = () => {
    setCurrentView("interview");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <BackgroundBeamsWithCollision className="min-h-screen">
        <ScrollArea className="w-full h-screen">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500">AI面试助手</Link>
              <div className="flex items-center space-x-8">
                <div className="hidden md:flex items-center space-x-6">
                  <Link href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">
                    首页
                  </Link>
                  <Link href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">
                    模拟面试
                  </Link>
                  <Link href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">
                    技能评估
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Link href="/settings" className="w-10 h-10 rounded-lg bg-white dark:bg-black text-black dark:text-white 
                         transition-colors border border-black/10 dark:border-white/10 
                         flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900">
                    <Icons.settings className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.nav>

          {currentView === "home" ? (
            <div className="pt-4">
              <div className="relative min-h-[80vh] flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between w-full">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col items-start space-y-4"
                  >
                    <TypewriterEffect words={words} />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl"
                    >
                      让我们一起提升你的面试技能，助你在每次面试中脱颖而出
                    </motion.p>
                    <HoverBorderGradient
                      onClick={startSetup}
                      containerClassName="rounded-full"
                      as="button"
                      className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                    >
                      开始模拟面试
                    </HoverBorderGradient>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="relative w-64 h-64 mt-8 md:mt-0"
                  >
                    <Image
                      src="/ai-avatar.png"
                      alt="AI Assistant Avatar"
                      width={256}
                      height={256}
                      className="rounded-full"
                      onLoadingComplete={() => setIsLoaded(true)}
                    />
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="max-w-7xl mx-auto px-4 pb-16"
              >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                  核心功能
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm"
                  >
                    <BarChart className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-blue-500 dark:text-blue-400">
                      AI 驱动
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      使用最新的 AI 技术，提供个性化的面试体验
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm"
                  >
                    <Users className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-blue-500 dark:text-blue-400">
                      实时反馈
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      获得即时反馈，快速改进你的面试表现
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm"
                  >
                    <Code className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-blue-500 dark:text-blue-400">
                      多样化场景
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      覆盖各种行业和职位的面试场景
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : (
            <InterviewSetup
              onComplete={handleSetupComplete}
              onBack={() => setCurrentView("home")}
            />
          )}
        </ScrollArea>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
