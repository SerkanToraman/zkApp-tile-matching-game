// timer-Middleware.ts

import { Request, Response, NextFunction } from "express";

export function validateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }
  next();
}
