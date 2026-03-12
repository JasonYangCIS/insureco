import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ProgressBar,
} from '@carbon/react';
import { ArrowLeft, DocumentPdf, Download, CheckmarkFilled, WarningAlt } from '@carbon/icons-react';
import {
  getAssetById,
  generateClaimHistory,
  generatePolicyDocuments,
} from '../../data/financialMockData';
import './ModernAssetDetail.scss';

export default function ModernAssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const asset = useMemo(() => getAssetById(assetId), [assetId]);
  const claimHistory = useMemo(
    () => asset ? generateClaimHistory(asset.id, asset.assetCategory) : [],
    [asset]
  );
  const policyDocuments = useMemo(() => asset ? generatePolicyDocuments(asset.id) : [], [asset]);

  if (!asset) {
    return (
      <div className="modern-asset-detail">
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <Tile>
              <h2>Asset Not Found</h2>
              <p>The requested asset could not be found.</p>
              <Button onClick={() => navigate('/dashboard-modern')}>
                Back to Dashboard
              </Button>
            </Tile>
          </Column>
        </Grid>
      </div>
    );
  }

  const lossRatio = ((asset.totalClaims / asset.coverageAmount) * 100).toFixed(1);
  const isHighRisk = parseFloat(lossRatio) > 30;

  // Claim history table headers and rows
  const claimHeaders = [
    { key: 'claimId', header: 'Claim ID' },
    { key: 'claimDate', header: 'Date' },
    { key: 'claimType', header: 'Type' },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
  ];

  const claimRows = claimHistory.map((claim) => ({
    id: claim.claimId,
    claimId: claim.claimId,
    claimDate: new Date(claim.claimDate).toLocaleDateString(),
    claimType: claim.claimType,
    amount: `$${claim.amount.toLocaleString()}`,
    status: claim.status,
  }));

  const getStatusKind = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'green';
      case 'closed':
        return 'gray';
      case 'under review':
        return 'blue';
      case 'pending':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <div className="modern-asset-detail">
      {/* Hero Header */}
      <div className="detail-hero">
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <Button
              kind="tertiary"
              renderIcon={ArrowLeft}
              onClick={() => navigate('/dashboard-modern')}
              className="back-button-modern"
            >
              Back
            </Button>
            <div className="hero-content-modern">
              <div>
                <Tag type={asset.assetCategory === 'Property' ? 'purple' : 'cyan'} size="md">
                  {asset.assetCategory}
                </Tag>
                <h1 className="detail-title-modern">{asset.assetName}</h1>
                <p className="detail-subtitle-modern">Policy #{asset.policyNumber}</p>
              </div>
              <div className="hero-status">
                {isHighRisk ? (
                  <div className="status-badge status-warning">
                    <WarningAlt size={20} />
                    <span>High Risk</span>
                  </div>
                ) : (
                  <div className="status-badge status-success">
                    <CheckmarkFilled size={20} />
                    <span>Good Standing</span>
                  </div>
                )}
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      {/* Quick Stats */}
      <Grid className="stats-grid-modern">
        <Column sm={4} md={4} lg={4}>
          <div className="stat-card-modern">
            <div className="stat-label-modern">Coverage</div>
            <div className="stat-value-modern">${(asset.coverageAmount / 1000).toFixed(0)}K</div>
          </div>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <div className="stat-card-modern">
            <div className="stat-label-modern">Next Premium</div>
            <div className="stat-value-modern">${asset.premiumDue.toLocaleString()}</div>
            <div className="stat-meta-modern">Due {new Date(asset.dueDate).toLocaleDateString()}</div>
          </div>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <div className="stat-card-modern">
            <div className="stat-label-modern">Total Claims</div>
            <div className="stat-value-modern stat-value-accent">${asset.totalClaims.toLocaleString()}</div>
          </div>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <div className="stat-card-modern">
            <div className="stat-label-modern">Loss Ratio</div>
            <div className={`stat-value-modern ${isHighRisk ? 'stat-value-warning' : ''}`}>
              {lossRatio}%
            </div>
            <div className="stat-progress-modern">
              <ProgressBar
                value={parseFloat(lossRatio)}
                max={100}
                label=""
                size="sm"
                status={isHighRisk ? 'error' : 'active'}
              />
            </div>
          </div>
        </Column>
      </Grid>

      {/* Tabbed Content */}
      <Grid className="content-grid-modern">
        <Column sm={4} md={8} lg={16}>
          <Tile className="content-tile-modern">
            <Tabs>
              <TabList aria-label="Asset details" contained>
                <Tab>Policy Details</Tab>
                <Tab>Claim History ({claimHistory.length})</Tab>
                <Tab>Documents ({policyDocuments.length})</Tab>
              </TabList>
              <TabPanels>
                {/* Policy Details Tab */}
                <TabPanel>
                  <div className="tab-panel-content">
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label-modern">Policy Number</div>
                        <div className="info-value-modern">{asset.policyNumber}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label-modern">Coverage Amount</div>
                        <div className="info-value-modern">${asset.coverageAmount.toLocaleString()}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label-modern">Deductible</div>
                        <div className="info-value-modern">${asset.deductible.toLocaleString()}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label-modern">Premium Amount</div>
                        <div className="info-value-modern">${asset.premiumDue.toLocaleString()}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label-modern">Payment Due Date</div>
                        <div className="info-value-modern">
                          {new Date(asset.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      {asset.vin && (
                        <div className="info-item">
                          <div className="info-label-modern">VIN</div>
                          <div className="info-value-modern info-value-mono">{asset.vin}</div>
                        </div>
                      )}
                      {asset.location && (
                        <div className="info-item">
                          <div className="info-label-modern">Location</div>
                          <div className="info-value-modern">{asset.location}</div>
                        </div>
                      )}
                      <div className="info-item">
                        <div className="info-label-modern">Asset Category</div>
                        <div className="info-value-modern">
                          <Tag type={asset.assetCategory === 'Property' ? 'purple' : 'cyan'} size="sm">
                            {asset.assetCategory}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Claim History Tab */}
                <TabPanel>
                  <div className="tab-panel-content">
                    {claimHistory.length === 0 ? (
                      <div className="empty-state-modern">
                        <CheckmarkFilled size={48} />
                        <h3>No Claims Filed</h3>
                        <p>This asset has a clean claims history.</p>
                      </div>
                    ) : (
                      <DataTable rows={claimRows} headers={claimHeaders} isSortable>
                        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
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
                                <TableRow {...getRowProps({ row })} key={row.id}>
                                  {row.cells.map((cell) => {
                                    if (cell.info.header === 'status') {
                                      return (
                                        <TableCell key={cell.id}>
                                          <Tag type={getStatusKind(cell.value)} size="sm">
                                            {cell.value}
                                          </Tag>
                                        </TableCell>
                                      );
                                    }
                                    return <TableCell key={cell.id}>{cell.value}</TableCell>;
                                  })}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </DataTable>
                    )}
                  </div>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel>
                  <div className="tab-panel-content">
                    <div className="document-grid">
                      {policyDocuments.map((doc) => (
                        <div key={doc.docId} className="document-card-modern">
                          <div className="document-icon-modern">
                            <DocumentPdf size={32} />
                          </div>
                          <div className="document-content">
                            <div className="document-name-modern">{doc.docName}</div>
                            <div className="document-meta-modern">
                              {doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            kind="ghost"
                            size="sm"
                            renderIcon={Download}
                            iconDescription="Download"
                            hasIconOnly
                          />
                        </div>
                      ))}
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
