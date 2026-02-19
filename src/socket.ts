import { Server as SocketIOServer } from 'socket.io';
import { type Server } from 'http';
import { getSession } from '@/services/auth.service';
import { registerChatHandlers } from '@/controllers/chat/chat.socket';
import { registerWebRtcHandlers } from '@/controllers/webrtc/webrtc.socket';
import { registerPresenceHandlers } from '@/controllers/presence/presence.socket';
import { setUserStatus } from '@/services/presence.service';
import { UserStatus } from '@/models/user-settings';

let io: SocketIOServer;

export function initSocket(server: Server): void {
  io = new SocketIOServer(server, {
    cors: {
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Middleware авторизации
  io.use(async (socket, next) => {
    const req = socket.request;
    if (!req.headers.authorization) {
      return next(new Error('Unauthorized'));
    }

    const token = req.headers.authorization;

    const session = await getSession(token);
    if (!session) {
      return next(new Error('Unauthorized'));
    }

    socket.data.userId = session.user_id;
    next();
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    console.log(`Socket connected: ${socket.id} (User: ${userId})`);

    await setUserStatus(userId, UserStatus.ONLINE);
    io.emit('presence:changed', { userId, status: UserStatus.ONLINE });

    // Подключение хендлеров чата
    registerChatHandlers(socket);

    // Подключение WebRTC хендлеров
    registerWebRtcHandlers(socket);

    // Подключение хендлеров присутствия
    registerPresenceHandlers(io, socket);

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
