import mongoose from 'mongoose';

import config from '@/config';

mongoose.Promise = global.Promise;

const { host, port, username, password, database, options } =
  config.database.mongodb;

export async function connect(): Promise<void> {
  const uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;

  try {
    await mongoose.connect(uri, options);
    const db = mongoose.connection;

    // Events
    db.on('disconnected', (_) => {
      console.log(`MongoDB disconnected: ${uri}`);
      connect();
    });

    db.on('reconnected', (_) => {
      console.log(`MongoDB reconnected: ${uri}`);
    });

    console.log(`MongoDB connected on ${uri}`);
  } catch (err) {
    console.log(`MongoDB connection error: ${uri} \n details: ${err}`);
    process.exit(-1);
  }
}
