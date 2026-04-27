import UserModel from "../models/user.model.ts";
import type { UserRepository } from "./user.repository.ts";
import type { User } from "../types/user.types.ts";
import { Types } from "mongoose";

type MongoUser = {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    favoriteCities: string[];
};

const PUBLIC_USER_SELECT = "-password";

export class MongoUserRepository implements UserRepository {
    private toPublicUser(user: MongoUser): User {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            favoriteCities: user.favoriteCities,
        };
    }

    private toUser(user: MongoUser): User {
        // with password
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            favoriteCities: user.favoriteCities,
        };
    }

    async save(user: User): Promise<User | null> {
        const userData = await UserModel.create(user);

        return this.toPublicUser(userData);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({
            email: email,
        }).lean<MongoUser>();

        if (!user) return null;

        return this.toUser(user);
    }

    async findById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId)
            .select(PUBLIC_USER_SELECT)
            .lean<MongoUser>();

        if (!user) return null;

        return this.toPublicUser(user);
    }

    async updateName(userId: string, name: string): Promise<User | null> {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { name },
            {
                new: true,
                runValidators: true,
            },
        )
            .select(PUBLIC_USER_SELECT)
            .lean<MongoUser>();

        if (!user) return null;

        return this.toPublicUser(user);
    }

    async addCity(userId: string, city: string): Promise<User | null> {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    favoriteCities: city,
                },
            },
            { runValidators: true, new: true },
        )
            .select(PUBLIC_USER_SELECT)
            .lean<MongoUser>();

        if (!user) return null;

        return this.toPublicUser(user);
    }

    async removeCity(userId: string, city: string): Promise<User | null> {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { favoriteCities: city } },
            { new: true },
        )
            .select(PUBLIC_USER_SELECT)
            .lean<MongoUser>();

        if (!user) return null;

        return this.toPublicUser(user);
    }

    async delete(userId: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(userId);
        return !!deleted;
    }
}

//done
