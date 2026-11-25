"use client";

import React, { useEffect, useRef } from "react";
import type { SakugaUser } from "@/lib/db";
import type { SakugaTabsElement } from "@/types/sakuga";

export type WorkspaceTab = "studio" | "gallery" | "database";

export interface DbHealth {
  ok: boolean;
  latencyMs?: number;
  host?: string;
  database?: string;
  user?: string;
  server_ip?: string;
  server_port?: number;
  version?: string;
  server_time?: string;
  mission_count?: number;
  completed_count?: number;
  total_likes?: number;
  user_count?: number;
  error?: string;
}

interface SakugaHeaderProps {
  mounted: boolean;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  health: DbHealth;
  missionsCount: number;
  usersCount: number;
  currentUser: SakugaUser | null;
  onToggleAuthModal: () => void;
  onLogout: () => void;
}

const TAB_TITLES: Record<WorkspaceTab, { title: string; subtitle: string }> = {
  studio: {
    title: "Production CRUD & Data Table",
    subtitle: "Kelola data cut animasi secara real-time di PostgreSQL (sakuga_missions)",
  },
  gallery: {
    title: "The Twelve Sakuga VFX Gallery",
    subtitle: "Showcase interaktif 12 komponen web anime dari finktheartist/sakuga-vfx",
  },
  database: {
    title: "PostgreSQL & Users Inspector",
    subtitle: "Status container postgres15, tabel sakuga_users, dan payload JSON",
  },
};

export default function SakugaHeader({
  mounted,
  activeTab,
  onTabChange,
  sidebarOpen,
  onToggleSidebar,
  health,
  missionsCount,
  usersCount,
  currentUser,
  onToggleAuthModal,
  onLogout,
}: SakugaHeaderProps) {
  const navTabsRef = useRef<SakugaTabsElement>(null);

  useEffect(() => {
    if (!mounted) return;
    const tabs = navTabsRef.current;
    if (!tabs) return;

    const indexMap: Record<WorkspaceTab, number> = {
      studio: 0,
      gallery: 1,
      database: 2,
    };
    if (typeof tabs.selected === "number" && tabs.selected !== indexMap[activeTab]) {
      tabs.selected = indexMap[activeTab];
    }

    const handleTab = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const val = detail?.value as WorkspaceTab;
      if (val) onTabChange(val);
    };
    tabs.addEventListener("change", handleTab);
    return () => tabs.removeEventListener("change", handleTab);
  }, [mounted, activeTab, onTabChange]);

  const currentMeta = TAB_TITLES[activeTab];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b-[1.5px] border-[#dcdaf0] px-4 sm:px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Sidebar Toggle & Active Section Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
            className="sk-pill !h-[34px] !px-3"
          >
            <span className="text-sm leading-none">{sidebarOpen ? "☰" : "☷"}</span>
            <span className="hidden sm:inline text-xs">Sidebar</span>
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="m-0 italic font-extrabold text-lg sm:text-xl leading-tight text-[#1d1a4a]"
                style={{
                  fontFamily:
                    '"Avenir Next", "Nunito", -apple-system, "Segoe UI", system-ui, sans-serif',
                }}
              >
                {currentMeta.title}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  health.ok
                    ? "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]"
                    : "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health.ok ? "bg-[#10b981]" : "bg-[#ef4444]"
                  }`}
                />
                {health.ok
                  ? `${health.host || "postgres15"}/${health.database || "sakuga_db"} (${health.latencyMs ?? 1}ms)`
                  : "DB Offline"}
              </span>
            </div>
            <p className="m-0 text-xs text-[#8580b0] hidden md:block">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Center/Right: Sakuga Tabs & Authenticated User Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {mounted && (
            <div className="hidden xl:block">
              <sakuga-tabs ref={navTabsRef} label="Header Navigation">
                <option value="studio">CRUD &amp; Tabel ({missionsCount})</option>
                <option value="gallery">12 VFX Gallery</option>
                <option value="database">DB &amp; Users ({usersCount})</option>
              </sakuga-tabs>
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf9ff] border border-[#dcdaf0] text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#7c5cff]" />
                  <strong className="text-[#1d1a4a]">{currentUser.full_name}</strong>
                  <span className="hidden sm:inline text-[#8580b0]">
                    ({currentUser.role})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleAuthModal}
                  className="sk-pill !h-[30px] !text-xs"
                >
                  Akun
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="sk-pill !h-[30px] !text-xs !border-[#ff5fa8] !text-[#ff5fa8] hover:!bg-[#fff0f7]"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onToggleAuthModal}
                className="sk-pill !h-[30px] !text-xs !bg-[#1d1a4a] !text-white !border-[#1d1a4a]"
              >
                🔐 Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
