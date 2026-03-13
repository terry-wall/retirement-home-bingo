import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
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
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { status } = await request.json()
    
    const game = await prisma.game.update({
      where: { id: params.gameId },
      data: { status },
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
    console.error('Error updating game:', error)
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    await prisma.game.delete({
      where: { id: params.gameId },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}