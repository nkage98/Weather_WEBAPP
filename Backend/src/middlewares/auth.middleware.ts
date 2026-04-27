import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";
import { AuthError } from "../errors/auth.error.ts";
import { env } from "../config/env.ts";
import type { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

interface AuthPayload extends JwtPayload {
    userId: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        throw new AuthError("No Token Provided");
    }

    const token = accessToken.startsWith("Bearer ")
        ? accessToken.slice(7)
        : null;

    if (!token) {
        throw new AuthError("Invalid Token Format");
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload;

        if (typeof decoded.userId !== "string") {
            throw new AuthError("Invalid Token Payload");
        }

        if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
            throw new AuthError("Invalid token payload");
        }

        req.userId = decoded.userId;
    } catch (error) {
        throw new AuthError("Invalid Token.");
    }

    next();
};

export default auth;
