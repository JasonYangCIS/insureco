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
  ProgressBar,
} from '@carbon/react';
import {
  ArrowLeft,
  DocumentPdf,
  Download,
  WarningAlt,
  CheckmarkFilled,
  TrendUp,
  Money,
} from '@carbon/icons-react';
import {
  getAssetById,
  generateClaimHistory,
  generatePolicyDocuments,
} from '../../data/financialMockData';
import './CreativeAssetDetail.scss';

export default function CreativeAssetDetail() {
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
      <div className="creative-asset-detail">
        <Grid>
          <Column lg={16}>
            <Tile>
              <h2>Asset Not Found</h2>
              <p>The requested asset could not be found.</p>
              <Button onClick={() => navigate('/dashboard-creative')}>
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
  const isMediumRisk = parseFloat(lossRatio) > 15 && parseFloat(lossRatio) <= 30;

  // Calculate risk score (0-100, higher is better)
  const riskScore = Math.max(0, 100 - parseFloat(lossRatio) * 2);

  // Claim history table
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
    <div className="creative-asset-detail">
      {/* Bold Gradient Hero */}
      <div className={`detail-hero-creative ${isHighRisk ? 'hero-danger' : isMediumRisk ? 'hero-warning' : 'hero-success'}`}>
        <div className="hero-pattern-creative"></div>
        <Grid>
          <Column lg={10}>
            <Button
              kind="tertiary"
              renderIcon={ArrowLeft}
              onClick={() => navigate('/dashboard-creative')}
              className="back-button-creative"
            >
              Back to Dashboard
            </Button>
            <div className="hero-content-detail">
              <Tag type={asset.assetCategory === 'Property' ? 'magenta' : 'teal'} size="md">
                {asset.assetCategory}
              </Tag>
              <h1 className="detail-hero-title">{asset.assetName}</h1>
              <p className="detail-hero-subtitle">Policy #{asset.policyNumber}</p>
            </div>
          </Column>
          <Column lg={6}>
            <div className="hero-risk-card">
              <div className="risk-icon-container">
                {isHighRisk ? (
                  <WarningAlt size={48} className="risk-icon-danger" />
                ) : (
                  <CheckmarkFilled size={48} className="risk-icon-success" />
                )}
              </div>
              <div className="risk-score-display">
                <div className="risk-label">Risk Score</div>
                <div className="risk-value">{riskScore.toFixed(0)}</div>
                <div className="risk-status">
                  {isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk'}
                </div>
              </div>
            </div>
          </Column>
        </Grid>
      </div>

      {/* Asymmetric Stats Grid */}
      <Grid className="stats-grid-creative">
        <Column sm={4} md={8} lg={8}>
          <div className="stat-feature-card">
            <div className="stat-feature-icon">
              <Money size={40} />
            </div>
            <div className="stat-feature-content">
              <div className="stat-feature-label">Total Coverage</div>
              <div className="stat-feature-value">
                ${(asset.coverageAmount / 1000).toFixed(0)}K
              </div>
              <ProgressBar
                value={(asset.totalClaims / asset.coverageAmount) * 100}
                max={100}
                label=""
                size="big"
                status={isHighRisk ? 'error' : 'active'}
              />
              <div className="stat-feature-meta">
                ${asset.totalClaims.toLocaleString()} in lifetime claims
              </div>
            </div>
          </div>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <div className="stat-mini-card stat-premium">
            <div className="stat-mini-label">Next Premium</div>
            <div className="stat-mini-value">${asset.premiumDue.toLocaleString()}</div>
            <div className="stat-mini-meta">Due {new Date(asset.dueDate).toLocaleDateString()}</div>
          </div>
        </Column>

        <Column sm={4} md={4} lg={4}>
          <div className="stat-mini-card stat-claims">
            <div className="stat-mini-label">Claims Filed</div>
            <div className="stat-mini-value">{claimHistory.length}</div>
            <div className="stat-mini-meta">
              {claimHistory.length === 0 ? 'Perfect record' : 'Lifetime claims'}
            </div>
          </div>
        </Column>
      </Grid>

      {/* Policy Details Grid */}
      <Grid className="details-grid-creative">
        <Column lg={16}>
          <Tile className="details-tile-creative">
            <h3 className="section-title-creative">
              <TrendUp size={24} />
              Policy Information
            </h3>
            <div className="details-content-grid">
              <div className="detail-item-creative">
                <div className="detail-icon-badge policy-badge">
                  <DocumentPdf size={20} />
                </div>
                <div>
                  <div className="detail-label-creative">Policy Number</div>
                  <div className="detail-value-creative">{asset.policyNumber}</div>
                </div>
              </div>

              <div className="detail-item-creative">
                <div className="detail-icon-badge coverage-badge">
                  <Money size={20} />
                </div>
                <div>
                  <div className="detail-label-creative">Coverage Amount</div>
                  <div className="detail-value-creative">${asset.coverageAmount.toLocaleString()}</div>
                </div>
              </div>

              <div className="detail-item-creative">
                <div className="detail-icon-badge deductible-badge">
                  <WarningAlt size={20} />
                </div>
                <div>
                  <div className="detail-label-creative">Deductible</div>
                  <div className="detail-value-creative">${asset.deductible.toLocaleString()}</div>
                </div>
              </div>

              {asset.vin && (
                <div className="detail-item-creative detail-item-wide">
                  <div className="detail-label-creative">VIN</div>
                  <div className="detail-value-creative detail-value-mono">{asset.vin}</div>
                </div>
              )}

              {asset.location && (
                <div className="detail-item-creative detail-item-wide">
                  <div className="detail-label-creative">Location</div>
                  <div className="detail-value-creative">{asset.location}</div>
                </div>
              )}
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Claim History */}
      <Grid className="claims-grid-creative">
        <Column lg={16}>
          <Tile className="claims-tile-creative">
            <h3 className="section-title-creative">
              <WarningAlt size={24} />
              Claim History
            </h3>
            {claimHistory.length === 0 ? (
              <div className="empty-state-creative">
                <CheckmarkFilled size={64} />
                <h4>Perfect Record!</h4>
                <p>This asset has never filed a claim.</p>
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
                            if (cell.info.header === 'amount') {
                              return (
                                <TableCell key={cell.id}>
                                  <strong className="amount-creative">{cell.value}</strong>
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
          </Tile>
        </Column>
      </Grid>

      {/* Documents */}
      <Grid className="documents-grid-creative">
        <Column lg={16}>
          <Tile className="documents-tile-creative">
            <h3 className="section-title-creative">
              <DocumentPdf size={24} />
              Policy Documents
            </h3>
            <div className="document-list-creative">
              {policyDocuments.map((doc) => (
                <div key={doc.docId} className="document-card-creative">
                  <div className="document-visual">
                    <DocumentPdf size={48} />
                  </div>
                  <div className="document-info-creative">
                    <div className="document-name-creative">{doc.docName}</div>
                    <div className="document-meta-creative">
                      {doc.size} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    kind="primary"
                    size="sm"
                    renderIcon={Download}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
