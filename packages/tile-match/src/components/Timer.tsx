// components/Timer.tsx
import React, { useState, useEffect } from "react";

interface TimerProps {
  isGameCompleted: boolean;
  reset: boolean;
  onTimeUpdate: (formattedTime: string) => void; // Add onTimeUpdate prop
}

const Timer: React.FC<TimerProps> = ({
  isGameCompleted,
  reset,
  onTimeUpdate,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Start the timer when the component mounts or reset occurs
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isGameCompleted && !isRunning) {
      setIsRunning(true); // Start the timer when the game begins
    }

    if (isRunning && !isGameCompleted) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    if (isGameCompleted && interval) {
      clearInterval(interval); // Stop the timer when the game is completed
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval); // Clear the interval when the component unmounts or the game stops
    };
  }, [isRunning, isGameCompleted]);

  // Reset the timer when the game restarts
  useEffect(() => {
    if (reset) {
      setSeconds(0);
      setIsRunning(false);
    }
  }, [reset]);

  // Format the time in minutes and seconds
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Call the onTimeUpdate callback to pass the formatted time to the parent
  useEffect(() => {
    onTimeUpdate(formatTime(seconds));
  }, [seconds, onTimeUpdate]);

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "24px",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <strong>Time: {formatTime(seconds)}</strong>
    </div>
  );
};

export default Timer;
