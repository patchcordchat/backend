import { Socket } from 'socket.io';
import {
  Router,
  Transport,
  Producer,
  Consumer,
} from 'mediasoup/node/lib/types';
import config from '@/config';
import { getRouter } from '@/lib/mediasoup';

// Вспомогательная функция для создания WebRTC транспорта
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
  let producerTransport: Transport | null = null;
  let consumerTransport: Transport | null = null;
  let producer: Producer | null = null;
  let consumer: Consumer | null = null;

  const router = getRouter();

  socket.on('getRouterRtpCapabilities', (data, callback) => {
    callback(router.rtpCapabilities);
  });

  socket.on('createProducerTransport', async (data, callback) => {
    try {
      const { transport, params } = await createWebRtcTransport(router);
      producerTransport = transport;
      callback(params);
    } catch (err) {
      console.error(err);
      callback({ error: err });
    }
  });

  socket.on('createConsumerTransport', async (data, callback) => {
    try {
      const { transport, params } = await createWebRtcTransport(router);
      consumerTransport = transport;
      callback(params);
    } catch (err) {
      console.error(err);
      callback({ error: err });
    }
  });

  socket.on('connectProducerTransport', async (data, callback) => {
    if (producerTransport) {
      await producerTransport.connect({ dtlsParameters: data.dtlsParameters });
    }
    callback();
  });

  socket.on('connectConsumerTransport', async (data, callback) => {
    if (consumerTransport) {
      await consumerTransport.connect({ dtlsParameters: data.dtlsParameters });
    }
    callback();
  });

  socket.on('produce', async (data, callback) => {
    try {
      const { kind, rtpParameters } = data;

      if (!producerTransport) throw new Error('Producer transport not found');

      producer = await producerTransport.produce({ kind, rtpParameters });

      producer.on('transportclose', () => {
        console.log('producer transport closed');
        producer?.close();
      });

      callback({ id: producer.id });

      socket.broadcast.emit('newProducer', { producerId: producer.id });
    } catch (error) {
      console.error(error);
      callback({ error: 'Produce failed' });
    }
  });

  socket.on('consume', async (data, callback) => {
    try {
      const { rtpCapabilities, producerId } = data;

      if (!router.canConsume({ producerId, rtpCapabilities })) {
        console.error('cannot consume');
        return;
      }

      if (!consumerTransport) throw new Error('Consumer transport not found');

      consumer = await consumerTransport.consume({
        producerId,
        rtpCapabilities,
        paused: true,
      });

      consumer.on('transportclose', () => {
        consumer?.close();
      });

      if (consumer.type === 'simulcast') {
        await consumer.setPreferredLayers({
          spatialLayer: 2,
          temporalLayer: 2,
        });
      }

      callback({
        producerId,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      });
    } catch (error) {
      console.error('consume failed', error);
      callback({ error: 'Consume failed' });
    }
  });

  // 7. Resume (снятие с паузы)
  socket.on('resume', async (data, callback) => {
    if (consumer) {
      await consumer.resume();
    }
    callback();
  });

  // Очистка ресурсов при отключении
  socket.on('disconnect', () => {
    producerTransport?.close();
    consumerTransport?.close();
    producer?.close();
    consumer?.close();
  });
};
