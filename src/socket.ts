import { Server as SocketIOServer } from 'socket.io';
import { type Server } from 'http';

export function initialize(server: Server): void {
  const io = new SocketIOServer(server);

  io.on('connection', (client) => {});

  console.log('Socket.IO server initialized');
}
