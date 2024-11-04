"use client";
import { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "../ui/Model";
import { ResumeInfo } from "@/types/resume";

interface ResumeFormProps {
  initialData?: ResumeInfo;
  onSubmit: (data: ResumeInfo) => void;
  onEdit?: () => void;
  autoOpen?: boolean;
}

export function ResumeForm({ 
  initialData, 
  onSubmit, 
  onEdit,
  autoOpen = false 
}: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeInfo>(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal>
      <ModalTrigger 
        className="bg-blue-500 text-white hover:bg-blue-600"
        autoOpen={autoOpen}
      >
        {initialData ? "编辑简历信息" : "确认信息"}
      </ModalTrigger>

      <ModalBody className="w-full md:w-[600px]">
        <ModalContent>
          <h2 className="text-2xl font-bold mb-6">
            {initialData ? "编辑简历信息" : "确认简历信息"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  年龄
                </label>
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  min="16"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  简历内容
                </label>
                <textarea
                  value={formData.text || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[200px]"
                  required
                />
              </div>
            </div>

            {initialData && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-blue-500 hover:text-blue-600"
                >
                  重新上传简历
                </button>
              </div>
            )}
          </form>
        </ModalContent>
        
        <ModalFooter>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData(initialData || {})}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-400"
            >
              重置
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              确认
            </button>
          </div>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
} 