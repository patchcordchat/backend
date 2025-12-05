import { IUser } from '@/models/user';

declare global {
    namespace Express {
        interface Request {
            _query?: unknown;
            user?: IUser;
            sessionId?: string;
        }
    }
}