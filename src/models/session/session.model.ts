import { Schema, model } from 'mongoose';
import { ISession } from './session.types';

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true,
    },
    lastActive: {
      type: Schema.Types.Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: 'sessions' },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = model<ISession>('Session', sessionSchema);

export default Session;
