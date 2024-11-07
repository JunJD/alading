import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface InterviewScoreProps {
  score: number;
  feedback: string;
}

export function InterviewScore({ score, feedback }: InterviewScoreProps) {
  const router = useRouter();
  const [userFeedback, setUserFeedback] = useState('');

  const handleSubmit = () => {
    // 处理用户反馈提交逻辑
    console.log('用户反馈:', userFeedback);
    router.push('/'); // 返回主页或其他页面
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">面试评分</h1>
      <p className="text-xl mb-2">您的得分: {score}</p>
      <p className="text-lg mb-4">{feedback}</p>
      <textarea
        className="w-1/2 p-2 border border-gray-300 rounded mb-4"
        placeholder="请留下您的反馈..."
        value={userFeedback}
        onChange={(e) => setUserFeedback(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        提交反馈
      </button>
    </div>
  );
} 