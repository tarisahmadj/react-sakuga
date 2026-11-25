import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, hashPassword, pool, SakugaUser } from "@/lib/db";
import { COOKIE_NAME, signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();
    const username = String(body.username || "").trim().toLowerCase();
    const email = String(body.email || `${username}@sakuga.local`).trim().toLowerCase();
    const password = String(body.password || "");
    const full_name = String(body.full_name || username).trim();
    const role = String(body.role || "Key Animator").trim();

    if (!username || !password || password.length < 4) {
      return NextResponse.json(
        { ok: false, error: "Username dan password (minimal 4 karakter) wajib diisi" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query<SakugaUser>(
      `INSERT INTO sakuga_users (username, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, full_name, role, created_at`,
      [username, email, hashPassword(password), full_name, role]
    );

    const user = rows[0];
    const token = signSession(user);
    const res = NextResponse.json({ ok: true, user }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    const isDuplicate = err?.code === "23505";
    return NextResponse.json(
      {
        ok: false,
        error: isDuplicate
          ? "Username atau email sudah terdaftar di PostgreSQL"
          : err?.message || "Gagal registrasi user",
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
