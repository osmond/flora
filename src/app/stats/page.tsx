import dynamic from "next/dynamic";

const AnalyticsPanel = dynamic(() => import("@/components/analytics/AnalyticsPanel"), {
  ssr: false,
});

export const revalidate = 60;

export default function StatsPage() {
  return <AnalyticsPanel />;
}
