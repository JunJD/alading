"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Icons } from '@/constants/icons'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 h-10 rounded-lg bg-white dark:bg-black text-black dark:text-white 
                transition-colors border border-black/10 dark:border-white/10 
                flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900"
    >
      <Icons.sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 