export interface Token {
    id?: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}
