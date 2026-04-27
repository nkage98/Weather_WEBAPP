const API = import.meta.env.VITE_API_URL;

export async function refresh(): Promise<string> {
    const response = await fetch(API + `auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();

    return data.accessToken;
}
