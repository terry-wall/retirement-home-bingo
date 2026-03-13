'use client'

interface GameBoardProps {
  calledNumbers: number[]
  lastCalledNumber: number | null
}

export default function GameBoard({ calledNumbers, lastCalledNumber }: GameBoardProps) {
  const generateNumberGrid = () => {
    const grid = []
    const letters = ['B', 'I', 'N', 'G', 'O']
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ]
    
    for (let letterIndex = 0; letterIndex < 5; letterIndex++) {
      const [start, end] = ranges[letterIndex]
      const column = []
      
      for (let num = start; num <= end; num++) {
        column.push({
          number: num,
          letter: letters[letterIndex],
          called: calledNumbers.includes(num),
          isLast: num === lastCalledNumber
        })
      }
      
      grid.push(column)
    }
    
    return grid
  }
  
  const numberGrid = generateNumberGrid()
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Game Board</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Numbers Called: {calledNumbers.length}/75</p>
          {lastCalledNumber && (
            <p className="text-lg font-semibold text-primary-600">
              Last Called: {lastCalledNumber}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
          <div key={letter} className="text-center">
            <div className="bg-primary-600 text-white font-bold py-2 rounded-t-lg">
              {letter}
            </div>
            <div className="space-y-1 bg-gray-50 p-2 rounded-b-lg min-h-[300px]">
              {numberGrid[index].map((item) => (
                <div
                  key={item.number}
                  className={`
                    w-full h-8 flex items-center justify-center text-xs font-medium rounded transition-all
                    ${item.called 
                      ? 'bg-success-500 text-white' 
                      : 'bg-white border border-gray-200 text-gray-700'
                    }
                    ${item.isLast ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
                  `}
                >
                  {item.number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {calledNumbers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Recently Called Numbers</h3>
          <div className="flex flex-wrap gap-2">
            {calledNumbers.slice(-10).reverse().map((number, index) => (
              <span
                key={number}
                className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold
                  ${index === 0 
                    ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-300' 
                    : 'bg-success-500 text-white'
                  }
                `}
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}