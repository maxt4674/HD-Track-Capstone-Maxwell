"use server";

import { z } from "zod";

import { DateTime } from "luxon";

import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/actions/auth.actions";

import { aggregateEvents } from "../lib/aggregateEvents";

import type {
  HistoricalEvent,
  HistoricalEventType,
  HeatmapActionResult,
  HeatmapFilters,
} from "../types";

const eventTypes = [
  "All Events",
  "Telstra Outage",
  "Power Outage",
  "Emergency Event",
  "Extreme Weather",
] as const;

const filtersSchema = z
  .object({
    startDate: z.string().regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid start date format"
    ),

    endDate: z.string().regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid end date format"
    ),

    eventType: z.enum(eventTypes),
  })
  .refine(
    (data) => data.startDate <= data.endDate,
    {
      message: "End date must not precede start date",
      path: ["endDate"],
    }
  );

export async function getHistoricalHeatmap(
  filters: HeatmapFilters
): Promise<HeatmapActionResult> {
  // Authentication errors are deliberately not converted
  // into successful data responses.
  const user = await requireAuth();

  const validation = filtersSchema.safeParse(filters);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid heatmap filters",
    };
  }

  const {
    startDate,
    endDate,
    eventType,
  } = validation.data;

  try {
    const snapshot = await adminDb
      .collection("historicalEvents")
      .get();

    const events: HistoricalEvent[] = snapshot.docs.map(
      (doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          type: data.type as HistoricalEventType,
          title: data.title,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          postcode: data.postcode,
          startTime: data.startTime.toDate().toISOString(),
          endTime: data.endTime.toDate().toISOString(),
        };
      }
    );

    const rangeStart = DateTime.fromISO(startDate, {
    zone: "Australia/Melbourne",
    }).startOf("day");

    const rangeEnd = DateTime.fromISO(endDate, {
    zone: "Australia/Melbourne",
    }).endOf("day");

    if (!rangeStart.isValid || !rangeEnd.isValid) {
    return {
        success: false,
        error: "Invalid date range",
    };
    }

    const filteredEvents = events.filter((event) => {
      const matchesType =
        eventType === "All Events" ||
        event.type === eventType;

      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      const matchesDate =
      eventStart.getTime() <= rangeEnd.toMillis() &&
      eventEnd.getTime() >= rangeStart.toMillis();

      return matchesType && matchesDate;
    });

    const points = aggregateEvents(filteredEvents);

    await adminDb.collection("heatmapQueries").add({
      userId: user.uid,
      eventType,
      startDate,
      endDate,
      queriedAt: new Date(),
      resultCount: filteredEvents.length,
    });

    return {
      success: true,
      data: {
        points,
        totalEvents: filteredEvents.length,
      },
    };
  } catch {
    return {
      success: false,
      error: "Unable to retrieve historical events",
    };
  }
}