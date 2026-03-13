import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkWinCondition } from '@/lib/bingo'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId, number } = await request.json()
    
    if (!playerId || !number) {
      return NextResponse.json(
        { error: 'Player ID and number are required' },
        { status: 400 }
      )
    }
    
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    })
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }
    
    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
    })
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }
    
    // Check if the number has been called
    if (!game.calledNumbers.includes(number)) {
      return NextResponse.json(
        { error: 'Number has not been called yet' },
        { status: 400 }
      )
    }
    
    // Check if number is on player's card
    const numberOnCard = player.card.some((row: number[]) => row.includes(number))
    if (!numberOnCard) {
      return NextResponse.json(
        { error: 'Number is not on your card' },
        { status: 400 }
      )
    }
    
    // Mark the number
    const markedNumbers = [...player.markedNumbers]
    if (!markedNumbers.includes(number)) {
      markedNumbers.push(number)
    }
    
    // Check for win condition
    const hasWon = checkWinCondition(player.card, markedNumbers)
    
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        markedNumbers,
        isWinner: hasWon,
      },
    })
    
    // If player won, update game status
    if (hasWon) {
      await prisma.game.update({
        where: { id: params.gameId },
        data: {
          status: 'finished',
        },
      })
    }
    
    return NextResponse.json({
      player: {
        id: updatedPlayer.id,
        name: updatedPlayer.name,
        card: updatedPlayer.card,
        markedNumbers: updatedPlayer.markedNumbers,
        isWinner: updatedPlayer.isWinner,
      },
      won: hasWon,
    })
  } catch (error) {
    console.error('Error marking number:', error)
    return NextResponse.json(
      { error: 'Failed to mark number' },
      { status: 500 }
    )
  }
}