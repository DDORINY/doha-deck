import { NextResponse } from "next/server";

export function apiError(message: string, error: unknown, status = 500) {
  console.error(message, error);

  return NextResponse.json(
    {
      message,
      ...(process.env.NODE_ENV === "development"
        ? {
            error: error instanceof Error ? error.message : String(error),
          }
        : {}),
    },
    { status },
  );
}
