import { authToken } from "./authToken";
import { refresh } from "./auth.service";

const API = import.meta.env.VITE_API_URL;

async function request(url: string, options: RequestInit = {}, retry = true) {
    const token = authToken.get();

    const response = await fetch(API + url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(options.headers || {}),
        },
    });

    if (response.status === 401 && retry) {
        try {
            const newToken = await refresh();
            authToken.set(newToken);

            return request(url, options, (retry = false));
        } catch {
            authToken.clear();
            throw new Error("Unauthorized");
        }
    }

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

export const apiClient = {
    get: (url: string) => request(url),

    post: (url: string, body?: any) =>
        request(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: (url: string, body?: any) =>
        request(url, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: (url: string) =>
        request(url, {
            method: "DELETE",
        }),
};
