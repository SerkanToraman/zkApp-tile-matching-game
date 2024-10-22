import React from "react";
import { calculateFinalScore } from "../helpers/calculateScore";

interface GameCompletedProps {
  score: number;
  time: string; // Time will be passed as a formatted string
}

const GameCompleted: React.FC<GameCompletedProps> = ({ score, time }) => {
  const finalScore = calculateFinalScore(score, time); // Calculate the final score

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        fontSize: "24px",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h1>🎉 Game Completed! 🎉</h1>
      <p>
        Your final score is: <strong>{finalScore}</strong>
      </p>
      <p>
        Original Score: <strong>{score}</strong>
      </p>
      <p>
        Time taken: <strong>{time}</strong>
      </p>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
        onClick={() => window.location.reload()} // Reload the page to restart the game
      >
        Play Again
      </button>
    </div>
  );
};

export default GameCompleted;