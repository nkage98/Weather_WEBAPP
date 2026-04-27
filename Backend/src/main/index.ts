import "dotenv/config";
import app from "./app.ts";
import { connectMongo } from "../config/mongo.ts";
import { env } from "../config/env.ts";
// import { connectRedis } from "./cache.ts";

async function startServer() {
    await connectMongo();
    // await connectRedis();

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
}

startServer();
