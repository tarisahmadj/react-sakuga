import { Pool } from "pg";
import crypto from "crypto";

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "postgres"}@${process.env.DB_HOST || "postgres15"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "sakuga_db"}`;

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
  schemaV2Initialized?: boolean;
};

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

export interface SakugaMission {
  id: number;
  title: string;
  category: string;
  assignee: string;
  notes: string;
  priority_power: number;
  rating: number;
  fx_enabled: boolean;
  completed: boolean;
  likes: number;
  sfx_tag: string;
  created_at: string;
  updated_at: string;
}

export interface SakugaUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(`sakuga_salt_v1:${password}`)
    .digest("hex");
}

const SEED_MISSIONS = [
  {
    title: "Cut #042 — Impact Frame Burst & Smoke Ring",
    category: "vfx",
    assignee: "Taris (Key Director)",
    notes: "1-frame invert sebelum impact burst + ドン! lettering",
    priority_power: 90,
    rating: 5,
    fx_enabled: true,
    completed: true,
    likes: 14,
    sfx_tag: "ドン! (DON!)",
  },
  {
    title: "Cut #078 — Liquid Splash Toggle 43-Frame Smear",
    category: "keyframe",
    assignee: "Yutaka Keyframe",
    notes: "Pastikan transisi smear knob di frame 12-28 mulus",
    priority_power: 75,
    rating: 5,
    fx_enabled: true,
    completed: false,
    likes: 9,
    sfx_tag: "ズザッ (ZUZA!)",
  },
  {
    title: "Cut #105 — Storm Cloud Progress Bar & Lifting Pebbles",
    category: "compositing",
    assignee: "Aoi Compositor",
    notes: "Tambahkan efek kerikil terangkat saat progress > 60%",
    priority_power: 60,
    rating: 4,
    fx_enabled: true,
    completed: false,
    likes: 6,
    sfx_tag: "ゴゴゴゴ (GOGOGO)",
  },
  {
    title: "Cut #119 — Teardrop Spring Slider & Cumulus Trail",
    category: "vfx",
    assignee: "Ren FX Artist",
    notes: "Crescent wave dilempar ke depan saat thumb dilepas cepat",
    priority_power: 45,
    rating: 5,
    fx_enabled: false,
    completed: false,
    likes: 4,
    sfx_tag: "ポン (PON)",
  },
];

const SEED_USERS = [
  {
    username: "admin",
    email: "admin@sakuga.local",
    password: "admin123",
    full_name: "Taris (Key Director)",
    role: "Studio Director",
  },
  {
    username: "animator",
    email: "animator@sakuga.local",
    password: "sakuga123",
    full_name: "Yutaka Keyframe",
    role: "Lead Animator",
  },
];

export async function ensureSchema(forceReseed = false): Promise<void> {
  if (globalForPg.schemaV2Initialized && !forceReseed) return;

  const client = await pool.connect();
  try {
    // 1. Users table for Authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS sakuga_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(120) NOT NULL,
        role VARCHAR(60) NOT NULL DEFAULT 'Lead Animator',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Missions table for CRUD
    await client.query(`
      CREATE TABLE IF NOT EXISTS sakuga_missions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(180) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'vfx',
        assignee VARCHAR(120) NOT NULL DEFAULT 'Taris (Key Director)',
        notes TEXT NOT NULL DEFAULT '',
        priority_power INTEGER NOT NULL DEFAULT 60,
        rating INTEGER NOT NULL DEFAULT 5,
        fx_enabled BOOLEAN NOT NULL DEFAULT true,
        completed BOOLEAN NOT NULL DEFAULT false,
        likes INTEGER NOT NULL DEFAULT 0,
        sfx_tag VARCHAR(50) NOT NULL DEFAULT 'ドン! (DON!)',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Upgrade existing sakuga_missions columns if table was created in v1
    await client.query(`
      ALTER TABLE sakuga_missions
        ADD COLUMN IF NOT EXISTS assignee VARCHAR(120) NOT NULL DEFAULT 'Taris (Key Director)',
        ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    `);

    // Seed default users if empty
    const userCountRes = await client.query(
      "SELECT COUNT(*)::int AS count FROM sakuga_users;"
    );
    if (userCountRes.rows[0].count === 0) {
      for (const u of SEED_USERS) {
        await client.query(
          `INSERT INTO sakuga_users (username, email, password_hash, full_name, role)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (username) DO NOTHING`,
          [u.username, u.email, hashPassword(u.password), u.full_name, u.role]
        );
      }
    }

    if (forceReseed) {
      await client.query("TRUNCATE TABLE sakuga_missions RESTART IDENTITY;");
    }

    const { rows } = await client.query(
      "SELECT COUNT(*)::int AS count FROM sakuga_missions;"
    );
    if (rows[0].count === 0) {
      for (const item of SEED_MISSIONS) {
        await client.query(
          `INSERT INTO sakuga_missions
            (title, category, assignee, notes, priority_power, rating, fx_enabled, completed, likes, sfx_tag)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            item.title,
            item.category,
            item.assignee,
            item.notes,
            item.priority_power,
            item.rating,
            item.fx_enabled,
            item.completed,
            item.likes,
            item.sfx_tag,
          ]
        );
      }
    } else {
      // Backfill empty notes on existing seeded rows
      await client.query(`
        UPDATE sakuga_missions
        SET notes = 'Keyframe & VFX production cut synced with PostgreSQL 15'
        WHERE notes = '';
      `);
    }

    globalForPg.schemaV2Initialized = true;
  } finally {
    client.release();
  }
}

export async function getMissions(): Promise<SakugaMission[]> {
  await ensureSchema();
  const { rows } = await pool.query<SakugaMission>(
    `SELECT id, title, category, assignee, notes, priority_power, rating, fx_enabled, completed, likes, sfx_tag, created_at, updated_at
     FROM sakuga_missions
     ORDER BY id DESC`
  );
  return rows;
}

export async function getUsers(): Promise<SakugaUser[]> {
  await ensureSchema();
  const { rows } = await pool.query<SakugaUser>(
    `SELECT id, username, email, full_name, role, created_at
     FROM sakuga_users
     ORDER BY id ASC`
  );
  return rows;
}

export async function getDbHealth() {
  const start = Date.now();
  try {
    await ensureSchema();
    const res = await pool.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        inet_server_addr()::text AS server_ip,
        inet_server_port() AS server_port,
        version() AS version,
        NOW() AS server_time,
        (SELECT COUNT(*)::int FROM sakuga_missions) AS mission_count,
        (SELECT COUNT(*)::int FROM sakuga_missions WHERE completed = true) AS completed_count,
        (SELECT COALESCE(SUM(likes), 0)::int FROM sakuga_missions) AS total_likes,
        (SELECT COUNT(*)::int FROM sakuga_users) AS user_count
    `);
    const latencyMs = Date.now() - start;
    return {
      ok: true,
      latencyMs,
      host: process.env.DB_HOST || "postgres15",
      ...res.rows[0],
    };
  } catch (err: any) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      host: process.env.DB_HOST || "postgres15",
      error: err?.message || "Database connection failed",
    };
  }
}
