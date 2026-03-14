'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LeagueCard from '@/components/LeagueCard'
import StatsTable from '@/components/StatsTable'

export default function DashboardPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">Overview of your bingo games and statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Your Leagues</h2>
          <LeagueCard />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <StatsTable games={games} />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="btn-primary">
          Back to Games
        </Link>
      </div>
    </div>
  )
}