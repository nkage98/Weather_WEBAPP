import type { User } from "../types/user.types.ts";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>; //omit password
    save(user: User): Promise<User>;
    delete(userId: string): Promise<boolean>;
    updateName(userId: string, name: string): Promise<User | null>;
    addCity(userId: string, city: string): Promise<User | null>;
    removeCity(userId: string, city: string): Promise<User | null>;
}
