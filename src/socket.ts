import { Server as SocketIOServer } from 'socket.io';
import { type Server } from 'http';
import { AuthService } from '@/services/auth.service';
import { parse } from 'cookie';
import { unsign } from 'cookie-signature';
import config from '@/config';

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
    if (!req.headers.cookie) {
      return next(new Error('Unauthorized'));
    }

    const cookies = parse(req.headers.cookie);
    const rawSid = cookies['sid'];
    if (!rawSid) {
      return next(new Error('Unauthorized'));
    }

    let sessionId = rawSid;
    if (rawSid.startsWith('s:')) {
      const unsigned = unsign(rawSid.slice(2), config.app.secretKey);
      if (unsigned === false) {
        return next(new Error('Unauthorized'));
      }
      sessionId = unsigned;
    }

    const session = await AuthService.getSession(sessionId);
    if (!session) {
      return next(new Error('Unauthorized'));
    }

    socket.data.userId = session.user_id;
    next();
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.userId!;

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
