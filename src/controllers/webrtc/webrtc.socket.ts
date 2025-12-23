import { Socket } from 'socket.io';
import { Router } from 'mediasoup/node/lib/types';
import config from '@/config';
import { createRoomRouter } from '@/lib/mediasoup';
import * as state from './webrtc.state';

const createWebRtcTransport = async (router: Router) => {
  const { maxIncomingBitrate, initialAvailableOutgoingBitrate, listenIps } =
    config.mediasoup.transport;

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
  let currentRoomId: string | null = null;
  let currentUserId: string | null = null;

  /**
   * 1. JOIN: Вход в голосовой канал
   * Клиент отправляет channelId, сервер создает/ищет Router и возвращает RTP Capabilities
   */
  socket.on(
    'webrtc:join',
    async (
      data: { serverId: string; channelId: string; userId: string },
      callback,
    ) => {
      try {
        const { serverId, channelId, userId } = data;
        // Генерируем уникальный ID комнаты
        const roomId = `${serverId}:${channelId}`;
        currentRoomId = roomId;
        currentUserId = userId;

        // 1. Ищем или создаем комнату
        let room = state.getRoom(roomId);
        if (!room) {
          // createRoomRouter теперь возвращает и router, и observer
          const router = await createRoomRouter();
          room = state.addRoom(roomId, router);
        }

        // 2. LOGIC: Вытеснение старой сессии (другая вкладка/устройство)
        const existingPeer = state.getPeerByUserId(roomId, userId);
        if (existingPeer) {
          // Оповещаем старый сокет, что он отключен
          socket
            .to(existingPeer.socketId)
            .emit('webrtc:kicked', { reason: 'Logged in from another device' });

          // Удаляем старого пира из стейта и Mediasoup
          state.removePeer(roomId, existingPeer.socketId);

          // Оповещаем комнату, что старый ID отключился (чтобы убрали видео/аудио)
          socket
            .to(`webrtc:${roomId}`)
            .emit('webrtc:peer_left', { userId: userId });
        }

        // 3. Создаем нового Peer
        const newPeer = state.createPeer(roomId, socket.id, userId);

        // Джойнимся в комнату socket.io
        socket.join(`webrtc:${roomId}`);

        // 4. Собираем данные для ответа (User ID + Producers)
        // Клиент должен получить список ВСЕХ текущих участников и их стримов
        const peersList: any[] = [];

        room.peers.forEach((peer) => {
          if (peer.socketId !== socket.id) {
            // Не добавляем себя
            const peerProducers: any[] = [];
            peer.producers.forEach((producer) => {
              peerProducers.push({
                id: producer.id,
                kind: producer.kind,
              });
            });

            peersList.push({
              userId: peer.userId,
              producers: peerProducers,
            });
          }
        });

        // 5. Оповещаем остальных, что зашел новый юзер (без стримов пока)
        socket.to(`webrtc:${roomId}`).emit('webrtc:peer_joined', { userId });

        callback({
          rtpCapabilities: room.router.rtpCapabilities,
          peers: peersList,
        });
      } catch (error) {
        console.error('join error', error);
        callback({ error: 'Failed to join' });
      }
    },
  );

  /**
   * 2. CREATE TRANSPORT: Создание WebRTC транспорта (sending или receiving)
   */
  socket.on('webrtc:create_transport', async (data, callback) => {
    try {
      if (!currentRoomId) throw new Error('Not joined a channel');
      const room = state.getRoom(currentRoomId);
      const peer = state.getPeer(currentRoomId, socket.id);

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
  socket.on(
    'webrtc:connect_transport',
    async (data: { transportId: string; dtlsParameters: any }, callback) => {
      try {
        if (!currentRoomId) return;
        const peer = state.getPeer(currentRoomId, socket.id);
        const transport = peer?.transports.get(data.transportId);

        if (!transport)
          throw new Error(`Transport with id "${data.transportId}" not found`);

        await transport.connect({ dtlsParameters: data.dtlsParameters });
        callback();
      } catch (error) {
        console.error('connect_transport error', error);
        callback({ error: 'Connect transport failed' });
      }
    },
  );

  /**
   * 4. PRODUCE: Публикация медиа (аудио/видео)
   */
  socket.on('webrtc:produce', async (data, callback) => {
    try {
      if (!currentRoomId) throw new Error('Not joined');
      const room = state.getRoom(currentRoomId);
      const peer = room?.peers.get(socket.id);
      const transport = peer?.transports.get(data.transportId);

      if (!transport) throw new Error('Transport not found');

      const producer = await transport.produce({
        kind: data.kind,
        rtpParameters: data.rtpParameters,
        appData: { ...data.appData, userId: currentUserId }, // Пишем userId в метаданные
      });

      peer?.producers.set(producer.id, producer);

      // Оповещаем других с userId
      socket.to(`webrtc:${currentRoomId}`).emit('webrtc:new_producer', {
        producerId: producer.id,
        userId: currentUserId,
        kind: producer.kind,
      });

      producer.on('transportclose', () => {
        producer.close();
        peer?.producers.delete(producer.id);
      });

      callback({ id: producer.id });
    } catch (error) {
      console.error(error);
      callback({ error: 'Produce failed' });
    }
  });

  socket.on('webrtc:speaking', (data) => {
    const { channelId, userId, speaking } = data;
    // Отправляем всем в канале, кроме отправителя
    socket.to(`webrtc:${currentRoomId}`).emit('webrtc:peer_speaking', {
      userId,
      speaking,
    });
  });

  /**
   * 5. CONSUME: Подписка на чужой стрим
   */
  socket.on(
    'webrtc:consume',
    async (
      data: { transportId: string; producerId: string; rtpCapabilities: any },
      callback,
    ) => {
      try {
        if (!currentRoomId) return;
        const room = state.getRoom(currentRoomId);
        const peer = state.getPeer(currentRoomId, socket.id);
        const transport = peer?.transports.get(data.transportId);

        if (!room || !transport) throw new Error('Room or Transport not found');

        if (
          !room.router.canConsume({
            producerId: data.producerId,
            rtpCapabilities: data.rtpCapabilities,
          })
        ) {
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
    },
  );

  /**
   * 6. RESUME: Запуск потока после consume
   */
  socket.on('webrtc:resume', async (data: { consumerId: string }) => {
    try {
      if (!currentRoomId) return;
      const peer = state.getPeer(currentRoomId, socket.id);
      const consumer = peer?.consumers.get(data.consumerId);

      if (consumer) {
        await consumer.resume();
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    if (currentRoomId && currentUserId) {
      state.removePeer(currentRoomId, socket.id);
      // Оповещаем, что ушел именно этот userId
      socket
        .to(`webrtc:${currentRoomId}`)
        .emit('webrtc:peer_left', { userId: currentUserId });
    }
  });
};
