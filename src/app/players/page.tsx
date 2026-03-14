'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PlayerCard from '@/components/PlayerCard'

interface Player {
  id: string
  name: string
  wins: number
  gamesPlayed: number
  joinedAt: string
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app this would come from an API
    const mockPlayers: Player[] = [
      { id: '1', name: 'Alice Johnson', wins: 12, gamesPlayed: 15, joinedAt: '2024-01-15' },
      { id: '2', name: 'Bob Smith', wins: 10, gamesPlayed: 14, joinedAt: '2024-01-20' },
      { id: '3', name: 'Carol Davis', wins: 8, gamesPlayed: 12, joinedAt: '2024-02-01' },
      { id: '4', name: 'David Wilson', wins: 6, gamesPlayed: 10, joinedAt: '2024-02-10' },
      { id: '5', name: 'Eva Brown', wins: 4, gamesPlayed: 8, joinedAt: '2024-02-15' },
      { id: '6', name: 'Frank Miller', wins: 2, gamesPlayed: 5, joinedAt: '2024-02-20' },
    ]
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setPlayers(mockPlayers)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading players...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Players</h1>
        <p className="text-gray-600">View all players in the retirement home bingo community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
      
      {players.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No players found.</p>
          <Link href="/" className="mt-4 inline-block btn-primary">
            Start a New Game
          </Link>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="btn-primary mr-4">
          Back to Dashboard
        </Link>
        <Link href="/league" className="btn-secondary">
          View League Standings
        </Link>
      </div>
    </div>
  )
}