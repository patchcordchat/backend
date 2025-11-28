import { Types, Document } from 'mongoose';

export interface ISession extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  ip: string;
  userAgent: string;
  expiresAt: Date;
  lastActive: Date;
}