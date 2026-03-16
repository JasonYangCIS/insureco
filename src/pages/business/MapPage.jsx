import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Heading,
  RadioButtonGroup,
  RadioButton,
} from '@carbon/react';
import MapView from '../../components/business/MapView';
import CascadingFilter from '../../components/business/CascadingFilter';
import { mockProperties, mockVehicles } from '../../data/businessMockData';
import { formatCurrency } from '../../utils/businessHelpers';
import './MapPage.scss';

/**
 * MapPage - Interactive map showing properties and fleet vehicles
 * Features: asset type switching, cascading filters, summary stats, clickable markers
 */
export default function MapPage() {
  const navigate = useNavigate();

  // ── Asset type ──────────────────────────────────────────────────────────────
  const [selectedAssetType, setSelectedAssetType] = useState('all');

  // ── Cascading filter state ──────────────────────────────────────────────────
  // { [categoryId]: string[] }  — e.g. { vehicleType: ['Cargo Van', 'SUV'] }
  const [selectedFilters, setSelectedFilters] = useState({});

  // Reset filters when the asset type changes so stale selections don't carry over
  useEffect(() => {
    setSelectedFilters({});
  }, [selectedAssetType]);

  // ── Build filter categories based on the active asset type ──────────────────
  const filterCategories = useMemo(() => {
    if (selectedAssetType === 'properties') {
      // Property-specific filter categories
      const statuses = [...new Set(mockProperties.map((p) => p.status))].sort();
      const propTypes = [...new Set(mockProperties.map((p) => p.propertyType))].sort();
      const cities = [...new Set(mockProperties.map((p) => p.city))].sort();

      return [
        {
          id: 'status',
          label: 'Status',
          options: statuses.map((s) => ({
            id: s,
            label: s,
            count: mockProperties.filter((p) => p.status === s).length,
          })),
        },
        {
          id: 'propertyType',
          label: 'Property Type',
          options: propTypes.map((t) => ({
            id: t,
            label: t,
            count: mockProperties.filter((p) => p.propertyType === t).length,
          })),
        },
        {
          id: 'city',
          label: 'City',
          options: cities.map((c) => ({
            id: c,
            label: c,
            count: mockProperties.filter((p) => p.city === c).length,
          })),
        },
      ];
    }

    // Vehicles or All — vehicle-focused categories (Status also applies to properties when "all")
    const statuses = [...new Set(mockVehicles.map((v) => v.status))].sort();
    const vehicleTypes = [...new Set(mockVehicles.map((v) => v.vehicleType))].sort();
    const departments = [...new Set(mockVehicles.map((v) => v.department))].sort();

    return [
      {
        id: 'status',
        label: 'Status',
        options: statuses.map((s) => ({
          id: s,
          label: s,
          count: mockVehicles.filter((v) => v.status === s).length,
        })),
      },
      {
        id: 'vehicleType',
        label: 'Vehicle Type',
        options: vehicleTypes.map((t) => ({
          id: t,
          label: t,
          count: mockVehicles.filter((v) => v.vehicleType === t).length,
        })),
      },
      {
        id: 'department',
        label: 'Department',
        options: departments.map((d) => ({
          id: d,
          label: d,
          count: mockVehicles.filter((v) => v.department === d).length,
        })),
      },
    ];
  }, [selectedAssetType]);

  // ── Apply filters to vehicle data ────────────────────────────────────────────
  const filteredVehicles = useMemo(() => {
    if (selectedAssetType === 'properties') return [];

    return mockVehicles.filter((v) => {
      const statusOk =
        !selectedFilters.status?.length || selectedFilters.status.includes(v.status);
      const typeOk =
        !selectedFilters.vehicleType?.length ||
        selectedFilters.vehicleType.includes(v.vehicleType);
      const deptOk =
        !selectedFilters.department?.length ||
        selectedFilters.department.includes(v.department);
      return statusOk && typeOk && deptOk;
    });
  }, [selectedFilters, selectedAssetType]);

  // ── Apply filters to property data ───────────────────────────────────────────
  const filteredProperties = useMemo(() => {
    if (selectedAssetType === 'vehicles') return [];

    // When "all" is selected, status from the vehicle-focused filter still applies to properties
    return mockProperties.filter((p) => {
      const statusOk =
        !selectedFilters.status?.length || selectedFilters.status.includes(p.status);
      const typeOk =
        !selectedFilters.propertyType?.length ||
        selectedFilters.propertyType.includes(p.propertyType);
      const cityOk =
        !selectedFilters.city?.length || selectedFilters.city.includes(p.city);
      return statusOk && typeOk && cityOk;
    });
  }, [selectedFilters, selectedAssetType]);

  // ── Summary stats (based on filtered data) ───────────────────────────────────
  const stats = useMemo(() => {
    if (selectedAssetType === 'properties') {
      return {
        total: filteredProperties.length,
        active: filteredProperties.filter((p) => p.status === 'Active').length,
        monthlyPremium: filteredProperties.reduce((sum, p) => sum + p.monthlyPremium, 0),
        openClaims: filteredProperties.reduce((sum, p) => sum + p.openClaims, 0),
      };
    } else if (selectedAssetType === 'vehicles') {
      return {
        total: filteredVehicles.length,
        active: filteredVehicles.filter((v) => v.status === 'Active').length,
        monthlyPremium: filteredVehicles.reduce((sum, v) => sum + v.monthlyPremium, 0),
        openClaims: filteredVehicles.reduce((sum, v) => sum + v.openClaims, 0),
      };
    }
    return {
      total: filteredProperties.length + filteredVehicles.length,
      active:
        filteredProperties.filter((p) => p.status === 'Active').length +
        filteredVehicles.filter((v) => v.status === 'Active').length,
      monthlyPremium:
        filteredProperties.reduce((sum, p) => sum + p.monthlyPremium, 0) +
        filteredVehicles.reduce((sum, v) => sum + v.monthlyPremium, 0),
      openClaims:
        filteredProperties.reduce((sum, p) => sum + p.openClaims, 0) +
        filteredVehicles.reduce((sum, v) => sum + v.openClaims, 0),
    };
  }, [selectedAssetType, filteredProperties, filteredVehicles]);

  // ── Filter handlers ──────────────────────────────────────────────────────────
  const handleFilterChange = (categoryId, values) => {
    setSelectedFilters((prev) => ({ ...prev, [categoryId]: values }));
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  return (
    <Grid fullWidth className="map-page">
      {/* Page Header */}
      <Column lg={16} md={8} sm={4}>
        <div className="page-header">
          <div className="header-content">
            <Heading className="page-title">Map View</Heading>
            <p className="page-description">
              Interactive map showing your properties and fleet vehicles
            </p>
          </div>
        </div>
      </Column>

      {/* Map */}
      <Column lg={11} md={8} sm={4} className="map-column">
        <Tile className="map-tile">
          <MapView
            properties={filteredProperties}
            vehicles={filteredVehicles}
            selectedAssetType={selectedAssetType}
          />
        </Tile>
      </Column>

      {/* Sidebar */}
      <Column lg={5} md={8} sm={4} className="sidebar-column">

        {/* Asset Type Selection */}
        <div className="asset-type-selection">
          <RadioButtonGroup
            name="asset-type"
            valueSelected={selectedAssetType}
            onChange={setSelectedAssetType}
            orientation="vertical"
            legendText="Asset Type"
          >
            <RadioButton id="asset-all" labelText="All Assets" value="all" />
            <RadioButton id="asset-properties" labelText="Properties" value="properties" />
            <RadioButton id="asset-vehicles" labelText="Vehicles" value="vehicles" />
          </RadioButtonGroup>
        </div>

        {/* Cascading Filters */}
        <CascadingFilter
          categories={filterCategories}
          selectedFilters={selectedFilters}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
        />

        {/* Summary Stats */}
        <Tile className="stats-tile">
          <Heading className="tile-heading">Summary</Heading>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Assets</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active</span>
              <span className="stat-value stat-active">{stats.active}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Premium</span>
              <span className="stat-value stat-premium">{formatCurrency(stats.monthlyPremium)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Open Claims</span>
              <span className="stat-value stat-claims">{stats.openClaims}</span>
            </div>
          </div>
        </Tile>

        {/* Legend */}
        <Tile className="legend-tile">
          <Heading className="tile-heading">Legend</Heading>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-marker property-legend"></div>
              <span className="legend-label">Properties</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker vehicle-legend"></div>
              <span className="legend-label">Vehicles</span>
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
