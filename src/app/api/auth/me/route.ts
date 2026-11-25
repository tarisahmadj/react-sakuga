import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getSessionUser();
  const users = await getUsers().catch(() => []);
  return NextResponse.json({ ok: true, user, users });
}
