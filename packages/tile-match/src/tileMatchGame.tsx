"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { generateTiles } from "./helpers/generateTiles";
import GameCompleted from "./components/GameCompleted";
import LevelSelection from "./components/LevelSelection";
import { calculateTilePosition } from "./helpers/calculateTilePosition";
import { Tile } from "./components/Tile";
import { calculateScore } from "./helpers/calculateScore";
import ScoreDisplay from "./components/ScoreDisplay";
import Timer from "./components/Timer";
import { useStartTimer, useStopTimer } from "./hooks/useTimer";
import { v4 as uuidv4 } from "uuid"; // Generate a unique sessionId

export default function TileMatchGame() {
  const [sessionId, setSessionId] = useState<string>(""); // Track sessionId for each game
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const flippedTilesRef = useRef<{ id: string; url: string }[]>([]);
  const [flippedBackIds, setFlippedBackIds] = useState<string[]>([]);
  const [matchedTiles, setMatchedTiles] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [disappearingTiles, setDisappearingTiles] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [formattedTime, setFormattedTime] = useState<string>("");

  // Initialize hooks with start and stop mutations
  const startTimerMutation = useStartTimer();
  const stopTimerMutation = useStopTimer();

  const generateTilesForLevel = (level: number) => {
    if (level === 1) return generateTiles(8);
    if (level === 2) return generateTiles(16);
    if (level === 3) return generateTiles(24);
    return [];
  };

  const tiles = useRef(generateTilesForLevel(selectedLevel || 1));

  const handleTileFlip = (id: string, url: string) => {
    if (isChecking || flippedTilesRef.current.length >= 2) return;
    if (flippedTilesRef.current.some((tile) => tile.id === id)) return;
    flippedTilesRef.current.push({ id, url });

    if (flippedTilesRef.current.length === 2) {
      setIsChecking(true);

      if (flippedTilesRef.current[0]?.url === flippedTilesRef.current[1]?.url) {
        const matchedTileIds = [
          flippedTilesRef.current[0]?.id,
          flippedTilesRef.current[1]?.id,
        ].filter((id): id is string => id !== undefined);

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
        const unmatchedTileIds = [
          flippedTilesRef.current[0]?.id,
          flippedTilesRef.current[1]?.id,
        ].filter((id): id is string => id !== undefined);

        setTimeout(() => {
          setFlippedBackIds(unmatchedTileIds);
          flippedTilesRef.current = [];

          setTimeout(() => {
            setFlippedBackIds([]);
            setIsChecking(false);
          }, 100);
        }, 1000);
      }
    }
  };

  const handleTileDisappear = (id: string) => {
    setDisappearingTiles((prev) => [...prev, id]);
  };

  const canFlipMore = flippedTilesRef.current.length < 2 && !isChecking;
  const isGameCompleted = disappearingTiles.length === tiles.current.length;

  // Start timer and reset state when a level is selected
  useEffect(() => {
    if (selectedLevel !== null) {
      const newSessionId = uuidv4(); // Generate a new sessionId
      setSessionId(newSessionId); // Store sessionId for this game session
      startTimerMutation.mutate(newSessionId); // Call start-timer API with sessionId
      setResetTimer(true);
      setTimeout(() => setResetTimer(false), 100);
    }
  }, [selectedLevel]);

  // Stop timer when the game completes
  useEffect(() => {
    if (isGameCompleted) {
      stopTimerMutation.mutate(sessionId, {
        onSuccess: (data) => {
          // Assuming data.duration is the total time from the API response
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
            tiles.current = generateTilesForLevel(level);
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
            {tiles.current.map((tile, index) => {
              const totalTiles = tiles.current.length;
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
