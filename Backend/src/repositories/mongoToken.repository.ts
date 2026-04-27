import RefreshTokenModel from "../models/token.model.ts";
import type { TokenRepository } from "./token.repository.ts";
import type { Token } from "../types/token.types.ts";
import { AppError } from "../errors/app.error.ts";

type MongoToken = {
    _id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
};

export class MongoTokenRepository implements TokenRepository {
    private toToken(token: MongoToken): Token {
        return {
            id: token._id.toString(),
            userId: token.userId,
            tokenHash: token.tokenHash,
            expiresAt: token.expiresAt,
        };
    }

    async findByHash(tokenHash: string): Promise<Token | null> {
        const token = await RefreshTokenModel.findOne({
            tokenHash: tokenHash,
        }).lean<MongoToken>();

        if (!token) {
            return null;
        }
        return this.toToken(token);
    }

    async save(token: Token): Promise<void> {
        const created = await RefreshTokenModel.findOneAndUpdate(
            { userId: token.userId },
            {
                tokenHash: token.tokenHash,
                expiresAt: token.expiresAt,
            },
            { upsert: true, new: true },
        ).lean<MongoToken>();

        if (!created) {
            throw new AppError("Failed to create token", 500);
        }

        return;
    }

    async delete(tokenHash: string): Promise<boolean> {
        const deleted = await RefreshTokenModel.findOneAndDelete({ tokenHash });

        return !!deleted;
    }
}

//done
