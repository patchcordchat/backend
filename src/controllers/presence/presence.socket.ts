import { Socket, Server } from 'socket.io';
import { setUserStatus } from '@/services/presence.service';
import { UserStatus } from '@/models/user-settings';

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
  const userId = socket.data.userId;

  if (!userId) return;

  // 1. При подключении: Ставим ONLINE и оповещаем всех
  setUserStatus(userId, UserStatus.ONLINE).then(() => {
    io.emit('presence:update', { userId, status: UserStatus.ONLINE });
  });

  // 2. Ручное изменение статуса (например, "Не беспокоить")
  socket.on('presence:set_status', async (status: UserStatus) => {
    await setUserStatus(userId, status);
    io.emit('presence:update', { userId, status });
  });

  // 3. При отключении
  socket.on('disconnect', async () => {
    const sockets = await io.in(`user:${userId}`).fetchSockets();
    
    if (sockets.length === 0) {
      await setUserStatus(userId, UserStatus.OFFLINE);
      io.emit('presence:update', { userId, status: UserStatus.OFFLINE });
    }
  });
};