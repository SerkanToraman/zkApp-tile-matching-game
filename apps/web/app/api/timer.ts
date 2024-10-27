// apps/web/src/app/api/timer.ts

const timers = new Map<string, Date>();

export function startTimer(sessionId: string) {
  const startTime = new Date();
  timers.set(sessionId, startTime);
  console.log(
    `Timer started at ${startTime.toISOString()} for session ${sessionId}`
  );
  return { startTime };
}

export function stopTimer(sessionId: string) {
  const startTime = timers.get(sessionId);

  if (!startTime) {
    console.error("Error: Timer has not been started or already stopped.");
    throw new Error("Timer has not been started.");
  }

  const endTime = new Date();
  const duration = (endTime.getTime() - startTime.getTime()) / 1000; // Calculate duration in seconds
  console.log(
    `Timer stopped at ${endTime.toISOString()} for session ${sessionId}. Duration: ${duration} seconds`
  );

  timers.delete(sessionId); // Clear the session's timer
  return { duration };
}
