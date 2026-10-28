import { requireAuth } from "@/actions/auth.actions";
import HistoricalEventsClient from "@/features/historical-events/components/HistoricalEventsClient";

export default async function HistoricalEventsPage() {
  await requireAuth();

  return (
    <main className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Historical Events Heatmap
        </h1>

        <p className="text-gray-600">
          Explore historical outages, emergencies, and extreme weather
          events across Victoria.
        </p>
      </div>

      <HistoricalEventsClient />
    </main>
  );
}