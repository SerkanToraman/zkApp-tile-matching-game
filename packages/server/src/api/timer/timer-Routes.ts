// timer-Routes.ts
import express, { Router } from "express";
import { startTimer, stopTimer } from "./timer-Controller.js";
import { validateSession } from "./timer-Middleware.js";

const router: Router = express.Router();

router.post("/start-timer", validateSession, (req, res) => {
  const { sessionId } = req.body;
  try {
    const result = startTimer(sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/stop-timer", validateSession, (req, res) => {
  const { sessionId } = req.body;
  try {
    const result = stopTimer(sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
