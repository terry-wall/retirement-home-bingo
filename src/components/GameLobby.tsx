'use client'

import { Game, Player } from '@/types/game'

interface GameLobbyProps {
  game: Game
  player: Player
  onStartGame: () => void
}

export default function GameLobby({ game, player, onStartGame }: GameLobbyProps) {
  const isHost = game.hostName === player.name
  const canStart = game.players.length >= 2
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Lobby</h1>
          <p className="text-lg text-gray-600">
            Game ID: <span className="font-mono font-medium">{game.id.slice(-8)}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Share this ID with other players so they can join!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Game Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Game Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Host:</span>
                <span className="font-medium">{game.hostName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Waiting for Players
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Players:</span>
                <span className="font-medium">{game.players.length}/20</span>
              </div>
            </div>
            
            {isHost && (
              <div className="mt-6">
                <button
                  onClick={onStartGame}
                  disabled={!canStart}
                  className={`
                    w-full py-3 px-4 rounded-lg font-bold text-lg transition-all
                    ${canStart
                      ? 'btn-success hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {canStart ? 'Start Game' : 'Need at least 2 players'}
                </button>
                
                {canStart && (
                  <p className="text-sm text-gray-600 text-center mt-2">
                    All players will be notified when the game starts
                  </p>
                )}
              </div>
            )}
            
            {!isHost && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-800 font-medium">Waiting for host to start the game...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Players List */}
          <div>
            <h2 className="text-xl font-bold mb-4">Players in Game</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {game.players.map((gamePlayer, index) => (
                <div
                  key={gamePlayer.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border
                    ${gamePlayer.id === player.id 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {gamePlayer.name}
                        {gamePlayer.id === player.id && ' (You)'}
                      </p>
                      {gamePlayer.name === game.hostName && (
                        <p className="text-xs text-primary-600 font-medium">Host</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-3 h-3 bg-green-400 rounded-full" title="Ready" />
                </div>
              ))}
            </div>
            
            {game.players.length < 20 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Room for {20 - game.players.length} more players
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">How to Play</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-1">
              <li>• Each player gets a unique 5x5 bingo card</li>
              <li>• Numbers will be called one at a time</li>
              <li>• Mark numbers on your card when they're called</li>
            </ul>
            <ul className="space-y-1">
              <li>• Get 5 in a row (horizontal, vertical, or diagonal)</li>
              <li>• First player to get BINGO wins!</li>
              <li>• Have fun and good luck! 🍀</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}