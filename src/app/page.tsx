import TodayPage, { revalidate } from "./today/page";
import dynamic from "next/dynamic";

const AnalyticsPanel = dynamic(
  () => import("@/components/analytics/AnalyticsPanel"),
  { ssr: false }
);

export { revalidate };

export default function Page() {
  return (
    <div className="space-y-8">
      <AnalyticsPanel />
      <TodayPage />
    </div>
  );
}

