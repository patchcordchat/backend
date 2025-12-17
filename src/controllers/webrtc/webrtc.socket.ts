import { Socket } from 'socket.io';
import { Router } from 'mediasoup/node/lib/types';
import config from '@/config';
import { createRoomRouter } from '@/lib/mediasoup';
import * as state from './webrtc.state';

const createWebRtcTransport = async (router: Router) => {
  const { maxIncomingBitrate, initialAvailableOutgoingBitrate, listenIps } =
    config.mediasoup.webRtcTransport;

  const transport = await router.createWebRtcTransport({
    listenIps,
    initialAvailableOutgoingBitrate,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });

  if (maxIncomingBitrate) {
    try {
      await transport.setMaxIncomingBitrate(maxIncomingBitrate);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    },
  };
};

export const registerWebRtcHandlers = (socket: Socket) => {
  // Локальная переменная, чтобы знать, в каком канале сейчас сокет
  let currentChannelId: string | null = null;

  /**
   * 1. JOIN: Вход в голосовой канал
   * Клиент отправляет channelId, сервер создает/ищет Router и возвращает RTP Capabilities
   */
  socket.on('webrtc:join', async (data: { channelId: string }, callback) => {
    try {
      const { channelId } = data;
      currentChannelId = channelId;

      // 1. Ищем комнату или создаем новую
      let room = state.getRoom(channelId);
      if (!room) {
        const router = await createRoomRouter();
        room = state.addRoom(channelId, router);
        console.log(`Router created for channel: ${channelId}`);
      }

      // 2. Создаем Peer (участника)
      state.createPeer(channelId, socket.id);

      const existingProducers: any[] = [];
      room.peers.forEach(peer => {
        if (peer.socketId !== socket.id) {
          peer.producers.forEach(producer => {
            existingProducers.push({
              producerId: producer.id,
              peerId: peer.socketId, // Чтобы знать чей это стрим
              kind: producer.kind
            });
          });
        }
      });

      // 3. Возвращаем клиенту возможности роутера
      callback({ 
        rtpCapabilities: room.router.rtpCapabilities,
        existingProducers
      });
      
      // Джойним сокет в socket.io комнату для сигналлинга (не путать с channel:join для чата)
      socket.join(`webrtc:${channelId}`);
    } catch (error) {
      console.error('webrtc:join error', error);
      callback({ error: 'Failed to join voice channel' });
    }
  });

  /**
   * 2. CREATE TRANSPORT: Создание WebRTC транспорта (sending или receiving)
   */
  socket.on('webrtc:create_transport', async (data, callback) => {
    try {
      if (!currentChannelId) throw new Error('Not joined a channel');
      const room = state.getRoom(currentChannelId);
      const peer = state.getPeer(currentChannelId, socket.id);
      
      if (!room || !peer) throw new Error('Room or Peer not found');

      const { transport, params } = await createWebRtcTransport(room.router);

      // Сохраняем транспорт у пира
      peer.transports.set(transport.id, transport);

      callback(params);
    } catch (err) {
      console.error(err);
      callback({ error: 'Failed to create transport' });
    }
  });

  /**
   * 3. CONNECT TRANSPORT: DTLS рукопожатие
   */
  socket.on('webrtc:connect_transport', async (data: { transportId: string; dtlsParameters: any }, callback) => {
    try {
      if (!currentChannelId) return;
      const peer = state.getPeer(currentChannelId, socket.id);
      const transport = peer?.transports.get(data.transportId);

      if (!transport) throw new Error(`Transport with id "${data.transportId}" not found`);
      
      await transport.connect({ dtlsParameters: data.dtlsParameters });
      callback();
    } catch (error) {
      console.error('connect_transport error', error);
      callback({ error: 'Connect transport failed' });
    }
  });

  /**
   * 4. PRODUCE: Публикация медиа (аудио/видео)
   */
  socket.on('webrtc:produce', async (data: { transportId: string; kind: any; rtpParameters: any; appData: any }, callback) => {
    try {
      if (!currentChannelId) return;
      const peer = state.getPeer(currentChannelId, socket.id);
      const transport = peer?.transports.get(data.transportId);

      if (!transport) throw new Error('Transport not found');

      const producer = await transport.produce({
        kind: data.kind,
        rtpParameters: data.rtpParameters,
        appData: { ...data.appData, peerId: socket.id }, // Храним ID владельца
      });

      peer?.producers.set(producer.id, producer);

      // Оповещаем ВСЕХ остальных в этой комнате о новом продюсере
      socket.to(`webrtc:${currentChannelId}`).emit('webrtc:new_producer', {
        producerId: producer.id,
        peerId: socket.id,
        kind: producer.kind,
      });

      producer.on('transportclose', () => {
        producer.close();
        peer?.producers.delete(producer.id);
      });

      callback({ id: producer.id });
    } catch (error) {
      console.error('produce error', error);
      callback({ error: 'Produce failed' });
    }
  });

  /**
   * 5. CONSUME: Подписка на чужой стрим
   */
  socket.on('webrtc:consume', async (data: { transportId: string; producerId: string; rtpCapabilities: any }, callback) => {
    try {
      if (!currentChannelId) return;
      const room = state.getRoom(currentChannelId);
      const peer = state.getPeer(currentChannelId, socket.id);
      const transport = peer?.transports.get(data.transportId);

      if (!room || !transport) throw new Error('Room or Transport not found');

      if (!room.router.canConsume({
          producerId: data.producerId,
          rtpCapabilities: data.rtpCapabilities
      })) {
        console.error('Cannot consume');
        return callback({ error: 'Cannot consume' });
      }

      const consumer = await transport.consume({
        producerId: data.producerId,
        rtpCapabilities: data.rtpCapabilities,
        paused: true, // Начинаем с паузы (рекомендация mediasoup)
      });

      peer?.consumers.set(consumer.id, consumer);

      consumer.on('transportclose', () => {
        consumer.close();
        peer?.consumers.delete(consumer.id);
      });
      
      // Обработка закрытия продюсера (если тот, кого мы слушаем, отключился)
      consumer.on('producerclose', () => {
        socket.emit('webrtc:consumer_closed', { consumerId: consumer.id });
        consumer.close();
        peer?.consumers.delete(consumer.id);
      });

      callback({
        id: consumer.id,
        producerId: data.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      });
    } catch (error) {
      console.error('consume error', error);
      callback({ error: 'Consume failed' });
    }
  });

  /**
   * 6. RESUME: Запуск потока после consume
   */
  socket.on('webrtc:resume', async (data: { consumerId: string }) => {
    try {
      if (!currentChannelId) return;
      const peer = state.getPeer(currentChannelId, socket.id);
      const consumer = peer?.consumers.get(data.consumerId);
      
      if (consumer) {
        await consumer.resume();
      }
    } catch (error) {
      console.log(error);      
    }
  });

  socket.on('disconnect', () => {
    if (currentChannelId) {
      state.removePeer(currentChannelId, socket.id);
      socket.to(`webrtc:${currentChannelId}`).emit('webrtc:peer_left', { peerId: socket.id });
    }
  });
  
  socket.on('webrtc:leave', (callback) => {
     if (currentChannelId) {
      state.removePeer(currentChannelId, socket.id);
      socket.leave(`webrtc:${currentChannelId}`);
      socket.to(`webrtc:${currentChannelId}`).emit('webrtc:peer_left', { peerId: socket.id });
      currentChannelId = null;
      if (typeof callback === 'function') callback();
    }
  });
};