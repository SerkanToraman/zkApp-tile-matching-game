import { v4 as uuidv4 } from "uuid";
import crypto from "crypto"; // For generating hashes
import { startTimer, stopTimer } from "../timer/timer-Controller.js";
import {
  calculateScore,
  calculateFinalScore,
} from "../../helpers/scoreCalculator.js";

// Interface for tiles, including URL for server-side operations
export interface Tile {
  id: string; // Unique client-facing ID
  hash: string; // Hash to verify matches
  url: string; // URL for loading the model on the client side
}

// Interface for session data stored in tilesMap
interface SessionData {
  tiles: Tile[]; // Array of tiles for the session
  matchedCount: number; // Number of matched tiles in this session
  startTime: Date; // Start time for the session timer
}

// Use Map for storing sessions with sessionId as the key and tiles as the value
const tilesMap = new Map<string, SessionData>();

// Generate tiles with both URL and hash, and start the timer
export function generateTiles(uniqueTileCount: number): {
  sessionId: string;
  tiles: Tile[];
} {
  const sessionId = uuidv4(); // Generate a new sessionId for this set of tiles

  const uniqueTiles: Tile[] = Array.from(
    { length: uniqueTileCount },
    (_, i) => {
      const identifier = `tile${i + 1}`;
      const hash = crypto.createHash("sha256").update(identifier).digest("hex");

      return {
        id: uuidv4(), // Unique client-facing ID to avoid manipulation
        hash,
        url: `/models/tile${i + 1}.glb`, // URL path to the tile model for rendering
      };
    }
  );

  const allTiles = [...uniqueTiles, ...uniqueTiles].map((tile) => ({
    ...tile,
    id: uuidv4(), // Assign a new unique ID for each duplicate to prevent direct client matching
  }));

  // Start the timer and save start time in session data
  const { startTime } = startTimer(sessionId);

  // Store tiles and start time in the session
  tilesMap.set(sessionId, {
    tiles: shuffleTiles(allTiles),
    matchedCount: 0,
    startTime,
  });

  return { sessionId, tiles: tilesMap.get(sessionId)?.tiles || [] };
}

// Verifies if two tile IDs correspond to matching pairs by checking their hashes
export function verifyMatch(
  sessionId: string,
  id1: string,
  id2: string
): boolean {
  const sessionData = tilesMap.get(sessionId);
  if (!sessionData) {
    console.error("No session data found for sessionId:", sessionId);
    return false;
  }

  const { tiles, matchedCount } = sessionData;
  const tile1 = tiles.find((tile) => tile.id === id1);
  const tile2 = tiles.find((tile) => tile.id === id2);

  if (!tile1 || !tile2) {
    console.error("One or both tiles not found for IDs:", id1, id2);
    return false;
  }

  const isMatch = tile1.hash === tile2.hash;

  if (isMatch) {
    sessionData.matchedCount = matchedCount + 1;
    tilesMap.set(sessionId, sessionData);
  }

  return isMatch;
}

// Calculate final score based on time and matched tiles
export function getFinalScore(
  sessionId: string,
  level: number
): { score: number; time: number; finalScore: number } | null {
  const sessionData = tilesMap.get(sessionId);
  if (!sessionData) return null;

  let duration;
  try {
    const timerResult = stopTimer(sessionId);
    // Always round down the duration
    duration = Math.floor(timerResult.duration);
  } catch (error) {
    console.error("Error stopping timer:", error);
    return null;
  }

  const baseScore = calculateScore(level, sessionData.matchedCount);

  if (sessionData.matchedCount !== sessionData.tiles.length / 2) {
    console.error("Not all tiles are matched to calculate the final score.");
    return null;
  }

  const finalScore = calculateFinalScore(baseScore, duration);

  return {
    score: baseScore,
    time: duration,
    finalScore,
  };
}

// Helper function to shuffle tiles array
function shuffleTiles(tiles: Tile[]): Tile[] {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i] as Tile, tiles[j] as Tile] = [tiles[j] as Tile, tiles[i] as Tile];
  }
  return tiles;
}
