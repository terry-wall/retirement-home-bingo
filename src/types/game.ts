export interface Player {
  id: string
  name: string
  card: number[][]
  markedNumbers: number[]
  isWinner: boolean
}

export interface Game {
  id: string
  hostName: string
  status: 'waiting' | 'playing' | 'finished'
  players: Player[]
  playerCount: number
  calledNumbers: number[]
  lastCalledNumber: number | null
  createdAt: Date
}

export interface GameState {
  currentGame: Game | null
  currentPlayer: Player | null
  loading: boolean
  error: string | null
}

export type GameStatus = 'waiting' | 'playing' | 'finished'