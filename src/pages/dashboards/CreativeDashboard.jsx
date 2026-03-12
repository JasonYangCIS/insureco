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
  Tag,
  ProgressBar,
} from '@carbon/react';
import {
  Money,
  DocumentAdd,
  Growth,
  Warning,
  Checkmark,
  ArrowRight,
} from '@carbon/icons-react';
import { LineChart, DonutChart, SimpleBarChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import { getMonthlyData, getAssetData, calculateYTDStats } from '../../data/financialMockData';
import './CreativeDashboard.scss';

export default function CreativeDashboard() {
  const navigate = useNavigate();
  const monthlyData = useMemo(() => getMonthlyData(), []);
  const assetData = useMemo(() => getAssetData(), []);
  const ytdStats = useMemo(() => calculateYTDStats(monthlyData, assetData), [monthlyData, assetData]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Paginate assets
  const paginatedAssets = useMemo(() => {
    const sorted = [...assetData].sort((a, b) => b.totalClaims - a.totalClaims);
    const startIndex = (page - 1) * pageSize;
    return sorted.slice(startIndex, startIndex + pageSize);
  }, [assetData, page, pageSize]);

  // Chart data for trend analysis
  const trendData = useMemo(() => {
    return monthlyData.map(month => ({
      group: 'Revenue',
      month: month.monthYear,
      value: month.propertyPremiums + month.autoPremiums - month.propertyClaims - month.autoClaims,
    }));
  }, [monthlyData]);

  // Donut chart for portfolio split
  const portfolioData = [
    { group: 'Property Premiums', value: ytdStats.propertyOwed },
    { group: 'Auto Premiums', value: ytdStats.autoOwed },
  ];

  // Bar chart for claims comparison
  const claimsComparisonData = useMemo(() => {
    const last6Months = monthlyData.slice(-6);
    return last6Months.flatMap(month => [
      { group: 'Property', month: month.month, value: month.propertyClaims },
      { group: 'Auto', month: month.month, value: month.autoClaims },
    ]);
  }, [monthlyData]);

  const trendChartOptions = {
    title: '',
    axes: {
      bottom: {
        title: '',
        mapsTo: 'month',
        scaleType: 'labels',
      },
      left: {
        title: 'Net Revenue',
        mapsTo: 'value',
        scaleType: 'linear',
      },
    },
    curve: 'curveNatural',
    height: '300px',
    legend: { enabled: false },
    color: {
      scale: {
        'Revenue': '#be95ff',
      },
    },
    // WCAG AA: White text for proper contrast on blue gradient background
    theme: 'g100', // Use Carbon's dark theme for white text
    grid: {
      x: {
        enabled: false,
      },
      y: {
        enabled: true,
      },
    },
  };

  const donutChartOptions = {
    title: '',
    resizable: true,
    height: '250px',
    donut: {
      center: {
        label: 'Portfolio',
      },
    },
    legend: {
      position: 'bottom',
    },
    color: {
      scale: {
        'Property Premiums': '#a56eff',
        'Auto Premiums': '#33b1ff',
      },
    },
  };

  const barChartOptions = {
    title: '',
    axes: {
      bottom: {
        title: '',
        mapsTo: 'month',
        scaleType: 'labels',
      },
      left: {
        title: 'Claims Amount',
        mapsTo: 'value',
        scaleType: 'linear',
      },
    },
    height: '280px',
    legend: {
      enabled: true,
    },
    color: {
      scale: {
        'Property': '#ff7eb6',
        'Auto': '#82cfff',
      },
    },
  };

  // Table headers
  const tableHeaders = [
    { key: 'assetName', header: 'Asset' },
    { key: 'assetCategory', header: 'Type' },
    { key: 'riskScore', header: 'Risk' },
    { key: 'totalClaims', header: 'Total Claims' },
    { key: 'premiumDue', header: 'Next Premium' },
    { key: 'actions', header: '' },
  ];

  // Format table rows with risk scores
  const tableRows = paginatedAssets.map(asset => {
    const lossRatio = (asset.totalClaims / asset.coverageAmount) * 100;
    let riskLevel = 'Low';
    if (lossRatio > 30) riskLevel = 'High';
    else if (lossRatio > 15) riskLevel = 'Medium';

    return {
      id: asset.id,
      assetName: asset.assetName,
      assetCategory: asset.assetCategory,
      riskScore: riskLevel,
      totalClaims: asset.totalClaims,
      premiumDue: asset.premiumDue,
      lossRatio: lossRatio,
    };
  });

  const formatCompact = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const healthScore = 100 - parseFloat(ytdStats.lossRatio);

  return (
    <div className="creative-dashboard">
      {/* Asymmetric Hero Section */}
      <div className="creative-hero">
        <div className="hero-pattern"></div>
        <Grid>
          <Column sm={4} md={8} lg={10}>
            <div className="hero-content-creative">
              <div className="hero-badge">
                <Money size={24} />
                <span>Financial Command Center</span>
              </div>
              <h1 className="creative-title">Insurance Portfolio Analytics</h1>
              <p className="creative-subtitle">Wild & Creative View - Data Storytelling Experience</p>
            </div>
          </Column>
          <Column sm={4} md={8} lg={6}>
            <div className="hero-stat-card">
              <div className="hero-stat-label">Portfolio Health Score</div>
              <div className="hero-stat-value">{healthScore.toFixed(0)}</div>
              <ProgressBar value={healthScore} max={100} label="" size="big" />
              <div className="hero-stat-subtitle">
                {healthScore > 70 ? 'Excellent Performance' : healthScore > 50 ? 'Good Standing' : 'Needs Attention'}
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      {/* Asymmetric KPI Grid */}
      <Grid className="kpi-grid-creative">
        {/* Large Feature Card */}
        <Column sm={4} md={8} lg={8}>
          <div className="kpi-feature-card">
            <div className="feature-card-header">
              <h3>Year-to-Date Performance</h3>
              <Growth size={32} className="feature-icon" />
            </div>
            <div className="feature-metrics">
              <div className="feature-metric-row">
                <div className="metric-item">
                  <div className="metric-label">Premiums Collected</div>
                  <div className="metric-value metric-value-success">
                    {formatCompact(ytdStats.totalOwed)}
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Claims Paid</div>
                  <div className="metric-value metric-value-danger">
                    {formatCompact(ytdStats.totalClaimed)}
                  </div>
                </div>
              </div>
              <div className="feature-chart">
                <LineChart data={trendData} options={trendChartOptions} />
              </div>
            </div>
          </div>
        </Column>

        {/* Stacked Small Cards */}
        <Column sm={4} md={4} lg={4}>
          <div className="kpi-stack">
            <div className="kpi-mini-card kpi-purple">
              <div className="mini-icon">
                <DocumentAdd size={28} />
              </div>
              <div className="mini-content">
                <div className="mini-label">Active Policies</div>
                <div className="mini-value">{assetData.length}</div>
              </div>
            </div>
            <div className="kpi-mini-card kpi-cyan">
              <div className="mini-icon">
                <Checkmark size={28} />
              </div>
              <div className="mini-content">
                <div className="mini-label">Zero Claims</div>
                <div className="mini-value">
                  {assetData.filter(a => a.totalClaims === 0).length}
                </div>
              </div>
            </div>
            <div className="kpi-mini-card kpi-red">
              <div className="mini-icon">
                <Warning size={28} />
              </div>
              <div className="mini-content">
                <div className="mini-label">High Risk</div>
                <div className="mini-value">
                  {assetData.filter(a => (a.totalClaims / a.coverageAmount) > 0.3).length}
                </div>
              </div>
            </div>
          </div>
        </Column>

        {/* Donut Chart Card */}
        <Column sm={4} md={4} lg={4}>
          <div className="kpi-chart-card">
            <h4>Portfolio Distribution</h4>
            <DonutChart data={portfolioData} options={donutChartOptions} />
          </div>
        </Column>
      </Grid>

      {/* Claims Comparison Section */}
      <Grid className="comparison-section">
        <Column sm={4} md={8} lg={16}>
          <Tile className="comparison-tile">
            <div className="section-header-creative">
              <h3>Claims Trend Analysis</h3>
              <div className="section-legend">
                <span className="legend-item"><span className="legend-dot legend-dot-property"></span>Property</span>
                <span className="legend-item"><span className="legend-dot legend-dot-auto"></span>Auto</span>
              </div>
            </div>
            <SimpleBarChart data={claimsComparisonData} options={barChartOptions} />
          </Tile>
        </Column>
      </Grid>

      {/* High Risk Assets Table */}
      <Grid className="assets-section-creative">
        <Column sm={4} md={8} lg={16}>
          <Tile className="assets-tile-creative">
            <div className="table-header-creative">
              <h3>Asset Performance Ranking</h3>
              <p className="table-description">Sorted by total claims (highest risk first)</p>
            </div>

            <DataTable rows={tableRows} headers={tableHeaders} isSortable>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
                <div {...getTableContainerProps()}>
                  <TableToolbar>
                    <TableToolbarContent>
                      <TableToolbarSearch placeholder="Search assets..." persistent />
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          {...getRowProps({ row })}
                          key={row.id}
                          onClick={() => navigate(`/dashboard-creative/${row.id}`)}
                          className="clickable-row-creative"
                        >
                          {row.cells.map((cell) => {
                            if (cell.info.header === 'assetCategory') {
                              return (
                                <TableCell key={cell.id}>
                                  <Tag
                                    type={cell.value === 'Property' ? 'magenta' : 'teal'}
                                    size="sm"
                                  >
                                    {cell.value}
                                  </Tag>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'riskScore') {
                              let tagType = 'green';
                              if (cell.value === 'High') tagType = 'red';
                              else if (cell.value === 'Medium') tagType = 'purple';
                              
                              return (
                                <TableCell key={cell.id}>
                                  <Tag type={tagType} size="sm">
                                    {cell.value}
                                  </Tag>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'totalClaims') {
                              return (
                                <TableCell key={cell.id}>
                                  <strong className="claims-amount">
                                    ${cell.value.toLocaleString()}
                                  </strong>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'premiumDue') {
                              return (
                                <TableCell key={cell.id}>
                                  ${cell.value.toLocaleString()}
                                </TableCell>
                              );
                            }
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
                    totalItems={assetData.length}
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
