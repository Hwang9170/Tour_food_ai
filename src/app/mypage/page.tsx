"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

/** =========================
 * i18n (ko/en/ar) — Onboarding과 동일 키
 * ========================= */
type Lang = "ko" | "en" | "ar";
const dict: Record<Lang, Record<string, string>> = {
  ko: {
    langTitle: "언어를 선택하세요",
    next: "다음",
    prev: "이전",
    start: "시작하기",
    save: "저장하고 시작",
    welcomeTitle: "반가워요! 기본 정보를 알려주세요",
    name: "이름",
    nationality: "국적",
    countryPlaceholder: "예: 대한민국 / Korea",
    dietTitle: "식이/종교 기준을 선택하세요",
    halalReq: "할랄 필수",
    halalFlex: "할랄 선호(유연)",
    halalNo: "구애받지 않음",
    avoid: "기피 식품",
    pork: "돼지고기",
    alcohol: "알코올(요리용 포함)",
    beef: "소고기",
    shellfish: "조개/갑각류",
    allergyTitle: "알레르기를 알려주세요",
    nuts: "견과",
    dairy: "유제품",
    gluten: "글루텐",
    egg: "달걀",
    soy: "대두",
    seafood: "해산물",
    allergyEtcPlaceholder: "기타 알레르기(콤마로 구분)",
    prefTitle: "선호/예산을 알려주세요",
    spice: "매운맛 허용",
    low: "낮음",
    high: "높음",
    budget: "예상 1인 예산(₩)",
    cuisines: "선호 요리",
    korean: "한식",
    chinese: "중식",
    japanese: "일식",
    indian: "인도식",
    middleeast: "중동식",
    western: "양식",
    local: "지역 특화",
    locationTitle: "위치 권한과 지도",
    grantLocation: "위치 권한 요청",
    skip: "건너뛰기",
    mapPreview: "지도 미리보기",
    qrTitle: "부스 QR을 스캔하세요",
    openCamera: "카메라 열기",
    stopCamera: "카메라 중지",
    manualCode: "코드를 직접 입력",
    codePlaceholder: "QR 코드 내용(링크/문자)",
    summaryTitle: "확인 후 시작합니다",
    edit: "수정",
    begin: "시작",
    required: "필수",
  },
  en: {
    langTitle: "Choose your language",
    next: "Next",
    prev: "Back",
    start: "Get Started",
    save: "Save & Start",
    welcomeTitle: "Welcome! Tell us about you",
    name: "Name",
    nationality: "Nationality",
    countryPlaceholder: "e.g., Korea",
    dietTitle: "Dietary / Religious preferences",
    halalReq: "Halal required",
    halalFlex: "Halal preferred (flexible)",
    halalNo: "No restriction",
    avoid: "Avoid",
    pork: "Pork",
    alcohol: "Alcohol (incl. cooking)",
    beef: "Beef",
    shellfish: "Shellfish",
    allergyTitle: "Allergies",
    nuts: "Nuts",
    dairy: "Dairy",
    gluten: "Gluten",
    egg: "Egg",
    soy: "Soy",
    seafood: "Seafood",
    allergyEtcPlaceholder: "Other allergies, comma-separated",
    prefTitle: "Preferences & Budget",
    spice: "Spice tolerance",
    low: "Low",
    high: "High",
    budget: "Per-person budget (₩)",
    cuisines: "Preferred cuisines",
    korean: "Korean",
    chinese: "Chinese",
    japanese: "Japanese",
    indian: "Indian",
    middleeast: "Middle Eastern",
    western: "Western",
    local: "Local special",
    locationTitle: "Location & Map",
    grantLocation: "Request location",
    skip: "Skip",
    mapPreview: "Map preview",
    qrTitle: "Scan a booth QR",
    openCamera: "Open camera",
    stopCamera: "Stop camera",
    manualCode: "Enter code manually",
    codePlaceholder: "QR code content (URL/text)",
    summaryTitle: "Review & Start",
    edit: "Edit",
    begin: "Begin",
    required: "required",
  },
  ar: {
    langTitle: "اختر اللغة",
    next: "التالي",
    prev: "السابق",
    start: "ابدأ",
    save: "حفظ والبدء",
    welcomeTitle: "مرحبًا! أخبرنا عنك",
    name: "الاسم",
    nationality: "الجنسية",
    countryPlaceholder: "مثال: كوريا",
    dietTitle: "التفضيلات الغذائية/الدينية",
    halalReq: "حلال إلزامي",
    halalFlex: "أفضل الحلال (مرن)",
    halalNo: "لا قيود",
    avoid: "تجنّب",
    pork: "لحم الخنزير",
    alcohol: "الكحول (حتى للطبخ)",
    beef: "لحم البقر",
    shellfish: "المأكولات القشرية",
    allergyTitle: "الحساسية",
    nuts: "مكسرات",
    dairy: "ألبان",
    gluten: "غلوتين",
    egg: "بيض",
    soy: "صويا",
    seafood: "مأكولات بحرية",
    allergyEtcPlaceholder: "حساسية أخرى، مفصولة بفواصل",
    prefTitle: "التفضيلات والميزانية",
    spice: "تحمل التوابل",
    low: "منخفض",
    high: "مرتفع",
    budget: "ميزانية للفرد (₩)",
    cuisines: "المطابخ المفضلة",
    korean: "كوري",
    chinese: "صيني",
    japanese: "ياباني",
    indian: "هندي",
    middleeast: "شرق أوسطي",
    western: "غربي",
    local: "محلي مميز",
    locationTitle: "الموقع والخريطة",
    grantLocation: "طلب الموقع",
    skip: "تخطي",
    mapPreview: "معاينة الخريطة",
    qrTitle: "امسح رمز كشك QR",
    openCamera: "فتح الكاميرا",
    stopCamera: "إيقاف الكاميرا",
    manualCode: "إدخال الرمز يدويًا",
    codePlaceholder: "محتوى رمز QR (رابط/نص)",
    summaryTitle: "المراجعة والبدء",
    edit: "تعديل",
    begin: "ابدأ",
    required: "إلزامي",
  },
};

/** =========================
 * Types & Defaults — Onboarding과 동일
 * ========================= */
type HalalMode = "required" | "flexible" | "none";
const cuisineOptionsKey = [
  "korean",
  "chinese",
  "japanese",
  "indian",
  "middleeast",
  "western",
  "local",
] as const;
type CuisineKey = typeof cuisineOptionsKey[number];

type Form = {
  lang: Lang;
  name: string;
  nationality: string;
  halal: HalalMode;
  avoid: { pork: boolean; alcohol: boolean; beef: boolean; shellfish: boolean };
  allergies: {
    nuts: boolean;
    dairy: boolean;
    gluten: boolean;
    egg: boolean;
    soy: boolean;
    seafood: boolean;
    other: string;
  };
  spice: number; // 0~4
  budget: number; // KRW
  cuisines: CuisineKey[];
  location?: { lat: number; lon: number } | null;
  lastBoothQR?: string;
};

const defaultForm: Form = {
  lang: "ko",
  name: "",
  nationality: "",
  halal: "flexible",
  avoid: { pork: false, alcohol: true, beef: false, shellfish: false },
  allergies: {
    nuts: false,
    dairy: false,
    gluten: false,
    egg: false,
    soy: false,
    seafood: false,
    other: "",
  },
  spice: 2,
  budget: 10000,
  cuisines: ["korean", "local"],
  location: null,
  lastBoothQR: "",
};

const STORAGE_KEY = "onboarding.v1";

/** =========================
 * Minimal type for BarcodeDetector (so we avoid @ts-ignore)
 * ========================= */
type DetectedBarcode = { rawValue: string };
type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]>;
};
declare global {
  interface Window {
    BarcodeDetector?: new (opts?: { formats?: string[] }) => BarcodeDetectorLike;
  }
}

/** =========================
 * QR Scanner (BarcodeDetector) — 재스캔용
 * ========================= */
function useQRScanner(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [supported, setSupported] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    setSupported(typeof window !== "undefined" && !!window.BarcodeDetector);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf: number | null = null;
    let detector: BarcodeDetectorLike | null = null;

    const start = async () => {
      if (!enabled || !videoRef.current || !window.BarcodeDetector) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        detector = new window.BarcodeDetector({ formats: ["qr_code"] });

        const tick = async () => {
          if (!videoRef.current || !detector) return;
          try {
            const detections = await detector.detect(videoRef.current);
            if (detections?.[0]?.rawValue) setResult(detections[0].rawValue);
          } catch {
            // ignore per-frame decode errors
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        // user denied or unavailable camera — ignore
      }
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      detector = null;
    };

    if (enabled && supported) start();
    return () => stop();
  }, [enabled, supported]);

  return { videoRef, supported, result, setResult };
}

/** =========================
 * Helpers
 * ========================= */
const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return (parts[0][0] + (parts[1]?.[0] ?? parts[0][1] ?? "")).toUpperCase();
};
const coords = (loc?: Form["location"]) =>
  loc ? `${loc.lat.toFixed(5)}, ${loc.lon.toFixed(5)}` : "-";
const staticMapUrl = (loc?: Form["location"]) =>
  loc
    ? `https://staticmap.openstreetmap.de/staticmap.php?center=${loc.lat},${loc.lon}&zoom=16&size=640x320&markers=${loc.lat},${loc.lon},lightblue1`
    : "";
const flagFromNationality = (n: string) => {
  const s = n.toLowerCase();
  if (/(korea|대한민국|한국)/.test(s)) return "🇰🇷";
  if (/(united states|usa|미국)/.test(s)) return "🇺🇸";
  if (/(china|중국)/.test(s)) return "🇨🇳";
  if (/(japan|일본)/.test(s)) return "🇯🇵";
  if (/(india|인도)/.test(s)) return "🇮🇳";
  if (/(uae|emirates|아랍)/.test(s)) return "🇦🇪";
  return "🌐";
};

/** =========================
 * Page
 * ========================= */
export default function Mypage() {
  // persisted & draft state (for proper edit/cancel/save UX)
  const [form, setForm] = useState<Form>(defaultForm);
  const [draft, setDraft] = useState<Form>(defaultForm);
  const [loaded, setLoaded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openCam, setOpenCam] = useState(false);

  // read on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const persisted: Form | null = raw ? JSON.parse(raw) : null;
      const merged = { ...defaultForm, ...(persisted ?? {}) };
      setForm(merged);
      setDraft(merged);
    } catch {
      setForm(defaultForm);
      setDraft(defaultForm);
    } finally {
      setLoaded(true);
    }
  }, []);

  const t = useMemo(() => dict[(edit ? draft.lang : form.lang) ?? "ko"], [edit, draft.lang, form.lang]);
  const isRTL = (edit ? draft.lang : form.lang) === "ar";
  const { videoRef, supported: qrSupported, result: qrResult } = useQRScanner(openCam);

  // when QR detected, write to both (so it works in or out of edit mode)
  useEffect(() => {
    if (!qrResult) return;
    setDraft((p) => ({ ...p, lastBoothQR: qrResult }));
    setForm((p) => ({ ...p, lastBoothQR: qrResult }));
    // optionally, auto-persist QR results:
    try {
      const next = { ...form, lastBoothQR: qrResult };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrResult]);

  /** handlers (edit-aware) */
  const setField = useCallback(<K extends keyof Form>(k: K, v: Form[K]) => {
    if (edit) setDraft((p) => ({ ...p, [k]: v }));
    else {
      setForm((p) => {
        const next = { ...p, [k]: v };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      setDraft((p) => ({ ...p, [k]: v }));
    }
  }, [edit]);

  const toggleAvoid = (k: keyof Form["avoid"]) =>
    setField("avoid", { ...(edit ? draft.avoid : form.avoid), [k]: !(edit ? draft.avoid[k] : form.avoid[k]) });

  type AllergyKey = Exclude<keyof Form["allergies"], "other">;
  const toggleAllergy = (k: AllergyKey) =>
    setField("allergies", {
      ...(edit ? draft.allergies : form.allergies),
      [k]: !(edit ? draft.allergies[k] : form.allergies[k]),
    });

  const toggleCuisine = (key: CuisineKey) => {
    const current = edit ? draft.cuisines : form.cuisines;
    const next = current.includes(key) ? current.filter((c) => c !== key) : [...current, key];
    setField("cuisines", next);
  };

  const requestLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 })
      );
      const { latitude, longitude } = pos.coords;
      setField("location", { lat: latitude, lon: longitude });
    } catch {
      // denied or failed — ignore
    }
  };

  const enterEdit = () => {
    setDraft(form); // snapshot so Cancel truly reverts
    setEdit(true);
  };
  const cancelEdit = () => {
    setDraft(form);
    setEdit(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setForm(draft);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setDraft(defaultForm);
  };

  if (!loaded) {
    return (
      <main className="min-h-screen grid place-items-center text-black">
        <div className="animate-pulse text-gray-500">Loading…</div>
      </main>
    );
  }

  const view = edit ? draft : form;

  return (
    <main className="min-h-screen bg-gray-50 pb-24 text-black" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
      <div className="-mt-12 mx-auto max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-lg border p-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center text-xl font-bold shadow">
            {initials(view.name || "User")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold truncate">{view.name || t.name}</h1>
              <span className="text-xl">{flagFromNationality(view.nationality || "")}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border">
                {view.lang === "ko" ? "KOR" : view.lang === "en" ? "ENG" : "ARA"}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{view.nationality || t.nationality}</p>
          </div>
          {!edit ? (
            <button onClick={enterEdit} className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50" aria-label={t.edit}>
              {t.edit}
            </button>
          ) : (
            <button onClick={cancelEdit} className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50" aria-label="취소">
              취소
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 mt-4 space-y-6">
        {/* 기본정보 */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="font-semibold mb-3">{t.welcomeTitle}</h2>
          {!edit ? (
            <div className="grid gap-2 text-sm">
              <Row label={t.name} value={view.name || "-"} />
              <Row label={t.nationality} value={view.nationality || "-"} />
              <Row label="Language" value={view.lang === "ko" ? "한국어" : view.lang === "en" ? "English" : "العربية"} />
            </div>
          ) : (
            <div className="grid gap-3">
              <input
                className="border rounded-xl w-full p-3 text-sm"
                placeholder={t.name}
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              <input
                className="border rounded-xl w-full p-3 text-sm"
                placeholder={t.countryPlaceholder}
                value={draft.nationality}
                onChange={(e) => setField("nationality", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2">
                {(["ko", "en", "ar"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setField("lang", l)}
                    className={`rounded-xl border px-3 py-2 text-sm ${draft.lang === l ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
                    aria-pressed={draft.lang === l}
                    aria-label={`language ${l}`}
                  >
                    {l === "ko" ? "한국어" : l === "en" ? "English" : "العربية"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 식이/종교 기준 */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="font-semibold mb-3">{t.dietTitle}</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {([
              { k: "required", label: t.halalReq },
              { k: "flexible", label: t.halalFlex },
              { k: "none", label: t.halalNo },
            ] as const).map((opt) => (
              <button
                key={opt.k}
                disabled={!edit}
                onClick={() => edit && setField("halal", opt.k)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  view.halal === opt.k ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"
                } ${!edit ? "opacity-70 cursor-default" : ""}`}
                aria-pressed={view.halal === opt.k}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold mb-2">{t.avoid}</p>
          <div className="grid grid-cols-2 gap-2">
            {(["pork", "alcohol", "beef", "shellfish"] as const).map((k) => (
              <button
                key={k}
                disabled={!edit}
                onClick={() => edit && toggleAvoid(k)}
                className={`rounded-xl border p-3 text-sm text-left ${
                  view.avoid[k] ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"
                } ${!edit ? "opacity-70 cursor-default" : ""}`}
                aria-pressed={view.avoid[k]}
              >
                {t[k]}
              </button>
            ))}
          </div>
        </section>

        {/* 알레르기 */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="font-semibold mb-3">{t.allergyTitle}</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(["nuts", "dairy", "gluten", "egg", "soy", "seafood"] as AllergyKey[]).map((k) => (
              <button
                key={k}
                disabled={!edit}
                onClick={() => edit && toggleAllergy(k)}
                className={`rounded-xl border p-3 text-sm text-left ${
                  view.allergies[k] ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"
                } ${!edit ? "opacity-70 cursor-default" : ""}`}
                aria-pressed={view.allergies[k]}
              >
                {t[k]}
              </button>
            ))}
          </div>
          <input
            className="border rounded-xl w-full p-3 text-sm placeholder-gray-400"
            placeholder={t.allergyEtcPlaceholder}
            value={view.allergies.other}
            onChange={(e) => setField("allergies", { ...view.allergies, other: e.target.value })}
            disabled={!edit}
          />
        </section>

        {/* 선호/예산 */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="font-semibold mb-3">{t.prefTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-1">{t.spice}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{t.low}</span>
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={1}
                  value={view.spice}
                  onChange={(e) => setField("spice", Number(e.target.value))}
                  className="w-full"
                  disabled={!edit}
                />
                <span className="text-xs text-gray-500">{t.high}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">🌶 {view.spice}/4</p>
            </div>
            <div>
              <p className="text-sm mb-1">{t.budget}</p>
              <input
                type="number"
                min={0}
                className="border rounded-xl w-full p-3 text-sm"
                value={view.budget}
                onChange={(e) => {
                  const v = e.target.value;
                  setField("budget", v === "" ? 0 : Math.max(0, Number(v)));
                }}
                disabled={!edit}
              />
            </div>
          </div>

          <p className="text-sm font-semibold mt-4 mb-2">{t.cuisines}</p>
          <div className="flex flex-wrap gap-2">
            {cuisineOptionsKey.map((k) => (
              <button
                key={k}
                disabled={!edit}
                onClick={() => edit && toggleCuisine(k)}
                className={`px-3 py-2 rounded-full text-sm border ${
                  view.cuisines.includes(k) ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"
                } ${!edit ? "opacity-70 cursor-default" : ""}`}
                aria-pressed={view.cuisines.includes(k)}
              >
                {t[k]}
              </button>
            ))}
          </div>
        </section>

        {/* 위치 */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="font-semibold mb-3">{t.locationTitle}</h2>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={requestLocation} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
              {t.grantLocation}
            </button>
            <span className="text-sm text-gray-600">{coords(view.location)}</span>
          </div>
          {view.location && (
            <Image src={staticMapUrl(view.location)} alt="map" width={400} height={200} className="w-full rounded-xl border" />
          )}
        </section>

        {/* QR */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <h2 className="font-semibold mb-3">{t.qrTitle}</h2>
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenCam((v) => !v)}
                disabled={!qrSupported}
                className="rounded-xl px-3 py-2 text-sm bg-blue-600 text-white disabled:opacity-50"
                aria-pressed={openCam}
              >
                {openCam ? t.stopCamera : t.openCamera}
              </button>
              {!qrSupported && <span className="text-xs text-gray-600">※ 일부 브라우저는 미지원</span>}
            </div>
            {openCam && (
              <div className="rounded-xl overflow-hidden border">
                <video ref={videoRef} className="w-full h-[220px] object-cover" muted playsInline />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">{t.manualCode}</label>
            <input
              className="border rounded-xl w-full p-3 text-sm"
              placeholder={t.codePlaceholder}
              value={view.lastBoothQR || ""}
              onChange={(e) => setField("lastBoothQR", e.target.value)}
            />
            <div className="sr-only" aria-live="polite">{view.lastBoothQR || ""}</div>
            {view.lastBoothQR && (
              <div className="mt-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm">
                ✅ QR: <span className="break-all">{view.lastBoothQR}</span>
              </div>
            )}
          </div>
        </section>

        {/* 액션 */}
        <section className="bg-white rounded-2xl shadow-sm border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {!edit ? (
                <>
                  <Link href="/map" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">지도</Link>
                  <Link href="/survey" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">설문</Link>
                </>
              ) : (
                <>
                  <button onClick={resetToDefault} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
                    기본값으로
                  </button>
                </>
              )}
            </div>
            {!edit ? (
              <button onClick={enterEdit} className="bg-blue-600 text-white rounded-xl px-5 py-2 text-sm font-semibold">
                {t.edit}
              </button>
            ) : (
              <button
                onClick={save}
                className="bg-blue-600 text-white rounded-xl px-5 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "저장 중…" : "저장"}
              </button>
            )}
          </div>
          {/* 미리보기 */}
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-gray-600">JSON 미리보기</summary>
            <pre className="mt-2 text-xs bg-gray-100 rounded-xl p-3 overflow-x-auto">
{JSON.stringify(view, null, 2)}
            </pre>
          </details>
        </section>
      </div>

   
    </main>
  );
}

/** =========================
 * Sub Components
 * ========================= */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right break-words">{value}</span>
    </div>
  );
}
// ...existing code...
