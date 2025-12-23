import { Socket } from 'socket.io';

export const registerChatHandlers = (socket: Socket) => {
  
  socket.on('channel:join', (channelId: string) => {
    socket.join(`channel:${channelId}`);
  });

  // Выход из канала
  socket.on('channel:leave', (channelId: string) => {
    socket.leave(`channel:${channelId}`);
  });

  socket.on('channel:typing', (data: { channelId: string; isTyping: boolean }) => {
    const { channelId, isTyping } = data;
    const userId = socket.data.userId;

    if (!userId) return;

    socket.to(`channel:${channelId}`).emit('channel:typing_update', {
      channelId,
      userId,
      isTyping
    });
  });
};