import axios from "axios";

// Define types
interface Tile {
  id: string;
  url: string;
}

interface FinalScoreParams {
  sessionId: string;
  level: number;
}

interface VerifyMatchVariables {
  sessionId: string;
  id1: string;
  id2: string;
}

interface VerifyMatchResponse {
  isMatch: boolean;
}

// Fetch tiles from the server
export const fetchTiles = async (
  tileCount: number
): Promise<{ sessionId: string; tiles: Tile[] }> => {
  const response = await axios.get(
    `http://localhost:8585/api/tile-game/generate-tiles`,
    {
      params: { tileCount },
    }
  );
  return response.data;
};

// Verify if two tiles match
export const verifyMatch = async ({
  sessionId,
  id1,
  id2,
}: VerifyMatchVariables): Promise<VerifyMatchResponse> => {
  const response = await axios.post(
    `http://localhost:8585/api/tile-game/verify-match`,
    {
      sessionId,
      id1,
      id2,
    }
  );
  return response.data;
};

// Fetch the final score
export const fetchFinalScore = async ({
  sessionId,
  level,
}: FinalScoreParams): Promise<{
  score: number;
  time: string;
  finalScore: number;
}> => {
  const response = await axios.get(
    `http://localhost:8585/api/tile-game/final-score`,
    {
      params: { sessionId, level },
    }
  );
  return response.data;
};
