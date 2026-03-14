'use client'

interface Player {
  id: string
  name: string
  wins: number
  gamesPlayed: number
}

interface LeagueStandingsProps {
  players?: Player[]
}

export default function LeagueStandings({ players = [] }: LeagueStandingsProps) {
  // Mock data if no players provided
  const mockPlayers = players.length > 0 ? players : [
    { id: '1', name: 'Alice Johnson', wins: 12, gamesPlayed: 15 },
    { id: '2', name: 'Bob Smith', wins: 10, gamesPlayed: 14 },
    { id: '3', name: 'Carol Davis', wins: 8, gamesPlayed: 12 },
    { id: '4', name: 'David Wilson', wins: 6, gamesPlayed: 10 },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">League Standings</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Rank</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold">Player</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">Wins</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">Games</th>
              <th className="text-center py-3 px-4 text-gray-600 font-semibold">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {mockPlayers
              .sort((a, b) => b.wins - a.wins)
              .map((player, index) => (
                <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold">
                    <span className={`${
                      index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-gray-500' :
                      index === 2 ? 'text-orange-600' :
                      'text-gray-800'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{player.name}</td>
                  <td className="py-3 px-4 text-center font-semibold text-green-600">{player.wins}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{player.gamesPlayed}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {player.gamesPlayed > 0 ? Math.round((player.wins / player.gamesPlayed) * 100) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}