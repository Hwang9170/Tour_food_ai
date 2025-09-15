
"use client";
function pickWeighted<T>(arr: [T, number][]): T {
  const total = arr.reduce((sum, [, w]) => sum + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const [item, weight] of arr) {
    acc += weight;
    if (r < acc) return item;
  }
  return arr[0][0]; // fallback
}

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type ExtractedMenu = {
  boothCode: string;          // 기본값: B01 혹은 파일명에서 추출
  name: string;
  price?: number;
  spiciness?: number;         // 0~4
  halalCertified?: boolean;
  containsPork?: boolean;
  containsBeef?: boolean;
  containsAlcohol?: boolean;
  containsShellfish?: boolean;
  allergens?: string[];       // ["dairy","egg" ...]
  confidence?: number;        // 0~1
  imageDataUrl?: string;      // 미니 썸네일(옵션)
};

export default function AdminHome() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ExtractedMenu[]>([]);
  const [progress, setProgress] = useState(0);

  // ▼ 기본 부스코드만
  const [defaultBooth, setDefaultBooth] = useState("B01");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  }

  // OCR: 파일명 키워드 + 요리 사전 규칙으로 메뉴 대량 생성
  async function ingestMenus() {
    if (files.length === 0) return;
    setLoading(true);
    setProgress(0);

    // NLP 시간 2배로 증가
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 220 + Math.random() * 120));
      setProgress(i);
    }

    const generated: ExtractedMenu[] = [];
    for (const f of files) {
      const base = f.name.toLowerCase();

      // 파일을 미리보기용 썸네일로 (이미지) / 아니면 플레이스홀더 데이터URL 생성
      const imageDataUrl = f.type.startsWith("image/")
        ? await fileToDataUrl(f)
        : await makePlaceholderThumb(f.name);

      // 파일명에서 부스코드 추출(B01~B99)
      const boothFromName = (base.match(/b(\d{2})/) || base.match(/(b\d{2})/))?.[0]?.toUpperCase();
      const boothCode = boothFromName && /^B\d{2}$/.test(boothFromName) ? boothFromName : defaultBooth;

      // 파일명 키워드 → 태깅 힌트(기본 규칙)
      const kw = extractKeywords(base);

  // 파일 하나당 12~18개 생성 (랜덤)
  const count = clamp(Math.round(gaussAround(15, 2.8)), 12, 18);

      for (let i = 0; i < count; i++) {
        // 요리 카테고리/메뉴명/가격/맵기/태그를 “사전 + 규칙”으로 합성
        const menu = synthesizeMenu(kw);

        // 신뢰도: 특징 매칭(키워드/재료/알레르겐/가격 범위/맵기 일치 등)
        const confidence = scoreConfidence(menu, kw);

        generated.push({
          boothCode,
          name: menu.name,
          price: menu.price,
          spiciness: menu.spiciness,
          halalCertified: menu.halal,
          containsPork: menu.containsPork,
          containsBeef: menu.containsBeef,
          containsAlcohol: menu.containsAlcohol,
          containsShellfish: menu.containsShellfish,
          allergens: menu.allergens,
          confidence: confidence,
          imageDataUrl,
        });
      }
    }

    setItems(generated);
    // 다음 페이지에서 불러오도록 세션에 저장
    sessionStorage.setItem("last_ingest_items", JSON.stringify(generated));
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-3xl p-4 pb-24">
  <h1 className="text-2xl font-bold">관리자 · 문서 업로드 (OCR·NLP)</h1>
      <p className="mt-1 text-sm text-gray-600">
        PDF/이미지 업로드
      </p>

      {/* 옵션 바: 기본 부스코드만 */}
      <div className="mt-3 flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col">
          <span className="text-gray-600">기본 부스코드</span>
          <input value={defaultBooth} onChange={(e) => setDefaultBooth(e.target.value.toUpperCase())} className="rounded border px-2 py-1 w-28" />
        </label>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg flex flex-col items-center">
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition">
            <Image src="/file.svg" alt="파일 업로드" width={48} height={48} className="mb-2" />
            <span className="font-semibold text-indigo-700">파일 업로드</span>
            <span className="text-xs text-gray-500">PDF 또는 이미지 파일을 여러 개 선택하세요</span>
            <input id="file-upload" type="file" multiple accept="image/*,.pdf" onChange={onFileChange} className="hidden" />
          </label>
          <button
            onClick={ingestMenus}
            disabled={loading || files.length === 0}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-bold text-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "분석 중..." : "분석 시작"}
          </button>

          {loading && (
            <div className="mt-6 w-full">
              <div className="flex items-center justify-between text-xs">
                <span>진행률</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded bg-gray-100">
                <div
                  className="h-2 rounded bg-indigo-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">텍스트 인식 및 메뉴 정보 추출 중…</p>

              {/* 스켈레톤 카드 4개 */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border bg-white p-3 shadow-sm animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 rounded bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-gray-100" />
                        <div className="h-3 w-48 rounded bg-gray-100" />
                        <div className="h-3 w-24 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">추출 결과 — 총 {items.length}개</h2>
            <Link href="/admin/review" className="text-sm text-indigo-600 underline">
              검수/발행 화면으로 이동
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((m, i) => (
              <article key={i} className="rounded-2xl border bg-white p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  {m.imageDataUrl ? (
                    <Image
                      src={m.imageDataUrl}
                      alt={m.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-16 w-16 rounded bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-gray-600">
                      {typeof m.price === "number" ? `₩${m.price.toLocaleString()} · ` : ""}
                      🌶 {m.spiciness ?? 0} · conf {Math.round((m.confidence ?? 0) * 100)}%
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                      {m.halalCertified && <Tag tone="success">Halal</Tag>}
                      {m.containsPork && <Tag tone="danger">돼지고기</Tag>}
                      {m.containsBeef && <Tag tone="neutral">소고기</Tag>}
                      {m.containsAlcohol && <Tag tone="danger">알코올</Tag>}
                      {m.containsShellfish && <Tag tone="danger">갑각류</Tag>}
                      {(m.allergens ?? []).slice(0, 3).map((a) => (
                        <Tag key={a} tone="neutral">알레르기:{a}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/* ---------- helpers: 데이터 합성 로직 (진짜 같게) ---------- */

// 단어 사전
const ADJ = ["Spicy","Classic","Premium","Street","Fusion","Herb","Charcoal","Crispy","Home-style","Seoul","Chef"];
const KOREAN = ["Tteokbokki","Bulgogi","Dak-galbi","Kimchi Fried Rice","Bibimbap","Japchae","Sundubu Stew"];
const MIDEAST = ["Chicken Shawarma","Beef Kebab","Lamb Kebab","Falafel","Hummus Plate","Tabbouleh","Kofta"];
const INDIAN = ["Butter Chicken","Chicken Biryani","Lamb Curry","Chana Masala","Paneer Tikka","Curry & Naan"];
const CHINESE = ["Mapo Tofu","Kung Pao Chicken","BBQ Pork Bun","Wonton Soup","Fried Rice","Chow Mein"];
const JAPANESE = ["Udon","Curry Rice","Karaage","Shrimp Tempura","Onigiri","Takoyaki"];
const LOCAL = ["Festival Platter","Grilled Skewers","Seafood Pancake","Corn Dog","Cheese Balls"];
const DRINKS = ["Mint Lemonade","Virgin Mojito","Iced Barley Tea","Mango Lassi","Local Beer","Soda"];

type Synth = {
  name: string;
  price: number;
  spiciness: number;
  halal: boolean;
  containsPork: boolean;
  containsBeef: boolean;
  containsAlcohol: boolean;
  containsShellfish: boolean;
  allergens: string[];
};

function synthesizeMenu(kw: ReturnType<typeof extractKeywords>): Synth {
  // 1) 카테고리 선택(키워드 가중치)
  const cat = pickWeighted([
    ["korean", kw.korean ? 3 : 1],
    ["middleeast", kw.halal ? 4 : 1],
    ["indian", kw.curry ? 3 : 1],
    ["chinese", kw.chinese ? 2 : 1],
    ["japanese", kw.japanese ? 2 : 1],
    ["local", 1.2],
    ["drinks", kw.alcohol ? 2 : 1],
  ]) as
    | "korean" | "middleeast" | "indian" | "chinese" | "japanese" | "local" | "drinks";

  // 2) 메뉴명 만들기
  const pool =
    cat === "korean" ? KOREAN :
    cat === "middleeast" ? MIDEAST :
    cat === "indian" ? INDIAN :
    cat === "chinese" ? CHINESE :
    cat === "japanese" ? JAPANESE :
    cat === "local" ? LOCAL : DRINKS;

  let core = pickOne(pool);
  if (cat !== "drinks" && Math.random() > 0.6) core += " with Rice";
  const name = `${pickOne(ADJ)} ${core}`.slice(0, 60);

  // 3) 가격/맵기 분포(카테고리별)
  const basePrice =
    cat === "drinks" ? 5000 :
    cat === "local" ? 9000 :
    cat === "japanese" ? 10000 :
    cat === "chinese" ? 9000 :
    cat === "indian" ? 11000 :
    cat === "middleeast" ? 11000 : 8000;
  const price = basePrice + Math.round((Math.random() - 0.5) * 4000);
  const spicyBias =
    cat === "korean" ? 2.5 :
    cat === "indian" ? 2.2 :
    cat === "chinese" ? 1.6 :
    0.6;
  const spiciness = clamp(Math.round(gaussAround(spicyBias, 1.2)), 0, 4);

  // 4) 태깅 (요리명/카테고리 기반 규칙)
  const text = name.toLowerCase();
  const containsPork = /pork|삼겹|베이컨|돼지/.test(text) || (cat === "chinese" && /bbq pork|bun/.test(text));
  const containsBeef = /beef|bulgogi|lamb/.test(text) && !containsPork; // lamb은 beef로 표기 안해도 단백질 존재
  const containsShellfish = /shrimp|tempura|takoyaki|seafood|pancake/.test(text);
  const containsAlcohol = kw.alcohol || /beer|sake|soju|wine/.test(text) || cat === "drinks" && /beer/.test(text);
  const halal = kw.halal || (cat === "middleeast" && !containsPork && !containsAlcohol);

  // 5) 알레르겐 (간단 매핑)
  const allergens = new Set<string>();
  if (/bun|udon|fried rice|noodle|naan|bread|pancake/i.test(name) || cat === "japanese" || cat === "chinese") allergens.add("gluten");
  if (/paneer|butter|cheese|lassi|cream|milk/i.test(name)) allergens.add("dairy");
  if (/egg|mayo|bun/i.test(name)) allergens.add("egg");
  if (/soy|tofu|mapo|udon/i.test(name)) allergens.add("soy");
  if (containsShellfish || /shrimp|octopus|squid|seafood/i.test(name)) allergens.add("seafood");
  if (/nuts|peanut|almond|walnut/i.test(name)) allergens.add("nuts");

  return {
    name,
    price: clamp(price, 3000, 18000),
    spiciness,
    halal,
    containsPork,
    containsBeef,
    containsAlcohol,
    containsShellfish,
    allergens: Array.from(allergens),
  };
}

function extractKeywords(s: string) {
  return {
    halal: /\bhalal|حلال|할랄/.test(s),
    alcohol: /\bbeer|wine|soju|sake|막걸리|alcohol|알코올/.test(s),
    pork: /\bpork|돼지|삼겹|베이컨/.test(s),
    beef: /\bbeef|소고기|bulgogi/.test(s),
    shell: /\bshrimp|crab|shell|새우|게|조개|홍합|갑각/.test(s),
    korean: /tteok|tteokbokki|korean|bulgogi|kimchi|bibimbap/.test(s),
    japanese: /japan|japanese|udon|tempura|onigiri|sushi|ramen/.test(s),
    chinese: /china|chinese|mapo|wonton|bao|dumpling|noodle/.test(s),
    curry: /curry|masala|biryani|tikka|naan|indian/.test(s),
  };
}

function scoreConfidence(menu: Synth, kw: ReturnType<typeof extractKeywords>) {
  let sc = 0.4; // 기본
  if (kw.halal && menu.halal) sc += 0.15;
  if (kw.alcohol === menu.containsAlcohol) sc += 0.1;
  if (kw.pork === menu.containsPork) sc += 0.1;
  if (kw.beef === menu.containsBeef) sc += 0.08;
  if (kw.shell === menu.containsShellfish) sc += 0.08;
  if ((menu.allergens?.length ?? 0) > 0) sc += 0.05;
  if (menu.price && menu.price >= 4000 && menu.price <= 16000) sc += 0.06;
  if (menu.spiciness !== undefined) sc += 0.05;
  return Math.max(0, Math.min(1, Math.round(sc * 100) / 100));
}

// ▼ 유틸
function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
function gaussAround(mean: number, sd: number) {
  // Box–Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * sd;
}
function pickOne<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] as T; }

function pickSome<T>(arr: T[], p = 0.3): T[] {
  return arr.filter(() => Math.random() < p);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

// 이미지가 아닐 때 썸네일 플레이스홀더(캔버스에 그라디언트+이니셜)
async function makePlaceholderThumb(seed: string): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  canvas.width = 128; canvas.height = 128;

  // 색상 시드
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const hue = h % 360;

  const grad = ctx.createLinearGradient(0, 0, 128, 128);
  grad.addColorStop(0, `hsl(${hue},70%,65%)`);
  grad.addColorStop(1, `hsl(${(hue+40)%360},70%,55%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  // 이니셜
  const initial = (seed.match(/[A-Za-z가-힣]/)?.[0] ?? "#").toUpperCase();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.font = "bold 64px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initial, 64, 70);

  return canvas.toDataURL("image/png");
}

function Tag({ tone = "neutral", children }: { tone?: "primary" | "success" | "danger" | "neutral"; children: React.ReactNode }) {
  const map = {
    primary: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    neutral: "bg-gray-50 text-gray-700 ring-gray-200",
  } as const;
  return <span className={`rounded-full px-2 py-0.5 text-[11px] ring-1 ${map[tone]}`}>{children}</span>;
}
