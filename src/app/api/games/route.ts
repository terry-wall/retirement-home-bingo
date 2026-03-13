import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { generateBingoCard } from '@/lib/bingo'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        players: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    const formattedGames = games.map(game => ({
      id: game.id,
      hostName: game.hostName,
      status: game.status,
      playerCount: game.players.length,
      calledNumbers: game.calledNumbers,
      lastCalledNumber: game.lastCalledNumber,
      createdAt: game.createdAt,
      players: game.players.map(player => ({
        id: player.id,
        name: player.name,
        card: player.card,
        markedNumbers: player.markedNumbers,
        isWinner: player.isWinner,
      })),
    }))
    
    return NextResponse.json(formattedGames)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hostName } = await request.json()
    
    if (!hostName) {
      return NextResponse.json(
        { error: 'Host name is required' },
        { status: 400 }
      )
    }
    
    const gameId = uuidv4()
    const hostCard = generateBingoCard()
    
    const game = await prisma.game.create({
      data: {
        id: gameId,
        hostName,
        status: 'waiting',
        calledNumbers: [],
        lastCalledNumber: null,
        players: {
          create: {
            id: uuidv4(),
            name: hostName,
            card: hostCard,
            markedNumbers: [],
            isWinner: false,
          }
        }
      },
      include: {
        players: true,
      },
    })
    
    return NextResponse.json({
      id: game.id,
      hostName: game.hostName,
      status: game.status,
      playerCount: game.players.length,
      calledNumbers: game.calledNumbers,
      lastCalledNumber: game.lastCalledNumber,
      createdAt: game.createdAt,
      players: game.players.map(player => ({
        id: player.id,
        name: player.name,
        card: player.card,
        markedNumbers: player.markedNumbers,
        isWinner: player.isWinner,
      })),
    })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}