"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import type {
  FeatureCollection,
  Point,
} from "geojson";

import type { HeatmapPoint } from "../types";

import HeatmapLegend from "./HeatmapLegend";

interface HistoricalHeatmapProps {
  points: HeatmapPoint[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  onRetry: () => void;
}

const SOURCE_ID = "historical-events";
const LAYER_ID = "historical-heatmap";

function buildGeoJSON(
  points: HeatmapPoint[]
): FeatureCollection<Point, { count: number }> {
  return {
    type: "FeatureCollection",

    features: points.map((point) => ({
      type: "Feature",

      geometry: {
        type: "Point",
        coordinates: [
          point.longitude,
          point.latitude,
        ],
      },

      properties: {
        count: point.count,
      },
    })),
  };
}

export default function HistoricalHeatmap({
  points,
  loading,
  error,
  hasLoaded,
  onRetry,
}: HistoricalHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const dataRef = useRef(buildGeoJSON(points));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

    const map = new maplibregl.Map({
      container: containerRef.current,

      style: {
        version: 8,

        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              "© OpenStreetMap contributors",
          },
        },

        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },

      center: [144.5, -37.1],
      zoom: 6,
    });

    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-left"
    );

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: dataRef.current,
      });

      map.addLayer({
        id: LAYER_ID,
        type: "heatmap",
        source: SOURCE_ID,

        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "count"],
            0, 0,
            20, 1,
          ],

          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4, 0.6,
            10, 2,
          ],

          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],

            0, "rgba(0,0,255,0)",
            0.2, "#5555ff",
            0.4, "#00cfff",
            0.6, "#00e676",
            0.8, "#ffeb3b",
            0.9, "#ff9800",
            1, "#ff1744",
          ],

          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4, 15,
            10, 40,
          ],

          "heatmap-opacity": 0.8,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const data = buildGeoJSON(points);

    dataRef.current = data;

    const map = mapRef.current;

    if (!map) {
      return;
    }

    const source = map.getSource(
      SOURCE_ID
    ) as maplibregl.GeoJSONSource | undefined;

    source?.setData(data);
  }, [points]);

  const showEmpty =
    hasLoaded &&
    !loading &&
    !error &&
    points.length === 0;

  return (
    <div className="relative h-[570px] w-full
                    overflow-hidden rounded-lg
                    border border-slate-200">
      <div
        ref={containerRef}
        className="h-full w-full"
      />

      <HeatmapLegend />

      {(loading || error || showEmpty) && (
        <div className="absolute inset-0 z-20
                        flex items-center justify-center
                        bg-white/50">
          <div
            className="w-[380px] max-w-[90%]
                       rounded-xl bg-white p-8
                       text-center shadow-xl"
            role="status"
            aria-live="polite"
          >
            {loading && (
              <>
                <div
                  className="mx-auto mb-5 h-12 w-12
                             animate-spin rounded-full
                             border-4 border-indigo-100
                             border-t-indigo-600"
                />

                <h3 className="text-lg font-semibold
                               text-[#1A2E61]">
                  Loading historical events...
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Retrieving data from Firebase.
                  This may take a few seconds.
                </p>
              </>
            )}

            {error && !loading && (
              <>
                <div className="mb-4 text-4xl text-red-500">
                  !
                </div>

                <h3 className="text-lg font-semibold
                               text-[#1A2E61]">
                  Unable to load historical events
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-5 rounded-md
                             bg-indigo-600 px-8 py-3
                             text-white hover:bg-indigo-700"
                >
                  Retry
                </button>
              </>
            )}

            {showEmpty && (
              <>
                <div className="mb-4 text-4xl">
                  🔎
                </div>

                <h3 className="text-lg font-semibold
                               text-[#1A2E61]">
                  No historical events found
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  There are no events matching your
                  selected filters. Try adjusting
                  your date range or event type.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}