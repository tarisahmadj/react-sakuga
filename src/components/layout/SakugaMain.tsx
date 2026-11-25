"use client";

import React from "react";
import type { SakugaMission, SakugaUser } from "@/lib/db";
import type { DbHealth, WorkspaceTab } from "./SakugaHeader";

interface SakugaMainProps {
  activeTab: WorkspaceTab;
  health: DbHealth;
  missions: SakugaMission[];
  currentUser: SakugaUser | null;
  children: React.ReactNode;
}

export default function SakugaMain({
  activeTab,
  health,
  missions,
  currentUser,
  children,
}: SakugaMainProps) {
  return (
    <main className="flex-1 px-4 sm:px-6 py-5 space-y-6 max-w-[1400px] w-full mx-auto">
      {/* Modular KPI Summary Cards inside <main> */}
      <section
        aria-label="Key Performance Metrics"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5"
      >
        <div className="sk-card p-3.5">
          <span className="text-xs font-semibold text-[#8580b0]">
            Database Container
          </span>
          <div className="text-base sm:text-lg font-extrabold mt-0.5 text-[#1d1a4a] truncate">
            {health.host || "postgres15"}:5432
          </div>
          <span className="text-xs text-[#7c5cff] font-medium">
            db: {health.database || "sakuga_db"} · Section: {activeTab.toUpperCase()}
          </span>
        </div>

        <div className="sk-card p-3.5">
          <span className="text-xs font-semibold text-[#8580b0]">
            Total Production Cuts
          </span>
          <div className="text-2xl font-extrabold mt-0.5 text-[#1d1a4a]">
            {missions.length}
          </div>
          <span className="text-xs text-[#8580b0]">
            Table: <code>sakuga_missions</code>
          </span>
        </div>

        <div className="sk-card p-3.5">
          <span className="text-xs font-semibold text-[#8580b0]">
            Completed Cuts (ズザッ)
          </span>
          <div className="text-2xl font-extrabold mt-0.5 text-[#10b981]">
            {missions.filter((m) => m.completed).length} / {missions.length}
          </div>
          <span className="text-xs text-[#8580b0]">Synced live to Postgres</span>
        </div>

        <div className="sk-card p-3.5">
          <span className="text-xs font-semibold text-[#8580b0]">
            Total Animator Kudos (ポン)
          </span>
          <div className="text-2xl font-extrabold mt-0.5 text-[#ff5fa8]">
            ♥ {missions.reduce((acc, m) => acc + (m.likes || 0), 0)}
          </div>
          <span className="text-xs text-[#8580b0] truncate">
            User: {currentUser?.username || "guest"}
          </span>
        </div>
      </section>

      {/* Active Workspace Section Content */}
      {children}
    </main>
  );
}
