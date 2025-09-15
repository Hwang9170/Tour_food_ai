"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, use as useUnwrap } from "react";
import { MENUS, type Menu } from "../../../_menus";

/** Survey 타입/기본값 */
type HalalMode = "required" | "flexible" | "none";
type Survey = {
  halal: HalalMode;
  avoid: { pork: boolean; alcohol: boolean; beef: boolean; shellfish: boolean };
  allergies: Record<"nuts" | "dairy" | "gluten" | "egg" | "soy" | "seafood", boolean> & { other: string };
  spice: number; budget: number; cuisines: string[]; notes: string;
};
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

/** 판정 */
function evaluate(menu: Menu, survey: Survey | null) {
  if (!survey) return { ok: true, reasons: ["설문 없음"] };
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
  if (allergies[a] && menu.allergens?.includes(a as keyof typeof amap)) reasons.push(`알레르기: ${amap[a]}`);
    });
  }
  return { ok: reasons.length === 0, reasons };
}

/** Page (params Promise 언랩) */
export default function MenuDetailPage({ params }: { params: Promise<{ boothId: string; menuId: string }> }) {
  const { boothId, menuId } = useUnwrap(params);
  const menu = useMemo(() => MENUS[boothId]?.find((m) => m.id === menuId), [boothId, menuId]);
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => setSurvey(readSurveyNormalized()), []);

  if (!menu) {
    return (
      <main className="min-h-screen grid place-items-center text-black">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">메뉴를 찾을 수 없습니다.</p>
          <Link href={`/map/${boothId}`} className="text-blue-600 underline">부스 상세로</Link>
        </div>
      </main>
    );
  }

  const v = evaluate(menu, survey);

  return (
    <main className="min-h-screen bg-gray-50 pb-16 text-black">
      <div className="h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
      <div className="-mt-8 mx-auto max-w-xl px-4">
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          {/* Hero Image */}
          <Image
            src={menu.imageUrl}
            alt={menu.name}
            width={600}
            height={224}
            className="w-full h-56 object-cover"
            loading="lazy"
            unoptimized
          />

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold">{menu.name}</h1>
                <p className="text-sm text-gray-500">
                  ₩{menu.price.toLocaleString()} · 🌶 {menu.spiciness} · ID: {menu.id}
                </p>
              </div>
              <Link href={`/map/${boothId}`} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">← 부스</Link>
            </div>

            {/* Verdict */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Chip color={v.ok ? "green" : "red"}>{v.ok ? "먹을 수 있어요" : "피하세요"}</Chip>
              {menu.halalCertified && <Chip color="green">Halal</Chip>}
              {menu.containsPork && <Chip color="red">돼지고기</Chip>}
              {menu.containsAlcohol && <Chip color="red">알코올</Chip>}
              {menu.containsBeef && <Chip color="gray">소고기</Chip>}
              {menu.containsShellfish && <Chip color="red">갑각류</Chip>}
              {menu.allergens?.map((a) => <Chip key={a} color="gray">알레르기: {a}</Chip>)}
            </div>

            {!v.ok && v.reasons.length > 0 && (
              <ul className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 list-disc list-inside">
                {v.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}

            {/* 소개 */}
            <section className="mt-4">
              <h2 className="font-semibold mb-1">메뉴 소개</h2>
              <p className="text-sm text-gray-700">{menu.description}</p>
            </section>

            {/* 조리 과정 — 더 자세하게 */}
            <section className="mt-4">
              <h2 className="font-semibold mb-1">조리 과정</h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {menu.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              <p className="text-xs text-gray-500 mt-2">* 실제 레시피와 다를 수 있으며, 축제 운영에 맞춰 일부 과정이 단축될 수 있습니다.</p>
            </section>
          </div>
        </div>
      </div>

      {!survey && (
        <div className="mx-auto max-w-xl px-4 mt-4 text-sm text-gray-600">
          설문 응답이 저장되어 있지 않습니다. <Link href="/survey" className="underline">설문 작성</Link>
        </div>
      )}
    </main>
  );
}

function Chip({ color, children }: { color: "green" | "red" | "gray"; children: React.ReactNode }) {
  const cls =
    color === "green" ? "border-green-600 text-green-700"
      : color === "red" ? "border-red-600 text-red-700"
      : "border-gray-400 text-gray-700";
  return <span className={`px-2 py-1 rounded-full text-xs border ${cls}`}>{children}</span>;
}
