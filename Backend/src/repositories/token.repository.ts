import type { Token } from "../types/token.types.ts";

export interface TokenRepository {
    findByHash(tokenHash: string): Promise<Token | null>;
    save(token: Token): Promise<void>;
    delete(token: string): Promise<boolean>;
}
