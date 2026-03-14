'use client'

interface Game {
  id: string
  name: string
  status: string
  createdAt: string
}

interface StatsTableProps {
  games: Game[]
}

export default function StatsTable({ games }: StatsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Games</h3>
      
      {games.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No games played yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-600">Game</th>
                <th className="text-left py-2 px-3 text-gray-600">Status</th>
                <th className="text-left py-2 px-3 text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {games.slice(0, 5).map((game) => (
                <tr key={game.id} className="border-b border-gray-100">
                  <td className="py-2 px-3">{game.name}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      game.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800' 
                        : game.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {game.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}