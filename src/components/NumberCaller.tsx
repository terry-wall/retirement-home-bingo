'use client'

interface NumberCallerProps {
  onCallNumber: () => void
  gameStatus: string
  remainingNumbers: number
}

export default function NumberCaller({ onCallNumber, gameStatus, remainingNumbers }: NumberCallerProps) {
  const canCallNumber = gameStatus === 'playing' && remainingNumbers > 0
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Number Caller</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Numbers Remaining</p>
          <div className="text-4xl font-bold text-primary-600">
            {remainingNumbers}
          </div>
        </div>
        
        <button
          onClick={onCallNumber}
          disabled={!canCallNumber}
          className={`
            w-full py-4 px-6 rounded-lg text-lg font-bold transition-all
            ${canCallNumber
              ? 'btn-primary hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {gameStatus !== 'playing' 
            ? 'Game Not Started'
            : remainingNumbers === 0
            ? 'All Numbers Called'
            : 'Call Next Number'
          }
        </button>
        
        {gameStatus === 'playing' && (
          <div className="text-center text-sm text-gray-500">
            <p>Click the button above to call the next random number</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="font-semibold mb-2">Game Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Call numbers one at a time</li>
          <li>• Players mark numbers on their cards</li>
          <li>• First player to get BINGO wins!</li>
          <li>• BINGO = complete row, column, or diagonal</li>
        </ul>
      </div>
    </div>
  )
}