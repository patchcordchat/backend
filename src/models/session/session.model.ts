import { Schema, Types, model } from 'mongoose';
import { ISession } from './session.types';

const sessionSchema = new Schema<ISession>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    client_info: {
      os: { type: String, default: 'Unknown' },
      platform: { type: String, default: 'Unknown' },
      ip: { type: String, select: false },
    },
    expires_at: {
      type: Number,
      required: true,
    },
    last_active: {
      type: Number,
      default: Date.now,
    },
    _ttl: {
      type: Date,
      select: false,
      expires: 0,
    },
    created_at: {
      type: Number,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Number,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'sessions',
    versionKey: false,
  },
);

sessionSchema.pre('save', function (next) {
  if (this.isModified('expires_at')) {
    this._ttl = new Date(this.expires_at);
  }
  next();
});

const Session = model<ISession>('Session', sessionSchema);

export default Session;
