// helpers/scoreCalculator.ts

// Calculates score based on level and matched tiles count
export function calculateScore(
  level: number,
  matchedTileCount: number
): number {
  let scorePerMatch = 10; // Base score per match

  if (level === 2) scorePerMatch = 15;
  else if (level === 3) scorePerMatch = 30;

  return matchedTileCount * scorePerMatch;
}

// Calculates the final score based on time and base score
export function calculateFinalScore(
  score: number,
  durationInSeconds: number
): number {
  const finalScore = score - durationInSeconds;
  return Math.max(finalScore, 0); // Prevent negative scores
}
