// apps/web/src/app/api/stop-timer/route.ts
import { NextResponse } from "next/server";
import { stopTimer } from "../timer";

export async function POST(request: Request) {
  const { sessionId } = await request.json(); // Assuming sessionId is passed in the request body
  if (!sessionId) {
    return NextResponse.json(
      { message: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = stopTimer(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
