# Financial Dashboard Prototypes

This document describes the three Financial Dashboard prototypes built for the Insurance Financial Analytics Dashboard (IFAD) project.

## Overview

Three distinct dashboard prototypes have been created, each with a different design philosophy and user experience approach. All prototypes implement the complete PRD requirements with realistic mock data.

## Access the Prototypes

Visit `/dashboards` to see the dashboard selector and choose which prototype to explore.

Direct links:
- **Conservative**: `/dashboard-conservative`
- **Modern Sleek**: `/dashboard-modern`
- **Wild & Creative**: `/dashboard-creative`

## Prototype Details

### 1. Conservative Dashboard (`/dashboard-conservative`)

**Design Philosophy**: Traditional Financial Overview

**Visual Style**:
- Classic grid layout
- Standard KPI cards with clear hierarchy
- Traditional color scheme (green for revenue, red for expenses)
- Familiar data table patterns
- Professional, enterprise-ready styling

**Key Features**:
- Four KPI cards showing Total Owed (YTD), Total Claimed (YTD), Loss Ratio, and Total Assets
- Interactive chart with Line/Bar toggle
- Sortable/filterable data table with 20 rows per page
- Category filter (All, Property, Auto)
- Drill-down to detailed asset views

**Best For**: Traditional financial analysts, conservative stakeholders, enterprise environments

---

### 2. Modern Sleek Dashboard (`/dashboard-modern`)

**Design Philosophy**: Minimalist Design

**Visual Style**:
- Clean, contemporary interface
- Blue gradient hero section
- Minimalist KPI cards with subtle animations
- Tabbed navigation for better organization
- Refined spacing and typography
- Progress indicators and status badges

**Key Features**:
- Gradient hero banner with health score
- Four minimalist KPI cards with progress bars
- Tabbed views (All Assets, Property, Auto)
- Context-aware charts that change based on active tab
- Tag-based categorization with purple/cyan color scheme
- Loss ratio indicators with color coding

**Best For**: Modern startups, tech-forward teams, users who prefer clean interfaces

---

### 3. Wild & Creative Dashboard (`/dashboard-creative`)

**Design Philosophy**: Data Storytelling Experience

**Visual Style**:
- Bold purple/magenta gradient hero
- Asymmetric layouts (not everything in equal columns)
- Multiple chart types (Line, Donut, Bar)
- Creative color schemes (purple, cyan, magenta, teal)
- Gradient cards with shadows
- Unique visual hierarchy

**Key Features**:
- Purple gradient hero with portfolio health score badge
- Large feature card with embedded trend chart
- Stacked mini-cards with different gradients
- Donut chart showing portfolio distribution
- Bar chart for claims comparison
- Risk-based sorting (highest claims first)
- Risk score badges (High/Medium/Low)

**Best For**: Creative agencies, innovative startups, presentations, stakeholders who value unique design

---

## Common Features (All Prototypes)

### Dashboard Main View
- **Summary Statistics (KPI Cards)**:
  - Total Owed (YTD) with Property/Auto breakdown
  - Total Claimed (YTD) with Property/Auto breakdown
  - Loss Ratio percentage
  - Total Assets count

- **Expense Visualization Chart**:
  - 12 months of historical data
  - Premiums vs Claims visualization
  - Property and Auto data series
  - Interactive/toggleable chart types

- **Asset Performance Table**:
  - 25 realistic insurance assets (10 Property, 15 Auto)
  - Asset ID/Name, Category, Premium Due, Due Date, Total Claims
  - Sortable columns
  - Pagination (10/20/30/50 items per page)
  - Search functionality
  - Clickable rows for drill-down

### Asset Detail View
- **Header Section**:
  - Asset name and category
  - Policy number
  - Risk indicators (varies by prototype)

- **Policy Information**:
  - Policy Number
  - Coverage Amount
  - Deductible
  - Premium Due
  - Due Date
  - VIN (for Auto assets)
  - Location (for Property assets)

- **Claim Summary**:
  - Total claims filed
  - Lifetime claims amount
  - Loss ratio calculation

- **Claim History Table**:
  - Claim ID, Date, Type, Amount, Status
  - Status badges (Paid, Closed, Under Review, Pending)
  - Sortable table
  - Empty state for assets with no claims

- **Policy Documents**:
  - Document name, type, size
  - Upload date
  - Download action buttons
  - PDF icons

## Data & Mock Generation

### Mock Data Source
All data is generated from `src/data/financialMockData.js` and includes:

- **12 months of historical data** (last 12 months from current date)
- **25 insurance assets**:
  - 10 Property assets (warehouses, industrial parks, office complexes, etc.)
  - 15 Auto assets (commercial trucks and fleet vehicles)
- **Realistic financial metrics**:
  - Premiums: $800-$10,000 per asset
  - Claims: $0-$50,000 lifetime per asset
  - Loss ratios: 68-72% average
  - Growing premium trend over time

### Data Generation Functions
- `getMonthlyData()`: Returns 12 months of aggregated premium/claim data
- `getAssetData()`: Returns 25 insurance assets with policy details
- `calculateYTDStats()`: Computes year-to-date statistics
- `generateClaimHistory(assetId, category)`: Creates 0-4 claims per asset
- `generatePolicyDocuments(assetId)`: Creates 3 policy documents per asset

Data is cached in memory for consistency across navigation.

## Technical Implementation

### Technology Stack
- **React 19**: Component framework
- **React Router DOM v7**: Navigation and routing
- **Carbon Design System (`@carbon/react`)**: UI component library
- **Carbon Charts (`@carbon/charts-react`)**: Data visualization
- **SCSS**: Styling with design tokens

### File Structure
```
src/
├── data/
│   └── financialMockData.js           # Mock data generator
├── pages/dashboards/
│   ├── DashboardSelector.jsx          # Landing page to choose prototype
│   ├── DashboardSelector.scss
│   ├── ConservativeDashboard.jsx      # Conservative prototype
│   ├── ConservativeDashboard.scss
│   ├── ConservativeAssetDetail.jsx    # Conservative detail view
│   ├── ConservativeAssetDetail.scss
│   ├── ModernDashboard.jsx            # Modern prototype
│   ├── ModernDashboard.scss
│   ├── ModernAssetDetail.jsx          # Modern detail view
│   ├── ModernAssetDetail.scss
│   ├── CreativeDashboard.jsx          # Creative prototype
│   ├── CreativeDashboard.scss
│   ├── CreativeAssetDetail.jsx        # Creative detail view
│   └── CreativeAssetDetail.scss
└── App.jsx                            # Routes configuration
```

### Routes
- `/dashboards` - Dashboard selector landing page
- `/dashboard-conservative` - Conservative main dashboard
- `/dashboard-conservative/:assetId` - Conservative asset detail
- `/dashboard-modern` - Modern main dashboard
- `/dashboard-modern/:assetId` - Modern asset detail
- `/dashboard-creative` - Creative main dashboard
- `/dashboard-creative/:assetId` - Creative asset detail

### Design Tokens Integration
All prototypes use the InsureCo design token system from `src/styles/tokens/`:
- Conservative: Traditional color scheme (green/red)
- Modern: Blue gradient theme
- Creative: Purple/magenta/cyan gradients

All prototypes support both light and dark modes via the theme toggle.

## PRD Compliance

All three prototypes fully implement the requirements from the Financial Dashboard PRD:

### ✅ Section 2.1: Summary Statistics (Header Section)
- Four KPI widgets showing Total Owed, Total Claimed, Portfolio Split, Loss Ratio
- Clear breakdown by Auto and Property
- Year-to-Date (YTD) calculations

### ✅ Section 2.2: Expense Visualization (Chart Section)
- Multi-series charts (Line and/or Bar)
- Data series: Property Premiums, Property Claims, Auto Premiums, Auto Claims
- Time axis showing monthly intervals (last 12 months)
- Interactive toggles/tabs to compare specific series

### ✅ Section 2.3: Asset Performance Ledger (Table Section)
- Columns: Asset ID/Name, Asset Category, Premium Due, Due Date, Total Claims
- Sortable by any column
- Filterable by category
- 20 rows per page with pagination

### ✅ Section 2.4: Drill-Down Logic
- Master-Detail navigation pattern
- Clicking any row navigates to dedicated Asset Detail View
- Full claim history for each asset
- Policy information and coverage limits
- Policy documents (simulated with download actions)

### ✅ Section 3: UI/UX Guidelines
- Visual hierarchy with prominent summary statistics
- Color palette following financial indicators (green/blue for premiums, red/orange for claims)
- Responsive design (desktop and tablet optimized)
- "Back to Dashboard" buttons in all drill-down views

### ✅ Section 4: Roadmap & Future Phases
- **Phase 1 Complete**: Core Dashboard with Table and Charts ✓
- **Phase 2 & 3**: Predictive Analytics and Automated Communication (future)

## Testing & Validation

### Tested Features
- ✅ All three prototypes load without errors
- ✅ Navigation between prototypes via selector page
- ✅ Navigation from dashboard to asset detail views
- ✅ Back button returns to correct dashboard
- ✅ Data consistency across all views
- ✅ Charts render correctly with realistic data
- ✅ Tables are sortable and filterable
- ✅ Pagination works correctly
- ✅ Light and dark theme support
- ✅ Responsive layout on different screen sizes

### Browser Compatibility
Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

### Follow-Up Questions for Stakeholders
1. Which prototype best fits your vision for the Financial Dashboard?
2. Are there specific design elements from multiple prototypes you'd like to combine?
3. Do the mock data values and ranges seem realistic for your use case?
4. Are there additional metrics or KPIs you'd like to see in the dashboard?
5. Should we add filters for date ranges (e.g., last 6 months, last year, custom range)?

### Potential Enhancements
- **Export functionality**: Export table data to CSV/Excel
- **Print views**: Optimized layouts for printing
- **Customizable KPIs**: Let users choose which KPIs to display
- **Dashboard personalization**: Save user preferences for chart types, filters, etc.
- **Real-time updates**: WebSocket integration for live data updates
- **Advanced filtering**: Multi-select filters, date range pickers
- **Saved views**: Allow users to save and recall custom dashboard configurations

## Conclusion

Three fully functional Financial Dashboard prototypes are now available for evaluation. Each prototype implements the complete PRD with realistic data, interactive features, and professional design. Choose the prototype that best aligns with your organization's style and user needs, or combine elements from multiple prototypes to create the perfect solution.

---

**Created**: 2024  
**PRD Reference**: FinancialDashboardPRD.pdf  
**Technology**: React 19 + Carbon Design System  
**Developer**: Builder.io Fusion AI
