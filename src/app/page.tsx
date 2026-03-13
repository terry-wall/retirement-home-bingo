'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Game } from '../types/game'

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState('')

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

  const createGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostName: playerName,
        }),
      })
      
      const game = await response.json()
      window.location.href = `/game/${game.id}?player=${encodeURIComponent(playerName)}`
    } catch (error) {
      console.error('Error creating game:', error)
      alert('Failed to create game')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Bingo!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Join or create a bingo game to play with friends at your retirement home.
        </p>
        
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
          />
          <button
            onClick={createGame}
            className="btn-primary w-full"
            disabled={!playerName.trim()}
          >
            Create New Game
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Active Games</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No active games. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Game #{game.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">
                      Host: {game.hostName} • Status: {game.status} • Players: {game.playerCount}/20
                    </p>
                  </div>
                  {game.status === 'waiting' && playerName.trim() && (
                    <Link
                      href={`/game/${game.id}?player=${encodeURIComponent(playerName)}`}
                      className="btn-primary"
                    >
                      Join Game
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={fetchGames}
          className="btn-secondary mt-4"
        >
          Refresh Games
        </button>
      </div>
    </div>
  )
}