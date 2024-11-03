"use client";
import { useResumeStore } from "@/stores/useResumeStore";
import { ResumeUploader } from "./ResumeUploader";
import { ResumePreview } from "./ResumePreview";
import { MultiStepLoader } from "../ui/MultiStepLoader";

export function ResumeVerification({ onComplete }: { onComplete: () => void }) {
  const { isLoading, error, name } = useResumeStore();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        上传简历
      </h2>

      {!name ? (
        isLoading ? (
          <MultiStepLoader
            steps={[
              "正在上传简历...",
              "解析简历内容...",
              "提取关键信息..."
            ]}
          />
        ) : (
          <div className="flex flex-col items-center">
            <ResumeUploader />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )
      ) : (
        <ResumePreview onComplete={onComplete} />
      )}
    </div>
  );
} 