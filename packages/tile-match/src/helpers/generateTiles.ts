// Define the type for a tile
interface Tile {
  id: string;
  url: string;
}

export function generateTiles(uniqueTileCount: number): Tile[] {
  // Create unique tiles based on the input count
  const uniqueTiles: Tile[] = Array.from(
    { length: uniqueTileCount },
    (_, i): Tile => ({
      id: `tile${i + 1}`,
      url: `/models/tile${i + 1}.glb`,
    })
  );

  // Duplicate each tile
  const allTiles: Tile[] = [...uniqueTiles, ...uniqueTiles].map(
    (tile, index): Tile => ({
      ...tile,
      id: `${tile.id}-${index}`, // Ensure each duplicated tile has a unique ID
    })
  );

  // Shuffle the tiles with type-safe swapping
  for (let i = allTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // Perform the swap safely, with type assertion
    [allTiles[i], allTiles[j]] = [allTiles[j] as Tile, allTiles[i] as Tile];
  }

  return allTiles;
}
