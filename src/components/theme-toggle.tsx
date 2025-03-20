'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/context/DarkModeContext'

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative rounded-lg p-2 cursor-pointer transition-colors ${
        isDarkMode 
          ? 'hover:bg-[#121212] text-white' 
          : 'hover:bg-gray-100 text-black'
      }`}
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  )
}