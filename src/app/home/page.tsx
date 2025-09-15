"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16 text-black flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 py-8 bg-white rounded-2xl shadow-lg border text-center">
        <h1 className="text-2xl font-bold mb-4">관광 AI 페스티벌</h1>
        <p className="text-lg font-semibold mb-6">어서오세요! 원하는 메뉴와 부스를 찾아보세요.</p>
        <div className="flex flex-col gap-4">
          <Link href="/map" className="block w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition">지도에서 부스 찾기</Link>
          <Link href="/mypage" className="block w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow hover:bg-indigo-700 transition">마이페이지</Link>
        </div>
      </div>
    </main>
  );
}
