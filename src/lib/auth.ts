import crypto from "crypto";
import { cookies } from "next/headers";
import type { SakugaUser } from "@/lib/db";

const SECRET = process.env.AUTH_SECRET || "sakuga-vfx-postgres15-secret-key-2026";
export const COOKIE_NAME = "sakuga_session";

export function signSession(user: SakugaUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token?: string): SakugaUser | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function getSessionUser(): SakugaUser | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySession(token);
  } catch {
    return null;
  }
}
