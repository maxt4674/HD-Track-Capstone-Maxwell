import type { Metadata } from 'next'

import { requireAuth } from '@/actions/auth.actions'

import HistoricalEventsClient from '@/features/historical-events/components/HistoricalEventsClient'

export const metadata: Metadata = {
  title: 'Historical Events | Network Intelligence Console',
  description: 'View historical network outages and emergency events across Victoria.',
}

export default async function HistoricalEventsPage() {
  await requireAuth()

  return <HistoricalEventsClient />
}
