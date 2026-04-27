import express from "express";
import routes from "../routes/routes.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "../middlewares/errorHandler.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use("/api", routes);

app.use(errorHandler);

export default app;
