import { Socket } from 'socket.io';

export const registerChatHandlers = (socket: Socket) => {
  socket.on('chat:join', (channelId: string) => {
    socket.join(`channel:${channelId}`);
  });

  // Выход из канала
  socket.on('chat:leave', (channelId: string) => {
    socket.leave(`channel:${channelId}`);
  });

  socket.on('chat:typing', (data: { channelId: string; isTyping: boolean }) => {
    const { channelId, isTyping } = data;
    const userId = socket.data.userId;

    if (!userId) return;

    socket.to(`channel:${channelId}`).emit('chat:user_typing', {
      channelId,
      userId,
      isTyping,
    });
  });
};
