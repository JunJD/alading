"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Industry, InterviewType, InterviewConfig } from "@/types/interview";
import { INDUSTRIES } from "@/constants/interview";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { useRouter } from "next/navigation";
import { ResumeVerification } from "./ResumeVerification";
import { ResumeInfo } from "@/types/resume";
import { INTERVIEW_TYPES } from "@/constants/interviewTypes";

interface InterviewSetupProps {
  onBack: () => void;
  onComplete: (config: InterviewConfig) => void;
}

export function InterviewSetup({ onBack, onComplete }: InterviewSetupProps) {
  const router = useRouter();
  const [step, setStep] = useState<"resume" | "industry" | "type">("resume");
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo>();

  const handleIndustrySelect = (industry: Industry) => {
    setResumeInfo(prev => prev ? { ...prev, industry } : { industry });
    setStep("type");
  };

  const handleTypeSelect = (type: InterviewType) => {
    const config: InterviewConfig = { industry: resumeInfo?.industry ?? null, type, resume: resumeInfo ?? null };
    localStorage.setItem('interviewConfig', JSON.stringify(config));
    onComplete(config);
    router.push(`/interview/${type.id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {step === "resume" ? (
        <ResumeVerification 
          onComplete={() => {
            setStep("industry");
          }} 
        />
      ) : step === "industry" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRIES.map((industry) => (
            <motion.div
              key={industry.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleIndustrySelect(industry)}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">{industry.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {industry.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {industry.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(INTERVIEW_TYPES).map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleTypeSelect(type)}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">{type.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {type.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {type.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <HoverBorderGradient
          onClick={onBack}
          className="text-lg font-semibold"
        >
          返回首页
        </HoverBorderGradient>
      </div>
    </div>
  );
} 