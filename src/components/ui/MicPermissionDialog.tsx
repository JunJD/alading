"use client";
import { motion } from "framer-motion";

interface MicPermissionDialogProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function MicPermissionDialog({ onAllow, onDeny }: MicPermissionDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          需要麦克风权限
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          为了进行语音面试，我们需要访问您的麦克风。请允许使用麦克风以继续。
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onDeny}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            拒绝
          </button>
          <button
            onClick={onAllow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            允许
          </button>
        </div>
      </div>
    </motion.div>
  );
} 