import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SFX_BY_CATEGORY: Record<string, string> = {
  vfx: "ドン! (DON!)",
  keyframe: "ズザッ (ZUZA!)",
  compositing: "ゴゴゴゴ (GOGOGO)",
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    await ensureSchema();
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ ok: false, error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (typeof body.title === "string" && body.title.trim()) {
      fields.push(`title = $${idx++}`);
      values.push(body.title.trim());
    }
    if (typeof body.category === "string" && body.category.trim()) {
      const cat = body.category.trim();
      fields.push(`category = $${idx++}`);
      values.push(cat);
      if (!body.sfx_tag && SFX_BY_CATEGORY[cat]) {
        fields.push(`sfx_tag = $${idx++}`);
        values.push(SFX_BY_CATEGORY[cat]);
      }
    }
    if (typeof body.assignee === "string") {
      fields.push(`assignee = $${idx++}`);
      values.push(body.assignee.trim() || user.full_name);
    }
    if (typeof body.notes === "string") {
      fields.push(`notes = $${idx++}`);
      values.push(body.notes.trim());
    }
    if (typeof body.sfx_tag === "string" && body.sfx_tag.trim()) {
      fields.push(`sfx_tag = $${idx++}`);
      values.push(body.sfx_tag.trim());
    }
    if (typeof body.completed === "boolean") {
      fields.push(`completed = $${idx++}`);
      values.push(body.completed);
    }
    if (typeof body.fx_enabled === "boolean") {
      fields.push(`fx_enabled = $${idx++}`);
      values.push(body.fx_enabled);
    }
    if (typeof body.rating === "number") {
      fields.push(`rating = $${idx++}`);
      values.push(Math.min(5, Math.max(0, body.rating)));
    }
    if (typeof body.priority_power === "number") {
      fields.push(`priority_power = $${idx++}`);
      values.push(Math.min(100, Math.max(0, body.priority_power)));
    }
    if (typeof body.likeDelta === "number") {
      fields.push(`likes = GREATEST(0, likes + $${idx++})`);
      values.push(body.likeDelta);
    }

    if (fields.length === 0) {
      return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);
    const { rows } = await pool.query(
      `UPDATE sakuga_missions SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, mission: rows[0] });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update mission" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    await ensureSchema();
    const id = Number(params.id);
    await pool.query("DELETE FROM sakuga_missions WHERE id = $1", [id]);
    return NextResponse.json({ ok: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to delete mission" },
      { status: 500 }
    );
  }
}
