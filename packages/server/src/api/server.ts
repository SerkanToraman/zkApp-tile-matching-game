import express, { Express } from "express";
import cors from "cors";
import timerRoutes from "./timer/timer-Routes.js";
import tileGameRoutes from "./tileGame/tileGame-Routes.js";

export const app: Express = express();

// Configure CORS with specific settings for local development
app.use(cors({ origin: "*" }));

app.use(express.json());

// Apply routes
app.use("/api/timer", timerRoutes);
app.use("/api/tile-game", tileGameRoutes);
