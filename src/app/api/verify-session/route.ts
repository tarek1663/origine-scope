import { NextResponse } from "next/server";
import { isSessionPaid } from "@/lib/paidSessions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }
  const paid = isSessionPaid(sessionId);
  return NextResponse.json({ paid });
}
