'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useUnipathTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: resolvedTheme,
    setTheme,
    toggleTheme,
    mounted,
  }
}
