import { Schema, model, Types } from 'mongoose';
import { IRelationship, RELATIONSHIP_TYPES } from './relationship.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const relationshipSchema = new Schema<IRelationship>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    target_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: Number,
      required: true,
      enum: Object.values(RELATIONSHIP_TYPES),
      default: RELATIONSHIP_TYPES.NONE,
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: 32,
      default: null,
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
    collection: 'user-relationships',
  },
);

// У одного пользователя (user_id) может быть только одна уникальная связь с другим пользователем (target_id)
relationshipSchema.index({ user_id: 1, target_id: 1 }, { unique: true });

// Для быстрого поиска списка друзей
relationshipSchema.index({ userId: 1, type: 1 });

relationshipSchema.plugin(toJSONPlugin<IRelationship>());

export default model<IRelationship>('Relationship', relationshipSchema);
