import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column, Tile, Button, Tag, Heading } from '@carbon/react';
import { ChartLine, ChartBar, Rocket } from '@carbon/icons-react';
import './FinancialDashboardIndex.scss';

const prototypes = [
  {
    id: 'conservative',
    title: 'Conservative',
    subtitle: 'Clean & Professional',
    description:
      'A strictly Carbon-component approach. Maximum readability, familiar patterns, and zero visual noise. Built for experienced financial analysts who value speed and clarity over aesthetics.',
    icon: ChartBar,
    tag: 'Carbon Only',
    tagType: 'blue',
    features: [
      'KPI tiles with portfolio split',
      'Multi-series line chart with checkbox toggles',
      'Sortable DataTable ledger',
      'Asset drill-down detail view',
    ],
    path: '/financial-dashboard/conservative',
    accentClass: 'prototype-card--conservative',
  },
  {
    id: 'sleek',
    title: 'Sleeker',
    subtitle: 'Polished SaaS Feel',
    description:
      'Carbon as a foundation, elevated with custom card styling, a composed chart view, a portfolio donut chart, and a risk progress bar in the ledger. Feels like a real B2B financial product.',
    icon: ChartLine,
    tag: 'Carbon + Custom',
    tagType: 'teal',
    features: [
      'Accent-border KPI cards with delta indicators',
      'ComposedChart (bars + lines) + donut portfolio split',
      'DataTable with toolbar search & risk progress bars',
      'Shared asset drill-down view',
    ],
    path: '/financial-dashboard/sleek',
    accentClass: 'prototype-card--sleek',
  },
  {
    id: 'wild',
    title: 'Wild',
    subtitle: 'Command Center',
    description:
      'A bold, high-impact design with animated KPI counters, area chart with gradient fills, a risk spotlight panel, and inline expandable rows. Stays on-brand while pushing the visual envelope.',
    icon: Rocket,
    tag: 'Creative',
    tagType: 'red',
    features: [
      'Animated counter KPI hero banner',
      'Full-width gradient area chart',
      'Risk Spotlight metrics panel',
      'Inline expandable table rows + bottom due-dates strip',
    ],
    path: '/financial-dashboard/wild',
    accentClass: 'prototype-card--wild',
  },
];

export default function FinancialDashboardIndex() {
  const navigate = useNavigate();

  return (
    <div className="fd-index">
      <div className="fd-index__hero">
        <Heading className="fd-index__title">Financial Dashboard Prototypes</Heading>
        <p className="fd-index__subtitle">
          Insurance Financial Analytics Dashboard (IFAD) — Three design directions for review.
          Each prototype implements the full PRD requirements: KPI summary, trend chart, asset ledger, and drill-down detail view.
        </p>
      </div>

      <Grid className="fd-index__grid">
        {prototypes.map((proto) => {
          const Icon = proto.icon;
          return (
            <Column key={proto.id} sm={4} md={4} lg={5} xlg={5}>
              <Tile className={`fd-prototype-card ${proto.accentClass}`}>
                <div className="fd-prototype-card__header">
                  <div className="fd-prototype-card__icon-wrap">
                    <Icon size={28} />
                  </div>
                  <Tag type={proto.tagType} size="sm">{proto.tag}</Tag>
                </div>
                <Heading className="fd-prototype-card__title">{proto.title}</Heading>
                <p className="fd-prototype-card__subtitle">{proto.subtitle}</p>
                <p className="fd-prototype-card__description">{proto.description}</p>
                <ul className="fd-prototype-card__features">
                  {proto.features.map((f, i) => (
                    <li key={i} className="fd-prototype-card__feature">{f}</li>
                  ))}
                </ul>
                <Button
                  kind="primary"
                  className="fd-prototype-card__btn"
                  onClick={() => navigate(proto.path)}
                >
                  View {proto.title} Prototype
                </Button>
              </Tile>
            </Column>
          );
        })}
      </Grid>

      <div className="fd-index__prd-note">
        <p>
          <strong>PRD Coverage:</strong> All three prototypes implement KPI widgets (Total Owed YTD, Total Claimed YTD, Auto/Property split),
          Gross/Net toggle, multi-series trend chart with interactive series toggles, sortable asset ledger,
          and master-detail drill-down with claim history, policy info, and coverage limits.
        </p>
      </div>
    </div>
  );
}
