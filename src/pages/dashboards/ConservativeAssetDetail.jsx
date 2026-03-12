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
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';
import { ArrowLeft, DocumentPdf, Download } from '@carbon/icons-react';
import {
  getAssetById,
  generateClaimHistory,
  generatePolicyDocuments,
} from '../../data/financialMockData';
import './ConservativeAssetDetail.scss';

export default function ConservativeAssetDetail() {
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
      <div className="conservative-asset-detail">
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <Tile>
              <h2>Asset Not Found</h2>
              <p>The requested asset could not be found.</p>
              <Button onClick={() => navigate('/dashboard-conservative')}>
                Back to Dashboard
              </Button>
            </Tile>
          </Column>
        </Grid>
      </div>
    );
  }

  // Claim history table headers and rows
  const claimHeaders = [
    { key: 'claimId', header: 'Claim ID' },
    { key: 'claimDate', header: 'Date Filed' },
    { key: 'claimType', header: 'Type' },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
    { key: 'description', header: 'Description' },
  ];

  const claimRows = claimHistory.map((claim) => ({
    id: claim.claimId,
    claimId: claim.claimId,
    claimDate: new Date(claim.claimDate).toLocaleDateString(),
    claimType: claim.claimType,
    amount: `$${claim.amount.toLocaleString()}`,
    status: claim.status,
    description: claim.description,
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
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <div className="conservative-asset-detail">
      {/* Header with Back Button */}
      <Grid className="detail-header">
        <Column sm={4} md={8} lg={16}>
          <Button
            kind="ghost"
            renderIcon={ArrowLeft}
            onClick={() => navigate('/dashboard-conservative')}
            className="back-button"
          >
            Back to Dashboard
          </Button>
          <h1 className="detail-title">{asset.assetName}</h1>
          <Tag type={asset.assetCategory === 'Property' ? 'blue' : 'green'} size="md">
            {asset.assetCategory}
          </Tag>
        </Column>
      </Grid>

      {/* Policy Information Section */}
      <Grid className="policy-section">
        <Column sm={4} md={4} lg={8}>
          <Tile className="info-card">
            <h3 className="section-title">Policy Information</h3>
            <StructuredListWrapper>
              <StructuredListBody>
                <StructuredListRow>
                  <StructuredListCell className="info-label">Policy Number</StructuredListCell>
                  <StructuredListCell className="info-value">{asset.policyNumber}</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell className="info-label">Coverage Amount</StructuredListCell>
                  <StructuredListCell className="info-value">
                    ${asset.coverageAmount.toLocaleString()}
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell className="info-label">Deductible</StructuredListCell>
                  <StructuredListCell className="info-value">
                    ${asset.deductible.toLocaleString()}
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell className="info-label">Next Premium Due</StructuredListCell>
                  <StructuredListCell className="info-value">
                    ${asset.premiumDue.toLocaleString()}
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell className="info-label">Due Date</StructuredListCell>
                  <StructuredListCell className="info-value">
                    {new Date(asset.dueDate).toLocaleDateString()}
                  </StructuredListCell>
                </StructuredListRow>
                {asset.vin && (
                  <StructuredListRow>
                    <StructuredListCell className="info-label">VIN</StructuredListCell>
                    <StructuredListCell className="info-value info-value-mono">
                      {asset.vin}
                    </StructuredListCell>
                  </StructuredListRow>
                )}
                {asset.location && (
                  <StructuredListRow>
                    <StructuredListCell className="info-label">Location</StructuredListCell>
                    <StructuredListCell className="info-value">{asset.location}</StructuredListCell>
                  </StructuredListRow>
                )}
              </StructuredListBody>
            </StructuredListWrapper>
          </Tile>
        </Column>

        <Column sm={4} md={4} lg={8}>
          <Tile className="summary-card">
            <h3 className="section-title">Claim Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <div className="stat-label">Total Claims Filed</div>
                <div className="stat-value">{claimHistory.length}</div>
              </div>
              <div className="summary-stat">
                <div className="stat-label">Lifetime Claims Amount</div>
                <div className="stat-value stat-value-large">
                  ${asset.totalClaims.toLocaleString()}
                </div>
              </div>
              <div className="summary-stat">
                <div className="stat-label">Loss Ratio</div>
                <div className="stat-value stat-value-ratio">
                  {((asset.totalClaims / asset.coverageAmount) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Claim History Section */}
      <Grid className="claims-section">
        <Column sm={4} md={8} lg={16}>
          <Tile className="claims-container">
            <h3 className="section-title">Claim History</h3>
            {claimHistory.length === 0 ? (
              <div className="empty-state">
                <p>No claims have been filed for this asset.</p>
              </div>
            ) : (
              <DataTable rows={claimRows} headers={claimHeaders} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
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
          </Tile>
        </Column>
      </Grid>

      {/* Policy Documents Section */}
      <Grid className="documents-section">
        <Column sm={4} md={8} lg={16}>
          <Tile className="documents-container">
            <h3 className="section-title">Policy Documents</h3>
            <div className="document-list">
              {policyDocuments.map((doc) => (
                <div key={doc.docId} className="document-item">
                  <div className="document-icon">
                    <DocumentPdf size={32} />
                  </div>
                  <div className="document-info">
                    <div className="document-name">{doc.docName}</div>
                    <div className="document-meta">
                      {doc.docType} • {doc.size} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
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
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
