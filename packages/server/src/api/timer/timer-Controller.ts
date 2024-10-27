// timer-Controller.ts

const timers = new Map<string, Date>();

export function startTimer(sessionId: string) {
  const startTime = new Date();
  timers.set(sessionId, startTime);
  return { startTime };
}

export function stopTimer(sessionId: string) {
  const startTime = timers.get(sessionId);
  if (!startTime) throw new Error("Timer has not been started.");

  const endTime = new Date();
  const duration = (endTime.getTime() - startTime.getTime()) / 1000; // Duration in seconds
  timers.delete(sessionId);
  return { duration };
}
