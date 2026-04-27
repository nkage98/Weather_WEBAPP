import type {
    LoginDTO,
    RegisterDTO,
    UserUpdateDTO,
} from "../types/user.dto.types.ts";

export function isUserRegister(user: unknown): user is RegisterDTO {
    if (typeof user !== "object" || user === null) {
        return false;
    }

    const obj = user as Record<string, unknown>;

    return (
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        typeof obj.password === "string"
    );
}

export function isUserLogin(user: unknown): user is LoginDTO {
    if (typeof user !== "object" || user === null) {
        return false;
    }

    const obj = user as Record<string, unknown>;

    return typeof obj.email === "string" && typeof obj.password === "string";
}

export function isUserUpdate(data: unknown): data is UserUpdateDTO {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;

    return typeof obj.userId === "string" && typeof obj.name === "string";
}

export function isValidEmailDomain(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function passwordMeetsPolicy(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
}
