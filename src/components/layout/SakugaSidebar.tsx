"use client";

import React from "react";
import type { SakugaMission, SakugaUser } from "@/lib/db";
import type { WorkspaceTab } from "./SakugaHeader";

interface SakugaSidebarProps {
  open: boolean;
  onCloseMobile: () => void;
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  filterCategory: string;
  onSelectCategory: (cat: string) => void;
  missions: SakugaMission[];
  usersCount: number;
  currentUser: SakugaUser | null;
  onNewCutClick: () => void;
}

export default function SakugaSidebar({
  open,
  onCloseMobile,
  activeTab,
  onSelectTab,
  filterCategory,
  onSelectCategory,
  missions,
  usersCount,
  currentUser,
  onNewCutClick,
}: SakugaSidebarProps) {
  const completedCount = missions.filter((m) => m.completed).length;
  const completionPct = missions.length
    ? Math.round((completedCount / missions.length) * 100)
    : 0;
  const totalLikes = missions.reduce((acc, m) => acc + (m.likes || 0), 0);

  const navItems: Array<{
    id: WorkspaceTab;
    icon: string;
    label: string;
    badge?: string | number;
    sfx: string;
  }> = [
    {
      id: "studio",
      icon: "▤",
      label: "Studio CRUD & Tabel",
      badge: missions.length,
      sfx: "ドン!",
    },
    {
      id: "gallery",
      icon: "✦",
      label: "The 12 VFX Gallery",
      badge: 13,
      sfx: "ズザッ",
    },
    {
      id: "database",
      icon: "⛁",
      label: "DB & Users Inspector",
      badge: usersCount,
      sfx: "カチッ",
    },
  ];

  const categories = [
    { id: "all", label: "Semua Kategori", count: missions.length, sfx: "ALL" },
    {
      id: "vfx",
      label: "VFX Impact Burst",
      count: missions.filter((m) => m.category === "vfx").length,
      sfx: "ドン!",
    },
    {
      id: "keyframe",
      label: "Key Animation",
      count: missions.filter((m) => m.category === "keyframe").length,
      sfx: "ズザッ",
    },
    {
      id: "compositing",
      label: "Compositing",
      count: missions.filter((m) => m.category === "compositing").length,
      sfx: "ゴゴゴゴ",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay when Fixed Sidebar is open */}
      {open && (
        <div
          onClick={onCloseMobile}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-[#1d1a4a]/35 backdrop-blur-[2px] lg:hidden transition-opacity"
        />
      )}

      {/* Fixed Sidebar (<aside>) */}
      <aside
        aria-label="Main Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-40 w-[270px] bg-[#faf9ff] border-r-[1.5px] border-[#dcdaf0] flex flex-col justify-between p-4 gap-5 overflow-y-auto transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0 shadow-xl lg:shadow-none" : "-translate-x-full"
        }`}
      >
        <div className="space-y-5">
          {/* Brand Identity */}
          <div className="p-3.5 rounded-2xl bg-white border-[1.5px] border-[#dcdaf0] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#fff0f7] text-[#ff5fa8] border border-[#ffc2df]">
                SAKUGA VFX × REACT
              </span>
              <span className="text-xs font-mono font-bold text-[#7c5cff]">
                FIXED
              </span>
            </div>
            <div
              className="mt-2 italic font-extrabold text-lg text-[#1d1a4a]"
              style={{
                fontFamily:
                  '"Avenir Next", "Nunito", -apple-system, "Segoe UI", system-ui, sans-serif',
              }}
            >
              Anime UI Studio
            </div>
            <p className="m-0 mt-0.5 text-[11.5px] text-[#8580b0]">
              Next.js 14 App Router + PostgreSQL 15 Container
            </p>

            <button
              type="button"
              onClick={() => {
                onSelectTab("studio");
                onNewCutClick();
              }}
              className="mt-3 w-full py-2.5 px-3 rounded-xl bg-[#1d1a4a] hover:bg-[#2d286b] text-white text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>+ Input Cut Baru</span>
              <span className="text-[#ff5fa8]">(Modal)</span>
            </button>
          </div>

          {/* Modular Section 1: Workspace Navigation */}
          <div className="space-y-1.5">
            <div className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8580b0]">
              Menu Utama
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                      active
                        ? "bg-[#1d1a4a] text-white border-[#1d1a4a] shadow-sm"
                        : "bg-white text-[#1d1a4a] border-[#dcdaf0] hover:border-[#1d1a4a]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                        active
                          ? "bg-[#ff5fa8] text-white"
                          : "bg-[#f4f3fc] text-[#7c5cff]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Modular Section 2: Department Filter Shortcuts */}
          <div className="space-y-1.5">
            <div className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8580b0]">
              Filter Departemen Tabel
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const active =
                  activeTab === "studio" && filterCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectTab("studio");
                      onSelectCategory(cat.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                      active
                        ? "bg-[#f4f3fc] text-[#7c5cff] border-[#7c5cff] font-bold"
                        : "bg-white text-[#1d1a4a] border-transparent hover:border-[#dcdaf0]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[11px] text-[#8580b0]">
                      {cat.sfx} · <strong>{cat.count}</strong>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modular Section 3: Studio Progress Card */}
          <div className="p-3.5 rounded-2xl bg-white border-[1.5px] border-[#dcdaf0] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#1d1a4a]">
                Progress Produksi
              </span>
              <span className="font-extrabold text-[#10b981]">
                {completionPct}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#f4f3fc] overflow-hidden border border-[#dcdaf0]">
              <div
                className="h-full bg-gradient-to-r from-[#7c5cff] to-[#10b981] transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#8580b0]">
              <span>
                Selesai: <strong>{completedCount}</strong>/{missions.length}
              </span>
              <span className="text-[#ff5fa8] font-bold">♥ {totalLikes} Kudos</span>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Section: Active User & Quick Links */}
        <div className="space-y-3 pt-3 border-t border-[#dcdaf0]">
          {currentUser && (
            <div className="p-3 rounded-xl bg-white border border-[#dcdaf0] text-xs">
              <div className="text-[10.5px] uppercase font-bold text-[#8580b0]">
                Sesi Login Aktif
              </div>
              <div className="font-extrabold text-[#1d1a4a] mt-0.5 truncate">
                {currentUser.full_name}
              </div>
              <div className="text-[11px] text-[#7c5cff] font-semibold">
                @{currentUser.username} · {currentUser.role}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            <a
              className="sk-pill !h-[26px] !text-[11px] flex-1 justify-center"
              href="https://github.com/finktheartist/sakuga-vfx"
              target="_blank"
              rel="noopener"
            >
              GitHub &#8599;
            </a>
            <a
              className="sk-pill !h-[26px] !text-[11px] flex-1 justify-center"
              href="/sakuga-vfx/gallery/index.html"
              target="_blank"
              rel="noopener"
            >
              Static &#8599;
            </a>
            <a
              className="sk-pill !h-[26px] !text-[11px] flex-1 justify-center"
              href="/api/health"
              target="_blank"
            rel="noopener"
            >
              API &#8599;
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
