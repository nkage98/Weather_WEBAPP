import { AuthError } from "../errors/auth.error.ts";
import { AuthService } from "../services/auth.service.ts";
import type { Request, Response } from "express";
import { isUserLogin } from "../validators/user.validators.ts";
import { env } from "../config/env.ts";

export class AuthController {
    constructor(private auth: AuthService) {}

    private setRefreshCookie = (res: Response, token: string) => {
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: Number(env.refreshTokenExpiresIn), // 15 days
        });
    };

    private clearRefreshCookie = (res: Response) => {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });
    };

    refresh = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies.token;

        if (!refreshToken) {
            throw new AuthError("No Refresh Token");
        }

        if (typeof refreshToken !== "string") {
            throw new AuthError("Invalid Token");
        }

        try {
            const token = await this.auth.refresh(refreshToken);
            if (token.refreshToken != refreshToken) {
                this.setRefreshCookie(res, token.refreshToken);
            }

            res.status(200).json({ accessToken: token.accessToken });
        } catch (error) {
            this.clearRefreshCookie(res);
            throw new AuthError(error);
        }

        //verifica quando for gerado novo refresh token
    };

    login = async (req: Request, res: Response): Promise<void> => {
        const loginRequest = {
            email: req.body.email,
            password: req.body.password,
        };

        if (!isUserLogin(loginRequest)) {
            throw new AuthError("Login Invalid");
        }

        const data = await this.auth.login(loginRequest);

        this.setRefreshCookie(res, data.refreshToken);

        res.status(200).json({
            data: data.user,
            accessToken: data.accessToken,
        });
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies.token;

        if (!refreshToken) {
            res.status(204).send();
            return;
        }

        if (typeof refreshToken !== "string") {
            throw new AuthError("Invalid Token");
        }

        await this.auth.logout(refreshToken);

        this.clearRefreshCookie(res);

        res.status(204).send();
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const userId = req.userId;

        await this.auth.delete(userId);

        res.status(204).send();
    };
}

//done
