export type HistoricalEventType =
  | "Telstra Outage"
  | "Power Outage"
  | "Emergency Event"
  | "Extreme Weather";

export type EventTypeFilter =
  | "All Events"
  | HistoricalEventType;

export interface HistoricalEvent {
  id: string;
  type: HistoricalEventType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  postcode: string;
  startTime: string;
  endTime: string;
}

export interface HeatmapFilters {
  startDate: string;
  endDate: string;
  eventType: EventTypeFilter;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  count: number;
}

export interface HeatmapResult {
  points: HeatmapPoint[];
  totalEvents: number;
}

export type HeatmapActionResult =
  | {
      success: true;
      data: HeatmapResult;
    }
  | {
      success: false;
      error: string;
    };