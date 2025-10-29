import { Schema, model, type Document } from 'mongoose';
import { randomUUID } from 'crypto';
import crypto from 'crypto';

export interface AuthSessionClientInfo {
  os: string | null;
  platform: string | null;
  location: string | null;
}

export interface ISession extends Document {
  id_hash: string;
  user_id: string;
  refresh_token: string;
  client_info: AuthSessionClientInfo;
  approx_last_used_time: Date;
  created_at: Date;
  expires_at: Date;
  ip_address: string;
  user_agent: string;
}

const sessionSchema = new Schema<ISession>(
  {
    id_hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    refresh_token: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    client_info: {
      os: {
        type: String,
        default: null,
      },
      platform: {
        type: String,
        default: null,
      },
      location: {
        type: String,
        default: null,
      },
    },
    approx_last_used_time: {
      type: Date,
      default: Date.now,
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      required: true,
      index: true,
    }
  },
  {
    _id: false,
    timestamps: false,
    collection: 'sessions',
  },
);

// Добавление индексов
sessionSchema.index({ user_id: 1, approx_last_used_time: -1 });
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL индекс

// Метод для генерации хеша ID сессии
sessionSchema.statics.generateIdHash = function (sessionId: string): string {
  return crypto
    .createHash('sha256')
    .update(sessionId)
    .digest('hex')
    .substring(0, 32);
};

// Метод для обновления времени последнего использования
sessionSchema.methods.updateLastUsed = async function () {
  this.approx_last_used_time = new Date();
  await this.save();
};

export default model<ISession>('session', sessionSchema);
