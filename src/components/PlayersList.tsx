'use client'

import { Player } from '@/types/game'

interface PlayersListProps {
  players: Player[]
  currentPlayer: Player
}

export default function PlayersList({ players, currentPlayer }: PlayersListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Players ({players.length}/20)</h2>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayer.id
          const markedCount = player.markedNumbers.length
          
          return (
            <div
              key={player.id}
              className={`
                p-3 rounded-lg border transition-colors
                ${isCurrentPlayer 
                  ? 'bg-primary-50 border-primary-200' 
                  : 'bg-gray-50 border-gray-200'
                }
                ${player.isWinner ? 'ring-2 ring-success-500' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${player.isWinner 
                      ? 'bg-yellow-400' 
                      : markedCount > 15 
                      ? 'bg-green-400' 
                      : markedCount > 10 
                      ? 'bg-yellow-400' 
                      : 'bg-gray-300'
                    }
                  `} />
                  <div>
                    <p className={`font-medium ${
                      isCurrentPlayer ? 'text-primary-700' : 'text-gray-900'
                    }`}>
                      {player.name}
                      {isCurrentPlayer && ' (You)'}
                      {player.isWinner && ' 🏆'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {markedCount}/24 marked
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {player.isWinner ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      WINNER!
                    </span>
                  ) : (
                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-300"
                        style={{ width: `${(markedCount / 24) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {players.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No players yet</p>
        </div>
      )}
      
      {players.length < 20 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Room for {20 - players.length} more players
          </p>
        </div>
      )}
    </div>
  )
}