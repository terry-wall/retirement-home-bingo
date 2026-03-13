import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { NextApiRequest } from 'next'

export type NextApiResponseServerIO = {
  socket: {
    server: HttpServer & {
      io: SocketServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export function initializeSocket(server: HttpServer) {
  if (!server.io) {
    console.log('Initializing Socket.IO server')
    
    const io = new SocketServer(server, {
      path: '/api/socket',
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })
    
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)
      
      socket.on('join-game', ({ gameId, playerName }) => {
        console.log(`Player ${playerName} joining game ${gameId}`)
        socket.join(gameId)
        
        // Notify other players in the game
        socket.to(gameId).emit('player-joined', { playerName })
      })
      
      socket.on('leave-game', ({ gameId, playerName }) => {
        console.log(`Player ${playerName} leaving game ${gameId}`)
        socket.leave(gameId)
        
        // Notify other players in the game
        socket.to(gameId).emit('player-left', { playerName })
      })
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
    
    server.io = io
  }
  
  return server.io
}

export function getIO(server: HttpServer): SocketServer {
  if (!server.io) {
    throw new Error('Socket.IO not initialized')
  }
  return server.io
}