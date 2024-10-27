// server/tileGame/tileGame-Routes.ts

import express, { Router } from "express";
import { generateTiles, verifyMatch } from "./tileGame-Controller.js";

const router: Router = express.Router();

// Route to generate tiles and return sessionId and tiles
router.get("/generate-tiles", (req, res) => {
  const tileCount = parseInt(req.query.tileCount as string, 10) || 8;
  const { sessionId, tiles } = generateTiles(tileCount); // Generate session-specific tiles

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

export default router;
