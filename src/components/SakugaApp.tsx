"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SakugaMission, SakugaUser } from "@/lib/db";
import type {
  SakugaButtonElement,
  SakugaCheckboxElement,
  SakugaInputElement,
  SakugaProgressElement,
  SakugaTabsElement,
  SakugaToastElement,
  SakugaToggleElement,
} from "@/types/sakuga";
import SakugaHeader, {
  type DbHealth,
  type WorkspaceTab,
} from "@/components/layout/SakugaHeader";
import SakugaSidebar from "@/components/layout/SakugaSidebar";
import SakugaMain from "@/components/layout/SakugaMain";
import SakugaFooter from "@/components/layout/SakugaFooter";
import SakugaCrudModal, {
  type CrudFormValues,
} from "@/components/modals/SakugaCrudModal";

interface GalleryItem {
  key: string;
  id: string;
  name: string;
  tag: string;
  how: string;
  wide?: boolean;
  demoType:
    | "primary-btn"
    | "secondary-btn"
    | "toggle"
    | "slider"
    | "checkbox"
    | "radio"
    | "input"
    | "tabs"
    | "progress"
    | "rating"
    | "toast"
    | "tooltip"
    | "like";
}

const REPO = "finktheartist/sakuga-vfx";

const GALLERY_ITEMS: GalleryItem[] = [
  {
    key: "btn-primary",
    id: "button",
    name: "Primary button",
    tag: "sakuga-button",
    how: "Click it — squashes flat, inverts 1 frame, impact burst + ドン! and done() checkmark.",
    demoType: "primary-btn",
  },
  {
    key: "btn-secondary",
    id: "button",
    name: "Secondary button",
    tag: "sakuga-button",
    how: "Click it — quiet squash with three wedges.",
    demoType: "secondary-btn",
  },
  {
    key: "toggle",
    id: "toggle",
    name: "Toggle",
    tag: "sakuga-toggle",
    how: "Flip it, then flip it back — 43 painted smear frames & liquid splash.",
    demoType: "toggle",
  },
  {
    key: "slider",
    id: "slider",
    name: "Slider",
    tag: "sakuga-slider",
    how: "Drag it fast, and let go while it is moving — teardrop stretch & cumulus trail.",
    demoType: "slider",
  },
  {
    key: "checkbox",
    id: "checkbox",
    name: "Checkbox",
    tag: "sakuga-checkbox",
    how: "Tick it — double crescent slash, flying crystals & ズザッ.",
    demoType: "checkbox",
  },
  {
    key: "radio",
    id: "radio",
    name: "Radio",
    tag: "sakuga-radio",
    how: "Pick another choice — dot springs in with wedges, puffs & hollow ポン.",
    demoType: "radio",
  },
  {
    key: "input",
    id: "input",
    name: "Text input",
    tag: "sakuga-input",
    how: "Click it and type — every key kicks up dust from the caret.",
    demoType: "input",
  },
  {
    key: "tabs",
    id: "tabs",
    name: "Tabs",
    tag: "sakuga-tabs",
    how: "Pick another tab, or use arrow keys — raised tab stretches & lands with wedges.",
    demoType: "tabs",
  },
  {
    key: "progress",
    id: "progress",
    name: "Progress",
    tag: "sakuga-progress",
    how: "Plays a load in surges with a storm cloud, pebbles & ゴゴゴゴ. Click it to replay.",
    wide: true,
    demoType: "progress",
  },
  {
    key: "rating",
    id: "rating",
    name: "Rating",
    tag: "sakuga-rating",
    how: "Give it five stars — stars pop in sequentially; five triggers a full burst.",
    demoType: "rating",
  },
  {
    key: "toast",
    id: "toast",
    name: "Toast",
    tag: "sakuga-toast",
    how: "Press Save — streaks in as a smear, lands in dust with ズザッ.",
    demoType: "toast",
  },
  {
    key: "tooltip",
    id: "tooltip",
    name: "Tooltip",
    tag: "sakuga-tooltip",
    how: "Hover, focus or tap the ? button — springs out like a manga speech bubble with カチッ.",
    demoType: "tooltip",
  },
  {
    key: "like",
    id: "skills/sakuga-vfx",
    name: "Starter Like Button",
    tag: "like-button",
    how: "Custom element built with SakugaFX core.js (Spring + burst + ticks + hollow ポン).",
    demoType: "like",
  },
];

const WIRE_PROMPTS: Record<string, string[]> = {
  button: [
    'Use <sakuga-button>Confirm</sakuga-button> where my main button is, and <sakuga-button variant="secondary">Cancel</sakuga-button> for a quieter one.',
    "Listen for click on the element as usual. When the action has succeeded, call el.done() to land a check on the button.",
  ],
  toggle: [
    'Use <sakuga-toggle label="..."></sakuga-toggle> where my switch is.',
    "Read el.checked and listen for change.",
  ],
  slider: [
    'Use <sakuga-slider value="30" label="..."></sakuga-slider> where my slider is.',
    "Read el.value. It fires input while moving and change on release.",
  ],
  checkbox: [
    "Use <sakuga-checkbox>Remember me</sakuga-checkbox>.",
    "Read el.checked and listen for change.",
  ],
  radio: [
    'List the choices as <option>s inside it: <sakuga-radio label="Plan"><option value="a" selected>Option A</option><option value="b">Option B</option></sakuga-radio>.',
    "Read el.value and listen for change.",
  ],
  input: [
    'Use <sakuga-input label="..." placeholder="..."></sakuga-input> where my text field is.',
    "Read and set el.value. It fires input and change.",
  ],
  tabs: [
    'List the tabs as <option>s inside it: <sakuga-tabs label="..."><option value="home">Home</option>...</sakuga-tabs>.',
    "Listen for change (e.detail has index, value and label) and show the matching panel yourself.",
  ],
  progress: [
    'Put <sakuga-progress label="..."></sakuga-progress> where my progress bar is.',
    'Call el.set(n) with progress from 0 to 1. Listen for "sakuga:done" when it reaches 100%.',
  ],
  rating: [
    'Use <sakuga-rating label="..."></sakuga-rating>.',
    "Read el.value (0 to 5) and listen for change.",
  ],
  toast: [
    'Put <sakuga-toast></sakuga-toast> where toasts should appear, and call el.show("Saved").',
  ],
  tooltip: [
    'Use <sakuga-tooltip text="..." label="..."></sakuga-tooltip> next to the thing it explains.',
  ],
  "skills/sakuga-vfx": [
    "Built directly on window.SakugaFX Base class from skills/sakuga-vfx/starter.html.",
  ],
};

function GalleryCard({ item }: { item: GalleryItem }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [said, setSaid] = useState<string>("Ready — try interacting above");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cleanups: Array<() => void> = [];

    if (item.demoType === "primary-btn") {
      const btn = stage.querySelector("sakuga-button") as SakugaButtonElement | null;
      if (btn) {
        const onClick = () => {
          setSaid("Clicked → calling el.done() in 760ms (ドン!)");
          setTimeout(() => btn.done?.(), 760);
        };
        btn.addEventListener("click", onClick);
        cleanups.push(() => btn.removeEventListener("click", onClick));
      }
    } else if (item.demoType === "secondary-btn") {
      const btn = stage.querySelector("sakuga-button") as SakugaButtonElement | null;
      if (btn) {
        const onClick = () => setSaid("Clicked secondary button");
        btn.addEventListener("click", onClick);
        cleanups.push(() => btn.removeEventListener("click", onClick));
      }
    } else if (item.demoType === "toast") {
      const btn = stage.querySelector("sakuga-button") as SakugaButtonElement | null;
      const toast = stage.querySelector("sakuga-toast") as SakugaToastElement | null;
      if (btn && toast) {
        const onClick = () => {
          toast.show?.("Saved to Sakuga Studio!");
          setSaid('el.show("Saved to Sakuga Studio!") → ズザッ');
        };
        btn.addEventListener("click", onClick);
        cleanups.push(() => btn.removeEventListener("click", onClick));
      }
    } else if (item.demoType === "progress") {
      const prog = stage.querySelector("sakuga-progress") as SakugaProgressElement | null;
      if (prog) {
        const onDone = () => setSaid("Event: sakuga:done (100% impact burst + ドン!)");
        prog.addEventListener("sakuga:done", onDone);
        cleanups.push(() => prog.removeEventListener("sakuga:done", onDone));
      }
    } else if (item.demoType === "tabs") {
      const tabs = stage.querySelector("sakuga-tabs") as SakugaTabsElement | null;
      if (tabs) {
        const onChange = (e: Event) => {
          const detail = (e as CustomEvent).detail;
          setSaid(`Tab changed: ${detail?.label || detail?.value} (index ${detail?.index})`);
        };
        tabs.addEventListener("change", onChange);
        cleanups.push(() => tabs.removeEventListener("change", onChange));
      }
    } else if (item.demoType === "like") {
      const like = stage.querySelector("like-button");
      if (like) {
        const onChange = (e: Event) => {
          const liked = (e as CustomEvent).detail?.liked;
          setSaid(liked ? "Liked! Heart burst + hollow ポン" : "Unliked (quiet puff)");
        };
        like.addEventListener("change", onChange);
        cleanups.push(() => like.removeEventListener("change", onChange));
      }
    } else {
      const el = stage.querySelector(item.tag) as any;
      if (el) {
        const onEvent = (e: Event) => {
          const val =
            item.tag === "sakuga-toggle" || item.tag === "sakuga-checkbox"
              ? el.checked
                ? "on (true)"
                : "off (false)"
              : el.value;
          setSaid(`${e.type}: ${val}`);
        };
        el.addEventListener("change", onEvent);
        el.addEventListener("input", onEvent);
        cleanups.push(() => {
          el.removeEventListener("change", onEvent);
          el.removeEventListener("input", onEvent);
        });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [item]);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSaid(label);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
      setSaid(label);
    }
  };

  const buildPrompt = () => {
    const lines = WIRE_PROMPTS[item.id] || [];
    return [
      `Add the Sakuga ${item.name.toLowerCase()} (<${item.tag}>) to my React/Next.js app.`,
      `1. Load /sakuga-vfx/${item.id}.js with a plain script tag.`,
      ...lines.map((l, idx) => `${idx + 2}. ${l}`),
    ].join("\n");
  };

  return (
    <section className={`sk-card ${item.wide ? "md:col-span-2" : ""}`}>
      <h2 className="m-0 px-4 pt-3.5 text-[15px] font-bold">
        {item.name}
        <span className="ml-1.5 font-medium text-[#8580b0]">&lt;{item.tag}&gt;</span>
      </h2>
      <p className="m-0 mt-0.5 px-4 text-[13px] text-[#8580b0]">{item.how}</p>

      <div
        ref={stageRef}
        className="flex-1 grid place-items-center min-h-[220px] px-4 py-6"
      >
        {item.demoType === "primary-btn" && (
          <sakuga-button data-demo="primary">Confirm</sakuga-button>
        )}
        {item.demoType === "secondary-btn" && (
          <sakuga-button variant="secondary">Cancel</sakuga-button>
        )}
        {item.demoType === "toggle" && (
          <sakuga-toggle label="Notifications"></sakuga-toggle>
        )}
        {item.demoType === "slider" && (
          <sakuga-slider value="30" label="Volume"></sakuga-slider>
        )}
        {item.demoType === "checkbox" && (
          <sakuga-checkbox>Remember me</sakuga-checkbox>
        )}
        {item.demoType === "radio" && (
          <sakuga-radio label="Plan">
            <option value="a" selected>
              Option A
            </option>
            <option value="b">Option B</option>
          </sakuga-radio>
        )}
        {item.demoType === "input" && (
          <sakuga-input label="Text" placeholder="Type something"></sakuga-input>
        )}
        {item.demoType === "tabs" && (
          <sakuga-tabs label="Sections">
            <option value="home">Home</option>
            <option value="profile">Profile</option>
            <option value="settings">Settings</option>
          </sakuga-tabs>
        )}
        {item.demoType === "progress" && (
          <sakuga-progress demo label="Loading"></sakuga-progress>
        )}
        {item.demoType === "rating" && (
          <sakuga-rating label="Rating" value="4"></sakuga-rating>
        )}
        {item.demoType === "toast" && (
          <div className="relative grid justify-items-center gap-5">
            <sakuga-button variant="secondary">Save</sakuga-button>
            <sakuga-toast></sakuga-toast>
          </div>
        )}
        {item.demoType === "tooltip" && (
          <sakuga-tooltip text="Helpful hint! React + Sakuga VFX + PostgreSQL"></sakuga-tooltip>
        )}
        {item.demoType === "like" && <like-button></like-button>}
      </div>

      <p
        className="min-h-[1.5em] m-0 px-4 text-center text-[13px] font-medium text-[#7c5cff]"
        aria-live="polite"
      >
        {said}
      </p>

      <div className="flex flex-wrap gap-1.5 px-4 py-3 border-t-[1.5px] border-[#dcdaf0] mt-2.5">
        {item.id !== "skills/sakuga-vfx" && (
          <a
            className="sk-pill !h-[30px] !text-[12.5px]"
            href={`/sakuga-vfx/${item.id}/index.html`}
            target="_blank"
            rel="noopener"
          >
            Docs &amp; demo &#8599;
          </a>
        )}
        <button
          type="button"
          className="sk-pill !h-[30px] !text-[12.5px]"
          onClick={() =>
            copyText(
              item.id === "skills/sakuga-vfx"
                ? `npx skills add ${REPO}`
                : `npx shadcn add ${REPO}/${item.id}`,
              "Install command copied!"
            )
          }
        >
          Copy install
        </button>
        <button
          type="button"
          className="sk-pill !h-[30px] !text-[12.5px]"
          onClick={() => copyText(buildPrompt(), "Agent prompt copied!")}
        >
          Copy a prompt for your agent
        </button>
      </div>
    </section>
  );
}

function MissionRowCard({
  mission,
  isEditing,
  onEdit,
  onToggleComplete,
  onToggleFx,
  onLike,
  onDelete,
}: {
  mission: SakugaMission;
  isEditing: boolean;
  onEdit: (mission: SakugaMission) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onToggleFx: (id: number, fx_enabled: boolean) => void;
  onLike: (id: number, delta: number) => void;
  onDelete: (id: number) => void;
}) {
  const checkboxRef = useRef<SakugaCheckboxElement>(null);
  const toggleRef = useRef<SakugaToggleElement>(null);
  const likeRef = useRef<HTMLElement>(null);
  const deleteBtnRef = useRef<SakugaButtonElement>(null);

  useEffect(() => {
    const cb = checkboxRef.current;
    if (cb) {
      cb.checked = mission.completed;
      const handleCb = () => onToggleComplete(mission.id, Boolean(cb.checked));
      cb.addEventListener("change", handleCb);
      return () => cb.removeEventListener("change", handleCb);
    }
  }, [mission.id, mission.completed, onToggleComplete]);

  useEffect(() => {
    const tg = toggleRef.current;
    if (tg) {
      tg.checked = mission.fx_enabled;
      const handleTg = () => onToggleFx(mission.id, Boolean(tg.checked));
      tg.addEventListener("change", handleTg);
      return () => tg.removeEventListener("change", handleTg);
    }
  }, [mission.id, mission.fx_enabled, onToggleFx]);

  useEffect(() => {
    const lk = likeRef.current;
    if (lk) {
      const handleLike = (e: Event) => {
        const liked = (e as CustomEvent).detail?.liked ?? true;
        onLike(mission.id, liked ? 1 : -1);
      };
      lk.addEventListener("change", handleLike);
      return () => lk.removeEventListener("change", handleLike);
    }
  }, [mission.id, onLike]);

  useEffect(() => {
    const del = deleteBtnRef.current;
    if (del) {
      const handleDel = () => onDelete(mission.id);
      del.addEventListener("click", handleDel);
      return () => del.removeEventListener("click", handleDel);
    }
  }, [mission.id, onDelete]);

  return (
    <div
      className={`sk-card p-4 transition-all ${
        isEditing
          ? "ring-2 ring-[#ff5fa8] bg-[#fff9fc]"
          : mission.completed
          ? "bg-[#faf9ff] border-[#cbc6ee]"
          : "bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-[220px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f4f3fc] text-[#1d1a4a] border border-[#dcdaf0]">
              #{mission.id} · {mission.category.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fff0f7] text-[#ff5fa8] border border-[#ffc2df]">
              {mission.sfx_tag}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f4f3fc] text-[#7c5cff]">
              PIC: {mission.assignee}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f4f3fc] text-[#1d1a4a]">
              Power: {mission.priority_power}%
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff9e6] text-[#d97706]">
              {"★".repeat(mission.rating)}
              {"☆".repeat(Math.max(0, 5 - mission.rating))}
            </span>
          </div>

          <h3
            className={`text-base font-bold m-0 ${
              mission.completed ? "line-through text-[#8580b0]" : "text-[#1d1a4a]"
            }`}
          >
            {mission.title}
          </h3>

          {mission.notes && (
            <p className="m-0 text-xs text-[#8580b0]">{mission.notes}</p>
          )}

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <sakuga-checkbox ref={checkboxRef}>
              {mission.completed ? "Cut Done (Synced)" : "Mark Cut as Done"}
            </sakuga-checkbox>
            <button
              type="button"
              onClick={() => onEdit(mission)}
              className="sk-pill !h-[28px] !text-xs !border-[#7c5cff] !text-[#7c5cff]"
            >
              ✎ Edit (Modal)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-[#8580b0] mb-1">
              VFX Canvas
            </span>
            <sakuga-toggle
              ref={toggleRef}
              label={`VFX layer for ${mission.title}`}
            ></sakuga-toggle>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-[#8580b0] mb-1">
              Kudos ({mission.likes})
            </span>
            <like-button ref={likeRef}></like-button>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold text-[#8580b0] mb-1">
              Action
            </span>
            <sakuga-button ref={deleteBtnRef} variant="secondary">
              Delete
            </sakuga-button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SakugaApp({
  initialHealth,
  initialMissions,
  initialUsers = [],
  initialUser = null,
}: {
  initialHealth: DbHealth;
  initialMissions: SakugaMission[];
  initialUsers?: SakugaUser[];
  initialUser?: SakugaUser | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("studio");
  const [health, setHealth] = useState<DbHealth>(initialHealth);
  const [missions, setMissions] = useState<SakugaMission[]>(initialMissions);
  const [users, setUsers] = useState<SakugaUser[]>(initialUsers);

  // Auth State
  const [currentUser, setCurrentUser] = useState<SakugaUser | null>(initialUser);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("admin");
  const [authPassword, setAuthPassword] = useState("admin123");
  const [authFullName, setAuthFullName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authRole, setAuthRole] = useState("Key Animator");
  const [authRemember, setAuthRemember] = useState(true);
  const [authError, setAuthError] = useState("");

  // Table & Filter State
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // CRUD Input Form Modal State
  const [crudModalOpen, setCrudModalOpen] = useState<boolean>(false);
  const [editingMission, setEditingMission] = useState<SakugaMission | null>(null);
  const [statusLog, setStatusLog] = useState<string>(
    "Ready — connected to PostgreSQL container (postgres15 → sakuga_db)"
  );

  // Refs to Sakuga custom elements
  const authUserRef = useRef<SakugaInputElement>(null);
  const authPassRef = useRef<SakugaInputElement>(null);
  const authNameRef = useRef<SakugaInputElement>(null);
  const authEmailRef = useRef<SakugaInputElement>(null);
  const authRememberRef = useRef<SakugaCheckboxElement>(null);
  const authSubmitBtnRef = useRef<SakugaButtonElement>(null);

  const newCutBtnRef = useRef<SakugaButtonElement>(null);
  const reseedBtnRef = useRef<SakugaButtonElement>(null);
  const toastRef = useRef<SakugaToastElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wire Auth Form <sakuga-*> controls
  useEffect(() => {
    if (!mounted || !showAuthModal) return;
    const cleanups: Array<() => void> = [];

    const uInp = authUserRef.current;
    if (uInp) {
      uInp.value = authUsername;
      const onU = () => setAuthUsername(uInp.value || "");
      uInp.addEventListener("input", onU);
      uInp.addEventListener("change", onU);
      cleanups.push(() => {
        uInp.removeEventListener("input", onU);
        uInp.removeEventListener("change", onU);
      });
    }

    const pInp = authPassRef.current;
    if (pInp) {
      pInp.value = authPassword;
      const onP = () => setAuthPassword(pInp.value || "");
      pInp.addEventListener("input", onP);
      pInp.addEventListener("change", onP);
      cleanups.push(() => {
        pInp.removeEventListener("input", onP);
        pInp.removeEventListener("change", onP);
      });
    }

    const nInp = authNameRef.current;
    if (nInp) {
      nInp.value = authFullName;
      const onN = () => setAuthFullName(nInp.value || "");
      nInp.addEventListener("input", onN);
      nInp.addEventListener("change", onN);
      cleanups.push(() => {
        nInp.removeEventListener("input", onN);
        nInp.removeEventListener("change", onN);
      });
    }

    const eInp = authEmailRef.current;
    if (eInp) {
      eInp.value = authEmail;
      const onE = () => setAuthEmail(eInp.value || "");
      eInp.addEventListener("input", onE);
      eInp.addEventListener("change", onE);
      cleanups.push(() => {
        eInp.removeEventListener("input", onE);
        eInp.removeEventListener("change", onE);
      });
    }

    const rem = authRememberRef.current;
    if (rem) {
      rem.checked = authRemember;
      const onR = () => setAuthRemember(Boolean(rem.checked));
      rem.addEventListener("change", onR);
      cleanups.push(() => rem.removeEventListener("change", onR));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [mounted, showAuthModal, authMode]);

  const handleAuthSubmit = async () => {
    setAuthError("");
    const usernameVal = (authUserRef.current?.value ?? authUsername).trim();
    const passwordVal = authPassRef.current?.value ?? authPassword;
    const fullNameVal = (authNameRef.current?.value ?? authFullName).trim();
    const emailVal = (authEmailRef.current?.value ?? authEmail).trim();

    if (!usernameVal || !passwordVal) {
      setAuthError("Username dan password wajib diisi!");
      toastRef.current?.show?.("Isi username & password!");
      return;
    }

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameVal,
          password: passwordVal,
          full_name: fullNameVal || usernameVal,
          email: emailVal || `${usernameVal}@sakuga.local`,
          role: authRole,
          remember: authRememberRef.current?.checked ?? authRemember,
        }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        authSubmitBtnRef.current?.done?.();
        setCurrentUser(data.user);
        toastRef.current?.show?.(`Welcome, ${data.user.full_name}! (ドン!)`);
        setStatusLog(
          `AUTH SUCCESS: Logged in as ${data.user.username} (${data.user.role})`
        );
        refreshHealth();
        setTimeout(() => setShowAuthModal(false), 550);
      } else {
        setAuthError(data.error || "Autentikasi gagal");
        toastRef.current?.show?.(data.error || "Login gagal");
      }
    } catch (err: any) {
      setAuthError(err?.message || "Network error");
    }
  };

  useEffect(() => {
    if (!mounted || !showAuthModal) return;
    const btn = authSubmitBtnRef.current;
    if (!btn) return;
    const onClick = () => handleAuthSubmit();
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  });

  const fillDemoAccount = (u: string, p: string) => {
    setAuthMode("login");
    setAuthUsername(u);
    setAuthPassword(p);
    setAuthError("");
    if (authUserRef.current) authUserRef.current.value = u;
    if (authPassRef.current) authPassRef.current.value = p;
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toastRef.current?.show?.("Logged out — mengarahkan ke halaman Login...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 350);
  };

  const openCreateModal = () => {
    setEditingMission(null);
    setCrudModalOpen(true);
    setStatusLog("MODAL CREATE: Input data cut baru ke PostgreSQL");
  };

  const openEditModal = (mission: SakugaMission) => {
    setEditingMission(mission);
    setCrudModalOpen(true);
    setStatusLog(`MODAL EDIT: Memuat Cut #${mission.id} (${mission.title})`);
  };

  const refreshHealth = async () => {
    try {
      const [hRes, uRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/auth/me"),
      ]);
      const hData = await hRes.json();
      setHealth(hData);
      const uData = await uRes.json();
      if (uData.users) setUsers(uData.users);
    } catch {
      // ignore
    }
  };

  const handleSaveFromModal = async (values: CrudFormValues): Promise<boolean> => {
    if (!values.title) {
      toastRef.current?.show?.("Isi judul Cut / VFX terlebih dahulu!");
      setStatusLog("Validation: judul cut masih kosong");
      return false;
    }

    if (editingMission) {
      setStatusLog(`Updating Cut #${editingMission.id} in PostgreSQL...`);
      try {
        const res = await fetch(`/api/missions/${editingMission.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (data.ok && data.mission) {
          toastRef.current?.show?.(`Cut #${editingMission.id} berhasil di-update!`);
          setMissions((prev) =>
            prev.map((m) => (m.id === editingMission.id ? data.mission : m))
          );
          setStatusLog(`UPDATE sakuga_missions WHERE id=${editingMission.id} → SUCCESS`);
          refreshHealth();
          return true;
        }
        toastRef.current?.show?.(data.error || "Gagal update data");
        return false;
      } catch (err: any) {
        toastRef.current?.show?.("Database error: " + (err?.message || "Unknown"));
        return false;
      }
    }

    setStatusLog("Saving new cut to PostgreSQL (postgres15/sakuga_db)...");
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.ok && data.mission) {
        toastRef.current?.show?.(`Saved #${data.mission.id} to PostgreSQL!`);
        setMissions((prev) => [data.mission, ...prev]);
        setStatusLog(
          `INSERT INTO sakuga_missions → ID #${data.mission.id} (${data.mission.sfx_tag})`
        );
        refreshHealth();
        return true;
      }
      toastRef.current?.show?.(data.error || "Gagal menyimpan ke database");
      return false;
    } catch (err: any) {
      toastRef.current?.show?.("Database error: " + (err?.message || "Unknown"));
      return false;
    }
  };

  // Wire "+ Input Cut Baru (Modal)" and "Reset Seed" buttons in Table Toolbar
  useEffect(() => {
    if (!mounted || activeTab !== "studio") return;
    const btn = newCutBtnRef.current;
    if (!btn) return;
    const onClick = () => openCreateModal();
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  });

  useEffect(() => {
    if (!mounted || activeTab !== "studio") return;
    const btn = reseedBtnRef.current;
    if (!btn) return;
    const onClick = async () => {
      const res = await fetch("/api/health", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        btn.done?.();
        setMissions(data.missions || []);
        setHealth(data.health || health);
        if (data.users) setUsers(data.users);
        setEditingMission(null);
        toastRef.current?.show?.("Database di-reset ke 4 seed awal!");
        setStatusLog("TRUNCATE & RESEED sakuga_missions selesai.");
      }
    };
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  });

  const handleToggleComplete = async (id: number, nextCompleted: boolean) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: nextCompleted } : m))
    );
    const res = await fetch(`/api/missions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: nextCompleted }),
    });
    const data = await res.json();
    if (data.ok) {
      toastRef.current?.show?.(
        nextCompleted ? `Cut #${id} selesai! (ズザッ)` : `Cut #${id} dibuka kembali`
      );
      setStatusLog(`UPDATE sakuga_missions SET completed=${nextCompleted} WHERE id=${id}`);
      refreshHealth();
    }
  };

  const handleToggleFx = async (id: number, nextFx: boolean) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, fx_enabled: nextFx } : m))
    );
    const res = await fetch(`/api/missions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fx_enabled: nextFx }),
    });
    const data = await res.json();
    if (data.ok) {
      toastRef.current?.show?.(
        `VFX Cut #${id}: ${nextFx ? "ON (Active)" : "OFF"}`
      );
      setStatusLog(`UPDATE sakuga_missions SET fx_enabled=${nextFx} WHERE id=${id}`);
    }
  };

  const handleQuickRating = async (id: number, nextRating: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, rating: nextRating } : m))
    );
    const res = await fetch(`/api/missions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: nextRating }),
    });
    const data = await res.json();
    if (data.ok) {
      toastRef.current?.show?.(`Rating Cut #${id} diubah ke ${nextRating}★`);
      setStatusLog(`UPDATE sakuga_missions SET rating=${nextRating} WHERE id=${id}`);
    }
  };

  const handleLike = async (id: number, delta: number) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, likes: Math.max(0, m.likes + delta) } : m
      )
    );
    const res = await fetch(`/api/missions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likeDelta: delta }),
    });
    const data = await res.json();
    if (data.ok && data.mission) {
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? data.mission : m))
      );
      setStatusLog(`UPDATE sakuga_missions SET likes=${data.mission.likes} WHERE id=${id}`);
      refreshHealth();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/missions/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      setMissions((prev) => prev.filter((m) => m.id !== id));
      if (editingMission?.id === id) {
        setEditingMission(null);
        setCrudModalOpen(false);
      }
      toastRef.current?.show?.(`Cut #${id} dihapus dari PostgreSQL`);
      setStatusLog(`DELETE FROM sakuga_missions WHERE id=${id}`);
      refreshHealth();
    }
  };

  const filteredMissions = missions.filter((m) => {
    if (filterCategory !== "all" && m.category !== filterCategory) return false;
    if (filterStatus === "done" && !m.completed) return false;
    if (filterStatus === "pending" && m.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchAssignee = (m.assignee || "").toLowerCase().includes(q);
      const matchNotes = (m.notes || "").toLowerCase().includes(q);
      const matchCat = m.category.toLowerCase().includes(q);
      if (!matchTitle && !matchAssignee && !matchNotes && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Global Toast Container (<sakuga-toast>) */}
      {mounted && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <sakuga-toast ref={toastRef}></sakuga-toast>
        </div>
      )}

      {/* MODAL INPUT FORM CRUD (<SakugaCrudModal />) */}
      {mounted && (
        <SakugaCrudModal
          open={crudModalOpen}
          editingMission={editingMission}
          defaultAssignee={currentUser?.full_name || "Taris (Key Director)"}
          statusLog={statusLog}
          onClose={() => setCrudModalOpen(false)}
          onSave={handleSaveFromModal}
        />
      )}

      {/* 1. FIXED MODULAR SIDEBAR SECTION */}
      <SakugaSidebar
        open={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        filterCategory={filterCategory}
        onSelectCategory={setFilterCategory}
        missions={missions}
        usersCount={users.length || health.user_count || 2}
        currentUser={currentUser}
        onNewCutClick={openCreateModal}
      />

      {/* Right Workspace Column with dynamic left padding matching Fixed Sidebar width (270px) */}
      <div
        className={`min-h-screen flex flex-col min-w-0 transition-[padding] duration-200 ease-in-out ${
          sidebarOpen ? "lg:pl-[270px]" : "lg:pl-0"
        }`}
      >
        {/* 2. MODULAR HEADER SECTION */}
        <SakugaHeader
          mounted={mounted}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          health={health}
          missionsCount={missions.length}
          usersCount={users.length || health.user_count || 2}
          currentUser={currentUser}
          onToggleAuthModal={() => setShowAuthModal((v) => !v)}
          onLogout={handleLogout}
        />

        {/* 3. MODULAR MAIN CONTENT SECTION */}
        <SakugaMain
          activeTab={activeTab}
          health={health}
          missions={missions}
          currentUser={currentUser}
        >
          {/* Optional Account Switch / Register Responsive Modal with Scrollable Body */}
          {mounted && showAuthModal && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Account Authentication Modal"
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
            >
              <div
                onClick={() => setShowAuthModal(false)}
                aria-hidden="true"
                className="fixed inset-0 bg-[#1d1a4a]/50 backdrop-blur-[3px]"
              />

              <section className="relative z-10 flex flex-col w-full sm:max-w-lg md:max-w-2xl max-h-[92dvh] sm:max-h-[86dvh] bg-white border-t-2 sm:border-2 border-[#1d1a4a] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Fixed Header */}
                <header className="shrink-0 flex flex-wrap items-start justify-between gap-3 px-5 sm:px-6 py-4 bg-white border-b-[1.5px] border-[#dcdaf0]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold bg-[#fff0f7] text-[#ff5fa8] border border-[#ffc2df] mb-1">
                      🔐 PostgreSQL Authentication (<code>sakuga_users</code>)
                    </div>
                    <h2 className="m-0 text-lg sm:text-xl font-extrabold text-[#1d1a4a]">
                      {authMode === "login"
                        ? "Ganti Akun / Login Studio"
                        : "Registrasi Animator Baru di PostgreSQL"}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setAuthError("");
                      }}
                      className={`sk-pill !h-[30px] !text-xs ${
                        authMode === "login"
                          ? "!bg-[#1d1a4a] !text-white !border-[#1d1a4a]"
                          : ""
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setAuthError("");
                      }}
                      className={`sk-pill !h-[30px] !text-xs ${
                        authMode === "register"
                          ? "!bg-[#7c5cff] !text-white !border-[#7c5cff]"
                          : ""
                      }`}
                    >
                      + Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(false)}
                      className="sk-pill !h-[30px] !text-xs"
                    >
                      ✕ Tutup
                    </button>
                  </div>
                </header>

                {/* Scrollable Body */}
                <div className="sk-modal-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1d1a4a] mb-1">
                        Username / Email (<code>&lt;sakuga-input&gt;</code>)
                      </label>
                      <div
                        style={
                          { "--sk-input-width": "100%" } as React.CSSProperties
                        }
                      >
                        <sakuga-input
                          ref={authUserRef}
                          label="Username"
                          placeholder="admin atau animator"
                        ></sakuga-input>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1d1a4a] mb-1">
                        Password (
                        <code>&lt;sakuga-input type=&quot;password&quot;&gt;</code>)
                      </label>
                      <div
                        style={
                          { "--sk-input-width": "100%" } as React.CSSProperties
                        }
                      >
                        <sakuga-input
                          ref={authPassRef}
                          type="password"
                          label="Password"
                          placeholder="••••••••"
                        ></sakuga-input>
                      </div>
                    </div>
                  </div>

                  {authMode === "register" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#dcdaf0]">
                      <div>
                        <label className="block text-xs font-bold text-[#1d1a4a] mb-1">
                          Nama Lengkap Animator
                        </label>
                        <div
                          style={
                            { "--sk-input-width": "100%" } as React.CSSProperties
                          }
                        >
                          <sakuga-input
                            ref={authNameRef}
                            label="Full Name"
                            placeholder="Misal: Kenji Animator"
                          ></sakuga-input>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1d1a4a] mb-1">
                          Email Studio
                        </label>
                        <div
                          style={
                            { "--sk-input-width": "100%" } as React.CSSProperties
                          }
                        >
                          <sakuga-input
                            ref={authEmailRef}
                            type="email"
                            label="Email"
                            placeholder="kenji@sakuga.local"
                          ></sakuga-input>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1d1a4a] mb-1">
                          Role / Jabatan
                        </label>
                        <select
                          value={authRole}
                          onChange={(e) => setAuthRole(e.target.value)}
                          className="w-full h-[42px] px-3 rounded-xl border-[1.5px] border-[#1d1a4a] bg-white text-sm font-semibold text-[#1d1a4a]"
                        >
                          <option value="Studio Director">Studio Director</option>
                          <option value="Lead Animator">Lead Animator</option>
                          <option value="Key Animator">Key Animator</option>
                          <option value="VFX Compositor">VFX Compositor</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {authError && (
                    <div className="px-3.5 py-2 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-xs font-bold text-[#b91c1c]">
                      ⚠ {authError}
                    </div>
                  )}

                  <div className="rounded-2xl bg-[#faf9ff] p-4 border-[1.5px] border-[#dcdaf0] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#1d1a4a]">
                        ⚡ Akun Demo PostgreSQL Siap Pakai
                      </span>
                      <span className="text-[11px] text-[#7c5cff] font-semibold">
                        Klik untuk isi otomatis
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => fillDemoAccount("admin", "admin123")}
                        className="text-left p-3 rounded-xl border border-[#dcdaf0] hover:border-[#1d1a4a] bg-white transition-all cursor-pointer"
                      >
                        <div className="text-xs font-extrabold text-[#1d1a4a]">
                          1. Studio Director
                        </div>
                        <div className="text-xs font-mono text-[#7c5cff] mt-0.5">
                          user: <strong>admin</strong> · pass:{" "}
                          <strong>admin123</strong>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => fillDemoAccount("animator", "sakuga123")}
                        className="text-left p-3 rounded-xl border border-[#dcdaf0] hover:border-[#1d1a4a] bg-white transition-all cursor-pointer"
                      >
                        <div className="text-xs font-extrabold text-[#1d1a4a]">
                          2. Lead Animator
                        </div>
                        <div className="text-xs font-mono text-[#7c5cff] mt-0.5">
                          user: <strong>animator</strong> · pass:{" "}
                          <strong>sakuga123</strong>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <footer className="shrink-0 flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-3.5 bg-[#faf9ff] border-t-[1.5px] border-[#dcdaf0]">
                  <sakuga-checkbox ref={authRememberRef}>
                    Ingat sesi login (30 hari)
                  </sakuga-checkbox>

                  <sakuga-button ref={authSubmitBtnRef}>
                    {authMode === "login"
                      ? "Sign In (ドン!)"
                      : "Register & Login"}
                  </sakuga-button>
                </footer>
              </section>
            </div>
          )}

          {/* SECTION A: FULL-WIDTH DATA TABLE + MODAL CRUD TRIGGER */}
          {activeTab === "studio" && (
            <section className="space-y-4">
              {/* Table Toolbar with Modal Input Trigger */}
              <div className="sk-card p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-base font-extrabold">
                      Tabel Data Produksi (<code>postgres15 → sakuga_missions</code>)
                    </h2>
                    <p className="m-0 text-xs text-[#8580b0]">
                      Klik <strong>+ Input Cut Baru</strong> atau tombol{" "}
                      <strong>✎ Edit</strong> pada baris tabel untuk membuka{" "}
                      <strong>Modal Form CRUD Sakuga VFX</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {mounted && (
                      <>
                        <sakuga-button ref={newCutBtnRef}>
                          + Input Cut Baru (Modal)
                        </sakuga-button>
                        <sakuga-button ref={reseedBtnRef} variant="secondary">
                          Reset Seed
                        </sakuga-button>
                      </>
                    )}

                    <div className="inline-flex rounded-full p-0.5 bg-[#f4f3fc] border border-[#dcdaf0]">
                      <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          viewMode === "table"
                            ? "bg-[#1d1a4a] text-white"
                            : "text-[#8580b0] hover:text-[#1d1a4a]"
                        }`}
                      >
                        ▤ Tabel
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("cards")}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          viewMode === "cards"
                            ? "bg-[#1d1a4a] text-white"
                            : "text-[#8580b0] hover:text-[#1d1a4a]"
                        }`}
                      >
                        ❖ Kartu
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#dcdaf0]">
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="🔍 Cari judul cut, animator PIC, atau catatan..."
                      className="w-full h-[34px] px-3 rounded-full border-[1.5px] border-[#dcdaf0] focus:border-[#1d1a4a] text-xs font-medium bg-[#faf9ff]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {["all", "vfx", "keyframe", "compositing"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFilterCategory(cat)}
                        className={`sk-pill !h-[28px] !text-xs ${
                          filterCategory === cat
                            ? "!border-[#1d1a4a] !bg-[#1d1a4a] !text-white"
                            : ""
                        }`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    {(
                      [
                        { id: "all", label: "Semua" },
                        { id: "done", label: "✓ Selesai" },
                        { id: "pending", label: "⏳ Proses" },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setFilterStatus(st.id)}
                        className={`sk-pill !h-[28px] !text-xs ${
                          filterStatus === st.id
                            ? "!border-[#7c5cff] !bg-[#7c5cff] !text-white"
                            : ""
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full-Width Interactive Data Table */}
              {viewMode === "table" && (
                <div className="sk-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-[#f4f3fc] border-b-[1.5px] border-[#dcdaf0] text-[#1d1a4a] uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-3 font-extrabold">ID</th>
                          <th className="py-3 px-3 font-extrabold">Status</th>
                          <th className="py-3 px-3 font-extrabold min-w-[240px]">
                            Judul Cut &amp; Catatan
                          </th>
                          <th className="py-3 px-3 font-extrabold">
                            Kategori / SFX
                          </th>
                          <th className="py-3 px-3 font-extrabold">
                            Animator (PIC)
                          </th>
                          <th className="py-3 px-3 font-extrabold">
                            Power &amp; Rating
                          </th>
                          <th className="py-3 px-3 font-extrabold text-center">
                            VFX
                          </th>
                          <th className="py-3 px-3 font-extrabold text-center">
                            Kudos
                          </th>
                          <th className="py-3 px-3 font-extrabold text-right min-w-[145px]">
                            Aksi CRUD
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dcdaf0]">
                        {filteredMissions.length === 0 ? (
                          <tr>
                            <td
                              colSpan={9}
                              className="py-10 px-4 text-center text-sm text-[#8580b0]"
                            >
                              Tidak ada data cut yang cocok dengan filter pencarian.
                            </td>
                          </tr>
                        ) : (
                          filteredMissions.map((m) => {
                            const isRowEditing =
                              crudModalOpen && editingMission?.id === m.id;
                            return (
                              <tr
                                key={m.id}
                                className={`transition-colors ${
                                  isRowEditing
                                    ? "bg-[#fff0f7]"
                                    : m.completed
                                    ? "bg-[#faf9ff] hover:bg-[#f3f1fc]"
                                    : "bg-white hover:bg-[#faf9ff]"
                                }`}
                              >
                                <td className="py-3 px-3 font-mono font-bold text-[#7c5cff]">
                                  #{m.id}
                                </td>

                                <td className="py-3 px-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleComplete(m.id, !m.completed)
                                    }
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border transition-all ${
                                      m.completed
                                        ? "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]"
                                        : "bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
                                    }`}
                                  >
                                    {m.completed ? "✓ Selesai" : "⏳ Proses"}
                                  </button>
                                </td>

                                <td className="py-3 px-3">
                                  <div
                                    className={`font-bold text-[13px] ${
                                      m.completed
                                        ? "line-through text-[#8580b0]"
                                        : "text-[#1d1a4a]"
                                    }`}
                                  >
                                    {m.title}
                                  </div>
                                  {m.notes && (
                                    <div className="text-[11.5px] text-[#8580b0] mt-0.5">
                                      {m.notes}
                                    </div>
                                  )}
                                </td>

                                <td className="py-3 px-3">
                                  <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#f4f3fc] text-[#1d1a4a] border border-[#dcdaf0] uppercase">
                                    {m.category}
                                  </div>
                                  <div className="text-[11px] font-bold text-[#ff5fa8] mt-1">
                                    {m.sfx_tag}
                                  </div>
                                </td>

                                <td className="py-3 px-3 font-semibold text-[#1d1a4a]">
                                  {m.assignee || "Taris (Key Director)"}
                                </td>

                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-16 h-2 rounded-full bg-[#dcdaf0] overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-[#7c5cff] to-[#ff5fa8]"
                                        style={{
                                          width: `${m.priority_power}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="font-bold text-[#1d1a4a]">
                                      {m.priority_power}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                          handleQuickRating(m.id, star)
                                        }
                                        className={`bg-transparent border-0 p-0 text-sm cursor-pointer leading-none ${
                                          star <= m.rating
                                            ? "text-[#f59e0b]"
                                            : "text-[#dcdaf0]"
                                        }`}
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </td>

                                <td className="py-3 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleFx(m.id, !m.fx_enabled)
                                    }
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer border ${
                                      m.fx_enabled
                                        ? "bg-[#f4f3fc] text-[#7c5cff] border-[#7c5cff]"
                                        : "bg-gray-100 text-gray-500 border-gray-300"
                                    }`}
                                  >
                                    {m.fx_enabled ? "ON" : "OFF"}
                                  </button>
                                </td>

                                <td className="py-3 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleLike(m.id, 1)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fff0f7] text-[#ff5fa8] border border-[#ffc2df] hover:bg-[#ffe0ef] cursor-pointer"
                                  >
                                    ♥ {m.likes}
                                  </button>
                                </td>

                                <td className="py-3 px-3 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(m)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                                        isRowEditing
                                          ? "bg-[#ff5fa8] text-white border-[#ff5fa8]"
                                          : "bg-white text-[#1d1a4a] border-[#dcdaf0] hover:border-[#1d1a4a]"
                                      }`}
                                    >
                                      ✎ Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(m.id)}
                                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] hover:bg-[#fee2e2] cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      <tfoot className="bg-[#faf9ff] border-t-[1.5px] border-[#dcdaf0] text-[11.5px] text-[#8580b0]">
                        <tr>
                          <td colSpan={9} className="py-2.5 px-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span>
                                Menampilkan{" "}
                                <strong className="text-[#1d1a4a]">
                                  {filteredMissions.length}
                                </strong>{" "}
                                dari{" "}
                                <strong className="text-[#1d1a4a]">
                                  {missions.length}
                                </strong>{" "}
                                baris di tabel <code>sakuga_missions</code> ·{" "}
                                <span className="font-mono text-[#7c5cff]">
                                  {statusLog}
                                </span>
                              </span>
                              <span>
                                Rata-rata Power:{" "}
                                <strong className="text-[#7c5cff]">
                                  {filteredMissions.length
                                    ? Math.round(
                                        filteredMissions.reduce(
                                          (a, b) => a + b.priority_power,
                                          0
                                        ) / filteredMissions.length
                                      )
                                    : 0}
                                  %
                                </strong>{" "}
                                · Selesai:{" "}
                                <strong className="text-[#047857]">
                                  {
                                    filteredMissions.filter((m) => m.completed)
                                      .length
                                  }
                                </strong>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {viewMode === "cards" &&
                (mounted && filteredMissions.length === 0 ? (
                  <div className="sk-card p-10 text-center text-[#8580b0]">
                    Belum ada data cut pada kategori ini. Klik{" "}
                    <strong>+ Input Cut Baru (Modal)</strong> di atas.
                  </div>
                ) : (
                  mounted && (
                    <div className="space-y-3">
                      {filteredMissions.map((mission) => (
                        <MissionRowCard
                          key={mission.id}
                          mission={mission}
                          isEditing={
                            crudModalOpen && editingMission?.id === mission.id
                          }
                          onEdit={openEditModal}
                          onToggleComplete={handleToggleComplete}
                          onToggleFx={handleToggleFx}
                          onLike={handleLike}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )
                ))}
            </section>
          )}

          {/* SECTION B: THE TWELVE GALLERY */}
          {activeTab === "gallery" && mounted && (
            <div>
              <div className="sk-card p-4 mb-5 bg-[#faf9ff]">
                <p className="m-0 text-sm text-[#1d1a4a]">
                  <strong>The Twelve Sakuga VFX Controls</strong> — Semua komponen
                  asli dari template{" "}
                  <a
                    href="https://github.com/finktheartist/sakuga-vfx.git"
                    target="_blank"
                    rel="noopener"
                    className="underline font-bold text-[#7c5cff]"
                  >
                    finktheartist/sakuga-vfx
                  </a>{" "}
                  berjalan di atas satu shared canvas (<code>window.SakugaFX</code>) di
                  dalam container React ini.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px] grid-flow-dense">
                {GALLERY_ITEMS.map((it) => (
                  <GalleryCard key={it.key} item={it} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION C: DATABASE & USERS TABLE INSPECTOR */}
          {activeTab === "database" && (
            <div className="space-y-5">
              <div className="sk-card p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-lg font-extrabold">
                      Tabel Akun Animator (<code>postgres15 → sakuga_users</code>)
                    </h2>
                    <p className="m-0 text-xs text-[#8580b0]">
                      Daftar akun yang dapat login ke Sakuga VFX Studio
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuthModal(true);
                    }}
                    className="sk-pill !text-xs !border-[#7c5cff] !text-[#7c5cff]"
                  >
                    + Tambah User Baru
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-[#f4f3fc] border-b border-[#dcdaf0] text-[#1d1a4a] uppercase text-[11px]">
                        <th className="py-2.5 px-3 font-extrabold">ID</th>
                        <th className="py-2.5 px-3 font-extrabold">Username</th>
                        <th className="py-2.5 px-3 font-extrabold">Nama Lengkap</th>
                        <th className="py-2.5 px-3 font-extrabold">Email</th>
                        <th className="py-2.5 px-3 font-extrabold">Role</th>
                        <th className="py-2.5 px-3 font-extrabold">Terdaftar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dcdaf0]">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#faf9ff]">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#7c5cff]">
                            #{u.id}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#1d1a4a]">
                            {u.username}
                          </td>
                          <td className="py-2.5 px-3 font-semibold">{u.full_name}</td>
                          <td className="py-2.5 px-3 text-[#8580b0]">{u.email}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#f4f3fc] text-[#7c5cff] font-bold text-[11px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#8580b0]">
                            {new Date(u.created_at).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="sk-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-lg font-extrabold">
                      PostgreSQL Container Connection (<code>postgres15</code>)
                    </h2>
                    <p className="m-0 text-xs text-[#8580b0]">
                      Terhubung melalui Docker network <code>docker-infra_default</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={refreshHealth}
                    className="sk-pill"
                  >
                    Refresh Status
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-[#f4f3fc] p-4 border border-[#dcdaf0] space-y-1.5">
                    <div>
                      <span className="text-[#8580b0]">Container Host:</span>{" "}
                      <strong>{health.host || "postgres15"}</strong>
                    </div>
                    <div>
                      <span className="text-[#8580b0]">Database Name:</span>{" "}
                      <strong>{health.database || "sakuga_db"}</strong>
                    </div>
                    <div>
                      <span className="text-[#8580b0]">User:</span>{" "}
                      <strong>{health.user || "postgres"}</strong>
                    </div>
                    <div>
                      <span className="text-[#8580b0]">Server IP / Port:</span>{" "}
                      <strong>
                        {health.server_ip || "172.18.0.4"}:
                        {health.server_port || 5432}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#8580b0]">Query Latency:</span>{" "}
                      <strong>{health.latencyMs ?? 1} ms</strong>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f4f3fc] p-4 border border-[#dcdaf0] space-y-1.5">
                    <div>
                      <span className="text-[#8580b0]">PostgreSQL Version:</span>
                      <div className="font-mono text-xs mt-1 text-[#1d1a4a] break-all">
                        {health.version}
                      </div>
                    </div>
                    <div className="pt-1">
                      <span className="text-[#8580b0]">Server Timestamp:</span>{" "}
                      <strong className="font-mono text-xs">
                        {health.server_time}
                      </strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-2">
                    Live Rows in <code>sakuga_missions</code> ({missions.length} rows)
                  </h3>
                  <pre className="rounded-xl bg-[#1d1a4a] text-[#f4f3fc] p-4 text-xs overflow-x-auto max-h-[380px]">
                    {JSON.stringify(missions, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </SakugaMain>

        {/* 4. MODULAR FOOTER SECTION */}
        <SakugaFooter health={health} />
      </div>
    </div>
  );
}
