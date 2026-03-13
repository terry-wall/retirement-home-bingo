'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import BingoCard from '@/components/BingoCard'
import GameBoard from '@/components/GameBoard'
import NumberCaller from '@/components/NumberCaller'
import PlayersList from '@/components/PlayersList'
import GameLobby from '@/components/GameLobby'
import { Game, Player } from '@/types/game'
import { io, Socket } from 'socket.io-client'

export default function GamePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const playerName = searchParams.get('player') || ''
  
  const [game, setGame] = useState<Game | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!playerName) {
      setError('Player name is required')
      setLoading(false)
      return
    }

    joinGame()
    
    // Initialize socket connection
    const newSocket = io()
    setSocket(newSocket)
    
    newSocket.emit('join-game', { gameId, playerName })
    
    newSocket.on('game-updated', (updatedGame: Game) => {
      setGame(updatedGame)
    })
    
    newSocket.on('number-called', (data) => {
      setGame(prev => prev ? {
        ...prev,
        calledNumbers: [...prev.calledNumbers, data.number],
        lastCalledNumber: data.number
      } : null)
    })
    
    newSocket.on('player-won', (data) => {
      alert(`${data.playerName} won the game!`)
    })
    
    return () => {
      newSocket.disconnect()
    }
  }, [gameId, playerName])

  const joinGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to join game')
      }
      
      const data = await response.json()
      setGame(data.game)
      setPlayer(data.player)
    } catch (error) {
      console.error('Error joining game:', error)
      setError('Failed to join game')
    } finally {
      setLoading(false)
    }
  }

  const startGame = async () => {
    try {
      await fetch(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'playing' }),
      })
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  const callNumber = async () => {
    try {
      await fetch(`/api/games/${gameId}/call`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error calling number:', error)
    }
  }

  const markNumber = async (number: number) => {
    if (!player) return
    
    try {
      await fetch(`/api/games/${gameId}/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          playerId: player.id,
          number 
        }),
      })
    } catch (error) {
      console.error('Error marking number:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!game || !player) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Game not found or unable to join.</p>
        </div>
      </div>
    )
  }

  if (game.status === 'waiting') {
    return (
      <GameLobby 
        game={game} 
        player={player} 
        onStartGame={startGame}
      />
    )
  }

  const isHost = game.hostName === playerName

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Bingo Card</h2>
            <BingoCard 
              card={player.card}
              markedNumbers={player.markedNumbers}
              onMarkNumber={markNumber}
              calledNumbers={game.calledNumbers}
            />
          </div>
          
          <GameBoard 
            calledNumbers={game.calledNumbers}
            lastCalledNumber={game.lastCalledNumber}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {isHost && (
            <NumberCaller 
              onCallNumber={callNumber}
              gameStatus={game.status}
              remainingNumbers={75 - game.calledNumbers.length}
            />
          )}
          
          <PlayersList 
            players={game.players}
            currentPlayer={player}
          />
        </div>
      </div>
    </div>
  )
}