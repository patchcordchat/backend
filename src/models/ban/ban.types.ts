import { Schema } from 'mongoose';

export interface IBan {
    _id: Schema.Types.ObjectId
    id: Schema.Types.ObjectId
    server_id: Schema.Types.ObjectId
    user_id: Schema.Types.ObjectId
    reason: string
    banned_at: Date
}