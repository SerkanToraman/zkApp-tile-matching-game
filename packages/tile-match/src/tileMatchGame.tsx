"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { generateTiles } from "./helpers/generateTiles";
import GameCompleted from "./components/GameCompleted";
import LevelSelection from "./components/LevelSelection";
import { calculateTilePosition } from "./helpers/calculateTilePosition";
import { Tile } from "./components/Tile";
import { calculateScore } from "./helpers/calculateScore"; // Import calculateScore
import ScoreDisplay from "./components/ScoreDisplay"; // Import ScoreDisplay
import Timer from "./components/Timer"; // Import Timer

export default function TileMatchGame() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null); // Track selected level
  const flippedTilesRef = useRef<{ id: string; url: string }[]>([]); // Use ref to track tiles
  const [flippedBackIds, setFlippedBackIds] = useState<string[]>([]); // Track tiles to flip back
  const [matchedTiles, setMatchedTiles] = useState<string[]>([]); // Track matched tiles
  const [isChecking, setIsChecking] = useState(false); // Prevent flipping while checking
  const [disappearingTiles, setDisappearingTiles] = useState<string[]>([]); // Track tiles to be removed
  const [score, setScore] = useState(0); // Track the player's score
  const [resetTimer, setResetTimer] = useState(false); // Track whether the timer should reset
  const [formattedTime, setFormattedTime] = useState<string>(""); // Track the formatted time

  // Generate the appropriate number of tiles based on the selected level
  const generateTilesForLevel = (level: number) => {
    if (level === 1) return generateTiles(8); // Level 1: 8 unique tiles (16 total)
    if (level === 2) return generateTiles(16); // Level 2: 16 unique tiles (32 total)
    if (level === 3) return generateTiles(24); // Level 3: 24 unique tiles (48 total)
    return [];
  };

  const tiles = useRef(generateTilesForLevel(selectedLevel || 1)); // Default to level 1 if no level is selected

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

          // Update the score based on the level and current matches
          if (selectedLevel) {
            const newScore = calculateScore(selectedLevel, 1); // 1 match
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

  // Reset the timer when a new level is selected
  useEffect(() => {
    if (selectedLevel !== null) {
      setResetTimer(true);
      setTimeout(() => setResetTimer(false), 100); // Reset the timer
    }
  }, [selectedLevel]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!selectedLevel ? (
        // Show the level selection page if no level is selected
        <LevelSelection
          onSelectLevel={(level) => {
            setSelectedLevel(level);
            tiles.current = generateTilesForLevel(level); // Generate tiles based on level
          }}
        />
      ) : isGameCompleted ? (
        <GameCompleted score={score} time={formattedTime} /> // Pass score and time to GameCompleted
      ) : (
        <>
          {/* Display the score */}
          <ScoreDisplay score={score} />

          {/* Display the timer */}
          <Timer
            isGameCompleted={isGameCompleted}
            reset={resetTimer}
            onTimeUpdate={setFormattedTime} // Callback to set formatted time when updated
          />

          <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
            <ambientLight intensity={2} />
            <directionalLight position={[1, 1, 1]} intensity={0.5} />

            {tiles.current.map((tile, index) => {
              const totalTiles = tiles.current.length;

              // Calculate the position using the external helper function
              const { x, y } = calculateTilePosition(index, totalTiles);

              // Do not render disappearing tiles
              return disappearingTiles.includes(tile.id) ? null : (
                <Tile
                  key={tile.id}
                  id={tile.id}
                  url={tile.url}
                  position={[x, y, 0]} // Use the dynamically calculated centered position
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
