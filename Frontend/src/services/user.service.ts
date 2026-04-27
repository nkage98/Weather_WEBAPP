import type { LoginDTO, RegisterDTO, User } from "@/types/user.dto.types";
import { authToken } from "./authToken";
import { apiClient } from "./api";

export async function login(user: LoginDTO): Promise<User> {
    const data = await apiClient.post("login", user);

    authToken.set(data.accessToken);

    return data.data;
}

export async function logout(): Promise<void> {
    await apiClient.post("logout");
    authToken.clear();
}

export async function register(user: RegisterDTO): Promise<void> {
    await apiClient.post("register", user);
}

export async function profile(): Promise<User> {
    const data = await apiClient.get("user");
    return data.data;
}

export async function updateUser(name: string): Promise<User> {
    const data = await apiClient.put("user", { name });
    return data.data;
}

export async function addFavorite(city: string): Promise<User> {
    const data = await apiClient.post("favorite/add", { city });
    return data.data;
}

export async function removeFavorite(city: string): Promise<User> {
    const data = await apiClient.post("favorite/remove", { city });
    return data.data;
}

export async function deleteAccount(): Promise<void> {
    await apiClient.delete("user/delete");
    authToken.clear();
}
