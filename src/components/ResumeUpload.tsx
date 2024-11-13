import { useState } from 'react';
import { useResumeStore } from '@/stores/useResumeStore';
import { ResumeInfo } from '@/types/resume';

export function ResumeUpload() {
    const { setResume, setLoading, setError } = useResumeStore();
    const [isUploading, setIsUploading] = useState(false);

    const processResume = async (file: File): Promise<ResumeInfo> => {
        // 这里添加处理简历的逻辑
        // 例如：解析PDF、提取文本等
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = async (e) => {
                try {
                    const base64 = e.target?.result as string;
                    
                    // 这里可以添加更多的简历处理逻辑
                    const resume: ResumeInfo = {
                        name: file.name,
                        text: '简历内容将在这里解析',
                        pdfBase64: base64
                    };
                    
                    resolve(resume);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setLoading(true);
        
        try {
            const resume = await processResume(file);
            setResume(resume);
        } catch (error) {
            setError(error instanceof Error ? error.message : '上传失败');
        } finally {
            setIsUploading(false);
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleUpload(file);
                    }
                }}
                disabled={isUploading}
            />
            {isUploading && <div>上传中...</div>}
        </div>
    );
} 