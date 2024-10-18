"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TileProps {
  id: string;
  url: string;
  position: [number, number, number];
  offset: number;
  isFlippedExternally: boolean;
  canFlip: boolean;
  onTileFlip: (id: string, url: string) => void;
}

function Tile({
  id,
  url,
  position,
  offset,
  isFlippedExternally,
  canFlip,
  onTileFlip,
}: TileProps) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Flip the tile back when `isFlippedExternally` changes
  useEffect(() => {
    if (!isFlippedExternally) {
      setIsFlipped(false);
    }
  }, [isFlippedExternally]);

  useEffect(() => {
    if (gltf && meshRef.current) {
      const clonedScene = gltf.scene.clone();
      meshRef.current.add(clonedScene);

      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = box.getCenter(new THREE.Vector3());
      clonedScene.position.set(-center.x, -center.y, -center.z);
      clonedScene.rotation.x = -Math.PI / 2;
    }
  }, [gltf]);

  useFrame(() => {
    if (pivotRef.current) {
      const targetRotationY = isFlipped ? Math.PI : 0;
      pivotRef.current.rotation.y = THREE.MathUtils.lerp(
        pivotRef.current.rotation.y,
        targetRotationY,
        0.05
      );
    }
  });

  const handleFlip = () => {
    if (canFlip && !isFlipped) {
      setIsFlipped(true);
      onTileFlip(id, url);
    }
  };

  return (
    <group ref={pivotRef} position={position} onPointerDown={handleFlip}>
      <group ref={meshRef} position={[0, 0, offset]} scale={[15, 15, 15]} />
    </group>
  );
}

export default function TileMatchGame() {
  const flippedTilesRef = useRef<{ id: string; url: string }[]>([]); // Use ref to track tiles
  const [flippedBackIds, setFlippedBackIds] = useState<string[]>([]); // Track tiles to flip back
  const [matchedTiles, setMatchedTiles] = useState<string[]>([]); // Track matched tiles

  const handleTileFlip = (id: string, url: string) => {
    // Prevent flipping the same tile twice
    if (flippedTilesRef.current.some((tile) => tile.id === id)) return;

    // Only flip if there are less than 2 tiles flipped
    if (flippedTilesRef.current.length < 2) {
      flippedTilesRef.current.push({ id, url });

      if (flippedTilesRef.current.length === 2) {
        // Prevent more flips if two tiles are already flipped
        if (
          flippedTilesRef.current[0]?.url === flippedTilesRef.current[1]?.url
        ) {
          console.log("Tiles matched!");

          const matchedTileIds = [
            flippedTilesRef.current[0]?.id,
            flippedTilesRef.current[1]?.id,
          ].filter((id): id is string => id !== undefined);

          setTimeout(() => {
            setMatchedTiles((matched) => [...matched, ...matchedTileIds]);
            flippedTilesRef.current = []; // Clear flipped tiles after matching
          }, 1000);
        } else {
          console.log("Tiles are not matched.");

          const unmatchedTileIds = [
            flippedTilesRef.current[0]?.id,
            flippedTilesRef.current[1]?.id,
          ].filter((id): id is string => id !== undefined);

          setTimeout(() => {
            setFlippedBackIds(unmatchedTileIds); // Mark tiles to flip back
            flippedTilesRef.current = []; // Clear flipped tiles after mismatch

            // Clear flippedBackIds after the flip-back effect
            setTimeout(() => {
              setFlippedBackIds([]); // Reset flippedBackIds
            }, 1000);
          }, 1000);
        }
      }
    }
  };

  const canFlipMore = flippedTilesRef.current.length < 2;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={2} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />

        {/* Render only tiles that are not matched */}
        {!matchedTiles.includes("tile1") && (
          <Tile
            id="tile1"
            url="/models/tile1.glb"
            position={[-15, 0, 0]}
            offset={-2}
            canFlip={canFlipMore}
            isFlippedExternally={!flippedBackIds.includes("tile1")}
            onTileFlip={handleTileFlip}
          />
        )}
        {!matchedTiles.includes("tile2") && (
          <Tile
            id="tile2"
            url="/models/tile1.glb"
            position={[-9, 0, 0]}
            offset={-2}
            canFlip={canFlipMore}
            isFlippedExternally={!flippedBackIds.includes("tile2")}
            onTileFlip={handleTileFlip}
          />
        )}
        {!matchedTiles.includes("tile3") && (
          <Tile
            id="tile3"
            url="/models/tile2.glb"
            position={[-3, 0, 0]}
            offset={-2}
            canFlip={canFlipMore}
            isFlippedExternally={!flippedBackIds.includes("tile3")}
            onTileFlip={handleTileFlip}
          />
        )}
        {!matchedTiles.includes("tile4") && (
          <Tile
            id="tile4"
            url="/models/tile2.glb"
            position={[3, 0, 0]}
            offset={-2}
            canFlip={canFlipMore}
            isFlippedExternally={!flippedBackIds.includes("tile4")}
            onTileFlip={handleTileFlip}
          />
        )}
        {!matchedTiles.includes("tile5") && (
          <Tile
            id="tile5"
            url="/models/tile3.glb"
            position={[9, 0, 0]}
            offset={-2}
            canFlip={canFlipMore}
            isFlippedExternally={!flippedBackIds.includes("tile5")}
            onTileFlip={handleTileFlip}
          />
        )}
        {!matchedTiles.includes("tile6") && (
          <Tile
            id="tile6"
            url="/models/tile3.glb"
            position={[15, 0, 0]}
            offset={-2}
            canFlip={canFlipMore}
            isFlippedExternally={!flippedBackIds.includes("tile6")}
            onTileFlip={handleTileFlip}
          />
        )}
      </Canvas>
    </div>
  );
}
