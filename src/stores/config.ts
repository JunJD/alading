import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_OPENAI_CONFIG, OpenAIConfig } from '@/types/config'

interface ConfigState {
  config: OpenAIConfig | null
  setConfig: (config: OpenAIConfig | Partial<OpenAIConfig>) => void
  clearConfig: () => void
}


export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: DEFAULT_OPENAI_CONFIG,
      setConfig: (newConfig) => set((state) => ({
        config: {
          ...DEFAULT_OPENAI_CONFIG,
          ...(state.config || {}),
          ...newConfig
        }
      })),
      clearConfig: () => set({ config: DEFAULT_OPENAI_CONFIG }),
    }),
    {
      name: 'ai-config-storage',
    }
  )
) 