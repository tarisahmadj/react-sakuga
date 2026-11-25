import { NextResponse } from "next/server";
import { ensureSchema, getDbHealth, getMissions, getUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getDbHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 500 });
}

export async function POST() {
  try {
    await ensureSchema(true);
    const [health, missions, users] = await Promise.all([
      getDbHealth(),
      getMissions(),
      getUsers(),
    ]);
    return NextResponse.json({
      ok: true,
      message: "Database sakuga_db berhasil di-reset ke seed awal!",
      health,
      missions,
      users,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to reseed database" },
      { status: 500 }
    );
  }
}
