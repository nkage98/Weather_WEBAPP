import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { UserRepository } from "../repositories/user.repository.ts";
import type { TokenRepository } from "../repositories/token.repository.ts";
import { env } from "../config/env.ts";
import { AuthError } from "../errors/auth.error.ts";
import { AppError } from "../errors/app.error.ts";
import type { TokensDTO } from "../types/token.dto.types.ts";
import type { LoginDTO, LoginResDTO } from "../types/user.dto.types.ts";

type RefreshToken = {
    token: string;
    tokenHash: string;
};

export class AuthService {
    private userRepo: UserRepository;
    private tokenRepo: TokenRepository;

    constructor(userRepo: UserRepository, tokenRepo: TokenRepository) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
    }

    private hash(data: string): string {
        const hashedData = crypto
            .createHash("sha256")
            .update(data)
            .digest("hex");

        return hashedData;
    }

    private generateRefreshToken(): RefreshToken {
        const token = crypto.randomBytes(64).toString("hex");

        const tokenHash = this.hash(token);

        return { token, tokenHash };
    }

    private generateAccessToken(userId: string): string {
        const accessToken = jwt.sign({ userId: userId }, env.jwtSecret, {
            expiresIn: "5m",
        });
        return accessToken;
    }

    private shouldRotateRefreshToken(expireAt: Date): boolean {
        const now = new Date();
        const diff = expireAt.getTime() - now.getTime();

        return diff < Number(env.shouldRotateBeforeMs); // 3 days
    }

    async login(userLogin: LoginDTO): Promise<LoginResDTO> {
        if (!userLogin.email?.trim() || !userLogin.password?.trim()) {
            throw new AuthError("Invalid Credentials");
        }

        const user = await this.userRepo.findByEmail(userLogin.email);

        if (!user) {
            throw new AuthError("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(
            userLogin.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new AuthError("Invalid Credentials");
        }

        const { token, tokenHash } = this.generateRefreshToken();

        await this.tokenRepo.save({
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + env.refreshTokenExpiresIn),
        });

        const accessToken = this.generateAccessToken(user.id);

        return {
            user: {
                name: user.name,
                email: user.email,
                favoriteCities: user.favoriteCities,
            },
            accessToken,
            refreshToken: token,
        };
    }

    async refresh(refreshToken: string): Promise<TokensDTO> {
        if (!refreshToken || !refreshToken.trim()) {
            throw new AuthError("Invalid Credentials");
        }

        const tokenHash = this.hash(refreshToken);
        const tokenStored = await this.tokenRepo.findByHash(tokenHash);

        if (!tokenStored) {
            throw new AuthError("Invalid Credentials");
        }

        if (Date.now() > tokenStored.expiresAt.getTime()) {
            throw new AuthError("Invalid Credentials");
        }

        let finalRefreshToken = refreshToken;

        if (this.shouldRotateRefreshToken(tokenStored.expiresAt)) {
            await this.tokenRepo.delete(tokenStored.tokenHash);

            const generated = this.generateRefreshToken();
            finalRefreshToken = generated.token;

            await this.tokenRepo.save({
                userId: tokenStored.userId,
                tokenHash: generated.tokenHash,
                expiresAt: new Date(Date.now() + env.refreshTokenExpiresIn),
            });
        }

        const accessToken = this.generateAccessToken(tokenStored.userId);

        return {
            accessToken,
            refreshToken: finalRefreshToken,
        };
    }

    async logout(refreshToken: string): Promise<void> {
        if (!refreshToken?.trim()) return;

        const tokenHash = this.hash(refreshToken);
        await this.tokenRepo.delete(tokenHash);
    }

    async delete(userId: string): Promise<void> {
        const deleted = this.userRepo.delete(userId);

        if (!deleted) {
            throw new AppError("User not found", 404);
        }
    }
}

//done
