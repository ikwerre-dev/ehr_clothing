'use client'

import { useDarkMode } from '@/context/DarkModeContext'

export function ThemeContainer({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useDarkMode()
    
    return (
        <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {children}
        </div>
    )
}