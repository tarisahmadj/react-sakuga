"use client";

import React from "react";
import type { DbHealth } from "./SakugaHeader";

export default function SakugaFooter({ health }: { health: DbHealth }) {
  return (
    <footer className="mt-auto border-t-[1.5px] border-[#dcdaf0] bg-[#faf9ff] px-4 sm:px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#8580b0]">
        <div className="space-y-0.5">
          <div className="font-bold text-[#1d1a4a]">
            Sakuga VFX × React (Next.js 14) + PostgreSQL 15 Studio
          </div>
          <div>
            Effects are drawn on one shared canvas (<code>window.SakugaFX</code>) and
            respect{" "}
            <code className="px-1.5 py-0.5 rounded bg-white border border-[#dcdaf0] text-[11px]">
              prefers-reduced-motion
            </code>{" "}
            &amp;{" "}
            <code className="px-1.5 py-0.5 rounded bg-white border border-[#dcdaf0] text-[11px]">
              --sk-*
            </code>{" "}
            variables.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white border border-[#dcdaf0] text-[11px] font-semibold text-[#1d1a4a]">
            Container: <code>react_sakuga</code>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white border border-[#dcdaf0] text-[11px] font-semibold text-[#1d1a4a]">
            DB: <code>{health.host || "postgres15"}:{health.server_port || 5432}/{health.database || "sakuga_db"}</code>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white border border-[#dcdaf0] text-[11px] font-semibold text-[#7c5cff]">
            Network: <code>docker-infra_default</code>
          </span>
        </div>
      </div>
    </footer>
  );
}
