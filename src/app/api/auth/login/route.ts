import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, hashPassword, pool, SakugaUser } from "@/lib/db";
import { COOKIE_NAME, signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();
    const identifier = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { ok: false, error: "Username/email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const hashed = hashPassword(password);
    const { rows } = await pool.query<SakugaUser & { password_hash: string }>(
      `SELECT id, username, email, full_name, role, created_at, password_hash
       FROM sakuga_users
       WHERE LOWER(username) = $1 OR LOWER(email) = $1
       LIMIT 1`,
      [identifier]
    );

    if (rows.length === 0 || rows[0].password_hash !== hashed) {
      return NextResponse.json(
        { ok: false, error: "Username atau password salah (Coba: admin / admin123)" },
        { status: 401 }
      );
    }

    const user: SakugaUser = {
      id: rows[0].id,
      username: rows[0].username,
      email: rows[0].email,
      full_name: rows[0].full_name,
      role: rows[0].role,
      created_at: rows[0].created_at,
    };

    const token = signSession(user);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: body.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Gagal proses login" },
      { status: 500 }
    );
  }
}
