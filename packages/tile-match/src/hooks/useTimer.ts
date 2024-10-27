// packages/tile-match/src/hooks/useTimer.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface StartTimerResponse {
  startTime: string; // Assuming start time is returned as a string
}

interface StopTimerResponse {
  duration: number; // Duration in seconds
}

// Start timer function with sessionId as a parameter
const startTimer = async (sessionId: string): Promise<StartTimerResponse> => {
  const response = await axios.post(
    "http://localhost:8585/api/timer/start-timer",
    {
      sessionId,
    }
  );
  return response.data;
};

const stopTimer = async (sessionId: string): Promise<StopTimerResponse> => {
  const response = await axios.post(
    "http://localhost:8585/api/timer/stop-timer",
    {
      sessionId,
    }
  );
  return response.data;
};

// Hook to start the timer
export function useStartTimer() {
  return useMutation<StartTimerResponse, Error, string>({
    mutationFn: startTimer,
    onSuccess: (data) => {
      console.log("Timer started at:", data.startTime);
    },
    onError: (error) => {
      console.error("Error starting timer:", error);
    },
  });
}

// Hook to stop the timer and retrieve duration
export function useStopTimer() {
  return useMutation<StopTimerResponse, Error, string>({
    mutationFn: stopTimer,
    onSuccess: (data) => {
      console.log("Total duration:", data.duration);
    },
    onError: (error) => {
      console.error("Error stopping timer:", error);
    },
  });
}
