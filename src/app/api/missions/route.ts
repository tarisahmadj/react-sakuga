import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getMissions, pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SFX_BY_CATEGORY: Record<string, string> = {
  vfx: "ドン! (DON!)",
  keyframe: "ズザッ (ZUZA!)",
  compositing: "ゴゴゴゴ (GOGOGO)",
};

export async function GET() {
  try {
    const missions = await getMissions();
    return NextResponse.json({ ok: true, missions });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to fetch missions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    await ensureSchema();
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Judul cut / scene tidak boleh kosong" },
        { status: 400 }
      );
    }

    const category = String(body.category || "vfx");
    const assignee =
      String(body.assignee || user.full_name || "Taris (Key Director)").trim() ||
      user.full_name;
    const notes = String(body.notes || "").trim();
    const priority_power = Math.min(100, Math.max(0, Number(body.priority_power ?? 65)));
    const rating = Math.min(5, Math.max(0, Number(body.rating ?? 5)));
    const fx_enabled = Boolean(body.fx_enabled ?? true);
    const completed = Boolean(body.completed ?? false);
    const sfx_tag = body.sfx_tag || SFX_BY_CATEGORY[category] || "カチッ (KACHI)";

    const { rows } = await pool.query(
      `INSERT INTO sakuga_missions
        (title, category, assignee, notes, priority_power, rating, fx_enabled, completed, likes, sfx_tag)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, $9)
       RETURNING *`,
      [title, category, assignee, notes, priority_power, rating, fx_enabled, completed, sfx_tag]
    );

    return NextResponse.json({ ok: true, mission: rows[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create mission" },
      { status: 500 }
    );
  }
}
