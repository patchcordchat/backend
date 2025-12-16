import { Server as SocketIOServer } from 'socket.io';
import { type Server } from 'http';
import { registerWebRtcHandlers } from '@/controllers/webrtc/webrtc.socket';

let io: SocketIOServer;

export function initSocket(server: Server): void {
  io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Логика Чатов/Каналов
    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      console.log(`User joined channel ${channelId}`);
    });

    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    // Подключение WebRTC хендлеров
    registerWebRtcHandlers(socket);
    
    // Общие события
    socket.on('disconnect', () => {
      console.log('client disconnected');
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  console.log('Socket.IO server initialized');
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}
