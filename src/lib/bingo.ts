// Generate a random bingo card
export function generateBingoCard(): number[][] {
  const card: number[][] = []
  
  // Define ranges for each column
  const ranges = [
    [1, 15],   // B column
    [16, 30],  // I column
    [31, 45],  // N column
    [46, 60],  // G column
    [61, 75]   // O column
  ]
  
  for (let col = 0; col < 5; col++) {
    const column: number[] = []
    const [min, max] = ranges[col]
    const availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i)
    
    for (let row = 0; row < 5; row++) {
      if (row === 2 && col === 2) {
        // Center square is FREE
        column.push(0)
      } else {
        // Pick a random number from available numbers
        const randomIndex = Math.floor(Math.random() * availableNumbers.length)
        const number = availableNumbers.splice(randomIndex, 1)[0]
        column.push(number)
      }
    }
    
    card.push(column)
  }
  
  // Transpose the card so we have rows instead of columns
  const transposedCard: number[][] = []
  for (let row = 0; row < 5; row++) {
    const cardRow: number[] = []
    for (let col = 0; col < 5; col++) {
      cardRow.push(card[col][row])
    }
    transposedCard.push(cardRow)
  }
  
  return transposedCard
}

// Call the next random number
export function callNextNumber(calledNumbers: number[]): number | null {
  const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
  const remainingNumbers = allNumbers.filter(num => !calledNumbers.includes(num))
  
  if (remainingNumbers.length === 0) {
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * remainingNumbers.length)
  return remainingNumbers[randomIndex]
}

// Check if a player has won (any row, column, or diagonal)
export function checkWinCondition(card: number[][], markedNumbers: number[]): boolean {
  // Helper function to check if all numbers in an array are marked (or free space)
  const areAllMarked = (numbers: number[]) => {
    return numbers.every(num => num === 0 || markedNumbers.includes(num))
  }
  
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (areAllMarked(card[row])) {
      return true
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    const column = card.map(row => row[col])
    if (areAllMarked(column)) {
      return true
    }
  }
  
  // Check diagonals
  const diagonal1 = [card[0][0], card[1][1], card[2][2], card[3][3], card[4][4]]
  const diagonal2 = [card[0][4], card[1][3], card[2][2], card[3][1], card[4][0]]
  
  if (areAllMarked(diagonal1) || areAllMarked(diagonal2)) {
    return true
  }
  
  return false
}

// Get the letter for a bingo number
export function getLetterForNumber(number: number): string {
  if (number >= 1 && number <= 15) return 'B'
  if (number >= 16 && number <= 30) return 'I'
  if (number >= 31 && number <= 45) return 'N'
  if (number >= 46 && number <= 60) return 'G'
  if (number >= 61 && number <= 75) return 'O'
  return ''
}