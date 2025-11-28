import { Schema } from 'mongoose';

export interface CreateServerRequest {
	name: string;
	description?: string | null;
	region?: string | null;
	icon?: string | null;
	afk_channel_id?: Schema.Types.UUID | null;
	afk_timeout?: number | null;
}
