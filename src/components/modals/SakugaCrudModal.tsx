"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SakugaMission } from "@/lib/db";
import type {
  SakugaButtonElement,
  SakugaCheckboxElement,
  SakugaInputElement,
  SakugaProgressElement,
  SakugaRadioElement,
  SakugaRatingElement,
  SakugaSliderElement,
  SakugaToggleElement,
} from "@/types/sakuga";

export interface CrudFormValues {
  title: string;
  assignee: string;
  notes: string;
  category: string;
  priority_power: number;
  rating: number;
  fx_enabled: boolean;
  completed: boolean;
}

interface SakugaCrudModalProps {
  open: boolean;
  editingMission: SakugaMission | null;
  defaultAssignee: string;
  statusLog: string;
  onClose: () => void;
  onSave: (values: CrudFormValues) => Promise<boolean>;
}

export default function SakugaCrudModal({
  open,
  editingMission,
  defaultAssignee,
  statusLog,
  onClose,
  onSave,
}: SakugaCrudModalProps) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState(defaultAssignee);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("vfx");
  const [priorityPower, setPriorityPower] = useState(80);
  const [rating, setRating] = useState(5);
  const [fxEnabled, setFxEnabled] = useState(true);
  const [completed, setCompleted] = useState(false);

  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<SakugaInputElement>(null);
  const assigneeInputRef = useRef<SakugaInputElement>(null);
  const notesInputRef = useRef<SakugaInputElement>(null);
  const radioRef = useRef<SakugaRadioElement>(null);
  const sliderRef = useRef<SakugaSliderElement>(null);
  const ratingRef = useRef<SakugaRatingElement>(null);
  const toggleRef = useRef<SakugaToggleElement>(null);
  const checkboxRef = useRef<SakugaCheckboxElement>(null);
  const submitBtnRef = useRef<SakugaButtonElement>(null);
  const cancelBtnRef = useRef<SakugaButtonElement>(null);
  const progressRef = useRef<SakugaProgressElement>(null);

  // Lock background page scroll & close on Escape key when modal is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Populate fields & reset scroll position when modal opens or editingMission changes
  useEffect(() => {
    if (!open) return;

    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }

    const nextTitle = editingMission ? editingMission.title : "";
    const nextAssignee = editingMission
      ? editingMission.assignee || defaultAssignee
      : defaultAssignee;
    const nextNotes = editingMission ? editingMission.notes || "" : "";
    const nextCategory = editingMission ? editingMission.category || "vfx" : "vfx";
    const nextPower = editingMission ? editingMission.priority_power ?? 80 : 80;
    const nextRating = editingMission ? editingMission.rating ?? 5 : 5;
    const nextFx = editingMission ? Boolean(editingMission.fx_enabled) : true;
    const nextCompleted = editingMission ? Boolean(editingMission.completed) : false;

    setTitle(nextTitle);
    setAssignee(nextAssignee);
    setNotes(nextNotes);
    setCategory(nextCategory);
    setPriorityPower(nextPower);
    setRating(nextRating);
    setFxEnabled(nextFx);
    setCompleted(nextCompleted);

    // Sync custom element properties
    if (inputRef.current) inputRef.current.value = nextTitle;
    if (assigneeInputRef.current) assigneeInputRef.current.value = nextAssignee;
    if (notesInputRef.current) notesInputRef.current.value = nextNotes;
    if (radioRef.current) radioRef.current.value = nextCategory;
    if (sliderRef.current) sliderRef.current.value = nextPower;
    if (ratingRef.current) ratingRef.current.value = nextRating;
    if (toggleRef.current) toggleRef.current.checked = nextFx;
    if (checkboxRef.current) checkboxRef.current.checked = nextCompleted;
    progressRef.current?.reset?.();
  }, [open, editingMission, defaultAssignee]);

  // Wire Sakuga Custom Elements inside Scrollable Modal Body
  useEffect(() => {
    if (!open) return;
    const cleanups: Array<() => void> = [];

    const inp = inputRef.current;
    if (inp) {
      const onInput = () => setTitle(inp.value || "");
      inp.addEventListener("input", onInput);
      inp.addEventListener("change", onInput);
      cleanups.push(() => {
        inp.removeEventListener("input", onInput);
        inp.removeEventListener("change", onInput);
      });
    }

    const asg = assigneeInputRef.current;
    if (asg) {
      const onAsg = () => setAssignee(asg.value || "");
      asg.addEventListener("input", onAsg);
      asg.addEventListener("change", onAsg);
      cleanups.push(() => {
        asg.removeEventListener("input", onAsg);
        asg.removeEventListener("change", onAsg);
      });
    }

    const nts = notesInputRef.current;
    if (nts) {
      const onNts = () => setNotes(nts.value || "");
      nts.addEventListener("input", onNts);
      nts.addEventListener("change", onNts);
      cleanups.push(() => {
        nts.removeEventListener("input", onNts);
        nts.removeEventListener("change", onNts);
      });
    }

    const rad = radioRef.current;
    if (rad) {
      const onRadio = () => setCategory(rad.value || "vfx");
      rad.addEventListener("change", onRadio);
      cleanups.push(() => rad.removeEventListener("change", onRadio));
    }

    const sld = sliderRef.current;
    if (sld) {
      const onSlide = () => setPriorityPower(Number(sld.value ?? 80));
      sld.addEventListener("input", onSlide);
      sld.addEventListener("change", onSlide);
      cleanups.push(() => {
        sld.removeEventListener("input", onSlide);
        sld.removeEventListener("change", onSlide);
      });
    }

    const rat = ratingRef.current;
    if (rat) {
      const onRate = () => setRating(Number(rat.value ?? 5));
      rat.addEventListener("change", onRate);
      cleanups.push(() => rat.removeEventListener("change", onRate));
    }

    const tog = toggleRef.current;
    if (tog) {
      const onToggle = () => setFxEnabled(Boolean(tog.checked));
      tog.addEventListener("change", onToggle);
      cleanups.push(() => tog.removeEventListener("change", onToggle));
    }

    const chk = checkboxRef.current;
    if (chk) {
      const onCheck = () => setCompleted(Boolean(chk.checked));
      chk.addEventListener("change", onCheck);
      cleanups.push(() => chk.removeEventListener("change", onCheck));
    }

    const cancelBtn = cancelBtnRef.current;
    if (cancelBtn) {
      const onCancel = () => onClose();
      cancelBtn.addEventListener("click", onCancel);
      cleanups.push(() => cancelBtn.removeEventListener("click", onCancel));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [open, onClose]);

  const triggerSubmit = async () => {
    const payload: CrudFormValues = {
      title: (inputRef.current?.value ?? title).trim(),
      assignee:
        (assigneeInputRef.current?.value ?? assignee).trim() || defaultAssignee,
      notes: (notesInputRef.current?.value ?? notes).trim(),
      category: radioRef.current?.value || category,
      priority_power: Number(sliderRef.current?.value ?? priorityPower),
      rating: Number(ratingRef.current?.value ?? rating),
      fx_enabled: Boolean(toggleRef.current?.checked ?? fxEnabled),
      completed: Boolean(checkboxRef.current?.checked ?? completed),
    };

    progressRef.current?.reset?.();
    progressRef.current?.set?.(0.35);

    const ok = await onSave(payload);
    if (ok) {
      progressRef.current?.set?.(1);
      submitBtnRef.current?.done?.();
      setTimeout(() => {
        onClose();
      }, 650);
    }
  };

  useEffect(() => {
    if (!open) return;
    const btn = submitBtnRef.current;
    if (!btn) return;
    const onClick = () => triggerSubmit();
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sakuga-crud-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Modal Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#1d1a4a]/50 backdrop-blur-[3px] transition-opacity"
      />

      {/* Responsive Modal Container: Fixed Header + Scrollable Body + Fixed Footer */}
      <section className="relative z-10 flex flex-col w-full sm:max-w-lg md:max-w-2xl max-h-[92dvh] sm:max-h-[86dvh] bg-white border-t-2 sm:border-2 border-[#1d1a4a] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* 1. FIXED MODAL HEADER (shrink-0) */}
        <header className="shrink-0 flex items-start justify-between gap-4 px-5 sm:px-6 py-4 bg-white border-b-[1.5px] border-[#dcdaf0]">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-extrabold mb-1 ${
                editingMission
                  ? "bg-[#fff0f7] text-[#ff5fa8] border border-[#ffc2df]"
                  : "bg-[#f4f3fc] text-[#7c5cff] border border-[#dcdaf0]"
              }`}
            >
              {editingMission
                ? `✎ MODE EDIT (UPDATE CUT #${editingMission.id})`
                : "+ MODE TAMBAH (INSERT CUT BARU)"}
            </span>
            <h2
              id="sakuga-crud-modal-title"
              className="m-0 text-lg sm:text-xl font-extrabold text-[#1d1a4a] truncate"
            >
              {editingMission
                ? `Edit Cut #${editingMission.id} di PostgreSQL`
                : "Input Cut Animasi Baru ke PostgreSQL"}
            </h2>
            <p className="m-0 mt-0.5 text-xs text-[#8580b0]">
              Responsive Modal dengan Scrollable Body — tersinkron ke tabel{" "}
              <code>sakuga_missions</code>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <sakuga-tooltip text="Gunakan scroll di dalam body modal jika layar kecil. Header dan tombol aksi di Footer tetap terkunci (pinned)."></sakuga-tooltip>
            <button
              type="button"
              onClick={onClose}
              className="sk-pill !h-[32px] !px-3 !text-xs font-extrabold"
            >
              ✕ Tutup
            </button>
          </div>
        </header>

        {/* 2. SCROLLABLE MODAL BODY (flex-1 min-h-0 overflow-y-auto) */}
        <div
          ref={scrollBodyRef}
          className="sk-modal-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-[#1d1a4a]">
                1. Judul Cut / Scene (<code>&lt;sakuga-input&gt;</code>) *
              </label>
              <div style={{ "--sk-input-width": "100%" } as React.CSSProperties}>
                <sakuga-input
                  ref={inputRef}
                  label="Cut Title"
                  placeholder="e.g. Cut #140 — Lightning Beam Impact Frame"
                ></sakuga-input>
              </div>
            </div>

            {/* 2. Animator PIC */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d1a4a]">
                2. Animator / PIC (<code>&lt;sakuga-input&gt;</code>)
              </label>
              <div style={{ "--sk-input-width": "100%" } as React.CSSProperties}>
                <sakuga-input
                  ref={assigneeInputRef}
                  label="Animator PIC"
                  placeholder="Nama Animator / PIC"
                ></sakuga-input>
              </div>
            </div>

            {/* 3. Production Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d1a4a]">
                3. Catatan Produksi (<code>&lt;sakuga-input&gt;</code>)
              </label>
              <div style={{ "--sk-input-width": "100%" } as React.CSSProperties}>
                <sakuga-input
                  ref={notesInputRef}
                  label="Production Notes"
                  placeholder="Catatan timing, efek burst, atau revisi frame"
                ></sakuga-input>
              </div>
            </div>
          </div>

          {/* 4. Department / Category (<sakuga-radio>) */}
          <div className="space-y-1.5 pt-2 border-t border-[#dcdaf0]">
            <label className="block text-xs font-bold text-[#1d1a4a]">
              4. Kategori Departemen &amp; SFX (<code>&lt;sakuga-radio&gt;</code>)
            </label>
            <sakuga-radio ref={radioRef} label="Department">
              <option value="vfx" selected>
                VFX Burst (ドン!)
              </option>
              <option value="keyframe">Key Animation (ズザッ)</option>
              <option value="compositing">Compositing (ゴゴゴゴ)</option>
            </sakuga-radio>
          </div>

          {/* 5. Impact Power & 6. Quality Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#dcdaf0] items-center">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d1a4a]">
                5. Impact Power: {priorityPower}% (
                <code>&lt;sakuga-slider&gt;</code>)
              </label>
              <div
                style={{ "--sk-slider-width": "230px" } as React.CSSProperties}
              >
                <sakuga-slider
                  ref={sliderRef}
                  value={String(priorityPower)}
                  min="10"
                  max="100"
                  step="5"
                  label="Impact Power"
                ></sakuga-slider>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d1a4a]">
                6. Quality Rating (<code>&lt;sakuga-rating&gt;</code>)
              </label>
              <sakuga-rating
                ref={ratingRef}
                label="Quality Rating"
                value={String(rating)}
              ></sakuga-rating>
            </div>
          </div>

          {/* 7. Toggle & 8. Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#dcdaf0]">
            <div>
              <span className="block text-xs font-bold text-[#1d1a4a] mb-1">
                7. Aktifkan VFX Layer (<code>&lt;sakuga-toggle&gt;</code>)
              </span>
              <sakuga-toggle ref={toggleRef} label="Enable VFX"></sakuga-toggle>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#1d1a4a] mb-2">
                8. Status Approval (<code>&lt;sakuga-checkbox&gt;</code>)
              </span>
              <sakuga-checkbox ref={checkboxRef}>
                Cut Selesai (Approved)
              </sakuga-checkbox>
            </div>
          </div>

          {/* 9. Progress Bar inside Scrollable Body */}
          <div className="pt-3 border-t border-[#dcdaf0] overflow-hidden">
            <span className="block text-xs font-bold text-[#8580b0]">
              9. PostgreSQL Sync Progress (<code>&lt;sakuga-progress&gt;</code>)
            </span>
            <div className="grid place-items-center">
              <sakuga-progress
                ref={progressRef}
                label="Postgres Sync"
              ></sakuga-progress>
            </div>
          </div>
        </div>

        {/* 3. FIXED MODAL FOOTER (shrink-0) */}
        <footer className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3.5 bg-[#faf9ff] border-t-[1.5px] border-[#dcdaf0]">
          <div className="text-xs font-mono text-[#7c5cff] truncate max-w-[260px] sm:max-w-[320px]">
            {statusLog}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <sakuga-button ref={cancelBtnRef} variant="secondary">
              Batal
            </sakuga-button>
            <sakuga-button ref={submitBtnRef}>
              {editingMission
                ? `Update Cut #${editingMission.id}`
                : "Simpan ke PostgreSQL"}
            </sakuga-button>
          </div>
        </footer>
      </section>
    </div>
  );
}
