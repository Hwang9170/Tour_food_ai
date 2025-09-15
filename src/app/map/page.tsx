// Leaflet Map에 커스텀 프로퍼티 타입 확장
declare module 'leaflet' {
  interface Map {
    __drawMarkers?: () => void;
    __fitToMarkers?: () => void;
  }
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

/** =========================
 * Types
 * ========================= */
type HalalMode = "required" | "flexible" | "none";
type Survey = {
  halal: HalalMode;
  avoid: { pork: boolean; alcohol: boolean; beef: boolean; shellfish: boolean };
  allergies: { nuts: boolean; dairy: boolean; gluten: boolean; egg: boolean; soy: boolean; seafood: boolean; other: string };
  spice: number; // 0~4
  budget: number; // KRW
  cuisines: string[];
  notes: string;
};

type Booth = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  halalCertified?: boolean;
  hasPork?: boolean;
  hasAlcohol?: boolean;
  avgPrice: number;
  cuisines: string[]; // e.g., ["korean","middleeast"]
  spicinessMax: number; // 0~4
};

/** =========================
 * Demo booth dataset (샘플)
 * 좌표는 여의도공원 인근 데모용
 * ========================= */
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
 * LocalStorage Survey
 * ========================= */
const STORAGE_KEY = "foodai_survey";
const getSurvey = (): Survey | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** =========================
 * Filtering logic
 * ========================= */
function filterBooths(booths: Booth[], survey: Survey | null): Booth[] {
  if (!survey) return booths;

  return booths.filter((b) => {
    // 1) Halal strictness
    if (survey.halal === "required") {
      if (!b.halalCertified) return false;
      if (b.hasPork) return false;
      if (b.hasAlcohol) return false;
    }
    // 2) Avoid list (항목 체크된 것은 제외)
    if (survey.avoid.pork && b.hasPork) return false;
    if (survey.avoid.alcohol && b.hasAlcohol) return false;
    // 소/갑각류는 데이터에 직접 반영된 예시는 아니지만, cuisines로 간접 필터
    if (survey.avoid.beef && b.name.toLowerCase().includes("beef")) return false;
    if (survey.avoid.shellfish && (b.cuisines.includes("seafood") || b.name.toLowerCase().includes("shrimp"))) return false;

    // 3) Budget
    if (b.avgPrice > survey.budget) return false;

    // 4) Spice tolerance (허용보다 매우 매운 부스 제외)
    if (b.spicinessMax > survey.spice) return false;

    // 5) Cuisine overlap (선호 요리와 1개 이상 교집합)
    if (survey.cuisines.length > 0) {
      const hit = b.cuisines.some((c) => survey.cuisines.includes(c));
      if (!hit) return false;
    }
    return true;
  });
}

/** =========================
 * MapPage
 * ========================= */
export default function MapPage() {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [usingGeoloc, setUsingGeoloc] = useState(false);
  const [counts, setCounts] = useState({ total: BOOTHS.length, shown: BOOTHS.length });

  const filtered = useMemo(() => filterBooths(BOOTHS, survey), [survey]);
  useEffect(() => setCounts({ total: BOOTHS.length, shown: filtered.length }), [filtered]);

  // Initialize Leaflet map (client only)
  useEffect(() => {
  let L: typeof import('leaflet');
  let map: L.Map;
  let layer: L.LayerGroup;

    const init = async () => {
      if (!mapDivRef.current) return;
      // 기존 맵 인스턴스가 있으면 제거
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      L = await import("leaflet");

      // 기본 아이콘 이슈 회피: circleMarker만 사용
      map = L.map(mapDivRef.current, {
        center: [37.5274, 126.9166], // 여의도공원 근처
        zoom: 15,
        zoomControl: false,
      });
      mapRef.current = map;

      // Tile layer (OSM)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // zoom control 오른쪽 하단
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // Layer group for booths
      layer = L.layerGroup().addTo(map);
      layerRef.current = layer;

      // 최초 렌더
      drawMarkers();
      fitToMarkers();

      // helpers
      function drawMarkers() {
        if (!layerRef.current) return;
        layerRef.current.clearLayers();

        filtered.forEach((b) => {
          const color = b.halalCertified ? "#16a34a" : "#2563eb"; // green vs blue
          const marker = L.circleMarker([b.lat, b.lon], {
            radius: 9,
            color,
            fillColor: color,
            fillOpacity: 0.85,
            weight: 2,
          });

          const tags = [
            b.halalCertified ? "Halal" : null,
            b.hasPork ? "Pork" : null,
            b.hasAlcohol ? "Alcohol" : null,
            `₩${b.avgPrice.toLocaleString()}`,
            ...b.cuisines,
            `🌶${b.spicinessMax}`,
          ]
            .filter(Boolean)
            .join(" · ");

          const osmLink = `https://www.openstreetmap.org/?mlat=${b.lat}&mlon=${b.lon}#map=18/${b.lat}/${b.lon}`;
          const gmapLink = `https://www.google.com/maps?q=${b.lat},${b.lon}`;

          marker.bindPopup(
            `
<div style="font-weight:700;margin-bottom:4px">${b.name}</div>
<div style="font-size:12px;opacity:.8;margin-bottom:6px">${tags}</div>
<div style="display:flex;gap:8px;margin-bottom:6px">
  <a href="${osmLink}" target="_blank" rel="noreferrer" style="font-size:12px">OpenStreetMap</a>
  <a href="${gmapLink}" target="_blank" rel="noreferrer" style="font-size:12px">Google Maps</a>
</div>
<a href="/map/${b.id}" style="display:inline-block;font-size:13px;font-weight:600;color:#2563eb;padding:4px 10px;border-radius:8px;border:1px solid #2563eb;background:#fff;">상세 보기</a>
            `.trim()
          );
          if (layerRef.current) {
            marker.addTo(layerRef.current);
          }
        });
      }

      function fitToMarkers() {
        if (!layerRef.current) return;
        // 레이어에 마커 없으면 기본 중앙
        if ((filtered?.length ?? 0) === 0) {
          map.setView([37.5274, 126.9166], 15);
          return;
        }
        const bounds = L.latLngBounds(filtered.map((b) => [b.lat, b.lon]));
        map.fitBounds(bounds.pad(0.2), { animate: true });
      }

      // 외부에서 호출할 수 있도록 참조 저장
  (map as unknown as Record<string, unknown>).__drawMarkers = drawMarkers;
  (map as unknown as Record<string, unknown>).__fitToMarkers = fitToMarkers;
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      layerRef.current = null;
    };
  // ...existing code...
  }, [filtered]);

  // Survey load (초기 1회)
  useEffect(() => {
    setSurvey(getSurvey());
  }, []);

  // 마커 다시 그리기(필터 변경 시)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.__drawMarkers) return;
    map.__drawMarkers();
  }, [filtered]);

  const refit = () => {
    const map = mapRef.current;
    if (!map || !map.__fitToMarkers) return;
    map.__fitToMarkers();
  };

  const reSyncSurvey = () => {
    setSurvey(getSurvey());
  };

  const clearFilters = () => {
    setSurvey(null);
  };

  const gotoMyLocation = async () => {
    setUsingGeoloc(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 })
      );
      const { latitude, longitude } = pos.coords;
      const L = (await import("leaflet")).default;
  const map = mapRef.current;
      if (map) {
        map.setView([latitude, longitude], 16);
        // pulsating marker
        const you = L.circleMarker([latitude, longitude], {
          radius: 10,
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        you.bindPopup(`<b>내 위치</b>`);
        setTimeout(() => map.removeLayer(you), 12000);
      }
    } catch {
      // ignore
    } finally {
      setUsingGeoloc(false);
    }
  };

  return (
    <main className="min-h-screen relative bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-[30] bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-[1100px] px-4 py-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Map</h1>
            <span className="text-xs text-gray-500">표시 {counts.shown} / 전체 {counts.total}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={reSyncSurvey}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              title="설문(localStorage)에서 필터 재적용"
            >
              설문 재동기화
            </button>
            <button
              onClick={clearFilters}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              title="모든 부스 보기"
            >
              필터 해제
            </button>
            <button
              onClick={refit}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              title="마커에 맞춰 보기"
            >
              보기 맞추기
            </button>
            <button
              onClick={gotoMyLocation}
              className="rounded-xl px-3 py-2 text-sm bg-blue-600 text-white disabled:opacity-50"
              disabled={usingGeoloc}
              title="내 위치로 이동"
            >
              {usingGeoloc ? "위치 확인 중…" : "내 위치"}
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="mx-auto max-w-[1100px] px-4 pb-6">
        <div className="h-[70vh] w-full rounded-2xl overflow-hidden border shadow-sm bg-white">
          <div ref={mapDivRef} className="h-full w-full" />
        </div>

        {/* Active filters preview */}
        <FilterPreview survey={survey} />
      </div>
    </main>
  );
}

/** =========================
 * Filter preview card
 * ========================= */
function FilterPreview({ survey }: { survey: Survey | null }) {
  if (!survey) {
    return (
      <div className="mt-4 text-sm text-gray-600">
        현재 <b>필터 해제</b> 상태입니다. <span className="opacity-70">설문 페이지에서 응답을 저장하면 자동으로 적용됩니다.</span>
      </div>
    );
  }

  const chips: string[] = [];
  chips.push(
    survey.halal === "required" ? "Halal: 필수" : survey.halal === "flexible" ? "Halal: 유연" : "Halal: 무관"
  );
  if (survey.avoid.pork) chips.push("돼지고기 제외");
  if (survey.avoid.alcohol) chips.push("알코올 제외");
  if (survey.avoid.beef) chips.push("소고기 제외");
  if (survey.avoid.shellfish) chips.push("갑각류 제외");
  chips.push(`예산 ≤ ₩${survey.budget.toLocaleString()}`);
  chips.push(`🌶 ≤ ${survey.spice}`);
  if (survey.cuisines.length) chips.push(`선호: ${survey.cuisines.join(", ")}`);

  return (
    <div className="mt-4 p-4 bg-white border rounded-2xl shadow-sm">
      <div className="text-sm font-semibold mb-2">적용 중인 필터</div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <span key={c} className="px-2 py-1 rounded-full border text-xs">
            {c}
          </span>
        ))}
      </div>
      {survey.notes && <div className="text-xs text-gray-600 mt-2">메모: {survey.notes}</div>}
    </div>
  );
}
