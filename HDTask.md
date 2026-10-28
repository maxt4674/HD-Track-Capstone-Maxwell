HD Task — Historical Events Heatmap
Overview
Implemented a Historical Events Heatmap for the Network Intelligence Console. The feature enables Duty Coordinators to explore historical incidents across Victoria, identify geographical concentrations, and filter events by date range and incident type.
Feature implementation
- Added a protected /historical-events page to the Next.js dashboard.
- Built an interactive map using MapLibre GL to visualise incident density.
- Added filters for date range and event type: Telstra Outage, Power Outage, Emergency Event, Extreme Weather, and All Events.
- Displayed the total number of events matching the selected filters, alongside loading, empty, and error states.
- Aggregated nearby event coordinates into geographic grid cells to produce heatmap density points.
- Included a map legend and supporting interface components.
Architecture and key decisions
Decision	Rationale
Next.js Server Actions	Retrieve data server-side without building a separate Express endpoint for this feature.
Firebase Admin SDK	Access Firestore securely from server-side code.
Cloud Firestore	Store historical events and heatmap query records.
MapLibre GL	Render an interactive geographic heatmap.
Grid-based aggregation	Combine nearby events for a clearer density visualisation.
Shared TypeScript types and validation	Keep event and filter data consistent between the UI and server.


Firestore collections
historicalEvents stores event identifiers, event type, title, description, latitude, longitude, postcode, start and end timestamps, and source information for demonstration records.

heatmapQueries records submitted heatmap queries for auditing or usage analysis.

Firestore rules restrict direct browser access to these collections. The application uses authenticated server-side operations to retrieve and process data.
Demonstration data
- Created a TypeScript seed script to generate example historical events in Victoria.
- Configured a standalone Firebase Admin initialisation for the seed script to avoid importing Next.js server-only modules from tsx.
- Expanded the proposed demonstration dataset to approximately 1,000 events across metropolitan and regional locations, spanning 2022–2026.
- The expanded dataset and final record count should be confirmed in Firestore; the discussion does not establish that the expanded script was successfully executed.

Links
- Repository: https://github.com/maxt4674/HD-Track-Capstone-Maxwell
- Branch / PR: https://github.com/maxt4674/HD-Track-Capstone-Maxwell/feature/vercel
- CI workflow: https://github.com/maxt4674/HD-Track-Capstone-Maxwell/blob/main/.github/workflows/ci.yml
- Live Vercel URL: https://hd-track-capstone-maxwell-mjmu.vercel.app