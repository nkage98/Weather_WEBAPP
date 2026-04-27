import type { User } from "./user.types.ts";

//PROFILE
export type UserDTO = {
    name: string;
    email: string;
    favoriteCities: string[];
};

export type RegisterDTO = {
    name: string;
    email: string;
    password: string;
};

export type LoginDTO = {
    email: string;
    password: string;
};

export type LoginResDTO = {
    user: User;
    accessToken: string;
    refreshToken: string;
};

export type UserUpdateDTO = {
    userId: string;
    name: string;
};
