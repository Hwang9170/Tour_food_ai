"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

type MenuDraft = {
  boothCode: string;
  name: string;
  price?: number;
  spiciness?: number;
  halalCertified?: boolean;
  containsPork?: boolean;
  containsBeef?: boolean;
  containsAlcohol?: boolean;
  containsShellfish?: boolean;
  allergens?: string[];
};

export default function ReviewPage() {
  const [drafts, setDrafts] = useState<MenuDraft[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [doneIds, setDoneIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_ingest_items");
    if (raw) {
  const parsed = JSON.parse(raw) as MenuDraft[];
      const mapped: MenuDraft[] = parsed.map((m) => ({
        boothCode: m.boothCode ?? "B01",
        name: m.name,
        price: m.price,
        spiciness: m.spiciness,
        halalCertified: m.halalCertified,
        containsPork: m.containsPork,
        containsBeef: m.containsBeef,
        containsAlcohol: m.containsAlcohol,
        containsShellfish: m.containsShellfish,
        allergens: m.allergens ?? [],
      }));
      setDrafts(mapped);
    }
  }, []);

  const update = (idx: number, patch: Partial<MenuDraft>) => {
    setDrafts((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  };

  // PDF로 QR 및 메뉴정보 한번에 다운로드
  const publishPDF = async () => {
    setPublishing(true);
    const doc = new jsPDF();
    for (let i = 0; i < drafts.length; i++) {
      const draft = drafts[i];
      if (!draft) continue;
      const menuId = cryptoRandomId();
      const url = `${location.origin}/map/${draft.boothCode}/menu/${menuId}`;
      const png = await makeFakeQR(url, 256);
      if (i > 0) doc.addPage();
      doc.setFontSize(16);
      doc.text(`Booth: ${draft.boothCode}`, 20, 30);
      doc.text(`Menu: ${draft.name}`, 20, 45);
      if (draft.price) doc.text(`Price: ₩${draft.price}`, 20, 60);
      if (typeof draft.spiciness === "number") doc.text(`Spiciness: ${draft.spiciness}`, 20, 75);
      if (draft.halalCertified) doc.text(`Halal Certified`, 20, 90);
      if (draft.containsPork) doc.text(`Contains Pork`, 20, 105);
      if (draft.containsBeef) doc.text(`Contains Beef`, 20, 120);
      if (draft.containsAlcohol) doc.text(`Contains Alcohol`, 20, 135);
      if (draft.containsShellfish) doc.text(`Contains Shellfish`, 20, 150);
      if (Array.isArray(draft.allergens) && draft.allergens.length) {
        doc.text(`Allergens: ${draft.allergens.join(", ")}`, 20, 165);
      }
      doc.addImage(png, "PNG", 140, 30, 50, 50);
    }
    doc.save("menus_with_qr.pdf");
    setPublishing(false);
    alert("PDF 다운로드가 완료되었습니다.");
  };

  return (
    <main className="mx-auto max-w-3xl p-4 pb-24">
  <h1 className="text-2xl font-bold">검수 & 발행</h1>
  <p className="mt-1 text-sm text-gray-600">값을 수정하고 PDF로 QR 및 메뉴정보를 한번에 다운로드할 수 있습니다.</p>

      <div className="mt-4 space-y-3">
        {drafts.map((d, i) => (
          <div key={i} className="rounded-2xl border bg-white p-3 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <L label="부스 코드">
                <input value={d.boothCode} onChange={(e) => update(i, { boothCode: e.target.value })} className="mt-1 w-full rounded border px-2 py-1" />
              </L>
              <L label="메뉴명">
                <input value={d.name} onChange={(e) => update(i, { name: e.target.value })} className="mt-1 w-full rounded border px-2 py-1" />
              </L>
              <L label="가격(원)">
                <input type="number" value={d.price ?? ""} onChange={(e) => update(i, { price: toNum(e.target.value) })} className="mt-1 w-full rounded border px-2 py-1" />
              </L>
              <L label="맵기(0~4)">
                <input type="number" min={0} max={4} value={d.spiciness ?? 0} onChange={(e) => update(i, { spiciness: toNum(e.target.value) ?? 0 })} className="mt-1 w-full rounded border px-2 py-1" />
              </L>
              <Check label="Halal 인증" checked={d.halalCertified ?? false} onChange={(v) => update(i, { halalCertified: v })} />
              <Check label="돼지고기 포함" checked={d.containsPork ?? false} onChange={(v) => update(i, { containsPork: v })} />
              <Check label="소고기 포함" checked={d.containsBeef ?? false} onChange={(v) => update(i, { containsBeef: v })} />
              <Check label="알코올 포함" checked={d.containsAlcohol ?? false} onChange={(v) => update(i, { containsAlcohol: v })} />
              <Check label="갑각류 포함" checked={d.containsShellfish ?? false} onChange={(v) => update(i, { containsShellfish: v })} />
              <L label="알레르기(쉼표로 구분)" full>
                <input
                  value={(d.allergens ?? []).join(",")}
                  onChange={(e) => update(i, { allergens: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </L>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={publishPDF}
          disabled={publishing || drafts.length === 0}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {publishing ? "PDF 생성 중…" : "PDF로 다운로드"}
        </button>
        {doneIds.length > 0 && <span className="text-sm text-gray-600">총 {doneIds.length}개 완료</span>}
      </div>
    </main>
  );
}

/* ---------- tiny UI ---------- */
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`text-sm ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

/* ---------- helpers (가짜 QR 생성) ---------- */
function sanitize(s: string) {
  return s.replace(/[^\w가-힣-_.]/g, "_").slice(0, 40);
}
function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

/**
 * 실제 QR이 아니라 "QR처럼 보이는" PNG를 캔버스로 생성 (스캔 불가)
 * - 텍스트 해시를 기반으로 격자 무늬를 만듦
 */
async function makeFakeQR(text: string, size = 320): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  canvas.width = size;
  canvas.height = size;

  // 배경
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);

  // 해시
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }

  // 패턴(가짜)
  const n = 29; // 29x29 격자
  const cell = Math.floor(size / n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      h = (h * 16777619) >>> 0;
      const bit = (h >> 3) & 1;
      if (bit === 1) {
        ctx.fillStyle = "#111";
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }

  // 모서리 포지셔닝 마커처럼 보이게
  drawFinder(ctx, 2, 2, cell * 7);
  drawFinder(ctx, size - cell * 9, 2, cell * 7);
  drawFinder(ctx, 2, size - cell * 9, cell * 7);

  // 하단에 URL 텍스트
  ctx.fillStyle = "#111";
  ctx.font = `${Math.floor(size * 0.04)}px ui-sans-serif, system-ui`;
  ctx.fillText(text.slice(0, 40) + (text.length > 40 ? "..." : ""), Math.floor(cell), size - Math.floor(cell));

  return canvas.toDataURL("image/png");
}
function drawFinder(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = "#111";
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + s * 0.14, y + s * 0.14, s * 0.72, s * 0.72);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + s * 0.28, y + s * 0.28, s * 0.44, s * 0.44);
}
function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
/* ---------- end of file ---------- */