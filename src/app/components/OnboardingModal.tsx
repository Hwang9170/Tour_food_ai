"use client";
import { useEffect, useMemo, useRef, useState } from "react";

/** =========================
 *  i18n (ko/en/ar)
 *  ========================= */
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
 *  Types & Defaults
 *  ========================= */
type HalalMode = "required" | "flexible" | "none";
type Form = {
  lang: Lang;
  name: string;
  nationality: string;
  halal: HalalMode;
  avoid: { pork: boolean; alcohol: boolean; beef: boolean; shellfish: boolean };
  allergies: { nuts: boolean; dairy: boolean; gluten: boolean; egg: boolean; soy: boolean; seafood: boolean; other: string };
  spice: number; // 0~4
  budget: number; // KRW
  cuisines: string[];
  location?: { lat: number; lon: number } | null;
  lastBoothQR?: string;
};

const cuisineOptionsKey = ["korean", "chinese", "japanese", "indian", "middleeast", "western", "local"] as const;

const defaultForm: Form = {
  lang: "ko",
  name: "",
  nationality: "",
  halal: "flexible",
  avoid: { pork: false, alcohol: true, beef: false, shellfish: false },
  allergies: { nuts: false, dairy: false, gluten: false, egg: false, soy: false, seafood: false, other: "" },
  spice: 2,
  budget: 10000,
  cuisines: ["korean", "local"],
  location: null,
  lastBoothQR: "",
};

/** =========================
 *  QR Scanner (BarcodeDetector)
 *  ========================= */
function useQRScanner(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [supported, setSupported] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    // Feature detect
    // @ts-ignore
    const ok = typeof window !== "undefined" && "BarcodeDetector" in window;
    setSupported(ok);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;
    // @ts-ignore
    let detector: any = null;

    const start = async () => {
      if (!enabled || !videoRef.current) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        // @ts-ignore
        detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const tick = async () => {
          if (!videoRef.current) return;
          try {
            const detections = await detector.detect(videoRef.current);
            if (detections && detections[0]?.rawValue) {
              setResult(detections[0].rawValue);
            } else if (detections && detections[0]?.rawValue === "") {
              // no-op
            }
          } catch {
            // ignore
          }
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      } catch (e) {
        // camera permission denied or not available
      }
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (enabled && supported) start();
    return () => stop();
  }, [enabled, supported]);

  return { videoRef, supported, result, setResult };
}

/** =========================
 *  Main Component
 *  ========================= */
export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<number>(0);
  const [openCam, setOpenCam] = useState(false);
  const [form, setForm] = useState<Form>(() => {
    if (typeof window === "undefined") return defaultForm;
    try {
      const cached = localStorage.getItem("onboarding");
      return cached ? { ...defaultForm, ...JSON.parse(cached) } : defaultForm;
    } catch {
      return defaultForm;
    }
  });

  const { videoRef, supported: qrSupported, result: qrResult, setResult: setQrResult } = useQRScanner(openCam);

  const t = useMemo(() => dict[form.lang], [form.lang]);
  const isRTL = form.lang === "ar";

  useEffect(() => {
    if (qrResult) {
      setForm((prev) => ({ ...prev, lastBoothQR: qrResult }));
    }
  }, [qrResult]);

  // Helpers
  const toggleCuisine = (key: string) =>
    setForm((prev) => {
      const exists = prev.cuisines.includes(key);
      return { ...prev, cuisines: exists ? prev.cuisines.filter((c) => c !== key) : [...prev.cuisines, key] };
    });

  const handleChange = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAllergyToggle = (k: keyof Form["allergies"]) => {
    setForm((prev) => ({ ...prev, allergies: { ...prev.allergies, [k]: !prev.allergies[k] as boolean } }));
  };

  const requestLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 }));
      const { latitude, longitude } = pos.coords;
      handleChange("location", { lat: latitude, lon: longitude });
    } catch {
      handleChange("location", null);
    }
  };

  const staticMapUrl = useMemo(() => {
    if (!form.location) return "";
    const { lat, lon } = form.location;
    // OpenStreetMap static map (no key)
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=16&size=360x200&markers=${lat},${lon},lightblue1`;
  }, [form.location]);

  const next = () => setStep((s) => Math.min(s + 1, 7));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const complete = () => {
    localStorage.setItem("onboarding", JSON.stringify(form));
    onComplete();
  };

  // Minimal validation per step
  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return form.name.trim().length > 0 && form.nationality.trim().length > 0;
      case 2:
        return true; // diet always valid
      case 3:
        return true; // allergies optional
      case 4:
        return form.budget >= 0;
      case 5:
        return true; // location optional
      case 6:
        return true; // QR optional
      case 7:
        return true;
      default:
        return true;
    }
  }, [step, form]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <div
        className="w-full max-w-[420px] min-h-screen bg-white text-black px-6 pb-10 pt-6 sm:min-h-[680px] sm:rounded-2xl sm:my-6 shadow-xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-blue-500" : "bg-gray-200"}`} />
          ))}
        </div>

        {/* CONTENT */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.langTitle}</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["ko", "en", "ar"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleChange("lang", l)}
                  className={`border rounded-xl py-3 font-medium ${form.lang === l ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"}`}
                >
                  {l === "ko" ? "한국어" : l === "en" ? "English" : "العربية"}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold" onClick={next}>
                {t.start}
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.welcomeTitle}</h2>
            <label className="block text-sm mb-1">
              {t.name} <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded-xl w-full p-3 mb-4 text-black placeholder-gray-400"
              placeholder={t.name}
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <label className="block text-sm mb-1">
              {t.nationality} <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded-xl w-full p-3 mb-6 text-black placeholder-gray-400"
              placeholder={t.countryPlaceholder}
              value={form.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
            />

            <div className="flex justify-between">
              <button className="text-gray-700" onClick={prev}>
                {t.prev}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold disabled:opacity-50" disabled={!canNext} onClick={next}>
                {t.next}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.dietTitle}</h2>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <button
                onClick={() => handleChange("halal", "required")}
                className={`border rounded-xl p-3 text-sm ${form.halal === "required" ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
              >
                {t.halalReq}
              </button>
              <button
                onClick={() => handleChange("halal", "flexible")}
                className={`border rounded-xl p-3 text-sm ${form.halal === "flexible" ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
              >
                {t.halalFlex}
              </button>
              <button
                onClick={() => handleChange("halal", "none")}
                className={`border rounded-xl p-3 text-sm ${form.halal === "none" ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
              >
                {t.halalNo}
              </button>
            </div>

            <p className="text-sm font-semibold mb-2">{t.avoid}</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(["pork", "alcohol", "beef", "shellfish"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setForm((p) => ({ ...p, avoid: { ...p.avoid, [k]: !p.avoid[k] } }))}
                  className={`rounded-xl border p-3 text-sm text-left ${form.avoid[k] ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
                >
                  {t[k]}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button className="text-gray-700" onClick={prev}>
                {t.prev}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold" onClick={next}>
                {t.next}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.allergyTitle}</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(["nuts", "dairy", "gluten", "egg", "soy", "seafood"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => handleAllergyToggle(k)}
                  className={`rounded-xl border p-3 text-sm text-left ${form.allergies[k] ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
                >
                  {t[k]}
                </button>
              ))}
            </div>
            <input
              className="border rounded-xl w-full p-3 mb-6 text-black placeholder-gray-400"
              placeholder={t.allergyEtcPlaceholder}
              value={form.allergies.other}
              onChange={(e) => setForm((p) => ({ ...p, allergies: { ...p.allergies, other: e.target.value } }))}
            />
            <div className="flex justify-between">
              <button className="text-gray-700" onClick={prev}>
                {t.prev}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold" onClick={next}>
                {t.next}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.prefTitle}</h2>

            <label className="block text-sm mb-1">{t.spice}</label>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs">{t.low}</span>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={form.spice}
                onChange={(e) => handleChange("spice", Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs">{t.high}</span>
            </div>

            <label className="block text-sm mb-1">{t.budget}</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="border rounded-xl w-full p-3 mb-4"
              value={form.budget}
              onChange={(e) => handleChange("budget", Number(e.target.value))}
            />

            <p className="text-sm font-semibold mb-2">{t.cuisines}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {cuisineOptionsKey.map((k) => (
                <button
                  key={k}
                  onClick={() => toggleCuisine(k)}
                  className={`px-3 py-2 rounded-full text-sm border ${form.cuisines.includes(k) ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-300"}`}
                >
                  {t[k]}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button className="text-gray-700" onClick={prev}>
                {t.prev}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold disabled:opacity-50" disabled={!canNext} onClick={next}>
                {t.next}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.locationTitle}</h2>
            <div className="flex items-center gap-3 mb-4">
              <button className="bg-blue-600 text-white rounded-xl px-4 py-2" onClick={requestLocation}>
                {t.grantLocation}
              </button>
              <button className="rounded-xl px-4 py-2 border" onClick={next}>
                {t.skip}
              </button>
            </div>
            {form.location && (
              <div>
                <p className="text-sm font-semibold mb-2">{t.mapPreview}</p>
                <img src={staticMapUrl} alt="map" className="w-full rounded-xl border mb-4" />
              </div>
            )}
            <div className="flex justify-between">
              <button className="text-gray-700" onClick={prev}>
                {t.prev}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold" onClick={() => setStep(6)}>
                {t.next}
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.qrTitle}</h2>

            <div className="flex items-center gap-2 mb-3">
              <button
                className="bg-blue-600 text-white rounded-xl px-4 py-2 disabled:opacity-50"
                onClick={() => setOpenCam((v) => !v)}
                disabled={!qrSupported}
                title={qrSupported ? "" : "BarcodeDetector 미지원 브라우저"}
              >
                {openCam ? t.stopCamera : t.openCamera}
              </button>
              {!qrSupported && <span className="text-xs text-gray-600">※ 일부 브라우저에서는 지원되지 않을 수 있어요.</span>}
            </div>

            {openCam && (
              <div className="rounded-xl overflow-hidden border mb-3">
                <video ref={videoRef} className="w-full h-[220px] object-cover" muted playsInline />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-1">{t.manualCode}</label>
              <input
                className="border rounded-xl w-full p-3"
                placeholder={t.codePlaceholder}
                value={form.lastBoothQR || ""}
                onChange={(e) => handleChange("lastBoothQR", e.target.value)}
              />
            </div>

            {form.lastBoothQR && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm mb-4">
                ✅ QR: <span className="break-all">{form.lastBoothQR}</span>
              </div>
            )}

            <div className="flex justify-between">
              <button className="text-gray-700" onClick={prev}>
                {t.prev}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold" onClick={next}>
                {t.next}
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t.summaryTitle}</h2>
            <div className="space-y-2 text-sm mb-6">
              <Row label="Language" value={form.lang === "ko" ? "한국어" : form.lang === "en" ? "English" : "العربية"} />
              <Row label={t.name} value={form.name || "-"} />
              <Row label={t.nationality} value={form.nationality || "-"} />
              <Row
                label="Halal"
                value={form.halal === "required" ? t.halalReq : form.halal === "flexible" ? t.halalFlex : t.halalNo}
              />
              <Row
                label={t.avoid}
                value={["pork", "alcohol", "beef", "shellfish"]
                  .filter((k) => (form.avoid as any)[k])
                  .map((k) => t[k])
                  .join(", ") || "-"}
              />
              <Row
                label={t.allergyTitle}
                value={
                  (["nuts", "dairy", "gluten", "egg", "soy", "seafood"] as const)
                    .filter((k) => form.allergies[k])
                    .map((k) => t[k])
                    .concat(form.allergies.other ? [form.allergies.other] : [])
                    .join(", ") || "-"
                }
              />
              <Row label={t.spice} value={`${form.spice}/4`} />
              <Row label={t.budget} value={`${form.budget.toLocaleString()}원`} />
              <Row label={t.cuisines} value={form.cuisines.map((k) => (t as any)[k]).join(", ")} />
              <Row label="Location" value={form.location ? `${form.location.lat.toFixed(5)}, ${form.location.lon.toFixed(5)}` : "-"} />
              <Row label="Booth QR" value={form.lastBoothQR || "-"} />
            </div>

            <div className="flex justify-between">
              <button className="rounded-xl px-4 py-2 border" onClick={() => setStep(1)}>
                {t.edit}
              </button>
              <button className="bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold" onClick={complete}>
                {t.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right break-words flex-1">{value}</span>
    </div>
  );
}
