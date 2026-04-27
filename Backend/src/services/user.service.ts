import {
    isValidEmailDomain,
    passwordMeetsPolicy,
} from "../validators/user.validators.ts";
import bcrypt from "bcrypt";
import type { UserRepository } from "../repositories/user.repository.ts";
import { AppError } from "../errors/app.error.ts";
import type { User } from "../types/user.types.ts";
import type {
    UserDTO,
    RegisterDTO,
    UserUpdateDTO,
} from "../types/user.dto.types.ts";

export class UserService {
    constructor(private userRepo: UserRepository) {}

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    }

    private mapUserToDTO(user: User): UserDTO {
        return {
            name: user.name,
            email: user.email,
            favoriteCities: user.favoriteCities,
        };
    }

    async register(user: RegisterDTO): Promise<UserDTO> {
        if (!user.name.trim() || !user.email.trim()) {
            throw new AppError("Name or Email cannot be empty", 400);
        }
        if (!isValidEmailDomain(user.email)) {
            throw new AppError("Invalid Email", 400);
        }

        if (!passwordMeetsPolicy(user.password)) {
            throw new AppError("Invalid Password", 400);
        }

        const hashedPassword = await this.hashPassword(user.password);

        const newUser = await this.userRepo.save({
            name: user.name,
            email: user.email,
            password: hashedPassword,
        });

        return this.mapUserToDTO(newUser);
    }

    async profile(userId: string): Promise<UserDTO> {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new AppError("User Not Found", 400);
        }

        return this.mapUserToDTO(user);
    }

    async updateName(userUpdate: UserUpdateDTO): Promise<UserDTO> {
        if (!userUpdate.name.trim()) {
            throw new AppError("Name cannot be empty", 400);
        }

        const updatedUser = await this.userRepo.updateName(
            userUpdate.userId,
            userUpdate.name,
        );

        if (!updatedUser) {
            throw new AppError("User Not Found", 400);
        }

        return this.mapUserToDTO(updatedUser);
    }

    async addCity(userId: string, city: string): Promise<UserDTO> {
        if (typeof city !== "string") {
            throw new AppError("Invalid Input", 400);
        }

        if (!city.trim()) {
            throw new AppError("City cannot be empty", 400);
        }

        const user = await this.userRepo.addCity(userId, city);

        if (!user) {
            throw new AppError("User Not Found", 404);
        }

        return this.mapUserToDTO(user);
    }

    async removeCity(userId: string, city: string): Promise<UserDTO> {
        if (typeof city !== "string") {
            throw new AppError("Invalid Input", 400);
        }

        if (!city.trim()) {
            throw new AppError("City cannot be empty", 400);
        }

        const user = await this.userRepo.removeCity(userId, city);

        if (!user) {
            throw new AppError("User Not Found", 404);
        }

        return this.mapUserToDTO(user);
    }
}

//done
