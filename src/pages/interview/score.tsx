import { useRouter } from 'next/router';
import { InterviewScore } from '@/components/interview/InterviewScore';

export default function ScorePage() {
  const router = useRouter();
  const { score, feedback } = router.query;

  if (!score || !feedback) {
    return <p>加载中...</p>;
  }

  return (
    <InterviewScore score={Number(score)} feedback={String(feedback)} />
  );
} 