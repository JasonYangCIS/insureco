import React, { useState, useMemo } from 'react';
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
} from '@carbon/react';
import { ArrowRight, TrendUp, CheckmarkFilled } from '@carbon/icons-react';
import { LineChart, SimpleBarChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import { getMonthlyData, getAssetData, calculateYTDStats } from '../../data/financialMockData';
import './ConservativeDashboard.scss';

export default function ConservativeDashboard() {
  const navigate = useNavigate();
  const monthlyData = useMemo(() => getMonthlyData(), []);
  const assetData = useMemo(() => getAssetData(), []);
  const ytdStats = useMemo(() => calculateYTDStats(monthlyData, assetData), [monthlyData, assetData]);

  const [chartType, setChartType] = useState('line');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter assets by category
  const filteredAssets = useMemo(() => {
    if (filterCategory === 'all') return assetData;
    return assetData.filter(asset => asset.assetCategory.toLowerCase() === filterCategory);
  }, [assetData, filterCategory]);

  // Paginate assets
  const paginatedAssets = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredAssets.slice(startIndex, startIndex + pageSize);
  }, [filteredAssets, page, pageSize]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return monthlyData.flatMap(month => [
      { group: 'Property Premiums', month: month.monthYear, value: month.propertyPremiums },
      { group: 'Property Claims', month: month.monthYear, value: month.propertyClaims },
      { group: 'Auto Premiums', month: month.monthYear, value: month.autoPremiums },
      { group: 'Auto Claims', month: month.monthYear, value: month.autoClaims },
    ]);
  }, [monthlyData]);

  const chartOptions = {
    title: 'Premiums vs Claims - Last 12 Months',
    axes: {
      bottom: {
        title: 'Month',
        mapsTo: 'month',
        scaleType: 'labels',
      },
      left: {
        title: 'Amount ($)',
        mapsTo: 'value',
        scaleType: 'linear',
      },
    },
    curve: 'curveMonotoneX',
    height: '400px',
    legend: {
      enabled: true,
    },
    color: {
      scale: {
        'Property Premiums': '#198038',
        'Property Claims': '#da1e28',
        'Auto Premiums': '#0f62fe',
        'Auto Claims': '#ff832b',
      },
    },
  };

  // Table headers
  const tableHeaders = [
    { key: 'assetName', header: 'Asset ID/Name' },
    { key: 'assetCategory', header: 'Category' },
    { key: 'premiumDue', header: 'Premium Due' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'totalClaims', header: 'Total Claims' },
    { key: 'actions', header: '' },
  ];

  // Format table rows
  const tableRows = paginatedAssets.map(asset => ({
    id: asset.id,
    assetName: asset.assetName,
    assetCategory: asset.assetCategory,
    premiumDue: `$${asset.premiumDue.toLocaleString()}`,
    dueDate: new Date(asset.dueDate).toLocaleDateString(),
    totalClaims: `$${asset.totalClaims.toLocaleString()}`,
  }));

  const formatCurrency = (value) => `$${value.toLocaleString()}`;

  return (
    <div className="conservative-dashboard">
      <Grid className="dashboard-header">
        <Column lg={16}>
          <h1 className="dashboard-title">Insurance Financial Analytics Dashboard</h1>
          <p className="dashboard-subtitle">Conservative View - Traditional Financial Overview</p>
        </Column>
      </Grid>

      {/* KPI Summary Section */}
      <Grid className="kpi-section">
        <Column sm={4} md={4} lg={4}>
          <Tile className="kpi-card">
            <div className="kpi-label">Total Owed (YTD)</div>
            <div className="kpi-value">{formatCurrency(ytdStats.totalOwed)}</div>
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
            <div className="kpi-label">Total Claimed (YTD)</div>
            <div className="kpi-value">{formatCurrency(ytdStats.totalClaimed)}</div>
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
            <div className="kpi-label">Loss Ratio</div>
            <div className="kpi-value kpi-value-ratio">{ytdStats.lossRatio}%</div>
            <div className="kpi-indicator">
              {parseFloat(ytdStats.lossRatio) > 75 ? (
                <div className="kpi-trend kpi-trend-up">
                  <TrendUp size={20} />
                  <span>Above Target</span>
                </div>
              ) : (
                <div className="kpi-trend kpi-trend-down">
                  <CheckmarkFilled size={20} />
                  <span>Within Target</span>
                </div>
              )}
            </div>
          </Tile>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <Tile className="kpi-card">
            <div className="kpi-label">Total Assets</div>
            <div className="kpi-value">{assetData.length}</div>
            <div className="kpi-breakdown">
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Property:</span>
                <span className="kpi-amount">
                  {assetData.filter(a => a.assetCategory === 'Property').length}
                </span>
              </div>
              <div className="kpi-breakdown-item">
                <span className="kpi-category">Auto:</span>
                <span className="kpi-amount">
                  {assetData.filter(a => a.assetCategory === 'Auto').length}
                </span>
              </div>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Chart Section */}
      <Grid className="chart-section">
        <Column lg={16}>
          <Tile className="chart-container">
            <div className="chart-toolbar">
              <h3 className="chart-title">Expense Visualization</h3>
              <div className="chart-controls">
                <Toggle
                  id="chart-type-toggle"
                  labelText="Chart Type"
                  labelA="Line Chart"
                  labelB="Bar Chart"
                  toggled={chartType === 'bar'}
                  onToggle={(checked) => setChartType(checked ? 'bar' : 'line')}
                  size="sm"
                />
              </div>
            </div>
            <div className="chart-wrapper">
              {chartType === 'line' ? (
                <LineChart data={chartData} options={chartOptions} />
              ) : (
                <SimpleBarChart
                  data={chartData}
                  options={{
                    ...chartOptions,
                    axes: {
                      ...chartOptions.axes,
                      bottom: {
                        ...chartOptions.axes.bottom,
                        scaleType: 'labels',
                      },
                    },
                  }}
                />
              )}
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Asset Performance Table */}
      <Grid className="table-section">
        <Column lg={16}>
          <Tile className="table-container">
            <h3 className="table-title">Asset Performance Ledger</h3>
            
            <DataTable rows={tableRows} headers={tableHeaders} isSortable>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
                <div {...getTableContainerProps()}>
                  <TableToolbar>
                    <TableToolbarContent>
                      <TableToolbarSearch placeholder="Search assets..." persistent />
                      <Select
                        id="category-filter"
                        labelText="Filter by Category"
                        value={filterCategory}
                        onChange={(e) => {
                          setFilterCategory(e.target.value);
                          setPage(1);
                        }}
                        size="sm"
                      >
                        <SelectItem value="all" text="All Categories" />
                        <SelectItem value="property" text="Property" />
                        <SelectItem value="auto" text="Auto" />
                      </Select>
                    </TableToolbarContent>
                  </TableToolbar>
                  
                  <Table {...getTableProps()}>
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
                      {rows.map((row) => (
                        <TableRow
                          {...getRowProps({ row })}
                          key={row.id}
                          onClick={() => navigate(`/dashboard-conservative/${row.id}`)}
                          className="clickable-row"
                        >
                          {row.cells.map((cell) => {
                            if (cell.info.header === 'actions') {
                              return (
                                <TableCell key={cell.id}>
                                  <Button
                                    kind="ghost"
                                    size="sm"
                                    renderIcon={ArrowRight}
                                    iconDescription="View Details"
                                    hasIconOnly
                                  />
                                </TableCell>
                              );
                            }
                            return <TableCell key={cell.id}>{cell.value}</TableCell>;
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    pageSizes={[10, 20, 30, 50]}
                    totalItems={filteredAssets.length}
                    onChange={({ page, pageSize }) => {
                      setPage(page);
                      setPageSize(pageSize);
                    }}
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
