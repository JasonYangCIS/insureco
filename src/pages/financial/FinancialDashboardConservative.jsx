import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Heading,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  ContentSwitcher,
  Switch,
  Dropdown,
  Checkbox,
  Button,
} from '@carbon/react';
import { WarningFilled } from '@carbon/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { kpiGross, kpiNet, monthlyTrend, assets } from '../../data/financialMockData';
import './FinancialDashboardConservative.scss';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const SERIES_CONFIG = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#24a148' },
  { key: 'propertyClaims', label: 'Property Claims', color: '#da1e28' },
  { key: 'autoPremiums', label: 'Auto Premiums', color: '#0043ce' },
  { key: 'autoClaims', label: 'Auto Claims', color: '#ff832b' },
];

const tableHeaders = [
  { key: 'name', header: 'Asset Name' },
  { key: 'category', header: 'Category' },
  { key: 'premiumDue', header: 'Premium Due' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Total Claims' },
];

const timeframeItems = [
  { id: 'monthly', text: 'Monthly' },
  { id: 'quarterly', text: 'Quarterly' },
  { id: 'annual', text: 'Annual' },
];

const HIGH_CLAIM_THRESHOLD = 20000;

export default function FinancialDashboardConservative() {
  const navigate = useNavigate();
  const [isNet, setIsNet] = useState(false);
  const [activeSeriesMap, setActiveSeriesMap] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });

  const kpi = isNet ? kpiNet : kpiGross;

  const toggleSeries = (key) => {
    setActiveSeriesMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tableRows = assets.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    premiumDue: fmt(a.premiumDue),
    dueDate: fmtDate(a.dueDate),
    totalClaims: fmt(a.totalClaims),
    _totalClaimsRaw: a.totalClaims,
  }));

  return (
    <div className="fd-conservative">
      {/* Page Header */}
      <div className="fd-conservative__page-header">
        <div className="fd-conservative__title-group">
          <Heading className="fd-conservative__title">Financial Analytics Dashboard</Heading>
          <p className="fd-conservative__subtitle">
            Insurance portfolio overview — Current fiscal year
          </p>
        </div>
        <div className="fd-conservative__controls">
          <ContentSwitcher
            size="sm"
            onChange={({ index }) => setIsNet(index === 1)}
            className="fd-conservative__switcher"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
          <Dropdown
            id="timeframe-dropdown"
            label="Monthly"
            items={timeframeItems}
            itemToString={(item) => item?.text || ''}
            size="sm"
            className="fd-conservative__timeframe"
          />
        </div>
      </div>

      {/* KPI Row */}
      <Grid className="fd-conservative__kpi-grid">
        <Column sm={4} md={4} lg={4}>
          <Tile className="fd-conservative__kpi-tile">
            <p className="fd-conservative__kpi-label">Total Owed (YTD)</p>
            <p className="fd-conservative__kpi-value fd-conservative__kpi-value--green">
              {fmt(kpi.totalOwedYTD)}
            </p>
            <p className="fd-conservative__kpi-sub">All premiums due this fiscal year</p>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile className="fd-conservative__kpi-tile">
            <p className="fd-conservative__kpi-label">Total Claimed (YTD)</p>
            <p className="fd-conservative__kpi-value fd-conservative__kpi-value--red">
              {fmt(kpi.totalClaimedYTD)}
            </p>
            <p className="fd-conservative__kpi-sub">Claims paid or reserved this year</p>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile className="fd-conservative__kpi-tile">
            <p className="fd-conservative__kpi-label">Auto Portfolio</p>
            <p className="fd-conservative__kpi-value fd-conservative__kpi-value--green">
              {fmt(kpi.autoOwedYTD)}
            </p>
            <div className="fd-conservative__split">
              <span className="fd-conservative__split-item fd-conservative__split-item--red">
                Claims: {fmt(kpi.autoClaimedYTD)}
              </span>
            </div>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile className="fd-conservative__kpi-tile">
            <p className="fd-conservative__kpi-label">Property Portfolio</p>
            <p className="fd-conservative__kpi-value fd-conservative__kpi-value--green">
              {fmt(kpi.propertyOwedYTD)}
            </p>
            <div className="fd-conservative__split">
              <span className="fd-conservative__split-item fd-conservative__split-item--red">
                Claims: {fmt(kpi.propertyClaimedYTD)}
              </span>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Chart Section */}
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Tile className="fd-conservative__chart-tile">
            <Heading className="fd-conservative__chart-title">Premium & Claims Trend</Heading>
            <div className="fd-conservative__chart-legend">
              {SERIES_CONFIG.map((s) => (
                <Checkbox
                  key={s.key}
                  id={`series-${s.key}`}
                  labelText={s.label}
                  checked={activeSeriesMap[s.key]}
                  onChange={() => toggleSeries(s.key)}
                />
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v, name) => [fmt(v), SERIES_CONFIG.find((s) => s.key === name)?.label || name]}
                  contentStyle={{
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                {SERIES_CONFIG.map((s) =>
                  activeSeriesMap[s.key] ? (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stroke={s.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </Tile>
        </Column>
      </Grid>

      {/* Asset Ledger */}
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className="fd-conservative__ledger-header">
            <Heading className="fd-conservative__ledger-title">Asset Performance Ledger</Heading>
            <p className="fd-conservative__ledger-hint">Click a row to view asset details</p>
          </div>
          <DataTable rows={tableRows} headers={tableHeaders} isSortable>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <Table {...getTableProps()} className="fd-conservative__table">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const rawAsset = assets.find((a) => a.id === row.id);
                    const isHighClaim = rawAsset && rawAsset.totalClaims >= HIGH_CLAIM_THRESHOLD;
                    return (
                      <TableRow
                        {...getRowProps({ row })}
                        key={row.id}
                        className={`fd-conservative__table-row ${isHighClaim ? 'fd-conservative__table-row--high-claim' : ''}`}
                        onClick={() =>
                          navigate(`/financial-dashboard/asset/${row.id}`, {
                            state: { from: 'conservative' },
                          })
                        }
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'category' ? (
                              <Tag
                                type={cell.value === 'Auto' ? 'blue' : 'teal'}
                                size="sm"
                              >
                                {cell.value}
                              </Tag>
                            ) : cell.info.header === 'totalClaims' ? (
                              <span className="fd-conservative__claims-cell">
                                {isHighClaim && (
                                  <WarningFilled
                                    size={16}
                                    className="fd-conservative__warning-icon"
                                    title="High claims amount"
                                  />
                                )}
                                {cell.value}
                              </span>
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
            )}
          </DataTable>
        </Column>
      </Grid>
    </div>
  );
}
