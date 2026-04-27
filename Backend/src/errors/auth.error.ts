import { AppError } from "./app.error.ts";

export class AuthError extends AppError {
    constructor(message = "Não Autorizado") {
        super(message, 401);
    }
}
