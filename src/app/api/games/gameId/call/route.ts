import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { callNextNumber } from '@/lib/bingo'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
    })
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    
    if (game.status !== 'playing') {
      return NextResponse.json(
        { error: 'Game is not in playing state' },
        { status: 400 }
      )
    }
    
    const nextNumber = callNextNumber(game.calledNumbers)
    
    if (!nextNumber) {
      return NextResponse.json(
        { error: 'All numbers have been called' },
        { status: 400 }
      )
    }
    
    const updatedGame = await prisma.game.update({
      where: { id: params.gameId },
      data: {
        calledNumbers: [...game.calledNumbers, nextNumber],
        lastCalledNumber: nextNumber,
      },
      include: {
        players: true,
      },
    })
    
    return NextResponse.json({
      number: nextNumber,
      game: {
        id: updatedGame.id,
        hostName: updatedGame.hostName,
        status: updatedGame.status,
        playerCount: updatedGame.players.length,
        calledNumbers: updatedGame.calledNumbers,
        lastCalledNumber: updatedGame.lastCalledNumber,
        createdAt: updatedGame.createdAt,
        players: updatedGame.players.map(player => ({
          id: player.id,
          name: player.name,
          card: player.card,
          markedNumbers: player.markedNumbers,
          isWinner: player.isWinner,
        })),
      },
    })
  } catch (error) {
    console.error('Error calling number:', error)
    return NextResponse.json(
      { error: 'Failed to call number' },
      { status: 500 }
    )
  }
}