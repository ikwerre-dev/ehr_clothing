'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

type DarkModeContextType = {
    isDarkMode: boolean
    toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Check for saved preference or system preference on client-side
        const savedMode = Cookies.get('darkMode')
        if (savedMode !== undefined) {
            setIsDarkMode(savedMode === 'true')
        } else {
            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDarkMode(systemPreference)
        }
    }, [])

    useEffect(() => {
        // Save to cookie whenever dark mode changes
        Cookies.set('darkMode', isDarkMode.toString(), { expires: 365 })
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev)
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export function useDarkMode() {
    const context = useContext(DarkModeContext)
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider')
    }
    return context
}