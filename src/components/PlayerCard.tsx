'use client'

interface Player {
  id: string
  name: string
  wins?: number
  gamesPlayed?: number
  joinedAt?: string
}

interface PlayerCardProps {
  player?: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {
  // Mock player data if none provided
  const defaultPlayer = {
    id: '1',
    name: 'Player',
    wins: 0,
    gamesPlayed: 0,
    joinedAt: new Date().toISOString()
  }

  const playerData = player || defaultPlayer

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-600">
            {playerData.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{playerData.name}</h3>
          <p className="text-sm text-gray-500">
            Joined {playerData.joinedAt ? new Date(playerData.joinedAt).toLocaleDateString() : 'Recently'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{playerData.wins || 0}</div>
          <div className="text-sm text-gray-500">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{playerData.gamesPlayed || 0}</div>
          <div className="text-sm text-gray-500">Games</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {playerData.gamesPlayed && playerData.gamesPlayed > 0
              ? `${Math.round(((playerData.wins || 0) / playerData.gamesPlayed) * 100)}%`
              : '0%'
            }
          </div>
          <div className="text-sm text-gray-500">Win Rate</div>
        </div>
      </div>
    </div>
  )
}