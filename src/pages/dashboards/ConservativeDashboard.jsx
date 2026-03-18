import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
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
  Pagination,
  Button,
  Toggle,
  Select,
  SelectItem,
  Tag,
} from '@carbon/react';
import { Growth, CheckmarkFilled, ChevronRight } from '@carbon/icons-react';
import { LineChart, SimpleBarChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import { getMonthlyData, getAssetData, calculateYTDStats } from '../../data/financialMockData';
import './ConservativeDashboard.scss';

// -------------------------------------------------------------------
// Module-level constants — defined outside component to avoid
// re-creating on every render.
// -------------------------------------------------------------------
const TABLE_HEADERS = [
  { key: 'assetName', header: 'Asset' },
  { key: 'assetCategory', header: 'Type' },
  { key: 'premiumDue', header: 'Next Premium' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Claims' },
  { key: 'lossRatio', header: 'Loss Ratio' },
];

const CHART_COLOR_SCALE = {
  'Property Premiums': '#198038',
  'Property Claims': '#da1e28',
  'Auto Premiums': '#0043ce',  // darker blue for WCAG AA contrast
  'Auto Claims': '#8a3800',    // darker orange for WCAG AA contrast
};

const BASE_CHART_OPTIONS = {
  title: 'Premiums vs Claims — Last 12 Months',
  axes: {
    bottom: { title: 'Month', mapsTo: 'month', scaleType: 'labels' },
    left: { title: 'Amount ($)', mapsTo: 'value', scaleType: 'linear' },
  },
  curve: 'curveMonotoneX',
  height: '400px',
  legend: { enabled: true },
  color: { scale: CHART_COLOR_SCALE },
};

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

/** Strip characters that could cause layout/injection issues in rendered text. */
const sanitizeInput = (value) => value.replace(/[<>"'&]/g, '');

/** Format a number as USD currency string. */
const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;

/** Map claim status string to a Carbon Tag type. */
const getStatusTagType = (status) => {
  switch (status.toLowerCase()) {
    case 'paid':      return 'green';
    case 'closed':    return 'gray';
    case 'under review': return 'blue';
    case 'pending':   return 'orange';
    default:          return 'gray';
  }
};

export default function ConservativeDashboard() {
  const navigate = useNavigate();

  // ---- Data (singleton caches, stable across renders) ----
  const monthlyData = useMemo(() => getMonthlyData(), []);
  const assetData   = useMemo(() => getAssetData(), []);
  const ytdStats    = useMemo(
    () => calculateYTDStats(monthlyData, assetData),
    [monthlyData, assetData]
  );

  // ---- UI state ----
  const [chartType,       setChartType]       = useState('line');
  const [page,            setPage]            = useState(1);
  const [pageSize,        setPageSize]        = useState(20);
  const [filterCategory,  setFilterCategory]  = useState('all');
  const [searchQuery,     setSearchQuery]     = useState('');

  // ---- Derived / memoized values ----

  /** Sanitize before filtering to avoid layout-breaking characters. */
  const sanitizedSearch = useMemo(
    () => sanitizeInput(searchQuery),
    [searchQuery]
  );

  const filteredAssets = useMemo(() => {
    let result = assetData;
    if (filterCategory !== 'all') {
      result = result.filter(
        (a) => a.assetCategory.toLowerCase() === filterCategory
      );
    }
    if (sanitizedSearch.trim()) {
      const q = sanitizedSearch.toLowerCase();
      result = result.filter(
        (a) =>
          a.assetName.toLowerCase().includes(q) ||
          a.assetCategory.toLowerCase().includes(q)
      );
    }
    return result;
  }, [assetData, filterCategory, sanitizedSearch]);

  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, page, pageSize]);

  // Pre-compute category counts once rather than inline in JSX
  const categoryCounts = useMemo(
    () => ({
      property: assetData.filter((a) => a.assetCategory === 'Property').length,
      auto:     assetData.filter((a) => a.assetCategory === 'Auto').length,
    }),
    [assetData]
  );

  const chartData = useMemo(
    () =>
      monthlyData.flatMap((m) => [
        { group: 'Property Premiums', month: m.monthYear, value: m.propertyPremiums },
        { group: 'Property Claims',   month: m.monthYear, value: m.propertyClaims   },
        { group: 'Auto Premiums',     month: m.monthYear, value: m.autoPremiums     },
        { group: 'Auto Claims',       month: m.monthYear, value: m.autoClaims       },
      ]),
    [monthlyData]
  );

  const tableRows = useMemo(
    () =>
      paginatedAssets.map((asset) => ({
        id:            asset.id,
        assetName:     asset.assetName,
        assetCategory: asset.assetCategory,
        premiumDue:    formatCurrency(asset.premiumDue),
        dueDate:       new Date(asset.dueDate).toLocaleDateString(),
        totalClaims:   formatCurrency(asset.totalClaims),
        lossRatio:     ((asset.totalClaims / asset.coverageAmount) * 100).toFixed(1),
      })),
    [paginatedAssets]
  );

  // ---- Stable callbacks ----
  const handleRowClick = useCallback(
    (assetId) => navigate(`/analytics/${assetId}`),
    [navigate]
  );

  const handleRowKeyDown = useCallback(
    (e, assetId) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate(`/analytics/${assetId}`);
      }
    },
    [navigate]
  );

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setFilterCategory(e.target.value);
    setPage(1);
  }, []);

  const handlePaginationChange = useCallback(({ page: p, pageSize: ps }) => {
    setPage(p);
    setPageSize(ps);
  }, []);

  const lossRatioFloat = parseFloat(ytdStats.lossRatio);

  return (
    <div className="conservative-dashboard">
      {/* ---- Page Header ---- */}
      <Grid className="dashboard-header">
        <Column sm={4} md={8} lg={16}>
          <h1 className="dashboard-title">Insurance Financial Analytics</h1>
          <p className="dashboard-subtitle">Traditional Financial Overview — Last 12 Months</p>
        </Column>
      </Grid>

      {/* ---- KPI Cards ---- */}
      <Grid className="kpi-section" role="region" aria-label="Key Performance Indicators">
        <Column sm={4} md={4} lg={4}>
          <Tile className="kpi-card">
            <div className="kpi-label" id="kpi-owed-label">Total Owed (YTD)</div>
            <div
              className="kpi-value"
              aria-labelledby="kpi-owed-label"
              aria-live="polite"
            >
              {formatCurrency(ytdStats.totalOwed)}
            </div>
            <div className="kpi-breakdown">
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Property:</span>
                <span className="kpi-amount">{formatCurrency(ytdStats.propertyOwed)}</span>
              </div>
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Auto:</span>
                <span className="kpi-amount">{formatCurrency(ytdStats.autoOwed)}</span>
              </div>
            </div>
          </Tile>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <Tile className="kpi-card">
            <div className="kpi-label" id="kpi-claimed-label">Total Claimed (YTD)</div>
            <div
              className="kpi-value"
              aria-labelledby="kpi-claimed-label"
              aria-live="polite"
            >
              {formatCurrency(ytdStats.totalClaimed)}
            </div>
            <div className="kpi-breakdown">
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Property:</span>
                <span className="kpi-amount">{formatCurrency(ytdStats.propertyClaimed)}</span>
              </div>
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Auto:</span>
                <span className="kpi-amount">{formatCurrency(ytdStats.autoClaimed)}</span>
              </div>
            </div>
          </Tile>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <Tile className="kpi-card">
            <div className="kpi-label" id="kpi-ratio-label">Loss Ratio</div>
            <div
              className="kpi-value kpi-value-ratio"
              aria-labelledby="kpi-ratio-label"
              aria-live="polite"
            >
              {ytdStats.lossRatio}%
            </div>
            <div className="kpi-indicator">
              {lossRatioFloat > 75 ? (
                <div className="kpi-trend kpi-trend-up" role="status">
                  <Growth size={20} aria-hidden="true" />
                  <span>Above Target</span>
                </div>
              ) : (
                <div className="kpi-trend kpi-trend-down" role="status">
                  <CheckmarkFilled size={20} aria-hidden="true" />
                  <span>Within Target</span>
                </div>
              )}
            </div>
          </Tile>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <Tile className="kpi-card">
            <div className="kpi-label" id="kpi-assets-label">Total Assets</div>
            <div
              className="kpi-value"
              aria-labelledby="kpi-assets-label"
            >
              {assetData.length}
            </div>
            <div className="kpi-breakdown">
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Property:</span>
                <span className="kpi-amount">{categoryCounts.property}</span>
              </div>
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Auto:</span>
                <span className="kpi-amount">{categoryCounts.auto}</span>
              </div>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* ---- Chart Section ---- */}
      <Grid className="chart-section">
        <Column sm={4} md={8} lg={16}>
          <Tile className="chart-container">
            <div className="chart-toolbar">
              <h2 className="chart-title">Expense Visualization</h2>
              <div className="chart-controls">
                <Toggle
                  id="chart-type-toggle"
                  labelText="Chart Type"
                  labelA="Line"
                  labelB="Bar"
                  toggled={chartType === 'bar'}
                  onToggle={(checked) => setChartType(checked ? 'bar' : 'line')}
                  size="sm"
                />
              </div>
            </div>
            <div className="chart-wrapper" role="img" aria-label="Premiums vs Claims chart for last 12 months">
              {chartType === 'line' ? (
                <LineChart data={chartData} options={BASE_CHART_OPTIONS} />
              ) : (
                <SimpleBarChart
                  data={chartData}
                  options={{
                    ...BASE_CHART_OPTIONS,
                    axes: {
                      ...BASE_CHART_OPTIONS.axes,
                      bottom: { ...BASE_CHART_OPTIONS.axes.bottom, scaleType: 'labels' },
                    },
                  }}
                />
              )}
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* ---- Asset Table ---- */}
      <Grid className="table-section">
        <Column sm={4} md={8} lg={16}>
          <Tile className="table-container">
            <h2 className="table-title">Asset Performance Ledger</h2>

            <DataTable rows={tableRows} headers={TABLE_HEADERS} isSortable>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
                <div {...getTableContainerProps()}>
                  <TableToolbar aria-label="Asset table toolbar">
                    <TableToolbarContent>
                      <TableToolbarSearch
                        placeholder="Search assets…"
                        persistent
                        onChange={handleSearch}
                        aria-label="Search assets by name or category"
                      />
                      <Select
                        id="category-filter"
                        labelText="Filter by Category"
                        hideLabel
                        value={filterCategory}
                        onChange={handleCategoryChange}
                        size="sm"
                        aria-label="Filter assets by category"
                      >
                        <SelectItem value="all"      text="All Categories" />
                        <SelectItem value="property" text="Property" />
                        <SelectItem value="auto"     text="Auto" />
                      </Select>
                    </TableToolbarContent>
                  </TableToolbar>

                  <Table {...getTableProps()} size="md">
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })} key={header.key}>
                            {header.header}
                          </TableHeader>
                        ))}
                        {/* Empty header for chevron column */}
                        <TableHeader scope="col">
                          <span className="visually-hidden">Actions</span>
                        </TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          {...getRowProps({ row })}
                          key={row.id}
                          onClick={() => handleRowClick(row.id)}
                          onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                          className="clickable-row"
                          tabIndex={0}
                          role="button"
                          aria-label={`View details for ${row.cells[0]?.value}`}
                        >
                          {row.cells.map((cell) => {
                            if (cell.info.header === 'assetCategory') {
                              return (
                                <TableCell key={cell.id}>
                                  <Tag
                                    type={cell.value === 'Property' ? 'blue' : 'teal'}
                                    size="sm"
                                  >
                                    {cell.value}
                                  </Tag>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'lossRatio') {
                              const isHigh = parseFloat(cell.value) > 30;
                              return (
                                <TableCell key={cell.id}>
                                  <span
                                    className={isHigh ? 'ratio-high' : 'ratio-normal'}
                                    aria-label={`Loss ratio: ${cell.value}%${isHigh ? ' — above threshold' : ''}`}
                                  >
                                    {cell.value}%
                                  </span>
                                </TableCell>
                              );
                            }
                            return <TableCell key={cell.id}>{cell.value}</TableCell>;
                          })}
                          <TableCell>
                            <Button
                              kind="ghost"
                              size="sm"
                              renderIcon={ChevronRight}
                              iconDescription="View asset details"
                              hasIconOnly
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(row.id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    pageSizes={[10, 20, 30, 50]}
                    totalItems={filteredAssets.length}
                    onChange={handlePaginationChange}
                  />
                </div>
              )}
            </DataTable>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
