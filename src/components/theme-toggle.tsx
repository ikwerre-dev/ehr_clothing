'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/context/DarkModeContext'

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  )
}