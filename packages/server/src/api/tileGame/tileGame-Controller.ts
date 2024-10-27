import { v4 as uuidv4 } from "uuid";
import crypto from "crypto"; // For generating hashes

// Interface for tiles, including URL for server-side operations
export interface Tile {
  id: string; // Unique client-facing ID
  hash: string; // Hash to verify matches
  url: string; // URL for loading the model on the client side
}

// Use Map for storing sessions with sessionId as the key and tiles as the value
const tilesMap = new Map<string, Tile[]>();

// Generate tiles with both URL and hash
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

  // Store tiles in the session using the Map with sessionId as the key
  tilesMap.set(sessionId, shuffleTiles(allTiles));

  return { sessionId, tiles: tilesMap.get(sessionId) || [] };
}

// Verifies if two tile IDs correspond to matching pairs by checking their hashes
export function verifyMatch(
  sessionId: string,
  id1: string,
  id2: string
): boolean {
  const tiles = tilesMap.get(sessionId);
  if (!tiles) {
    console.error("No tiles found for sessionId:", sessionId);
    return false;
  }

  const tile1 = tiles.find((tile) => tile.id === id1);
  const tile2 = tiles.find((tile) => tile.id === id2);

  if (!tile1 || !tile2) {
    console.error("One or both tiles not found for IDs:", id1, id2);
    return false;
  }

  return tile1.hash === tile2.hash; // Check if hashes match, not URLs
}

// Helper function to shuffle tiles array
function shuffleTiles(tiles: Tile[]): Tile[] {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i] as Tile, tiles[j] as Tile] = [tiles[j] as Tile, tiles[i] as Tile];
  }
  return tiles;
}
