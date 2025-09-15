"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, use as useUnwrap } from "react";
import { MENUS, type Menu } from "../_menus";

/** Survey 타입 */
type HalalMode = "required" | "flexible" | "none";
type Survey = {
  halal: HalalMode;
  avoid: { pork: boolean; alcohol: boolean; beef: boolean; shellfish: boolean };
  allergies: Record<"nuts" | "dairy" | "gluten" | "egg" | "soy" | "seafood", boolean> & { other: string };
  spice: number; budget: number; cuisines: string[]; notes: string;
};

/** Booth 데이터 (기존과 동일) */
type Booth = {
  id: string; name: string; lat: number; lon: number;
  halalCertified?: boolean; hasPork?: boolean; hasAlcohol?: boolean;
  avgPrice: number; cuisines: string[]; spicinessMax: number;
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

/** 설문 정규화 기본값 */
const defaultSurvey: Survey = {
  halal: "flexible",
  avoid: { pork: false, alcohol: true, beef: false, shellfish: false },
  allergies: { nuts: false, dairy: false, gluten: false, egg: false, soy: false, seafood: false, other: "" },
  spice: 2, budget: 10000, cuisines: [], notes: "",
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
      notes: typeof s.notes === "string" ? s.notes : "",
      spice: typeof s.spice === "number" ? s.spice : defaultSurvey.spice,
      budget: typeof s.budget === "number" ? s.budget : defaultSurvey.budget,
    };
  } catch { return null; }
}

/** 가능/불가 판정 */
function evaluateMenu(menu: Menu, survey: Survey | null) {
  if (!survey) return { allowed: true, reasons: ["설문 없음"] };
  const reasons: string[] = [];
  const avoid = survey.avoid ?? defaultSurvey.avoid;
  const allergies = survey.allergies ?? defaultSurvey.allergies;

  if (survey.halal === "required") {
    if (!menu.halalCertified) reasons.push("할랄 인증 아님");
    if (menu.containsPork) reasons.push("돼지고기 포함");
    if (menu.containsAlcohol) reasons.push("알코올 포함");
  }
  if (avoid.pork && menu.containsPork) reasons.push("돼지고기 제외 설정");
  if (avoid.alcohol && menu.containsAlcohol) reasons.push("알코올 제외 설정");
  if (avoid.beef && menu.containsBeef) reasons.push("소고기 제외 설정");
  if (avoid.shellfish && menu.containsShellfish) reasons.push("갑각류 제외 설정");
  if ((menu.spiciness ?? 0) > (survey.spice ?? defaultSurvey.spice)) reasons.push("매운맛 초과");
  if ((menu.price ?? 0) > (survey.budget ?? defaultSurvey.budget)) reasons.push("예산 초과");

  if (menu.allergens?.length) {
    const amap: Record<"nuts" | "dairy" | "gluten" | "egg" | "soy" | "seafood", string> = {
      nuts: "견과",
      dairy: "유제품",
      gluten: "글루텐",
      egg: "달걀",
      soy: "대두",
      seafood: "해산물"
    };
    const allergenKeys: Array<"nuts" | "dairy" | "gluten" | "egg" | "soy" | "seafood"> = ["nuts", "dairy", "gluten", "egg", "soy", "seafood"];
    allergenKeys.forEach((a) => {
      if (allergies[a] && menu.allergens?.includes(a)) reasons.push(`알레르기: ${amap[a]}`);
    });
  }
  return { allowed: reasons.length === 0, reasons };
}

/** Page (params Promise 언랩) */
export default function BoothDetailPage({ params }: { params: Promise<{ boothId: string }> }) {
  const { boothId } = useUnwrap(params);
  const booth = useMemo(() => BOOTHS.find((b) => b.id === boothId), [boothId]);
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => setSurvey(readSurveyNormalized()), []);

  if (!booth) {
    return (
      <main className="min-h-screen grid place-items-center text-black">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">부스를 찾을 수 없습니다.</p>
          <Link href="/map" className="text-blue-600 underline">지도으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  const menus = MENUS[booth.id] ?? [];
  const osmLink = `https://www.openstreetmap.org/?mlat=${booth.lat}&mlon=${booth.lon}#map=18/${booth.lat}/${booth.lon}`;
  const gmapLink = `https://www.google.com/maps?q=${booth.lat},${booth.lon}`;

  return (
    <main className="min-h-screen bg-gray-50 pb-16 text-black">
      {/* Header */}
      <div className="h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
      <div className="-mt-10 mx-auto max-w-xl px-4">
        <div className="bg-white rounded-2xl shadow-lg border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{booth.name}</h1>
              <p className="text-sm text-gray-500">ID: {booth.id} · {booth.lat.toFixed(5)}, {booth.lon.toFixed(5)}</p>
            </div>
            <Link href="/map" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">← 지도</Link>
          </div>

          {/* Booth chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {booth.halalCertified && <Chip color="green">Halal 인증</Chip>}
            {booth.hasPork && <Chip color="red">돼지고기 있음</Chip>}
            {booth.hasAlcohol && <Chip color="red">알코올 있음</Chip>}
            <Chip color="gray">평균 ₩{booth.avgPrice.toLocaleString()}</Chip>
            <Chip color="gray">요리: {booth.cuisines.join(", ")}</Chip>
            <Chip color="gray">🌶 최대 {booth.spicinessMax}</Chip>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mt-3">
            <a href={osmLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">OpenStreetMap</a>
            <a href={gmapLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Google Maps</a>
          </div>
        </div>
      </div>

      {/* Menus (썸네일 + 태그) */}
      <div className="mx-auto max-w-xl px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">메뉴</h2>
        <div className="space-y-3">
          {menus.map((m) => {
            const verdict = evaluateMenu(m, survey);
            return (
              <div key={m.id} className="bg-white border rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="w-24 h-24 rounded-xl object-cover border shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{m.name}</h3>
                        <p className="text-sm text-gray-500">₩{m.price.toLocaleString()} · 🌶 {m.spiciness}</p>
                      </div>
                      <Link href={`/map/${booth.id}/menu/${m.id}`} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">
                        상세 보기
                      </Link>
                    </div>

                    {/* verdict chips */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {verdict.allowed ? <Chip color="green">먹을 수 있어요</Chip> : <Chip color="red">피하세요</Chip>}
                      {m.halalCertified && <Chip color="green">Halal</Chip>}
                      {m.containsPork && <Chip color="red">돼지고기</Chip>}
                      {m.containsAlcohol && <Chip color="red">알코올</Chip>}
                      {m.containsBeef && <Chip color="gray">소고기</Chip>}
                      {m.containsShellfish && <Chip color="red">갑각류</Chip>}
                      {m.allergens?.map((a) => <Chip key={a} color="gray">알레르기: {a}</Chip>)}
                    </div>

                    {/* reasons */}
                    {!verdict.allowed && verdict.reasons.length > 0 && (
                      <ul className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-2 list-disc list-inside">
                        {verdict.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    )}

                    {/* description (요약) */}
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{m.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!survey && (
          <div className="mt-4 text-sm text-gray-600">
            설문 응답이 저장되어 있지 않습니다. <Link href="/survey" className="underline">설문 작성</Link>
          </div>
        )}
      </div>
    </main>
  );
}

/** UI: Chip */
function Chip({ color, children }: { color: "green" | "red" | "gray"; children: React.ReactNode }) {
  const cls =
    color === "green" ? "border-green-600 text-green-700"
      : color === "red" ? "border-red-600 text-red-700"
      : "border-gray-400 text-gray-700";
  return <span className={`px-2 py-1 rounded-full text-xs border ${cls}`}>{children}</span>;
}
