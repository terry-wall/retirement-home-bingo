'use client'

interface BingoCardProps {
  card: number[][]
  markedNumbers: number[]
  onMarkNumber: (number: number) => void
  calledNumbers: number[]
}

export default function BingoCard({ card, markedNumbers, onMarkNumber, calledNumbers }: BingoCardProps) {
  const headers = ['B', 'I', 'N', 'G', 'O']
  
  const isNumberCalled = (number: number) => calledNumbers.includes(number)
  const isNumberMarked = (number: number) => markedNumbers.includes(number)
  
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="grid grid-cols-5 bg-primary-600 text-white">
        {headers.map((header, index) => (
          <div key={index} className="p-3 text-center font-bold text-xl">
            {header}
          </div>
        ))}
      </div>
      
      {/* Card */}
      <div className="grid grid-cols-5">
        {card.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isCalled = isNumberCalled(number)
            const isMarked = isNumberMarked(number)
            const isFreeSpace = rowIndex === 2 && colIndex === 2 && number === 0
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => {
                  if (isCalled && !isMarked && !isFreeSpace) {
                    onMarkNumber(number)
                  }
                }}
                disabled={!isCalled || isMarked || isFreeSpace}
                className={`
                  aspect-square p-2 border border-gray-300 text-lg font-semibold transition-all
                  ${isFreeSpace 
                    ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed' 
                    : isMarked 
                    ? 'bg-success-500 text-white' 
                    : isCalled 
                    ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                  hover:scale-105
                `}
              >
                {isFreeSpace ? 'FREE' : number}
              </button>
            )
          })
        )}
      </div>
      
      <div className="p-3 bg-gray-50 text-sm text-center text-gray-600">
        Marked: {markedNumbers.length} / 24
      </div>
    </div>
  )
}