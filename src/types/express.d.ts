import type { ISession } from '@/models/session';

declare global {
    namespace Express {
        interface Request {
            _query?: unknown;
            session?: ISession;
        }
    }
}