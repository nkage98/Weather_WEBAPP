function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Environment variable ${name} is not defined`);
    }

    return value;
}

export const env = {
    port: requireEnv("PORT"),
    mongoUri: requireEnv("MONGO_URI"),
    jwtSecret: requireEnv("JWT_SECRET"),
    shouldRotateBeforeMs: Number(requireEnv("ROTATE_BEFORE_MS")),
    refreshTokenExpiresIn: Number(requireEnv("REFRESH_TOKEN_LIFETIME")),
};
