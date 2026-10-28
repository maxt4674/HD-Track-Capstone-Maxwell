import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64

if (!projectId || !serviceAccountBase64) {
  throw new Error('Missing Firebase environment variables. Check frontend/.env.local.')
}

const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'))

const app = getApps().length
  ? getApps()[0]!
  : initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })

const adminDb = getFirestore(app)

type EventType = 'Telstra Outage' | 'Power Outage' | 'Emergency Event' | 'Extreme Weather'

interface Location {
  name: string
  postcode: string
  latitude: number
  longitude: number
  count: number
}

const locations: Location[] = [
  { name: 'Melbourne CBD', postcode: '3000', latitude: -37.8136, longitude: 144.9631, count: 180 },
  { name: 'Dandenong', postcode: '3175', latitude: -37.9875, longitude: 145.2148, count: 100 },
  { name: 'Frankston', postcode: '3199', latitude: -38.1466, longitude: 145.1228, count: 80 },
  { name: 'Werribee', postcode: '3030', latitude: -37.9, longitude: 144.664, count: 75 },
  { name: 'Sunbury', postcode: '3429', latitude: -37.5811, longitude: 144.7261, count: 50 },
  { name: 'Geelong', postcode: '3220', latitude: -38.1499, longitude: 144.3617, count: 100 },
  { name: 'Ballarat', postcode: '3350', latitude: -37.5622, longitude: 143.8503, count: 70 },
  { name: 'Bendigo', postcode: '3550', latitude: -36.757, longitude: 144.2794, count: 65 },
  { name: 'Shepparton', postcode: '3630', latitude: -36.3805, longitude: 145.399, count: 50 },
  { name: 'Wodonga', postcode: '3690', latitude: -36.1218, longitude: 146.8881, count: 40 },
  { name: 'Warrnambool', postcode: '3280', latitude: -38.3818, longitude: 142.487, count: 35 },
  { name: 'Traralgon', postcode: '3844', latitude: -38.1953, longitude: 146.5415, count: 55 },
  { name: 'Sale', postcode: '3850', latitude: -38.1109, longitude: 147.068, count: 35 },
  { name: 'Mildura', postcode: '3500', latitude: -34.1855, longitude: 142.1625, count: 35 },
  { name: 'Horsham', postcode: '3400', latitude: -36.7113, longitude: 142.1993, count: 30 },
]

const eventTypes: EventType[] = [
  'Telstra Outage',
  'Power Outage',
  'Emergency Event',
  'Extreme Weather',
]

const descriptions: Record<EventType, string> = {
  'Telstra Outage': 'Historical telecommunications network disruption.',
  'Power Outage': 'Historical electricity supply interruption.',
  'Emergency Event': 'Historical emergency incident affecting the area.',
  'Extreme Weather': 'Historical severe weather conditions.',
}

function randomOffset(): number {
  return (Math.random() - 0.5) * 0.15
}

function randomDate(): Date {
  const start = new Date('2024-01-01T00:00:00Z').getTime()
  const end = new Date('2024-12-31T23:59:59Z').getTime()

  return new Date(start + Math.random() * (end - start))
}

async function seedHistoricalEvents() {
  const batch = adminDb.batch()

  let total = 0

  for (const location of locations) {
    for (let i = 0; i < location.count; i++) {
      const type: EventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]!

      const startTime = randomDate()

      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

      const eventRef = adminDb.collection('historicalEvents').doc()

      batch.set(eventRef, {
        type,
        title: `${type} - ${location.name}`,
        description: descriptions[type],
        latitude: location.latitude + randomOffset(),
        longitude: location.longitude + randomOffset(),
        postcode: location.postcode,
        startTime,
        endTime,
        source: 'Demonstration Data',
        createdAt: new Date(),
      })

      total++
    }
  }

  await batch.commit()

  console.log(`Successfully seeded ${total} historical events.`)
}

seedHistoricalEvents().catch((error) => {
  console.error('Failed to seed historical events:', error)
  process.exitCode = 1
})
