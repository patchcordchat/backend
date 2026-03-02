import { Socket } from 'socket.io';
import { Router } from 'mediasoup/node/lib/types';
import config from '@/config';
import { createRoomRouter } from '@/lib/mediasoup';
import * as state from './call.state';

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

export const registerCallHandlers = (socket: Socket) => {
  // Локальная переменная, чтобы знать, в каком канале сейчас сокет
  let currentVoiceChannelId: string | null = null;
  let currentUserId: string | null = null;

  /**
   * 1. JOIN: Вход в голосовой канал
   * Клиент отправляет channelId, сервер создает/ищет Router и возвращает RTP Capabilities
   */
  socket.on('call:join', async (data: { channel_id: string; user_id: string }, callback) => {
    try {
      const { channel_id, user_id } = data;
      currentVoiceChannelId = channel_id;
      currentUserId = user_id;

      // 1. Ищем или создаем комнату
      let room = state.getRoom(channel_id);
      if (!room) {
        // createRoomRouter теперь возвращает и router, и observer
        const router = await createRoomRouter();
        room = state.addRoom(channel_id, router);
      }

      // 2. LOGIC: Вытеснение старой сессии (другая вкладка/устройство)
      const existingPeer = state.getPeerByUserId(channel_id, user_id);
      if (existingPeer) {
        // Оповещаем старый сокет, что он отключен
        socket
          .to(existingPeer.socketId)
          .emit('call:kicked', { reason: 'Logged in from another device' });

        // Удаляем старого пира из стейта и Mediasoup
        state.removePeer(channel_id, existingPeer.socketId);

        // Оповещаем комнату, что старый ID отключился (чтобы убрали видео/аудио)
        socket.to(`channel:${channel_id}`).emit('call:user_left', { userId: user_id });
      }

      // 3. Создаем нового Peer
      state.createPeer(channel_id, socket.id, user_id);

      // Джойнимся в комнату socket.io
      socket.join(`channel:${channel_id}`);

      // 4. Собираем данные для ответа (User ID + Producers)
      // Клиент должен получить список ВСЕХ текущих участников и их стримов
      const peersList: { userId: string; producers: any }[] = [];

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
      socket.to(`channel:${channel_id}`).emit('call:user_joined', { user_id });

      callback({
        rtpCapabilities: room.router.rtpCapabilities,
        peers: peersList,
      });
    } catch (error) {
      console.error('join error', error);
      callback({ error: 'Failed to join' });
    }
  });

  /**
   * 2. CREATE TRANSPORT: Создание WebRTC транспорта (sending или receiving)
   */
  socket.on('call:media:create_transport', async (data, callback) => {
    try {
      if (!currentVoiceChannelId) throw new Error('Not joined a channel');
      const room = state.getRoom(currentVoiceChannelId);
      const peer = state.getPeer(currentVoiceChannelId, socket.id);

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
    'call:media:connect_transport',
    async (data: { transport_id: string; dtls_parameters: any }, callback) => {
      try {
        if (!currentVoiceChannelId) return;
        const peer = state.getPeer(currentVoiceChannelId, socket.id);
        const transport = peer?.transports.get(data.transport_id);

        if (!transport) throw new Error(`Transport with id "${data.transport_id}" not found`);

        await transport.connect({ dtlsParameters: data.dtls_parameters });
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
  socket.on('call:media:produce', async (data, callback) => {
    try {
      if (!currentVoiceChannelId) throw new Error('Not joined');
      const room = state.getRoom(currentVoiceChannelId);
      const peer = room?.peers.get(socket.id);
      const transport = peer?.transports.get(data.transport_id);

      if (!transport) throw new Error('Transport not found');

      const producer = await transport.produce({
        kind: data.kind,
        rtpParameters: data.rtp_parameters,
        appData: { ...data.app_data, userId: currentUserId }, // Пишем userId в метаданные
      });

      peer?.producers.set(producer.id, producer);

      // Оповещаем других с userId
      socket.to(`channel:${currentVoiceChannelId}`).emit('call:media:producer_added', {
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

  socket.on('call:speaking', (data) => {
    const { user_id, speaking } = data;
    // Отправляем всем в канале, кроме отправителя
    socket.to(`channel:${currentVoiceChannelId}`).emit('call:user_speaking', {
      user_id,
      speaking,
    });
  });

  /**
   * 5. CONSUME: Подписка на чужой стрим
   */
  socket.on(
    'call:media:consume',
    async (
      data: { transport_id: string; producer_id: string; rtp_capabilities: any },
      callback,
    ) => {
      try {
        if (!currentVoiceChannelId) return;
        const room = state.getRoom(currentVoiceChannelId);
        const peer = state.getPeer(currentVoiceChannelId, socket.id);
        const transport = peer?.transports.get(data.transport_id);

        if (!room || !transport) throw new Error('Room or Transport not found');

        if (
          !room.router.canConsume({
            producerId: data.producer_id,
            rtpCapabilities: data.rtp_capabilities,
          })
        ) {
          console.error('Cannot consume');
          return callback({ error: 'Cannot consume' });
        }

        const consumer = await transport.consume({
          producerId: data.producer_id,
          rtpCapabilities: data.rtp_capabilities,
          paused: true, // Начинаем с паузы (рекомендация mediasoup)
        });

        peer?.consumers.set(consumer.id, consumer);

        consumer.on('transportclose', () => {
          consumer.close();
          peer?.consumers.delete(consumer.id);
        });

        // Обработка закрытия продюсера (если тот, кого мы слушаем, отключился)
        consumer.on('producerclose', () => {
          socket.emit('call:media:consumer_closed', { consumer_id: consumer.id });
          consumer.close();
          peer?.consumers.delete(consumer.id);
        });

        callback({
          id: consumer.id,
          producerId: data.producer_id,
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
  socket.on('call:media:resume', async (data: { consumer_id: string }) => {
    try {
      if (!currentVoiceChannelId) return;
      const peer = state.getPeer(currentVoiceChannelId, socket.id);
      const consumer = peer?.consumers.get(data.consumer_id);

      if (consumer) {
        await consumer.resume();
      }
    } catch (error) {
      console.log(error);
    }
  });

  const onDisconnect = () => {
    if (!currentVoiceChannelId || !currentUserId) return;

    state.removePeer(currentVoiceChannelId, socket.id);
    // Оповещаем, что ушел именно этот userId
    socket.to(`channel:${currentVoiceChannelId}`).emit('call:peer_left', { userId: currentUserId });
  };

  socket.on('disconnect', onDisconnect);
  socket.on('call:leave', onDisconnect);
};
