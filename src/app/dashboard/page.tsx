import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const { data: tasks } = await supabaseAdmin
    .from("tasks")
    .select("id, completed_at")
    .eq("user_id", userId);
  const total = tasks?.length ?? 0;
  const completed = tasks?.filter((t) => t.completed_at).length ?? 0;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  const { data: events } = await supabaseAdmin
    .from("events")
    .select("created_at")
    .eq("user_id", userId)
    .eq("type", "water")
    .order("created_at", { ascending: false })
    .limit(30);
  let streak = 0;
  if (events && events.length) {
    const days = events.map((e) =>
      new Date(e.created_at as string).toDateString(),
    );
    const unique = Array.from(new Set(days));
    streak = 1;
    for (let i = 1; i < unique.length; i++) {
      const prev = new Date(unique[i - 1]);
      const curr = new Date(unique[i]);
      if (prev.getTime() - curr.getTime() === 86_400_000) streak++;
      else break;
    }
  }

  const lat = process.env.WEATHER_LAT ?? "40.71";
  const lon = process.env.WEATHER_LON ?? "-74.01";
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=et0_fao_evapotranspiration&timezone=auto`;
  const res = await fetch(url);
  const et0Data: { date: string; value: number }[] = [];
  if (res.ok) {
    const data = await res.json();
    const daily = data.daily;
    for (let i = 0; i < daily.time.length; i++) {
      et0Data.push({
        date: daily.time[i],
        value: daily.et0_fao_evapotranspiration[i],
      });
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="et0">ET₀ Log</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <p className="font-medium">Completion</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-6 px-2">
                    Range
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              {completion}% of tasks completed
            </p>
            <p className="text-sm text-muted-foreground">
              Current streak: {streak} days
            </p>
          </div>
        </TabsContent>
        <TabsContent value="et0">
          <ul className="mt-4 space-y-1 text-sm">
            {et0Data.map((d) => (
              <li key={d.date}>
                {d.date}: {d.value}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
