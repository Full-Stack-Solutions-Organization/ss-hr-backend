import { Request } from "express";

export interface DecodedUser {
    userId: string;
    role: string;
    exp: number;
    iat: number;
    email?: string;
}

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            user: DecodedUser;
        }
    }
}