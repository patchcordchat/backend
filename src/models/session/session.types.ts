import { type Document } from "mongoose";

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