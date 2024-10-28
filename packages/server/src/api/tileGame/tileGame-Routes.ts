// server/tileGame/tileGame-Routes.ts

import express, { Router } from "express";
import {
  generateTiles,
  verifyMatch,
  getFinalScore,
} from "./tileGame-Controller.js";

const router: Router = express.Router();

// Route to generate tiles and return sessionId and tiles
router.get("/generate-tiles", (req, res) => {
  const tileCount = parseInt(req.query.tileCount as string, 10) || 8;
  const { sessionId, tiles } = generateTiles(tileCount); // Generate session-specific tiles and start the timer

  // Send sessionId and tiles (IDs and URLs) to the client for rendering
  res.json({ sessionId, tiles: tiles.map(({ id, url }) => ({ id, url })) });
});

// Route to verify if two tiles match, using sessionId to find the correct tile set
router.post("/verify-match", (req, res) => {
  const { sessionId, id1, id2 } = req.body;

  // Verify match using sessionId to access the correct tile set
  const isMatch = verifyMatch(sessionId, id1, id2);
  res.json({ isMatch });
});

// Route to fetch final score, score, and time when the game ends
router.get("/final-score", (req, res) => {
  const sessionId = req.query.sessionId as string;
  const level = parseInt(req.query.level as string, 10);

  // Call getFinalScore to calculate and return score, time, and finalScore
  const finalScoreData = getFinalScore(sessionId, level);

  if (!finalScoreData) {
    return res.status(400).json({ error: "Unable to calculate final score" });
  }

  res.json(finalScoreData); // Returns { score, time, finalScore }
});

export default router;
