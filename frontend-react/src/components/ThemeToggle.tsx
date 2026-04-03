import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('imperial-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('imperial-theme', 'light')
    }
  }, [isDark])

  return (
    <button
      className="fixed top-4 right-4 z-50 rounded-md border border-border bg-card px-3 py-1.5 text-[13px] text-foreground hover:bg-muted transition-colors"
      onClick={() => setIsDark(!isDark)}
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
