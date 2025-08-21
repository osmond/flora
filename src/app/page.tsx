import TodayPage, { revalidate } from "./today/page";
import AnalyticsPanel from "@/components/analytics/AnalyticsPanel";

export { revalidate };

export default function Page() {
  return (
    <div className="space-y-8">
      <AnalyticsPanel />
      <TodayPage />
    </div>
  );
}

