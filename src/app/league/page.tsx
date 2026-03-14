'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LeagueStandings from '@/components/LeagueStandings'

export default function LeaguePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading league standings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">League</h1>
        <p className="text-gray-600">View current league standings and player statistics.</p>
      </div>

      <LeagueStandings />
      
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="btn-primary mr-4">
          Back to Dashboard
        </Link>
        <Link href="/" className="btn-secondary">
          Join New Game
        </Link>
      </div>
    </div>
  )
}