import type {
  HistoricalEvent,
  HeatmapPoint,
} from "../types";

const GRID_SIZE = 0.05;

export function aggregateEvents(
  events: HistoricalEvent[]
): HeatmapPoint[] {
  const grid = new Map<
    string,
    HeatmapPoint
  >();

  for (const event of events) {
    const latitude =
      Math.floor(event.latitude / GRID_SIZE) *
      GRID_SIZE +
      GRID_SIZE / 2;

    const longitude =
      Math.floor(event.longitude / GRID_SIZE) *
      GRID_SIZE +
      GRID_SIZE / 2;

    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

    const existing = grid.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      grid.set(key, {
        latitude,
        longitude,
        count: 1,
      });
    }
  }

  return Array.from(grid.values());
}