import { useState, useContext, createContext, useEffect } from "react";
import type { ReactNode } from "react";
import {
    login,
    profile,
    logout,
    addFavorite,
    removeFavorite,
    deleteAccount,
    updateUser,
} from "@/services/user.service";
import { LoginDTO } from "../types/user.dto.types";

type User = {
    name: string;
    email: string;
    favoriteCities: string[];
};

type LoginResult = {
    success: boolean;
    message?: string;
};

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    handleLogin: (data: LoginDTO) => Promise<LoginResult>;
    handleProfile: () => Promise<void>;
    handleLogout: () => Promise<void>;
    handleAddFav: (city: string) => Promise<void>;
    handleRemoveFav: (city: string) => Promise<void>;
    handleUpdate: (name: string) => Promise<void>;
    handleDelete: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function refresh() {
            console.log("Refreshing session...");

            if (user) return;
            try {
                const userData = await profile();
                setUser(userData);
            } catch {
                console.log("No active session found");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        refresh();
    }, []);

    async function handleLogin(user: LoginDTO) {
        setError(null);
        try {
            setLoading(true);

            const data = await login(user);
            setUser(data);

            return { success: true };
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unexpected Error");
            }
            console.error(error);

            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    async function handleProfile() {
        setError(null);
        try {
            setLoading(true);
            const userData = await profile();
            setUser(userData);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unexpected Error");
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setUser(null);
        try {
            await logout();
        } catch {}
    }

    async function handleAddFav(city: string) {
        setError(null);
        try {
            setLoading(true);

            const userData = await addFavorite(city);
            console.log(userData);
            setUser(userData);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unexpected Error");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleRemoveFav(city: string) {
        setError(null);
        try {
            setLoading(true);

            const userData = await removeFavorite(city);

            setUser(userData);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unexpected Error");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(name: string) {
        setError(null);
        try {
            setLoading(true);
            const userData = await updateUser(name);

            setUser(userData);
        } catch (error) {
            setError("Error to update user");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setError(null);
        try {
            setLoading(true);
            await deleteAccount();
            setUser(null);
        } catch (error) {
            setError("Error to delete account");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                handleLogin,
                handleProfile,
                handleLogout,
                handleAddFav,
                handleRemoveFav,
                handleUpdate,
                handleDelete,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
