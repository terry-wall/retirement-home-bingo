import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { generateBingoCard } from '@/lib/bingo'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerName } = await request.json()
    
    if (!playerName) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      )
    }
    
    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: {
        players: true,
      },
    })
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    
    if (game.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Game has already started' },
        { status: 400 }
      )
    }
    
    if (game.players.length >= 20) {
      return NextResponse.json(
        { error: 'Game is full' },
        { status: 400 }
      )
    }
    
    // Check if player already exists
    const existingPlayer = game.players.find(p => p.name === playerName)
    if (existingPlayer) {
      return NextResponse.json({
        game: {
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
        },
        player: {
          id: existingPlayer.id,
          name: existingPlayer.name,
          card: existingPlayer.card,
          markedNumbers: existingPlayer.markedNumbers,
          isWinner: existingPlayer.isWinner,
        },
      })
    }
    
    const playerId = uuidv4()
    const playerCard = generateBingoCard()
    
    const newPlayer = await prisma.player.create({
      data: {
        id: playerId,
        name: playerName,
        gameId: params.gameId,
        card: playerCard,
        markedNumbers: [],
        isWinner: false,
      },
    })
    
    const updatedGame = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: {
        players: true,
      },
    })
    
    return NextResponse.json({
      game: {
        id: updatedGame!.id,
        hostName: updatedGame!.hostName,
        status: updatedGame!.status,
        playerCount: updatedGame!.players.length,
        calledNumbers: updatedGame!.calledNumbers,
        lastCalledNumber: updatedGame!.lastCalledNumber,
        createdAt: updatedGame!.createdAt,
        players: updatedGame!.players.map(player => ({
          id: player.id,
          name: player.name,
          card: player.card,
          markedNumbers: player.markedNumbers,
          isWinner: player.isWinner,
        })),
      },
      player: {
        id: newPlayer.id,
        name: newPlayer.name,
        card: newPlayer.card,
        markedNumbers: newPlayer.markedNumbers,
        isWinner: newPlayer.isWinner,
      },
    })
  } catch (error) {
    console.error('Error joining game:', error)
    return NextResponse.json(
      { error: 'Failed to join game' },
      { status: 500 }
    )
  }
}