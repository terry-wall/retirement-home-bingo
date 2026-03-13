import { PrismaClient } from '@prisma/client'
import { generateBingoCard } from '../src/lib/bingo'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Clean up existing data
  await prisma.player.deleteMany()
  await prisma.game.deleteMany()
  
  // Create sample games
  const sampleGames = [
    {
      id: uuidv4(),
      hostName: 'Alice Johnson',
      status: 'waiting',
      players: [
        { name: 'Alice Johnson', isHost: true },
        { name: 'Bob Smith' },
        { name: 'Carol Williams' },
      ]
    },
    {
      id: uuidv4(),
      hostName: 'David Brown',
      status: 'playing',
      calledNumbers: [7, 23, 45, 61, 12, 34, 56, 72, 8],
      lastCalledNumber: 8,
      players: [
        { name: 'David Brown', isHost: true },
        { name: 'Emma Davis' },
        { name: 'Frank Miller' },
        { name: 'Grace Wilson' },
        { name: 'Henry Moore' },
      ]
    }
  ]
  
  for (const gameData of sampleGames) {
    console.log(`Creating game hosted by ${gameData.hostName}...`)
    
    const game = await prisma.game.create({
      data: {
        id: gameData.id,
        hostName: gameData.hostName,
        status: gameData.status,
        calledNumbers: gameData.calledNumbers || [],
        lastCalledNumber: gameData.lastCalledNumber || null,
      }
    })
    
    // Create players for this game
    for (const playerData of gameData.players) {
      const playerCard = generateBingoCard()
      const markedNumbers = gameData.calledNumbers ? 
        gameData.calledNumbers.filter(() => Math.random() > 0.7) : [] // Randomly mark some numbers
      
      await prisma.player.create({
        data: {
          id: uuidv4(),
          name: playerData.name,
          gameId: game.id,
          card: playerCard,
          markedNumbers,
          isWinner: false,
        }
      })
      
      console.log(`  - Added player: ${playerData.name}`)
    }
  }
  
  // Create a finished game example
  const finishedGameId = uuidv4()
  const finishedGame = await prisma.game.create({
    data: {
      id: finishedGameId,
      hostName: 'Sarah Taylor',
      status: 'finished',
      calledNumbers: [1, 16, 31, 46, 61, 2, 17, 32, 47, 62, 3, 18, 33, 48, 63, 4, 19, 34, 49, 64],
      lastCalledNumber: 64,
    }
  })
  
  // Add players to finished game
  const finishedPlayers = [
    { name: 'Sarah Taylor', isWinner: true },
    { name: 'Tom Anderson' },
    { name: 'Lisa Garcia' },
  ]
  
  for (const playerData of finishedPlayers) {
    const playerCard = generateBingoCard()
    const markedNumbers = playerData.isWinner ? 
      [playerCard[0][0], playerCard[0][1], playerCard[0][2], playerCard[0][3], playerCard[0][4]] : // First row for winner
      [1, 16, 31, 46] // Some random numbers for others
    
    await prisma.player.create({
      data: {
        id: uuidv4(),
        name: playerData.name,
        gameId: finishedGame.id,
        card: playerCard,
        markedNumbers,
        isWinner: playerData.isWinner || false,
      }
    })
  }
  
  console.log('✅ Database seed completed successfully!')
  
  // Print summary
  const totalGames = await prisma.game.count()
  const totalPlayers = await prisma.player.count()
  
  console.log(`📊 Summary:`)
  console.log(`   - Total games: ${totalGames}`)
  console.log(`   - Total players: ${totalPlayers}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })