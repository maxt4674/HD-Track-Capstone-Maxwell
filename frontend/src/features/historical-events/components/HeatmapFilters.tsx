'use client'

import type { HeatmapFilters as Filters, EventTypeFilter } from '../types'

interface HeatmapFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onApply: () => void
  loading: boolean
}

export default function HeatmapFilters({
  filters,
  onChange,
  onApply,
  loading,
}: HeatmapFiltersProps) {
  const inputClass =
    'w-full rounded-md border border-slate-300 bg-white ' +
    'px-3 py-3 text-[#1A2E61] outline-none ' +
    'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div>
        <label htmlFor="heatmap-start-date" className="mb-2 block font-medium text-[#1A2E61]">
          Start Date
        </label>

        <input
          id="heatmap-start-date"
          type="date"
          value={filters.startDate}
          max={filters.endDate}
          onChange={(event) =>
            onChange({
              ...filters,
              startDate: event.target.value,
            })
          }
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="heatmap-end-date" className="mb-2 block font-medium text-[#1A2E61]">
          End Date
        </label>

        <input
          id="heatmap-end-date"
          type="date"
          value={filters.endDate}
          min={filters.startDate}
          onChange={(event) =>
            onChange({
              ...filters,
              endDate: event.target.value,
            })
          }
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="heatmap-event-type" className="mb-2 block font-medium text-[#1A2E61]">
          Event Type
        </label>

        <select
          id="heatmap-event-type"
          value={filters.eventType}
          onChange={(event) =>
            onChange({
              ...filters,
              eventType: event.target.value as EventTypeFilter,
            })
          }
          className={inputClass}
        >
          <option>All Events</option>
          <option>Telstra Outage</option>
          <option>Power Outage</option>
          <option>Emergency Event</option>
          <option>Extreme Weather</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="w-full cursor-pointer rounded-md bg-indigo-600 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </div>
    </div>
  )
}
