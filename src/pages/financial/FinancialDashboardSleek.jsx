import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Dropdown,
  Button,
  ProgressBar,
} from '@carbon/react';
import { ArrowUp, ArrowDown, Download } from '@carbon/icons-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { kpiGross, kpiNet, monthlyTrend, assets } from '../../data/financialMockData';
import './FinancialDashboardSleek.scss';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtShort = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}k`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const timeframeItems = [
  { id: '2025', text: 'Jan – Jun 2025' },
  { id: 'q1', text: 'Q1 2025' },
  { id: 'q4', text: 'Q4 2024' },
  { id: 'full', text: 'Full Year 2024' },
];

const SERIES = [
  { key: 'propertyPremiums', label: 'Prop Premiums', color: '#24a148', type: 'bar' },
  { key: 'propertyClaims', label: 'Prop Claims', color: '#da1e28', type: 'bar' },
  { key: 'autoPremiums', label: 'Auto Premiums', color: '#0043ce', type: 'line' },
  { key: 'autoClaims', label: 'Auto Claims', color: '#ff832b', type: 'line' },
];

const PIE_DATA = (kpi) => [
  { name: 'Auto Premiums', value: kpi.autoOwedYTD, color: '#0043ce' },
  { name: 'Property Premiums', value: kpi.propertyOwedYTD, color: '#009d9a' },
];

const tableHeaders = [
  { key: 'name', header: 'Asset Name' },
  { key: 'category', header: 'Category' },
  { key: 'premiumDue', header: 'Premium Due' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Total Claims' },
  { key: 'riskBar', header: 'Risk Level' },
];

const maxClaims = Math.max(...assets.map((a) => a.totalClaims));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="fds-chart-tooltip">
      <p className="fds-chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="fds-chart-tooltip__item" style={{ color: p.color }}>
          {SERIES.find((s) => s.key === p.dataKey)?.label || p.dataKey}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function FinancialDashboardSleek() {
  const navigate = useNavigate();
  const [isNet, setIsNet] = useState(false);
  const [activeSeries, setActiveSeries] = useState(
    Object.fromEntries(SERIES.map((s) => [s.key, true]))
  );
  const [searchTerm, setSearchTerm] = useState('');

  const kpi = isNet ? kpiNet : kpiGross;

  const toggleSeries = (key) =>
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));

  // Prior year deltas (mocked as +8% for premiums, -3% for claims)
  const kpiCards = [
    {
      label: 'Total Owed (YTD)',
      value: kpi.totalOwedYTD,
      delta: 8.2,
      positive: true,
      accentClass: 'fds-metric-card--green',
    },
    {
      label: 'Total Claimed (YTD)',
      value: kpi.totalClaimedYTD,
      delta: -3.1,
      positive: false,
      accentClass: 'fds-metric-card--red',
    },
    {
      label: 'Auto Portfolio',
      value: kpi.autoOwedYTD,
      sub: `Claims: ${fmt(kpi.autoClaimedYTD)}`,
      delta: 5.4,
      positive: true,
      accentClass: 'fds-metric-card--blue',
    },
    {
      label: 'Property Portfolio',
      value: kpi.propertyOwedYTD,
      sub: `Claims: ${fmt(kpi.propertyClaimedYTD)}`,
      delta: 11.7,
      positive: true,
      accentClass: 'fds-metric-card--teal',
    },
  ];

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableRows = filteredAssets.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    premiumDue: fmt(a.premiumDue),
    dueDate: fmtDate(a.dueDate),
    totalClaims: fmt(a.totalClaims),
    riskBar: Math.round((a.totalClaims / maxClaims) * 100),
    _raw: a,
  }));

  return (
    <div className="fds">
      {/* Sticky header bar */}
      <div className="fds__topbar">
        <div className="fds__topbar-left">
          <h1 className="fds__topbar-title">Financial Analytics</h1>
          <span className="fds__topbar-badge">Insurance Portfolio</span>
        </div>
        <div className="fds__topbar-right">
          <div className="fds__gross-toggle">
            <button
              className={`fds__toggle-btn ${!isNet ? 'fds__toggle-btn--active' : ''}`}
              onClick={() => setIsNet(false)}
            >
              Gross
            </button>
            <button
              className={`fds__toggle-btn ${isNet ? 'fds__toggle-btn--active' : ''}`}
              onClick={() => setIsNet(true)}
            >
              Net
            </button>
          </div>
          <Dropdown
            id="timeframe-sleek"
            label="Date Range"
            items={timeframeItems}
            itemToString={(i) => i?.text || ''}
            size="sm"
            className="fds__date-dropdown"
          />
          <Button kind="ghost" size="sm" renderIcon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <Grid className="fds__kpi-grid">
        {kpiCards.map((card, i) => (
          <Column key={i} sm={4} md={4} lg={4}>
            <div className={`fds-metric-card ${card.accentClass}`}>
              <p className="fds-metric-card__label">{card.label}</p>
              <p className="fds-metric-card__value">{fmtShort(card.value)}</p>
              {card.sub && <p className="fds-metric-card__sub">{card.sub}</p>}
              <div className="fds-metric-card__delta">
                {card.delta > 0 ? (
                  <ArrowUp size={14} className="fds-metric-card__delta-icon fds-metric-card__delta-icon--up" />
                ) : (
                  <ArrowDown size={14} className="fds-metric-card__delta-icon fds-metric-card__delta-icon--down" />
                )}
                <span className={card.delta > 0 ? 'fds-metric-card__delta--up' : 'fds-metric-card__delta--down'}>
                  {Math.abs(card.delta)}% vs prior year
                </span>
              </div>
            </div>
          </Column>
        ))}
      </Grid>

      {/* Chart Section */}
      <Grid className="fds__chart-grid">
        {/* Left: ComposedChart */}
        <Column sm={4} md={5} lg={10}>
          <div className="fds__chart-panel">
            <div className="fds__chart-panel-header">
              <h2 className="fds__chart-panel-title">Premiums & Claims Trend</h2>
              <div className="fds__series-pills">
                {SERIES.map((s) => (
                  <button
                    key={s.key}
                    className={`fds__series-pill ${activeSeries[s.key] ? 'fds__series-pill--active' : ''}`}
                    style={activeSeries[s.key] ? { borderColor: s.color, color: s.color } : {}}
                    onClick={() => toggleSeries(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={monthlyTrend} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                {SERIES.map((s) =>
                  activeSeries[s.key] ? (
                    s.type === 'bar' ? (
                      <Bar key={s.key} dataKey={s.key} fill={s.color} opacity={0.8} radius={[2, 2, 0, 0]} />
                    ) : (
                      <Line
                        key={s.key}
                        type="monotone"
                        dataKey={s.key}
                        stroke={s.color}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    )
                  ) : null
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Column>

        {/* Right: Portfolio Donut */}
        <Column sm={4} md={3} lg={6}>
          <div className="fds__chart-panel fds__chart-panel--donut">
            <h2 className="fds__chart-panel-title">Portfolio Split</h2>
            <p className="fds__donut-total">Total: {fmtShort(kpi.totalOwedYTD)}</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={PIE_DATA(kpi)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_DATA(kpi).map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [fmt(v), '']} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(val) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="fds__donut-breakdown">
              <div className="fds__donut-row">
                <span className="fds__donut-dot" style={{ background: '#0043ce' }} />
                <span className="fds__donut-label">Auto</span>
                <span className="fds__donut-pct">
                  {Math.round((kpi.autoOwedYTD / kpi.totalOwedYTD) * 100)}%
                </span>
              </div>
              <div className="fds__donut-row">
                <span className="fds__donut-dot" style={{ background: '#009d9a' }} />
                <span className="fds__donut-label">Property</span>
                <span className="fds__donut-pct">
                  {Math.round((kpi.propertyOwedYTD / kpi.totalOwedYTD) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </Column>
      </Grid>

      {/* Asset Ledger */}
      <div className="fds__ledger">
        <div className="fds__ledger-header">
          <h2 className="fds__ledger-title">Asset Performance Ledger</h2>
          <p className="fds__ledger-hint">Click any row for full asset detail</p>
        </div>
        <DataTable rows={tableRows} headers={tableHeaders} isSortable>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps, onInputChange }) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    placeholder="Search assets..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()} className="fds__table">
                <TableHead>
                  <TableRow>
                    {headers.map((h) => (
                      <TableHeader {...getHeaderProps({ header: h })} key={h.key}>
                        {h.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const rawAsset = assets.find((a) => a.id === row.id);
                    return (
                      <TableRow
                        {...getRowProps({ row })}
                        key={row.id}
                        className="fds__table-row"
                        onClick={() =>
                          navigate(`/financial-dashboard/asset/${row.id}`, {
                            state: { from: 'sleek' },
                          })
                        }
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'category' ? (
                              <Tag type={cell.value === 'Auto' ? 'blue' : 'teal'} size="sm">
                                {cell.value}
                              </Tag>
                            ) : cell.info.header === 'riskBar' ? (
                              <div className="fds__risk-bar-wrap">
                                <ProgressBar
                                  value={cell.value}
                                  max={100}
                                  size="sm"
                                  status={cell.value >= 80 ? 'error' : cell.value >= 50 ? 'active' : 'active'}
                                  label=""
                                  hideLabel
                                  className={`fds__risk-bar ${cell.value >= 80 ? 'fds__risk-bar--high' : ''}`}
                                />
                                <span className="fds__risk-pct">{cell.value}%</span>
                              </div>
                            ) : (
                              cell.value
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
      </div>
    </div>
  );
}
