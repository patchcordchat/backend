import { Schema, model } from 'mongoose';
import { ISession } from './session.types';

const sessionSchema = new Schema<ISession>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

sessionSchema.index({ _ttl: 1 }, { expireAfterSeconds: 0 });

sessionSchema.pre('save', function (next) {
  if (this.isModified('expires_at')) {
    this._ttl = new Date(this.expires_at);
  }
  next();
});

const Session = model<ISession>('Session', sessionSchema);

export default Session;
