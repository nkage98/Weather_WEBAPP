import { UserService } from "../services/user.service.ts";
import type { Request, Response } from "express";
import { isUserRegister, isUserUpdate } from "../validators/user.validators.ts";
import { AppError } from "../errors/app.error.ts";

export class UserController {
    constructor(private user: UserService) {}

    register = async (req: Request, res: Response): Promise<void> => {
        const registerRequest = req.body;
        if (!isUserRegister(registerRequest)) {
            throw new AppError("Invalid Input", 400);
        }

        await this.user.register(registerRequest);

        res.status(201).send();
    };

    profile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.userId;

        const data = await this.user.profile(userId);

        res.status(200).json({ data });
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const updateRequest = { userId: req.userId, name: req.body.name };

        if (!isUserUpdate(updateRequest)) {
            throw new AppError("Invalid Request", 400);
        }

        const data = await this.user.updateName(updateRequest);

        res.status(200).json({ data });
    };

    addCity = async (req: Request, res: Response): Promise<void> => {
        const { city } = req.body;

        console.log("cidade para adicionar: ", city);

        if (!city || city.trim() === "") {
            throw new AppError("City is required", 400);
        }

        const data = await this.user.addCity(req.userId, city);

        res.status(201).json({ data });
    };

    removeCity = async (req: Request, res: Response): Promise<void> => {
        const { city } = req.body;

        console.log("cidade para deletar: ", city);

        if (!city || city.trim() === "") {
            throw new AppError("City is required", 400);
        }
        const data = await this.user.removeCity(req.userId, city);

        res.status(200).json({ data });
    };
}
