"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import GameCompleted from "./components/GameCompleted";
import LevelSelection from "./components/LevelSelection";
import { calculateTilePosition } from "./helpers/calculateTilePosition";
import { Tile } from "./components/Tile";
import { calculateScore } from "./helpers/calculateScore";
import ScoreDisplay from "./components/ScoreDisplay";
import Timer from "./components/Timer";
import { useStartTimer, useStopTimer } from "./hooks/useTimer";

export default function TileMatchGame() {
  const [sessionId, setSessionId] = useState<string>(""); // Track sessionId for each game
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [tiles, setTiles] = useState<{ id: string; url: string }[]>([]); // State for tiles fetched from the server
  const flippedTilesRef = useRef<{ id: string; url: string }[]>([]);
  const [flippedBackIds, setFlippedBackIds] = useState<string[]>([]);
  const [matchedTiles, setMatchedTiles] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [disappearingTiles, setDisappearingTiles] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [formattedTime, setFormattedTime] = useState<string>("");

  const startTimerMutation = useStartTimer();
  const stopTimerMutation = useStopTimer();

  // Fetch tiles from the server based on the selected level
  useEffect(() => {
    if (selectedLevel !== null) {
      const fetchTiles = async () => {
        try {
          const tileCount = selectedLevel * 8;
          const response = await axios.get(
            `http://localhost:8585/api/tile-game/generate-tiles`,
            {
              params: { tileCount },
            }
          );

          console.log("Fetched tiles and sessionId:", response.data);
          setSessionId(response.data.sessionId); // Set sessionId from server response
          setTiles(response.data.tiles); // Set tiles in state

          startTimerMutation.mutate(response.data.sessionId); // Start timer with sessionId
          setResetTimer(true);
          setTimeout(() => setResetTimer(false), 100);
        } catch (error) {
          console.error("Error fetching tiles:", error);
        }
      };
      fetchTiles();
    }
  }, [selectedLevel]);

  const handleTileFlip = async (id: string, url: string) => {
    if (isChecking || flippedTilesRef.current.length >= 2) return;
    if (flippedTilesRef.current.some((tile) => tile.id === id)) return;
    flippedTilesRef.current.push({ id, url });

    if (flippedTilesRef.current.length === 2) {
      setIsChecking(true);

      const [tile1, tile2] = flippedTilesRef.current;
      console.log("Checking match between:", tile1, tile2);

      if (tile1 && tile2) {
        try {
          const isMatchResponse = await axios.post(
            `http://localhost:8585/api/tile-game/verify-match`,
            {
              sessionId, // Send sessionId for server-based tile match lookup
              id1: tile1.id,
              id2: tile2.id,
            }
          );
          const isMatch = isMatchResponse.data.isMatch;
          console.log("Match result:", isMatch);

          if (isMatch) {
            const matchedTileIds = [tile1.id, tile2.id];
            setTimeout(() => {
              setMatchedTiles((matched) => [...matched, ...matchedTileIds]);
              flippedTilesRef.current = [];
              setIsChecking(false);

              if (selectedLevel) {
                const newScore = calculateScore(selectedLevel, 1);
                setScore((prevScore) => prevScore + newScore);
              }
            }, 1000);
          } else {
            const unmatchedTileIds = [tile1.id, tile2.id];
            setTimeout(() => {
              setFlippedBackIds(unmatchedTileIds);
              flippedTilesRef.current = [];

              setTimeout(() => {
                setFlippedBackIds([]);
                setIsChecking(false);
              }, 100);
            }, 1000);
          }
        } catch (error) {
          console.error("Error verifying match:", error);
        }
      } else {
        console.error("Tiles not found for verification.");
      }
    }
  };

  const handleTileDisappear = (id: string) => {
    setDisappearingTiles((prev) => [...prev, id]);
  };

  const canFlipMore = flippedTilesRef.current.length < 2 && !isChecking;
  const isGameCompleted = disappearingTiles.length === tiles.length;

  useEffect(() => {
    if (isGameCompleted) {
      stopTimerMutation.mutate(sessionId, {
        onSuccess: (data) => {
          setFormattedTime(data.duration.toString());
        },
      });
    }
  }, [isGameCompleted]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!selectedLevel ? (
        <LevelSelection
          onSelectLevel={(level) => {
            setSelectedLevel(level);
          }}
        />
      ) : isGameCompleted ? (
        <GameCompleted score={score} time={formattedTime} />
      ) : (
        <>
          <ScoreDisplay score={score} />
          <Timer
            isGameCompleted={isGameCompleted}
            reset={resetTimer}
            onTimeUpdate={setFormattedTime}
          />
          <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
            <ambientLight intensity={2} />
            <directionalLight position={[1, 1, 1]} intensity={0.5} />
            {tiles.map((tile, index) => {
              const totalTiles = tiles.length;
              const { x, y } = calculateTilePosition(index, totalTiles);

              return disappearingTiles.includes(tile.id) ? null : (
                <Tile
                  key={tile.id}
                  id={tile.id}
                  url={tile.url}
                  position={[x, y, 0]}
                  offset={-2}
                  canFlip={canFlipMore}
                  isFlippedExternally={!flippedBackIds.includes(tile.id)}
                  onTileFlip={handleTileFlip}
                  isMatched={matchedTiles.includes(tile.id)}
                  onTileDisappear={handleTileDisappear}
                />
              );
            })}
          </Canvas>
        </>
      )}
    </div>
  );
}
