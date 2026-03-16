import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Heading,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';
import { ArrowLeft, Document, Camera, Car, Building } from '@carbon/icons-react';
import { assets } from '../../data/financialMockData';
import './AssetDetailPage.scss';

const claimHeaders = [
  { key: 'claimId', header: 'Claim ID' },
  { key: 'dateFiled', header: 'Date Filed' },
  { key: 'type', header: 'Type' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
];

const statusTagType = {
  Settled: 'green',
  Pending: 'blue',
  'Under Review': 'teal',
  Denied: 'red',
};

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || 'conservative';

  const asset = assets.find((a) => a.id === assetId);

  if (!asset) {
    return (
      <div className="asset-detail asset-detail--not-found">
        <p>Asset not found.</p>
        <Button kind="ghost" onClick={() => navigate(`/financial-dashboard/${from}`)}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const claimRows = asset.claimHistory.map((c) => ({
    id: c.claimId,
    claimId: c.claimId,
    dateFiled: fmtDate(c.dateFiled),
    type: c.type,
    amount: fmt(c.amount),
    status: c.status,
  }));

  return (
    <div className="asset-detail">
      {/* Back button */}
      <div className="asset-detail__back-bar">
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          onClick={() => navigate(`/financial-dashboard/${from}`)}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Asset header */}
      <div className="asset-detail__header">
        <div className="asset-detail__header-icon">
          {asset.category === 'Auto' ? <Car size={32} /> : <Building size={32} />}
        </div>
        <div className="asset-detail__header-info">
          <div className="asset-detail__header-top">
            <Heading className="asset-detail__asset-name">{asset.name}</Heading>
            <Tag type={asset.category === 'Auto' ? 'blue' : 'teal'} size="md">
              {asset.category}
            </Tag>
          </div>
          <p className="asset-detail__policy-number">Policy: {asset.policyInfo.policyNumber}</p>
        </div>
      </div>

      {/* Coverage Summary */}
      <section className="asset-detail__section">
        <Heading className="asset-detail__section-title">Coverage Summary</Heading>
        <Grid>
          <Column sm={4} md={2} lg={4}>
            <Tile className="asset-detail__coverage-tile">
              <p className="asset-detail__coverage-label">Liability Limit</p>
              <p className="asset-detail__coverage-value asset-detail__coverage-value--green">
                {fmt(asset.coverageLimits.liability)}
              </p>
            </Tile>
          </Column>
          <Column sm={4} md={2} lg={4}>
            <Tile className="asset-detail__coverage-tile">
              <p className="asset-detail__coverage-label">
                {asset.category === 'Auto' ? 'Collision Limit' : 'Structure Limit'}
              </p>
              <p className="asset-detail__coverage-value asset-detail__coverage-value--green">
                {fmt(asset.coverageLimits.collision)}
              </p>
            </Tile>
          </Column>
          <Column sm={4} md={2} lg={4}>
            <Tile className="asset-detail__coverage-tile">
              <p className="asset-detail__coverage-label">Annual Deductible</p>
              <p className="asset-detail__coverage-value asset-detail__coverage-value--red">
                {fmt(asset.coverageLimits.deductible)}
              </p>
            </Tile>
          </Column>
        </Grid>
      </section>

      {/* Claim History */}
      <section className="asset-detail__section">
        <Heading className="asset-detail__section-title">Claim History</Heading>
        <DataTable rows={claimRows} headers={claimHeaders} isSortable>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()} className="asset-detail__claim-table">
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
                  const statusCell = row.cells.find((c) => c.info.header === 'status');
                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'status' ? (
                            <Tag type={statusTagType[cell.value] || 'gray'} size="sm">
                              {cell.value}
                            </Tag>
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
        <p className="asset-detail__claims-total">
          Lifetime Total Claims:{' '}
          <strong className="asset-detail__claims-total-value">{fmt(asset.totalClaims)}</strong>
        </p>
      </section>

      {/* Policy Information */}
      <section className="asset-detail__section">
        <Heading className="asset-detail__section-title">Policy Information</Heading>
        <Tile className="asset-detail__policy-tile">
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Field</StructuredListCell>
                <StructuredListCell head>Value</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell>Policy Number</StructuredListCell>
                <StructuredListCell>{asset.policyInfo.policyNumber}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>Underwriter</StructuredListCell>
                <StructuredListCell>{asset.policyInfo.underwriter}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>Coverage Type</StructuredListCell>
                <StructuredListCell>{asset.policyInfo.coverageType}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>Inception Date</StructuredListCell>
                <StructuredListCell>{fmtDate(asset.policyInfo.inceptionDate)}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>Renewal Date</StructuredListCell>
                <StructuredListCell>{fmtDate(asset.policyInfo.renewalDate)}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell>Next Premium Due</StructuredListCell>
                <StructuredListCell>
                  {fmt(asset.premiumDue)} — {fmtDate(asset.dueDate)}
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </Tile>
      </section>

      {/* Media / Documentation */}
      <section className="asset-detail__section">
        <Heading className="asset-detail__section-title">Supporting Media & Documentation</Heading>
        <Tile className="asset-detail__media-tile">
          <div className="asset-detail__media-placeholder">
            <div className="asset-detail__media-icons">
              <Document size={40} />
              <Camera size={40} />
            </div>
            <p className="asset-detail__media-heading">Documentation Upload — Phase 2</p>
            <p className="asset-detail__media-text">
              Original policy underwriting documents, coverage certificates, and supporting media
              (photos/video of the property or vehicle) will be available in Phase 2 of the IFAD roadmap.
            </p>
          </div>
        </Tile>
      </section>
    </div>
  );
}
