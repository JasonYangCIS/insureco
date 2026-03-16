import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tag,
  Button,
  ContentSwitcher,
  Switch,
} from '@carbon/react';
import {
  ArrowRight,
  Warning,
  Analytics,
  Money,
  ChartLineSmooth,
} from '@carbon/icons-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { kpiGross, kpiNet, monthlyTrend, assets, lossRatio, highestSingleClaim, next30DaysCollections, upcomingDues } from '../../data/financialMockData';
import './FinancialDashboardWild.scss';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtShort = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}k`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// Animated counter hook
function useCountUp(target, duration = 1800, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(Math.round(eased * target));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration, active]);
  return value;
}

function AnimatedKPI({ label, value, isGreen, prefix = '$' }) {
  const animated = useCountUp(value);
  const display = animated >= 1_000_000
    ? `${prefix}${(animated / 1_000_000).toFixed(2)}M`
    : `${prefix}${(animated / 1_000).toFixed(0)}k`;
  return (
    <div className="fdw-kpi">
      <p className="fdw-kpi__label">{label}</p>
      <p className={`fdw-kpi__value ${isGreen ? 'fdw-kpi__value--green' : 'fdw-kpi__value--red'}`}>
        {display}
      </p>
    </div>
  );
}

const SERIES_AREA = [
  { key: 'autoPremiums', label: 'Auto Premiums', color: '#42be65', gradId: 'gradAutoPrem' },
  { key: 'propertyPremiums', label: 'Prop Premiums', color: '#08bdba', gradId: 'gradPropPrem' },
  { key: 'autoClaims', label: 'Auto Claims', color: '#da1e28', gradId: 'gradAutoClaim' },
  { key: 'propertyClaims', label: 'Prop Claims', color: '#ff832b', gradId: 'gradPropClaim' },
];

const TOP_CLAIM_COUNT = 3;
const sortedByClaimsDesc = [...assets].sort((a, b) => b.totalClaims - a.totalClaims);
const topClaimIds = new Set(sortedByClaimsDesc.slice(0, TOP_CLAIM_COUNT).map((a) => a.id));

const WildTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="fdw-tooltip">
      <p className="fdw-tooltip__month">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="fdw-tooltip__row">
          <span className="fdw-tooltip__dot" style={{ background: p.color }} />
          <span className="fdw-tooltip__name">
            {SERIES_AREA.find((s) => s.key === p.dataKey)?.label || p.dataKey}
          </span>
          <span className="fdw-tooltip__val">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function FinancialDashboardWild() {
  const navigate = useNavigate();
  const [isNet, setIsNet] = useState(false);
  const [activeSeries, setActiveSeries] = useState(
    Object.fromEntries(SERIES_AREA.map((s) => [s.key, true]))
  );
  const [expandedRow, setExpandedRow] = useState(null);

  const kpi = isNet ? kpiNet : kpiGross;

  const toggleSeries = (key) =>
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleRow = (id) =>
    setExpandedRow((prev) => (prev === id ? null : id));

  return (
    <div className="fdw">
      {/* ── Hero Banner ─────────────────────────────── */}
      <div className="fdw__hero">
        <div className="fdw__hero-inner">
          <div className="fdw__hero-title-row">
            <div>
              <h1 className="fdw__hero-title">IFAD Command Center</h1>
              <p className="fdw__hero-subtitle">
                Insurance Financial Analytics — Real-time portfolio intelligence
              </p>
            </div>
            <ContentSwitcher
              size="sm"
              onChange={({ index }) => setIsNet(index === 1)}
              className="fdw__hero-switcher"
            >
              <Switch name="gross" text="Gross" />
              <Switch name="net" text="Net" />
            </ContentSwitcher>
          </div>

          <Grid className="fdw__kpi-row">
            <Column sm={4} md={2} lg={4}>
              <AnimatedKPI label="Total Owed (YTD)" value={kpi.totalOwedYTD} isGreen />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <AnimatedKPI label="Total Claimed (YTD)" value={kpi.totalClaimedYTD} isGreen={false} />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <AnimatedKPI label="Auto Premiums" value={kpi.autoOwedYTD} isGreen />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <AnimatedKPI label="Property Premiums" value={kpi.propertyOwedYTD} isGreen />
            </Column>
          </Grid>
        </div>
      </div>

      {/* ── Area Chart ──────────────────────────────── */}
      <div className="fdw__chart-section">
        <div className="fdw__chart-header">
          <div>
            <h2 className="fdw__chart-title">Premium & Claims Velocity</h2>
            <p className="fdw__chart-sub">Monthly trend — toggle series to compare</p>
          </div>
          <div className="fdw__chart-legend-row">
            {SERIES_AREA.map((s) => (
              <button
                key={s.key}
                className={`fdw__legend-btn ${activeSeries[s.key] ? 'fdw__legend-btn--active' : ''}`}
                style={activeSeries[s.key] ? { '--legend-color': s.color } : {}}
                onClick={() => toggleSeries(s.key)}
              >
                <span className="fdw__legend-dot" style={{ background: activeSeries[s.key] ? s.color : undefined }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrend} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <defs>
              {SERIES_AREA.map((s) => (
                <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'rgba(244,244,244,0.6)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'rgba(244,244,244,0.6)' }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<WildTooltip />} />
            {SERIES_AREA.map((s) =>
              activeSeries[s.key] ? (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#${s.gradId})`}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Risk Spotlight ───────────────────────────── */}
      <div className="fdw__spotlight-section">
        <h2 className="fdw__spotlight-heading">Risk Spotlight</h2>
        <Grid>
          <Column sm={4} md={2} lg={5}>
            <div className="fdw-spotlight-card fdw-spotlight-card--loss">
              <div className="fdw-spotlight-card__icon-row">
                <Analytics size={24} />
                <span className="fdw-spotlight-card__label">Portfolio Loss Ratio</span>
              </div>
              <p className="fdw-spotlight-card__value">{lossRatio}%</p>
              <p className="fdw-spotlight-card__desc">
                {lossRatio < 65 ? 'Healthy — below 65% threshold' : lossRatio < 80 ? 'Elevated — monitor closely' : 'Critical — exceeds safe threshold'}
              </p>
            </div>
          </Column>
          <Column sm={4} md={2} lg={5}>
            <div className="fdw-spotlight-card fdw-spotlight-card--claim">
              <div className="fdw-spotlight-card__icon-row">
                <Warning size={24} />
                <span className="fdw-spotlight-card__label">Highest Single Claim</span>
              </div>
              <p className="fdw-spotlight-card__value">{fmt(highestSingleClaim)}</p>
              <p className="fdw-spotlight-card__desc">Across all active assets, current fiscal year</p>
            </div>
          </Column>
          <Column sm={4} md={4} lg={6}>
            <div className="fdw-spotlight-card fdw-spotlight-card--collections">
              <div className="fdw-spotlight-card__icon-row">
                <Money size={24} />
                <span className="fdw-spotlight-card__label">Next 30-Day Collections</span>
              </div>
              <p className="fdw-spotlight-card__value">{fmt(next30DaysCollections)}</p>
              <p className="fdw-spotlight-card__desc">Premiums due within 30 days of today</p>
            </div>
          </Column>
        </Grid>
      </div>

      {/* ── Asset Ledger with Inline Expand ──────────── */}
      <div className="fdw__ledger-section">
        <div className="fdw__ledger-header">
          <h2 className="fdw__ledger-title">Asset Performance Ledger</h2>
          <p className="fdw__ledger-sub">Click row to expand quick view — or open full detail</p>
        </div>
        <div className="fdw__ledger-table">
          {/* Header row */}
          <div className="fdw__ledger-row fdw__ledger-row--head">
            <span>Asset</span>
            <span>Category</span>
            <span>Premium Due</span>
            <span>Due Date</span>
            <span>Total Claims</span>
          </div>
          {/* Data rows */}
          {assets.map((asset) => {
            const isTop = topClaimIds.has(asset.id);
            const isExpanded = expandedRow === asset.id;
            return (
              <div key={asset.id} className={`fdw__ledger-entry ${isTop ? 'fdw__ledger-entry--high' : ''}`}>
                <div
                  className={`fdw__ledger-row ${isExpanded ? 'fdw__ledger-row--expanded' : ''}`}
                  onClick={() => toggleRow(asset.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleRow(asset.id)}
                >
                  <span className="fdw__ledger-name">
                    {isTop && <span className="fdw__pulse-dot" title="High claims" />}
                    {asset.name}
                  </span>
                  <span>
                    <Tag type={asset.category === 'Auto' ? 'blue' : 'teal'} size="sm">
                      {asset.category}
                    </Tag>
                  </span>
                  <span className="fdw__ledger-premium">{fmt(asset.premiumDue)}</span>
                  <span className="fdw__ledger-date">{fmtDate(asset.dueDate)}</span>
                  <span className={`fdw__ledger-claims ${isTop ? 'fdw__ledger-claims--high' : ''}`}>
                    {fmt(asset.totalClaims)}
                  </span>
                </div>
                {/* Inline expand */}
                {isExpanded && (
                  <div className="fdw__ledger-expand">
                    <div className="fdw__expand-grid">
                      <div className="fdw__expand-stat">
                        <span className="fdw__expand-stat-label">Claim Events</span>
                        <span className="fdw__expand-stat-value">{asset.claimHistory.length}</span>
                      </div>
                      <div className="fdw__expand-stat">
                        <span className="fdw__expand-stat-label">Last Claim Filed</span>
                        <span className="fdw__expand-stat-value">
                          {fmtDate(asset.claimHistory[0]?.dateFiled || '')}
                        </span>
                      </div>
                      <div className="fdw__expand-stat">
                        <span className="fdw__expand-stat-label">Policy Number</span>
                        <span className="fdw__expand-stat-value">{asset.policyInfo.policyNumber}</span>
                      </div>
                      <div className="fdw__expand-stat">
                        <span className="fdw__expand-stat-label">Underwriter</span>
                        <span className="fdw__expand-stat-value">{asset.policyInfo.underwriter}</span>
                      </div>
                    </div>
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={ArrowRight}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/financial-dashboard/asset/${asset.id}`, {
                          state: { from: 'wild' },
                        });
                      }}
                      className="fdw__expand-detail-btn"
                    >
                      View Full Detail
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Due Dates Strip ────────────────────── */}
      <div className="fdw__due-strip">
        <span className="fdw__due-strip-label">Upcoming Premiums:</span>
        {upcomingDues.map((a) => (
          <span key={a.id} className="fdw__due-pill">
            <span className="fdw__due-pill-name">{a.name.split(' ').slice(0, 3).join(' ')}</span>
            <span className="fdw__due-pill-amount">{fmt(a.premiumDue)}</span>
            <span className="fdw__due-pill-date">{fmtDate(a.dueDate)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
