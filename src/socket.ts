import { Server as SocketIOServer } from 'socket.io';
import { type Server } from 'http';

let io: SocketIOServer;

export function initSocket(server: Server): void {
  io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('User connected');
    
    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      console.log(`User joined channel ${channelId}`);
    });

    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  console.log('Socket.IO server initialized');
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}
