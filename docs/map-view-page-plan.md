# Map View Page — Implementation Plan

## Overview

Build an interactive **Map View** page at `/business/map` using **React-Leaflet** that displays both commercial properties and fleet vehicles on a themed map. The page replaces the current `BusinessComingSoon` placeholder.

**User selections:**
- Both properties and fleet vehicles, with a layer toggle
- Popup on marker click + link to detail page
- Theme-aware map tiles (light/dark match app theme)
- Split layout: asset list panel on the left, map on the right

---

## Tech Stack Additions

Install the following packages:
- `leaflet` — core mapping library
- `react-leaflet` — React bindings for Leaflet

No other mapping dependencies needed; Leaflet uses OpenStreetMap-compatible tile servers (CartoDB) which require no API key.

---

## File Structure

### New files
```
src/pages/business/MapViewPage.jsx       — Page component (route entry)
src/pages/business/MapViewPage.scss      — Page-level layout styles
src/components/business/AssetMap.jsx     — Leaflet map component
src/components/business/AssetMap.scss    — Map-specific styles
src/components/business/AssetListPanel.jsx  — Left-panel list of assets
src/components/business/AssetListPanel.scss — List panel styles
```

### Modified files
```
src/App.jsx                              — Replace BusinessComingSoon with MapViewPage for /business/map
```

---

## Architecture & Component Design

### `MapViewPage.jsx` (Page container)
- Manages shared state: `activeLayers` (which asset types are visible), `selectedAssetId`, `searchQuery`
- Uses `React.lazy` + `Suspense` to lazy-load `AssetMap` (avoids bundling Leaflet until user visits this route — major performance benefit)
- Responsive layout:
  - **Desktop (≥1056px):** Horizontal split — `AssetListPanel` (~320px fixed width) + `AssetMap` (fills remaining space)
  - **Tablet/Mobile (<1056px):** Carbon `Tabs` with two tabs: "List" and "Map" — only one visible at a time to prevent a cramped layout on small screens
- Page title, layer toggle buttons, and search input sit above or alongside the panel

### `AssetMap.jsx` (Leaflet map)
- Uses `MapContainer`, `TileLayer`, `Marker`, `Popup`, `useMap` from `react-leaflet`
- **Tile layers:** Switches between CartoDB Voyager (light) and CartoDB Dark Matter (dark) by reading `isDark` from `useTheme()`
- **Markers:**
  - Properties → Red custom SVG marker using `--interactive-primary` color + `Building` icon
  - Vehicles → Teal/secondary color custom SVG marker + `CarFront` icon
  - Active/selected marker → Slightly larger size + ring styling
- **Clustering:** Uses `leaflet.markercluster` (`react-leaflet-cluster`) to group nearby markers when zoomed out — critical for performance at scale
- **Popup content:** Asset name, type badge, address, status, open claims, monthly premium, and a "View Details" button that navigates to the detail page
- **Auto-fit:** `fitBounds` to encompass all visible markers on initial load and when layers change
- Exposes a ref/callback so the parent can programmatically pan to a selected asset from the list panel

### `AssetListPanel.jsx` (Left list panel)
- Accepts filtered list of assets based on active layers + search query
- Carbon `Search` component for filtering by name or address
- Scrollable list of items, each showing: asset icon, name, city/state, status tag, monthly premium
- Selected state (highlighted row) when a marker is active on the map
- Clicking a list item pans/zooms the map to that marker and opens its popup

---

## Data

Reuse existing mock data from `src/data/businessMockData.js`:
- `mockProperties` — 10+ properties, each with `lat`, `lng`, `name`, `address`, `status`, `monthlyPremium`, `openClaims`
- `mockVehicles` — fleet vehicles (need to verify lat/lng presence; if missing, add mock coordinates to existing entries)

All data is already imported and available — no new data files needed.

---

## Layer Toggle Controls

Two toggle buttons rendered above/beside the map:
- **Properties** (Building icon) — toggled on by default
- **Fleet Vehicles** (CarFront icon) — toggled on by default

Using Carbon `Button` with `kind="tertiary"` when active and `kind="ghost"` when inactive, each with `aria-pressed` set appropriately for screen readers.

When a layer is toggled off, its markers disappear and the map re-fits bounds to remaining visible markers.

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop ≥1056px | Side-by-side: list panel (320px) + map (fills remaining width), full viewport height minus header |
| Tablet 672–1055px | Carbon Tabs: "List" tab + "Map" tab, each full width |
| Mobile <672px | Carbon Tabs: same as tablet, map height set to 60vh to keep it usable |

Map container height:
- Desktop: `calc(100vh - 48px)` (subtract header height)
- Tablet/Mobile: `60vh` minimum, `calc(100vh - 130px)` accounting for tabs + header

---

## WCAG 2.1 AA Compliance

### Perceivable
- Marker color is **not** the only differentiator — shape/icon embedded in the SVG marker also differs between asset types
- All map popup text meets 4.5:1 contrast ratio using design tokens (`--text-primary` on `--background-primary`)
- Map tile attributions included (Leaflet handles this by default)

### Operable
- **Layer toggles:** `aria-pressed` reflects active state; keyboard-focusable
- **List panel:** Fully keyboard-navigable list (arrow keys, Enter to select)
- **Map:** Has `role="application"` and `aria-label="Interactive asset map"` so screen readers treat it as an app region
- **Marker popups:** Focus is moved into the popup when it opens; Escape closes it
- All touch targets ≥44×44px (buttons, list items, markers)
- Map zoom/pan controls remain keyboard-accessible (Leaflet provides +/− keyboard zoom by default)

### Understandable
- Empty states clearly communicated: "No assets match your filters" message in the list panel
- Loading state: Carbon `InlineLoading` shown in the map area while tiles load
- Layer toggle buttons have clear labels visible at all times (not just on hover)

### Robust
- Map container uses semantic HTML landmark (`<section aria-label="Map View">`)
- List panel uses `<ul>` with `role="listbox"` pattern
- All interactive elements have explicit, descriptive `aria-label` attributes

---

## Theme Awareness

| App Theme | Tile URL |
|-----------|----------|
| Light (`white` / `g10`) | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png` |
| Dark (`g90` / `g100`) | `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` |

The `TileLayer` URL updates whenever `isDark` changes. Attribution text: `© OpenStreetMap contributors © CARTO`.

Custom SVG markers use CSS custom properties so their fill colors update automatically with theme:
- Properties: `var(--interactive-primary)` (red in light, lighter red in dark)
- Vehicles: `var(--color-brand-blue-60)` or a secondary semantic color

Map popup backgrounds use: `background: var(--background-primary)`, `color: var(--text-primary)`

---

## Performance Optimizations

1. **Lazy loading:** `AssetMap` is `React.lazy`-loaded — Leaflet (~100kb gzip) is only downloaded when the user navigates to this page
2. **Marker clustering:** `react-leaflet-cluster` clusters nearby markers at low zoom levels, preventing DOM overload
3. **Memoization:** Filtered asset lists are `useMemo`-derived from mock data + active layers + search query — no redundant recalculation on re-renders
4. **Tile caching:** Browser caches CartoDB tiles automatically
5. **Virtualized list:** If the asset list grows large in the future, the list panel can be upgraded to a virtualized list (react-window). With current mock data (~20 items), standard rendering is sufficient

---

## Popup Content Structure

```
┌─────────────────────────────────┐
│ 🏢 Downtown Office Building     │
│  [Property] [Active]            │
│  123 Main St, San Francisco, CA │
│  Monthly Premium: $2,450        │
│  Open Claims: 0                 │
│                    [View Details →] │
└─────────────────────────────────┘
```

- Type badge: Carbon `Tag` component (`kind="blue"` for property, `kind="teal"` for vehicle)
- Status badge: Carbon `Tag` (`kind="green"` for Active)
- "View Details" navigates to `/business/properties/:id` or `/business/fleet/:id`

---

## Implementation Steps

1. **Install dependencies** — `npm install leaflet react-leaflet react-leaflet-cluster`
2. **Verify vehicle lat/lng** — Check `mockVehicles` in `businessMockData.js`; add coordinates if missing
3. **Create `AssetMap.jsx`** — Leaflet map with custom markers, tile switching, clustering, popups
4. **Create `AssetListPanel.jsx`** — Filterable asset list with selection state
5. **Create `MapViewPage.jsx`** — Page layout, state management, layer toggle controls, lazy-load wrapper
6. **Create SCSS files** — Theme-aware styles using design tokens for all custom elements
7. **Update `App.jsx`** — Replace `BusinessComingSoon` with `MapViewPage` for `/business/map` route
8. **Import Leaflet CSS** — Add `import 'leaflet/dist/leaflet.css'` in the map component (scoped import)
9. **Fix Leaflet default marker icons** — Apply the standard Vite/Webpack fix for Leaflet's broken default icon URLs (set `L.Icon.Default.mergeOptions` with bundled asset paths)
10. **Test and verify** — Light/dark themes, mobile/tablet/desktop layouts, keyboard nav, screen reader behavior, marker clustering, popup links

---

## SEO & Schema Data

### React-Leaflet is Client-Side Only — and That's Fine Here

React-Leaflet requires browser APIs (`window`, `document`) and cannot run server-side. However, this is **not a new limitation introduced by the map** — the entire app is already a Vite SPA (Single Page Application), meaning every page is client-side rendered. The map page is no different from `BusinessDashboard.jsx` or any other page in this project.

If public SSR/SEO were needed for the whole app, the solution would be migrating to **Next.js** — a separate architectural decision unrelated to the map library choice. React-Leaflet works in Next.js via `dynamic(() => import('./AssetMap'), { ssr: false })`.

### Schema.org / JSON-LD

Schema markup **can** be added to the Map View page independently of how the map renders. A `<script type="application/ld+json">` block can embed structured data for each insured location using the `Place` or `LocalBusiness` schema types:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Downtown Office Building",
  "address": { "@type": "PostalAddress", "streetAddress": "123 Main St", ... },
  "geo": { "@type": "GeoCoordinates", "latitude": 37.7749, "longitude": -122.4194 }
}
```

This can be injected via a `<Helmet>` component (if `react-helmet-async` is installed) or as a static `<script>` tag rendered by the page component.

### Authenticated Route — SEO Is Not Applicable

`/business/map` is part of the authenticated business dashboard. Search engines should not (and cannot) index authenticated content, making public SEO irrelevant for this specific route. No `robots.txt` or canonical changes are needed.

**Recommendation:** Add JSON-LD Schema markup for the insured locations as a progressive enhancement — it's low-effort and future-proofs the data if the app ever moves to SSR.

---

## Key Design Decisions

- **CartoDB tiles (no API key):** OpenStreetMap attribution is free and appropriate; no API key management needed. Mapbox would require a key and billing setup.
- **`react-leaflet-cluster` over `leaflet.markercluster`:** Better React integration, supports SSR/lazy patterns, maintained actively.
- **Split layout over overlay controls:** A left panel gives a consistently accessible alternative to the map for all users, including keyboard-only and screen reader users who cannot interact with the visual map.
- **`React.lazy` for the map:** Leaflet is one of the largest dependencies; lazy loading it keeps the initial bundle small and the rest of the app fast.
- **Custom SVG markers over default Leaflet icons:** Allows brand color tokens to be applied and ensures markers are visually distinct by both color AND shape (WCAG 1.4.1 — use of color).
