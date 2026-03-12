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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ProgressBar,
} from '@carbon/react';
import { ChevronRight, TrendUp, Analytics } from '@carbon/icons-react';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import { getMonthlyData, getAssetData, calculateYTDStats } from '../../data/financialMockData';
import './ModernDashboard.scss';

export default function ModernDashboard() {
  const navigate = useNavigate();
  const monthlyData = useMemo(() => getMonthlyData(), []);
  const assetData = useMemo(() => getAssetData(), []);
  const ytdStats = useMemo(() => calculateYTDStats(monthlyData, assetData), [monthlyData, assetData]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState(0);

  // Filter assets by category based on tab
  const filteredAssets = useMemo(() => {
    if (activeTab === 0) return assetData;
    if (activeTab === 1) return assetData.filter(a => a.assetCategory === 'Property');
    return assetData.filter(a => a.assetCategory === 'Auto');
  }, [assetData, activeTab]);

  // Paginate assets
  const paginatedAssets = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredAssets.slice(startIndex, startIndex + pageSize);
  }, [filteredAssets, page, pageSize]);

  // Prepare chart data for selected tab
  const chartData = useMemo(() => {
    if (activeTab === 1) {
      // Property only
      return monthlyData.flatMap(month => [
        { group: 'Premiums', month: month.monthYear, value: month.propertyPremiums },
        { group: 'Claims', month: month.monthYear, value: month.propertyClaims },
      ]);
    } else if (activeTab === 2) {
      // Auto only
      return monthlyData.flatMap(month => [
        { group: 'Premiums', month: month.monthYear, value: month.autoPremiums },
        { group: 'Claims', month: month.monthYear, value: month.autoClaims },
      ]);
    }
    // All
    return monthlyData.flatMap(month => [
      { group: 'Premiums', month: month.monthYear, value: month.propertyPremiums + month.autoPremiums },
      { group: 'Claims', month: month.monthYear, value: month.propertyClaims + month.autoClaims },
    ]);
  }, [monthlyData, activeTab]);

  const chartOptions = {
    title: '',
    axes: {
      bottom: {
        title: '',
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
    height: '350px',
    legend: {
      enabled: true,
      position: 'top',
    },
    color: {
      scale: {
        'Premiums': '#0f62fe',
        'Claims': '#da1e28',
      },
    },
    grid: {
      x: {
        enabled: false,
      },
      y: {
        enabled: true,
      },
    },
  };

  // Table headers
  const tableHeaders = [
    { key: 'assetName', header: 'Asset' },
    { key: 'assetCategory', header: 'Type' },
    { key: 'premiumDue', header: 'Next Premium' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'totalClaims', header: 'Claims' },
    { key: 'lossRatio', header: 'Loss Ratio' },
  ];

  // Format table rows
  const tableRows = paginatedAssets.map(asset => ({
    id: asset.id,
    assetName: asset.assetName,
    assetCategory: asset.assetCategory,
    premiumDue: `$${asset.premiumDue.toLocaleString()}`,
    dueDate: new Date(asset.dueDate).toLocaleDateString(),
    totalClaims: `$${asset.totalClaims.toLocaleString()}`,
    lossRatio: ((asset.totalClaims / asset.coverageAmount) * 100).toFixed(1),
  }));

  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const formatCompact = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="modern-dashboard">
      <div className="dashboard-hero">
        <Grid>
          <Column lg={16}>
            <div className="hero-content">
              <div className="hero-header">
                <Analytics size={48} className="hero-icon" />
                <div>
                  <h1 className="hero-title">Financial Analytics</h1>
                  <p className="hero-subtitle">Modern Sleek View - Minimalist Design</p>
                </div>
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      {/* KPI Cards - Minimalist */}
      <Grid className="kpi-grid">
        <Column sm={4} md={4} lg={4}>
          <div className="kpi-card-modern">
            <div className="kpi-header">
              <span className="kpi-label-modern">Premiums Collected</span>
              <TrendUp size={20} className="kpi-icon-success" />
            </div>
            <div className="kpi-value-modern">{formatCompact(ytdStats.totalOwed)}</div>
            <div className="kpi-progress">
              <ProgressBar value={75} label="" size="sm" />
              <span className="kpi-progress-text">75% of annual target</span>
            </div>
          </div>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <div className="kpi-card-modern">
            <div className="kpi-header">
              <span className="kpi-label-modern">Claims Paid</span>
              <TrendUp size={20} className="kpi-icon-warning" />
            </div>
            <div className="kpi-value-modern">{formatCompact(ytdStats.totalClaimed)}</div>
            <div className="kpi-detail">
              <span className="kpi-detail-label">Property</span>
              <span className="kpi-detail-value">{formatCompact(ytdStats.propertyClaimed)}</span>
            </div>
          </div>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <div className="kpi-card-modern">
            <div className="kpi-header">
              <span className="kpi-label-modern">Loss Ratio</span>
            </div>
            <div className="kpi-value-modern kpi-value-accent">{ytdStats.lossRatio}%</div>
            <div className="kpi-detail">
              <Tag type={parseFloat(ytdStats.lossRatio) > 75 ? 'red' : 'green'} size="sm">
                {parseFloat(ytdStats.lossRatio) > 75 ? 'Above Target' : 'Within Target'}
              </Tag>
            </div>
          </div>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <div className="kpi-card-modern">
            <div className="kpi-header">
              <span className="kpi-label-modern">Active Policies</span>
            </div>
            <div className="kpi-value-modern">{assetData.length}</div>
            <div className="kpi-split">
              <div className="kpi-split-item">
                <div className="split-label">Property</div>
                <div className="split-value">
                  {assetData.filter(a => a.assetCategory === 'Property').length}
                </div>
              </div>
              <div className="kpi-split-item">
                <div className="split-label">Auto</div>
                <div className="split-value">
                  {assetData.filter(a => a.assetCategory === 'Auto').length}
                </div>
              </div>
            </div>
          </div>
        </Column>
      </Grid>

      {/* Tabbed Layout */}
      <Grid className="content-grid">
        <Column lg={16}>
          <Tile className="content-tile">
            <Tabs selectedIndex={activeTab} onChange={(e) => { setActiveTab(e.selectedIndex); setPage(1); }}>
              <TabList aria-label="Dashboard views" contained>
                <Tab>All Assets</Tab>
                <Tab>Property</Tab>
                <Tab>Auto</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="tab-content">
                    <div className="chart-section-modern">
                      <h3 className="section-heading">Performance Trends</h3>
                      <LineChart data={chartData} options={chartOptions} />
                    </div>
                    <div className="table-section-modern">
                      <h3 className="section-heading">Asset Portfolio</h3>
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
                                  <TableHeader />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row) => (
                                  <TableRow
                                    {...getRowProps({ row })}
                                    key={row.id}
                                    onClick={() => navigate(`/dashboard-modern/${row.id}`)}
                                    className="clickable-row-modern"
                                  >
                                    {row.cells.map((cell) => {
                                      if (cell.info.header === 'assetCategory') {
                                        return (
                                          <TableCell key={cell.id}>
                                            <Tag
                                              type={cell.value === 'Property' ? 'purple' : 'cyan'}
                                              size="sm"
                                            >
                                              {cell.value}
                                            </Tag>
                                          </TableCell>
                                        );
                                      }
                                      if (cell.info.header === 'lossRatio') {
                                        return (
                                          <TableCell key={cell.id}>
                                            <span className={parseFloat(cell.value) > 30 ? 'ratio-high' : 'ratio-normal'}>
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
                                        iconDescription="View"
                                        hasIconOnly
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
                              onChange={({ page, pageSize }) => {
                                setPage(page);
                                setPageSize(pageSize);
                              }}
                            />
                          </div>
                        )}
                      </DataTable>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="tab-content">
                    <div className="chart-section-modern">
                      <h3 className="section-heading">Property Performance</h3>
                      <LineChart data={chartData} options={chartOptions} />
                    </div>
                    <div className="table-section-modern">
                      <h3 className="section-heading">Property Assets</h3>
                      <DataTable rows={tableRows} headers={tableHeaders} isSortable>
                        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
                          <div {...getTableContainerProps()}>
                            <TableToolbar>
                              <TableToolbarContent>
                                <TableToolbarSearch placeholder="Search properties..." persistent />
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
                                  <TableHeader />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row) => (
                                  <TableRow
                                    {...getRowProps({ row })}
                                    key={row.id}
                                    onClick={() => navigate(`/dashboard-modern/${row.id}`)}
                                    className="clickable-row-modern"
                                  >
                                    {row.cells.map((cell) => {
                                      if (cell.info.header === 'assetCategory') {
                                        return (
                                          <TableCell key={cell.id}>
                                            <Tag type="purple" size="sm">
                                              {cell.value}
                                            </Tag>
                                          </TableCell>
                                        );
                                      }
                                      if (cell.info.header === 'lossRatio') {
                                        return (
                                          <TableCell key={cell.id}>
                                            <span className={parseFloat(cell.value) > 30 ? 'ratio-high' : 'ratio-normal'}>
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
                                        iconDescription="View"
                                        hasIconOnly
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
                              onChange={({ page, pageSize }) => {
                                setPage(page);
                                setPageSize(pageSize);
                              }}
                            />
                          </div>
                        )}
                      </DataTable>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="tab-content">
                    <div className="chart-section-modern">
                      <h3 className="section-heading">Auto Fleet Performance</h3>
                      <LineChart data={chartData} options={chartOptions} />
                    </div>
                    <div className="table-section-modern">
                      <h3 className="section-heading">Auto Fleet Assets</h3>
                      <DataTable rows={tableRows} headers={tableHeaders} isSortable>
                        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
                          <div {...getTableContainerProps()}>
                            <TableToolbar>
                              <TableToolbarContent>
                                <TableToolbarSearch placeholder="Search vehicles..." persistent />
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
                                  <TableHeader />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row) => (
                                  <TableRow
                                    {...getRowProps({ row })}
                                    key={row.id}
                                    onClick={() => navigate(`/dashboard-modern/${row.id}`)}
                                    className="clickable-row-modern"
                                  >
                                    {row.cells.map((cell) => {
                                      if (cell.info.header === 'assetCategory') {
                                        return (
                                          <TableCell key={cell.id}>
                                            <Tag type="cyan" size="sm">
                                              {cell.value}
                                            </Tag>
                                          </TableCell>
                                        );
                                      }
                                      if (cell.info.header === 'lossRatio') {
                                        return (
                                          <TableCell key={cell.id}>
                                            <span className={parseFloat(cell.value) > 30 ? 'ratio-high' : 'ratio-normal'}>
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
                                        iconDescription="View"
                                        hasIconOnly
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
                              onChange={({ page, pageSize }) => {
                                setPage(page);
                                setPageSize(pageSize);
                              }}
                            />
                          </div>
                        )}
                      </DataTable>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
