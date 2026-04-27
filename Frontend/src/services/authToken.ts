let accesToken: string | null = null;

export const authToken = {
    get: () => accesToken,
    set: (token: string) => (accesToken = token),
    clear: () => (accesToken = null),
};
