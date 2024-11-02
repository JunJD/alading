"use client"
import { InterviewState } from "@/types/interview"
import { motion } from "framer-motion"

export const VoiceStateIcon = ({ state }: { state: InterviewState }) => {
  const renderIcon = () => {
    switch (state) {
      case 'userSpeaking':
        return (
          <motion.svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-blue-500"
            initial={false}
            animate={{
              scale: [1, 1.2, 1],
              transition: { repeat: Infinity, duration: 1 }
            }}
          >
            <path
              fill="currentColor"
              d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
            />
          </motion.svg>
        )
      case 'aiSpeaking':
        return (
          <motion.svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-green-500"
            initial={false}
            animate={{
              rotate: [0, 360],
              transition: { repeat: Infinity, duration: 2, ease: "linear" }
            }}
          >
            <path
              fill="currentColor"
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"
            />
          </motion.svg>
        )
      case 'pending':
        return (
          <motion.svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-yellow-500"
            initial={false}
            animate={{
              opacity: [1, 0.5, 1],
              transition: { repeat: Infinity, duration: 1 }
            }}
          >
            <path
              fill="currentColor"
              d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
            />
          </motion.svg>
        )
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-gray-400"
          >
            <path
              fill="currentColor"
              d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
            />
          </svg>
        )
    }
  }

  return (
    <div className="flex items-center justify-center">
      {renderIcon()}
    </div>
  )
} 