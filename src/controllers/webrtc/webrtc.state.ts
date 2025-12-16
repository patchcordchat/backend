import { Router, Transport, Producer, Consumer, WebRtcTransport } from 'mediasoup/node/lib/types';

export interface Peer {
  socketId: string;
  transports: Map<string, Transport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
}

export interface Room {
  id: string;
  router: Router;
  peers: Map<string, Peer>;
}

// Хранилище всех активных комнат (каналов)
// channelId -> Room
const rooms: Map<string, Room> = new Map();

export const getRoom = (channelId: string) => rooms.get(channelId);

export const addRoom = (channelId: string, router: Router): Room => {
  const room: Room = {
    id: channelId,
    router,
    peers: new Map(),
  };
  rooms.set(channelId, room);
  return room;
};

export const removeRoom = (channelId: string) => {
  const room = rooms.get(channelId);
  if (room) {
    room.router.close();
    rooms.delete(channelId);
  }
};

export const getPeer = (channelId: string, socketId: string) => {
  return rooms.get(channelId)?.peers.get(socketId);
};

export const createPeer = (channelId: string, socketId: string): Peer => {
  const room = rooms.get(channelId);
  if (!room) throw new Error('Room not found');

  const peer: Peer = {
    socketId,
    transports: new Map(),
    producers: new Map(),
    consumers: new Map(),
  };
  
  room.peers.set(socketId, peer);
  return peer;
};

export const removePeer = (channelId: string, socketId: string) => {
  const room = rooms.get(channelId);
  if (!room) return;

  const peer = room.peers.get(socketId);
  if (peer) {
    // Закрываем всё, что связано с пиром
    peer.producers.forEach((p) => p.close());
    peer.consumers.forEach((c) => c.close());
    peer.transports.forEach((t) => t.close());
    room.peers.delete(socketId);
  }

  // Если комната пуста — удаляем её, чтобы не висела в памяти
  if (room.peers.size === 0) {
    removeRoom(channelId);
    console.log(`Room ${channelId} closed (empty)`);
  }
};