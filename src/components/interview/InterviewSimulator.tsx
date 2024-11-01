"use client"
import { TextGenerateEffect } from "../ui/TextGenerateEffect"
import { useState } from "react"
import { InterviewConfig } from "@/types/interview"

interface InterviewSimulatorProps {
  config: InterviewConfig;
  onComplete: () => void;
}

export function InterviewSimulator({ config, onComplete }: InterviewSimulatorProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  // 根据面试类型和行业选择不同的问题集
  const getQuestions = () => {
    if (config.type?.id === 'self-intro') {
      return [
        "请简单介绍一下你自己。",
        "你的职业规划是什么？",
        "你为什么选择这个行业？",
        "你认为你最大的优势是什么？",
        "你对这个岗位的理解是什么？"
      ];
    } else if (config.type?.id === 'project') {
      return [
        "请介绍一个你最有成就感的项目经历。",
        "在项目中你遇到了什么挑战？如何解决的？",
        "你在团队中担任什么角色？",
        "项目最终取得了什么成果？",
        "从这个项目中你学到了什么？"
      ];
    } else if (config.type?.id === 'salary') {
      return [
        "你期望的薪资范围是多少？",
        "为什么你认为自己值这个薪资？",
        "除了基本工资，你还关注哪些福利待遇？",
        "如果我们的预算达不到你的期望，你会如何考虑？",
        "你对未来的薪资增长有什么期望？"
      ];
    }
    return [
      "请介绍一下你自己。",
      "你为什么选择应聘这个职位？",
      "你认为你的优势是什么？",
      "你如何处理工作中的压力？",
      "你对我们公司了解多少？"
    ];
  };

  const interviewQuestions = getQuestions();

  const handleNextQuestion = () => {
    // 根据面试类型生成不同的反馈
    const generateFeedback = () => {
      if (config.type?.id === 'self-intro') {
        return "你的自我介绍很有条理，突出了关键经历和能力。建议可以更多地结合行业特点来展示自己。";
      } else if (config.type?.id === 'project') {
        return "项目经验描述详实，清晰地展示了你的问题解决能力。建议可以多强调量化的成果。";
      } else if (config.type?.id === 'salary') {
        return "薪资谈判的态度恰当，论述有理有据。建议可以更多地强调自己的价值贡献。";
      }
      return "很好的回答！你提到了一些关键点。继续保持这种表现。";
    };

    setFeedback(generateFeedback());
    
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setFeedback('');
      }, 3000);
    } else {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {config.industry?.name} - {config.type?.name}
        </h2>
        <span className="text-4xl">{config.type?.icon}</span>
      </div>
      
      <div className="mb-6">
        <TextGenerateEffect words={interviewQuestions[currentQuestionIndex]} />
      </div>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="w-full p-4 mb-4 border rounded-lg dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={6}
        placeholder="在这里输入你的回答..."
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          问题 {currentQuestionIndex + 1}/{interviewQuestions.length}
        </span>
        <button
          onClick={handleNextQuestion}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300"
        >
          提交回答
        </button>
      </div>

      {feedback && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">💡</span>
            <h3 className="font-semibold text-green-800 dark:text-green-200">AI 反馈</h3>
          </div>
          <p className="text-green-700 dark:text-green-300">{feedback}</p>
        </div>
      )}
    </div>
  );
} 