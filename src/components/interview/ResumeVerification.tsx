"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MultiStepLoader, LoadingState } from "../ui/MultiStepLoader";
import { readPdf } from "@/lib/resume-parser";
import { delay } from "@/lib/utils";
import { ResumeForm } from "./ResumeForm";
import { FileUpload } from "../ui/FileUpload";
import { ResumeCard } from "./ResumeCard";


export interface ResumeInfo {
    name?: string;
    age?: number;
    text?: string;
    industry?: any;
    pdfBase64?: string;
}

type LoadingStatus = 'pending' | 'loading' | 'completed';

const INITIAL_LOADING_STATES: LoadingState[] = [
    { id: 'upload', text: '正在上传简历...', status: 'pending' },
    { id: 'parse', text: '解析简历内容...', status: 'pending' },
    { id: 'extract', text: '提取关键信息...', status: 'pending' }
];

const RESUME_STORAGE_KEY = 'resumeInfo';

function storageWrapOrNull<T>(key: string): T|null {
    return JSON.parse(sessionStorage.getItem(key) || "null")
}

export function ResumeVerification({ onComplete }: { onComplete: (info: ResumeInfo) => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [loadingStates, setLoadingStates] = useState<LoadingState[]>(INITIAL_LOADING_STATES);
    const [parsedInfo, setParsedInfo] = useState<ResumeInfo|null>(storageWrapOrNull<ResumeInfo>(RESUME_STORAGE_KEY));
    const [pdfUrl, setPdfUrl] = useState<string>();

    const updateLoadingState = (id: string, status: LoadingStatus) => {
        setLoadingStates(prev =>
            prev.map(state =>
                state.id === id ? { ...state, status } : state
            )
        );
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileUpload = async (file: File) => {
        setLoading(true);
        setError(undefined);
        setLoadingStates(INITIAL_LOADING_STATES);
        updateLoadingState('upload', 'loading');
        
        try {
            const base64Data = await fileToBase64(file);
            const fileUrl = URL.createObjectURL(file);
            setPdfUrl(fileUrl);

            await delay(1000);
            updateLoadingState('upload', 'completed');
            updateLoadingState('parse', 'loading');

            const result = await readPdf(fileUrl);

            await delay(1000);
            if (!result.name) {
                throw new Error("未能识别姓名信息");
            }

            await delay(1000);
            updateLoadingState('parse', 'completed');
            updateLoadingState('extract', 'loading');

            const resumeInfo: ResumeInfo = {
                name: result.name,
                age: result.age,
                text: result.text,
                pdfBase64: base64Data
            };

            setParsedInfo(resumeInfo);
            updateLoadingState('extract', 'completed');

        } catch (err) {
            setError(err instanceof Error ? err.message : "简历上传失败");
            loadingStates.forEach(state => {
                if (state.status === 'loading') {
                    updateLoadingState(state.id, 'pending');
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (data: ResumeInfo) => {
        sessionStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
        onComplete(data);
    };

    const handleFileChange = async (files: File[]) => {
        if (files.length > 0) {
            const file = files[0]; // 只处理第一个文件
            if (file.type === 'application/pdf') {
                await handleFileUpload(file);
            } else {
                setError("请上传 PDF 格式的文件");
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        上传简历
                    </h2>
                </div>

                {!parsedInfo && (
                    loading ? (
                        <MultiStepLoader loadingStates={loadingStates} />
                    ) : (
                        <div className="flex flex-col items-center">
                            <FileUpload onChange={handleFileChange} />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>
                    )
                )}

                {parsedInfo && !loading && (
                    <div className="space-y-4">
                        <ResumeCard resumeInfo={parsedInfo} pdfUrl={pdfUrl} />
                        
                        <div className="flex justify-center space-x-4 mt-2">
                            <ResumeForm
                                initialData={parsedInfo}
                                onSubmit={handleFormSubmit}
                                onEdit={() => {
                                    setParsedInfo(null);
                                    setPdfUrl(undefined);
                                }}
                            />
                            <button
                                onClick={() => handleFormSubmit(parsedInfo)}
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                直接继续
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
} 