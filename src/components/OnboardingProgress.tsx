"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui";

interface Props {
  hasPlants: boolean;
  hasTasks: boolean;
}

type OnboardingState = {
  addedPlant: boolean;
  scheduledTask: boolean;
  viewedToday: boolean;
};

export default function OnboardingProgress({ hasPlants, hasTasks }: Props) {
  const [state, setState] = useState<OnboardingState>({
    addedPlant: false,
    scheduledTask: false,
    viewedToday: false,
  });

  useEffect(() => {
    const stored = JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("onboarding") || "{}"
        : "{}",
    );

    const updated: OnboardingState = {
      addedPlant: stored.addedPlant || hasPlants,
      scheduledTask: stored.scheduledTask || hasTasks,
      viewedToday: true,
    };

    setState(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding", JSON.stringify(updated));
    }
  }, [hasPlants, hasTasks]);

  const completed = Object.values(state).filter(Boolean).length;
  const progress = Math.round((completed / 3) * 100);

  if (completed === 3) return null;

  return (
    <div className="mb-6">
      <div className="mb-1 text-sm">
        Onboarding {completed}/3 steps complete
      </div>
      <Progress value={progress} className="h-2 w-full" />
    </div>
  );
}
