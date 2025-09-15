"use client";
import { useEffect, useState } from "react";
import BottomTab from "./BottomTab";
import OnboardingModal from "./OnboardingModal";

export default function AppWithOnboarding({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("onboarding")) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-900 flex justify-center items-center">
      <div className="relative max-w-[390px] min-h-screen bg-white shadow-lg flex flex-col overflow-hidden text-black">
        <div className="flex-1 pb-16">{/* 하단탭 높이만큼 padding */}
          {children}
        </div>
        <BottomTab />
        {showOnboarding && (
          <OnboardingModal onComplete={() => setShowOnboarding(false)} />
        )}
      </div>
    </div>
  );
}

