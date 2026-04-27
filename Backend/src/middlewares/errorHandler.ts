import type { Response, NextFunction, Request } from "express";
import { AppError } from "../errors/app.error.ts";
import { MongoServerError } from "mongodb";
import { stat } from "fs";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof AppError) {
        if (err.statusCode >= 500) {
            console.error(err);
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.log("erro:", err.message, " statusCode:", err.statusCode);
        return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof MongoServerError && err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0] ?? "Object";
        const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
        return res.status(409).json({
            message: `${capitalized} already exists`,
        });
    }

    console.error(err);

    return res.status(500).json({ message: "Internal Server Error" });
}
