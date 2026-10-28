'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import { getHistoricalHeatmap } from '../actions/historicalEvents.actions'

import type { HeatmapFilters, HeatmapResult } from '../types'

import HeatmapFiltersComponent from './HeatmapFilters'
import HeatmapStatus from './HeatmapStatus'

const HistoricalHeatmap = dynamic(() => import('./HistoricalHeatmap'), {
  ssr: false,
  loading: () => <div className="h-[570px] animate-pulse rounded-lg bg-slate-100" />,
})

const initialFilters: HeatmapFilters = {
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  eventType: 'All Events',
}

export default function HistoricalEventsClient() {
  const [filters, setFilters] = useState<HeatmapFilters>(initialFilters)

  const [result, setResult] = useState<HeatmapResult | null>(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [hasLoaded, setHasLoaded] = useState(false)

  const loadEvents = useCallback(async (selectedFilters: HeatmapFilters) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getHistoricalHeatmap(selectedFilters)

      if (!response.success) {
        setResult(null)
        setError(response.error)
        return
      }

      setResult(response.data)
    } catch {
      setResult(null)
      setError('There was a problem retrieving data from Firebase. ' + 'Please try again.')
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    void loadEvents(initialFilters)
  }, [loadEvents])

  const applyFilters = () => {
    if (!filters.startDate || !filters.endDate || filters.startDate > filters.endDate) {
      setError('Please select a valid date range.')
      return
    }

    void loadEvents(filters)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A2E61]">Historical Events Heatmap</h1>

          <p className="mt-3 text-[#405578]">
            View the concentration of past network, power and emergency events across Victoria.
          </p>
        </header>

        <HeatmapFiltersComponent
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          loading={loading}
        />

        <HistoricalHeatmap
          points={result?.points ?? []}
          loading={loading}
          error={error}
          hasLoaded={hasLoaded}
          onRetry={() => void loadEvents(filters)}
        />

        <HeatmapStatus count={loading || error ? null : (result?.totalEvents ?? null)} />
      </div>
    </div>
  )
}
