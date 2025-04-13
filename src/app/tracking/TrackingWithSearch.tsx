'use client'

import { Suspense } from 'react'
import TrackingContent from './TrackingContent'
import { useSearchParams } from 'next/navigation'

export default function TrackingPage() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code')

    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <TrackingContent initialTrackingNumber={code || ''} />
        </Suspense>
    )
}