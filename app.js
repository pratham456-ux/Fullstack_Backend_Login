import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/user.routes.js";

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);


export default app;
