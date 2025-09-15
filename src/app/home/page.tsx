"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { MENUS, type Menu } from "../map/_menus";

/** =========================
 * Demo booths (Map 페이지와 동일 스키마)
 * ========================= */
type Booth = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  halalCertified?: boolean;
  hasPork?: boolean;
  hasAlcohol?: boolean;
  avgPrice: number;
  cuisines: string[];
  spicinessMax: number; // 0~4
};
const BOOTHS: Booth[] = [
  { id: "B01", name: "Halal Kebab House", lat: 37.5276, lon: 126.9159, halalCertified: true, hasPork: false, hasAlcohol: false, avgPrice: 12000, cuisines: ["middleeast"], spicinessMax: 2 },
  { id: "B02", name: "Seoul Tteokbokki", lat: 37.5284, lon: 126.9172, halalCertified: false, hasPork: false, hasAlcohol: false, avgPrice: 5000, cuisines: ["korean"], spicinessMax: 4 },
  { id: "B03", name: "BBQ Pork Bun", lat: 37.5289, lon: 126.9138, halalCertified: false, hasPork: true, hasAlcohol: false, avgPrice: 8000, cuisines: ["chinese"], spicinessMax: 1 },
  { id: "B04", name: "Curry & Naan", lat: 37.5268, lon: 126.9167, halalCertified: true, hasPork: false, hasAlcohol: false, avgPrice: 10000, cuisines: ["indian"], spicinessMax: 3 },
  { id: "B05", name: "Korean Beef Skewer", lat: 37.5262, lon: 126.9148, halalCertified: false, hasPork: false, hasAlcohol: false, avgPrice: 9000, cuisines: ["korean"], spicinessMax: 2 },
  { id: "B06", name: "Seafood Tempura", lat: 37.5259, lon: 126.9194, halalCertified: false, hasPork: false, hasAlcohol: false, avgPrice: 11000, cuisines: ["japanese", "seafood"], spicinessMax: 1 },
  { id: "B07", name: "Non-Alcohol Mojito", lat: 37.5295, lon: 126.9189, halalCertified: false, hasPork: false, hasAlcohol: false, avgPrice: 6000, cuisines: ["western"], spicinessMax: 0 },
  { id: "B08", name: "Local Festival Set", lat: 37.5272, lon: 126.9211, halalCertified: false, hasPork: false, hasAlcohol: true, avgPrice: 15000, cuisines: ["local"], spicinessMax: 2 },
];

/** =========================
 * Festival Schedule
 * ========================= */
type FestivalEvent = {
  id: string;
  title: string;
  stage: string;
  start: string; // ISO, e.g. "2025-10-05T18:00:00+09:00"
  end: string;   // ISO
  tags?: string[];
};

const EVENTS: FestivalEvent[] = [
  { id: "E01", title: "오프닝 세레모니", stage: "메인 스테이지", start: "2025-10-05T18:00:00+09:00", end: "2025-10-05T18:20:00+09:00", tags: ["메인"] },
  { id: "E02", title: "K-푸드 쿠킹 쇼", stage: "푸드 라운지", start: "2025-10-05T18:30:00+09:00", end: "2025-10-05T19:00:00+09:00", tags: ["쿠킹"] },
  { id: "E03", title: "글로벌 밴드 공연", stage: "리버사이드", start: "2025-10-05T19:10:00+09:00", end: "2025-10-05T19:50:00+09:00", tags: ["공연"] },
  { id: "E04", title: "불꽃 하이라이트", stage: "한강 메인", start: "2025-10-05T20:00:00+09:00", end: "2025-10-05T20:20:00+09:00", tags: ["불꽃"] },
  { id: "E05", title: "라스트 DJ 파티", stage: "메인 스테이지", start: "2025-10-05T20:30:00+09:00", end: "2025-10-05T21:00:00+09:00", tags: ["파티"] },
];

/** =========================
 * Survey 타입/정규화
 * ========================= */
type HalalMode = "required" | "flexible" | "none";
type Survey = {
  halal: HalalMode;
  avoid: { pork: boolean; alcohol: boolean; beef: boolean; shellfish: boolean };
  allergies: { nuts: boolean; dairy: boolean; gluten: boolean; egg: boolean; soy: boolean; seafood: boolean; other: string };
  spice: number;
  budget: number;
  cuisines: string[];
  notes: string;
  lastBoothQR?: string;
};

const defaultSurvey: Survey = {
  halal: "flexible",
  avoid: { pork: false, alcohol: true, beef: false, shellfish: false },
  allergies: { nuts: false, dairy: false, gluten: false, egg: false, soy: false, seafood: false, other: "" },
  spice: 2,
  budget: 10000,
  cuisines: [],
  notes: "",
  lastBoothQR: "",
};

function readSurveyNormalized(): Survey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("foodai_survey") || localStorage.getItem("onboarding");
    if (!raw) return null;
    const s = JSON.parse(raw);
    return {
      ...defaultSurvey,
      ...s,
      avoid: { ...defaultSurvey.avoid, ...(s.avoid ?? {}) },
      allergies: { ...defaultSurvey.allergies, ...(s.allergies ?? {}) },
      cuisines: Array.isArray(s.cuisines) ? s.cuisines : defaultSurvey.cuisines,
      spice: typeof s.spice === "number" ? s.spice : defaultSurvey.spice,
      budget: typeof s.budget === "number" ? s.budget : defaultSurvey.budget,
      lastBoothQR: typeof s.lastBoothQR === "string" ? s.lastBoothQR : "",
    };
  } catch {
    return null;
  }
}

/** =========================
 * Hooks & utils (시간/QR)
 * ========================= */
function useNow(intervalMs = 30000) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function parseISO(s: string) {
  return new Date(s);
}
function isOngoing(ev: FestivalEvent, now: Date) {
  return parseISO(ev.start) <= now && now < parseISO(ev.end);
}
function isUpcoming(ev: FestivalEvent, now: Date) {
  return now < parseISO(ev.start);
}
function fmtTime(d: Date) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
function fmtDay(d: Date) {
  const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}(${w})`;
}
function diffMin(a: Date, b: Date) {
  return Math.max(0, Math.round((a.getTime() - b.getTime()) / 60000));
}
function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

/** QR 스캐너 (간단) */
function useQRScanner(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [supported, setSupported] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
  setSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;
  let detector: BarcodeDetector | null = null;

    const start = async () => {
      if (!enabled || !videoRef.current) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
  detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const tick = async () => {
          if (!videoRef.current) return;
          try {
            if (!detector) return;
            const detections = await detector.detect(videoRef.current);
            if (detections?.[0]?.rawValue) {
              setResult(detections[0].rawValue);
            }
          } catch {}
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      } catch {}
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (enabled && supported) start();
    return () => stop();
  }, [enabled, supported]);

  return { videoRef, supported, result, setResult };
}

/** =========================
 * 식단 평가 로직
 * ========================= */
function evaluateMenu(menu: Menu, survey: Survey | null) {
  if (!survey) return { allowed: true, score: 0 };
  const avoid = survey.avoid ?? defaultSurvey.avoid;
  const allergies = survey.allergies ?? defaultSurvey.allergies;

  if (survey.halal === "required") {
    if (!menu.halalCertified || menu.containsPork || menu.containsAlcohol) return { allowed: false, score: -999 };
  }
  if ((avoid.pork && menu.containsPork) || (avoid.alcohol && menu.containsAlcohol) || (avoid.beef && menu.containsBeef) || (avoid.shellfish && menu.containsShellfish))
    return { allowed: false, score: -999 };
  if (menu.allergens?.some((a: "nuts" | "dairy" | "gluten" | "egg" | "soy" | "seafood") => allergies[a] === true)) return { allowed: false, score: -999 };

  const spiceDelta = Math.abs((survey.spice ?? 2) - (menu.spiciness ?? 0));
  const priceDelta = Math.abs((survey.budget ?? 10000) - (menu.price ?? 0));
  const score = 1000 - spiceDelta * 50 - Math.min(priceDelta, 20000) / 20;
  return { allowed: true, score };
}

/** =========================
 * Home (App 스타일)
 * ========================= */
export default function HomePage() {
  const now = useNow(30000);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [openCam, setOpenCam] = useState(false);
  const { videoRef, supported: qrSupported, result: qrResult, setResult: setQrResult } = useQRScanner(openCam);

  // 설문 로드
  useEffect(() => {
    const s = readSurveyNormalized();
    setSurvey(s);
  }, []);

  // QR 저장
  useEffect(() => {
    if (!qrResult) return;
    try {
      const prev = readSurveyNormalized() ?? defaultSurvey;
      const next = { ...prev, lastBoothQR: qrResult };
      localStorage.setItem("foodai_survey", JSON.stringify(next));
      setSurvey(next);
    } catch {}
  }, [qrResult]);

  // 최근 QR 링크
  const lastQRLink = useMemo(() => {
    const raw = survey?.lastBoothQR || "";
    const match = raw.match(/\/map\/(B\d{2})/i);
    if (match) return { boothId: match[1], href: `/map/${match[1]}` };
    return raw ? { boothId: "", href: raw } : null;
  }, [survey?.lastBoothQR]);

  // 추천 메뉴/부스
  const recommendedMenus = useMemo(() => {
    const all: Menu[] = Object.values(MENUS).flat();
    if (!survey) return all.slice(0, 6);
    return all
      .map((m) => ({ m, ev: evaluateMenu(m, survey) }))
      .filter(({ ev }) => ev.allowed)
      .sort((a, b) => b.ev.score - a.ev.score)
      .slice(0, 6)
      .map(({ m }) => m);
  }, [survey]);

  const recommendedBooths = useMemo(() => {
    if (!survey) return BOOTHS.slice(0, 4);
    return BOOTHS
      .filter((b) => (survey.halal !== "required" || (b.halalCertified && !b.hasPork && !b.hasAlcohol)))
      .filter((b) => b.avgPrice <= (survey.budget ?? 999999))
      .filter((b) => b.spicinessMax <= (survey.spice ?? 4))
      .filter((b) => !survey.cuisines.length || b.cuisines.some((c) => survey.cuisines.includes(c)))
      .slice(0, 4);
  }, [survey]);

  // 일정 계산
  const ongoing = useMemo(() => EVENTS.filter((e) => isOngoing(e, now)), [now]);
  const upcoming = useMemo(() => EVENTS.filter((e) => isUpcoming(e, now)).sort((a, b) => +parseISO(a.start) - +parseISO(b.start)), [now]);
  const nextEvent = upcoming[0];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-600/20">
      {/* ===== Hero (앱 타이틀 + 오늘) ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,.25),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,.25),transparent_50%)]" />
        <div className="mx-auto max-w-md px-4 pt-8 pb-4">
          <h1 className="text-3xl font-extrabold leading-tight">
            ONLY FOR{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
              YOU 
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-700">설문 기반 필터링 · 실시간 QR 연동</p>

          {/* 오늘 정보 */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <span className="rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">{fmtDay(now)}</span>
            <span className="rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">행사장: 여의도 한강공원</span>
            <span className="rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5">날씨: 맑음 26°</span>
          </div>

          {/* 빠른 액션 */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <QuickAction href="/map" title="지도" desc="부스/메뉴 찾기" />
            <QuickAction href="/survey" title="설문" desc="선호 업데이트" />
            <button
              onClick={() => setOpenCam((v) => !v)}
              disabled={!qrSupported}
              className="rounded-2xl border bg-white p-3 text-left shadow-sm ring-1 ring-black/5 hover:shadow-md disabled:opacity-50"
            >
              <div className="font-semibold">QR 스캔</div>
              <p className="text-xs text-gray-600">{openCam ? "스캔 중..." : "부스 QR 인식"}</p>
            </button>
          </div>

          {/* QR 미리보기 */}
          {openCam && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-lg ring-1 ring-black/5">
              <video ref={videoRef} className="h-48 w-full animate-[pulse_2s_ease-in-out_infinite] object-cover" muted playsInline />
            </div>
          )}

          {/* QR 결과 */}
          {(qrResult || lastQRLink) && (
            <div className="mt-2 flex flex-wrap items-center gap-2" aria-live="polite">
              {qrResult && <Pill tone="info">스캔됨: <span className="font-normal">{qrResult}</span></Pill>}
              {lastQRLink && <Link href={lastQRLink.href} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 underline shadow-sm ring-1 ring-black/5">최근 QR 열기 {lastQRLink.boothId ? `(${lastQRLink.boothId})` : ""}</Link>}
              {qrResult && <button className="text-xs underline opacity-80 hover:opacity-100" onClick={() => setQrResult("")}>지우기</button>}
            </div>
          )}
        </div>
      </div>

      {/* ===== Today @ Festival (일정) ===== */}
      <div className="mx-auto max-w-md px-4">
        {/* 진행 중 */}
        <section className="mt-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold">지금 진행 중</h3>
            <Link href="/events" className="text-xs text-indigo-600 underline">전체 일정</Link>
          </div>

          {ongoing.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-600">
              현재 진행 중인 무대가 없어요.
            </div>
          ) : (
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
              {ongoing.map((ev) => {
                const s = parseISO(ev.start); const e = parseISO(ev.end);
                const ratio = clamp01((now.getTime() - s.getTime()) / (e.getTime() - s.getTime()));
                return (
                  <div key={ev.id} className="min-w-[85%] snap-center rounded-2xl border bg-white p-3 shadow-sm ring-1 ring-black/5">
                    <div className="mb-1 flex items-center gap-2">
                      <MiniTag tone="success">NOW</MiniTag>
                      <span className="text-xs text-gray-600">{fmtTime(s)}–{fmtTime(e)} · {ev.stage}</span>
                    </div>
                    <div className="text-sm font-semibold">{ev.title}</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${ratio * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 다가오는 일정 + 카운트다운 */}
        <section className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold">다가오는 일정</h3>
            {nextEvent && (
              <Pill tone="info">
                {diffMin(parseISO(nextEvent.start), now) === 0
                  ? "곧 시작!"
                  : `시작까지 ${diffMin(parseISO(nextEvent.start), now)}분`}
              </Pill>
            )}
          </div>

          {upcoming.slice(0, 4).map((ev) => {
            const s = parseISO(ev.start); const e = parseISO(ev.end);
            return (
              <Link key={ev.id} href="/events" className="mb-2 block rounded-2xl border bg-white p-3 shadow-sm ring-1 ring-black/5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-gray-600">{fmtTime(s)}–{fmtTime(e)}</div>
                </div>
                <div className="mt-0.5 text-xs text-gray-600">{ev.stage}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {ev.tags?.slice(0, 2).map((t) => <MiniTag key={t} tone="neutral">#{t}</MiniTag>)}
                </div>
              </Link>
            );
          })}
          {upcoming.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-600">
              예정된 일정이 더 이상 없어요.
            </div>
          )}
        </section>
      </div>

      {/* ===== Preferences (요약) ===== */}
      <div className="mx-auto max-w-md px-4">
        <section className="mt-6 rounded-2xl border bg-white/90 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-bold">나의 식이/선호 요약</h2>
            <Link href="/survey" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">설문 수정</Link>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Tag tone={survey?.halal === "required" ? "success" : survey?.halal === "none" ? "neutral" : "primary"}>
              Halal: {survey ? (survey.halal === "required" ? "필수" : survey.halal === "flexible" ? "유연" : "무관") : "미설정"}
            </Tag>
            <Tag tone="neutral">예산 ≤ ₩{(survey?.budget ?? defaultSurvey.budget).toLocaleString()}</Tag>
            <Tag tone="neutral">🌶 ≤ {survey?.spice ?? defaultSurvey.spice}</Tag>
            {(survey?.avoid?.pork || false) && <Tag tone="danger">돼지고기 제외</Tag>}
            {(survey?.avoid?.alcohol || false) && <Tag tone="danger">알코올 제외</Tag>}
            {(survey?.avoid?.beef || false) && <Tag tone="neutral">소고기 제외</Tag>}
            {(survey?.avoid?.shellfish || false) && <Tag tone="danger">갑각류 제외</Tag>}
            {((survey?.cuisines?.length ?? 0) > 0) && <Tag tone="primary">선호: {survey!.cuisines.join(", ")}</Tag>}
          </div>
        </section>
      </div>

      {/* ===== 추천 섹션 ===== */}
      <div className="mx-auto max-w-md px-4 pb-24">
        {/* 부스 */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold">추천 부스</h3>
            <Link href="/map" className="text-xs text-indigo-600 underline">전체 보기</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedBooths.length === 0 && <PlaceholderCard count={2} />}
            {recommendedBooths.map((b) => (
              <Link key={b.id} href={`/map/${b.id}`} className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md">
                <div className="h-20 w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                <div className="p-3">
                  <div className="font-semibold">{b.name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">평균 ₩{b.avgPrice.toLocaleString()} · 🌶 최대 {b.spicinessMax}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {b.halalCertified && <MiniTag tone="success">Halal</MiniTag>}
                    {b.hasPork && <MiniTag tone="danger">돼지고기</MiniTag>}
                    {b.hasAlcohol && <MiniTag tone="danger">알코올</MiniTag>}
                    {b.cuisines.slice(0, 2).map((c) => <MiniTag key={c} tone="neutral">{c}</MiniTag>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 메뉴 */}
        <section className="mt-8">
          <h3 className="mb-2 text-base font-semibold">추천 메뉴</h3>
          <div className="grid grid-cols-2 gap-3">
            {recommendedMenus.length === 0 && <PlaceholderCard count={2} />}
            {recommendedMenus.map((m) => {
              const boothId = m.boothId;
              return (
                <Link key={m.id} href={`/map/${boothId}/menu/${m.id}`} className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md">
                  <Image src={m.imageUrl} alt={m.name} width={400} height={96} className="h-24 w-full object-cover" loading="lazy" unoptimized />
                  <div className="p-3">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-gray-500">₩{m.price.toLocaleString()} · 🌶 {m.spiciness}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.halalCertified && <MiniTag tone="success">Halal</MiniTag>}
                      {m.containsPork && <MiniTag tone="danger">돼지고기</MiniTag>}
                      {m.containsAlcohol && <MiniTag tone="danger">알코올</MiniTag>}
                      {m.containsBeef && <MiniTag tone="neutral">소고기</MiniTag>}
                      {m.containsShellfish && <MiniTag tone="danger">갑각류</MiniTag>}
                      {m.allergens?.slice(0, 2).map((a: string) => <MiniTag key={a} tone="neutral">알레르기: {a}</MiniTag>)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

/** =========================
 * Small UI
 * ========================= */
function Pill({ tone = "info", children }: { tone?: "info" | "success" | "danger"; children: React.ReactNode }) {
  const map = {
    info: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
  } as const;
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${map[tone]}`}>{children}</span>;
}

function Tag({ tone = "neutral", children }: { tone?: "primary" | "success" | "danger" | "neutral"; children: React.ReactNode }) {
  const map = {
    primary: "border-indigo-600 text-indigo-700",
    success: "border-emerald-600 text-emerald-700",
    danger: "border-rose-600 text-rose-700",
    neutral: "border-gray-400 text-gray-700",
  } as const;
  return <span className={`rounded-full border px-2 py-1 text-xs ${map[tone]}`}>{children}</span>;
}

function MiniTag({ tone = "neutral", children }: { tone?: "primary" | "success" | "danger" | "neutral"; children: React.ReactNode }) {
  const map = {
    primary: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    neutral: "bg-gray-50 text-gray-700 ring-gray-200",
  } as const;
  return <span className={`rounded-full px-2 py-0.5 text-[11px] ring-1 ${map[tone]}`}>{children}</span>;
}

function QuickAction({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="rounded-2xl border bg-white p-3 text-left shadow-sm ring-1 ring-black/5 hover:shadow-md">
      <div className="font-semibold">{title}</div>
      <p className="text-xs text-gray-600">{desc}</p>
    </Link>
  );
}

function PlaceholderCard({ count = 2 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5">
          <div className="h-20 w-full bg-gray-200" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  );
}
