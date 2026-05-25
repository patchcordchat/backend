import { Router, Transport, Producer, Consumer } from 'mediasoup/node/lib/types';

export interface Peer {
  socketId: string;
  userId: string; // Добавили userId
  transports: Map<string, Transport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
}

export interface Room {
  id: string;
  router: Router;
  peers: Map<string, Peer>; // Ключ — socketId (для быстрого доступа при разрыве)
}

const rooms = new Map<string, Room>();

export const getRoom = (roomId: string) => rooms.get(roomId);

export const addRoom = (roomId: string, router: Router) => {
  const room: Room = {
    id: roomId,
    router,
    peers: new Map(),
  };
  rooms.set(roomId, room);
  return room;
};

export const removeRoom = (channelId: string) => {
  const room = rooms.get(channelId);
  if (room) {
    room.router.close();
    rooms.delete(channelId);
  }
};

export const getPeerByUserId = (roomId: string, userId: string): Peer | undefined => {
  const room = rooms.get(roomId);
  if (!room) return undefined;
  for (const peer of room.peers.values()) {
    if (peer.userId === userId) return peer;
  }
  return undefined;
};

export const getPeer = (channelId: string, socketId: string) => {
  return rooms.get(channelId)?.peers.get(socketId);
};

export const createPeer = (roomId: string, socketId: string, userId: string) => {
  const room = rooms.get(roomId);
  if (!room) return null;

  const peer: Peer = {
    socketId,
    userId,
    transports: new Map(),
    producers: new Map(),
    consumers: new Map(),
  };

  room.peers.set(socketId, peer);
  return peer;
};

export const removePeer = (roomId: string, socketId: string) => {
  const room = rooms.get(roomId);
  if (room) {
    const peer = room.peers.get(socketId);
    // Важно: закрыть все транспорты mediasoup, чтобы освободить память
    peer?.transports.forEach((t) => t.close());
    room.peers.delete(socketId);

    // Если комната пуста — можно удалить и комнату (опционально)
    if (room.peers.size === 0) {
      room.router.close();
      rooms.delete(roomId);
    }
  }
};
