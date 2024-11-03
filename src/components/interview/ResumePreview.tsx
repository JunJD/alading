import { useResumeStore } from "@/stores/useResumeStore";
import { ResumeCard } from "./ResumeCard";
import { ResumeForm } from "./ResumeForm";

export function ResumePreview({ onComplete }: { onComplete: () => void }) {
  const resume = useResumeStore();

  if (!resume.name) return null;

  const handleSubmit = (data: any) => {
    // 更新 store 中的数据
    resume.setResume(data);
    onComplete();
  };

  return (
    <div className="space-y-4">
      <ResumeCard resumeInfo={resume} />
      
      <div className="flex justify-center space-x-4">
        <ResumeForm 
          initialData={resume} 
          onSubmit={handleSubmit}
          onEdit={() => resume.clearResume()}
        />
        <button
          onClick={() => handleSubmit(resume)}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          直接继续
        </button>
      </div>
    </div>
  );
} 