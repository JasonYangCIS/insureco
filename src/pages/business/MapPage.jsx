import React, { useState, useMemo } from 'react';
import {
  Grid,
  Column,
  Tile,
  Heading,
  RadioButtonGroup,
  RadioButton,
} from '@carbon/react';
import MapView from '../../components/business/MapView';
import MapFilters from '../../components/business/MapFilters/MapFilters';
import { mockProperties, mockVehicles } from '../../data/businessMockData';
import { formatCurrency } from '../../utils/businessHelpers';
import './MapPage.scss';

/**
 * MapPage - Interactive map showing properties and fleet vehicles.
 *
 * The new map filter design (from Figma) replaces the old FacetedFilterButton
 * dropdown with a permanent, accordion-style MapFilters panel embedded
 * directly in the sidebar. Active filter chips are shown inside the filter
 * panel for instant, accessible feedback.
 *
 * Features:
 *  - Asset-type toggle (All / Properties / Vehicles)
 *  - Summary stats tile (total, active, premium, open claims)
 *  - Inline accordion filter panel with active tags and per-facet counts
 *  - Dismissible active-filter tags inside the filter tile
 *  - Map marker legend
 */
export default function MapPage() {
  // ─── State ──────────────────────────────────────────────────────────────────

  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    type: [],
    location: [],
    propertyType: [],
    vehicleType: [],
    city: [],
  });

  // ─── Facets ─────────────────────────────────────────────────────────────────

  const facets = useMemo(() => {
    if (selectedAssetType === 'properties') {
      const statuses = {};
      const types = {};
      const cities = {};

      mockProperties.forEach((p) => {
        statuses[p.status] = (statuses[p.status] || 0) + 1;
        types[p.propertyType] = (types[p.propertyType] || 0) + 1;
        cities[p.city] = (cities[p.city] || 0) + 1;
      });

      return [
        {
          key: 'status',
          label: 'Status',
          options: Object.entries(statuses)
            .map(([value, count]) => ({ value, label: value, count }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        {
          key: 'type',
          label: 'Property Type',
          options: Object.entries(types)
            .map(([value, count]) => ({ value, label: value, count }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        {
          key: 'location',
          label: 'City',
          options: Object.entries(cities)
            .map(([value, count]) => ({ value, label: value, count }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
      ];
    }

    if (selectedAssetType === 'vehicles') {
      const statuses = {};
      const types = {};
      const departments = {};

      mockVehicles.forEach((v) => {
        statuses[v.status] = (statuses[v.status] || 0) + 1;
        types[v.vehicleType] = (types[v.vehicleType] || 0) + 1;
        departments[v.department] = (departments[v.department] || 0) + 1;
      });

      return [
        {
          key: 'status',
          label: 'Status',
          options: Object.entries(statuses)
            .map(([value, count]) => ({ value, label: value, count }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        {
          key: 'type',
          label: 'Vehicle Type',
          options: Object.entries(types)
            .map(([value, count]) => ({ value, label: value, count }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        {
          key: 'location',
          label: 'Department',
          options: Object.entries(departments)
            .map(([value, count]) => ({ value, label: value, count }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
      ];
    }

    // ── All assets ──
    const statuses = {};
    const propertyTypes = {};
    const vehicleTypes = {};
    const cities = {};
    const departments = {};

    mockProperties.forEach((p) => {
      statuses[p.status] = (statuses[p.status] || 0) + 1;
      propertyTypes[p.propertyType] = (propertyTypes[p.propertyType] || 0) + 1;
      cities[p.city] = (cities[p.city] || 0) + 1;
    });

    mockVehicles.forEach((v) => {
      statuses[v.status] = (statuses[v.status] || 0) + 1;
      vehicleTypes[v.vehicleType] = (vehicleTypes[v.vehicleType] || 0) + 1;
      departments[v.department] = (departments[v.department] || 0) + 1;
    });

    return [
      {
        key: 'status',
        label: 'Status',
        options: Object.entries(statuses)
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        key: 'propertyType',
        label: 'Property Type',
        options: Object.entries(propertyTypes)
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        key: 'vehicleType',
        label: 'Vehicle Type',
        options: Object.entries(vehicleTypes)
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        key: 'city',
        label: 'City',
        options: Object.entries(cities)
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        key: 'location',
        label: 'Department',
        options: Object.entries(departments)
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
    ];
  }, [selectedAssetType]);

  // ─── Filtered data ───────────────────────────────────────────────────────────

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const statusMatch =
        selectedFilters.status.length === 0 ||
        selectedFilters.status.includes(property.status);
      const typeMatch =
        selectedFilters.type.length === 0 ||
        selectedFilters.type.includes(property.propertyType);
      const locationMatch =
        selectedFilters.location.length === 0 ||
        selectedFilters.location.includes(property.city);
      const propertyTypeMatch =
        selectedFilters.propertyType.length === 0 ||
        selectedFilters.propertyType.includes(property.propertyType);
      const cityMatch =
        selectedFilters.city.length === 0 ||
        selectedFilters.city.includes(property.city);

      return statusMatch && typeMatch && locationMatch && propertyTypeMatch && cityMatch;
    });
  }, [selectedFilters]);

  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter((vehicle) => {
      const statusMatch =
        selectedFilters.status.length === 0 ||
        selectedFilters.status.includes(vehicle.status);
      const typeMatch =
        selectedFilters.type.length === 0 ||
        selectedFilters.type.includes(vehicle.vehicleType);
      const locationMatch =
        selectedFilters.location.length === 0 ||
        selectedFilters.location.includes(vehicle.department);
      const vehicleTypeMatch =
        selectedFilters.vehicleType.length === 0 ||
        selectedFilters.vehicleType.includes(vehicle.vehicleType);

      return statusMatch && typeMatch && locationMatch && vehicleTypeMatch;
    });
  }, [selectedFilters]);

  // ─── Summary stats ───────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (selectedAssetType === 'properties') {
      return {
        total: filteredProperties.length,
        active: filteredProperties.filter((p) => p.status === 'Active').length,
        monthlyPremium: filteredProperties.reduce((s, p) => s + p.monthlyPremium, 0),
        openClaims: filteredProperties.reduce((s, p) => s + p.openClaims, 0),
      };
    }
    if (selectedAssetType === 'vehicles') {
      return {
        total: filteredVehicles.length,
        active: filteredVehicles.filter((v) => v.status === 'Active').length,
        monthlyPremium: filteredVehicles.reduce((s, v) => s + v.monthlyPremium, 0),
        openClaims: filteredVehicles.reduce((s, v) => s + v.openClaims, 0),
      };
    }
    return {
      total: filteredProperties.length + filteredVehicles.length,
      active:
        filteredProperties.filter((p) => p.status === 'Active').length +
        filteredVehicles.filter((v) => v.status === 'Active').length,
      monthlyPremium:
        filteredProperties.reduce((s, p) => s + p.monthlyPremium, 0) +
        filteredVehicles.reduce((s, v) => s + v.monthlyPremium, 0),
      openClaims:
        filteredProperties.reduce((s, p) => s + p.openClaims, 0) +
        filteredVehicles.reduce((s, v) => s + v.openClaims, 0),
    };
  }, [selectedAssetType, filteredProperties, filteredVehicles]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleAssetTypeChange = (value) => {
    setSelectedAssetType(value);
    setSelectedFilters({
      status: [],
      type: [],
      location: [],
      propertyType: [],
      vehicleType: [],
      city: [],
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <Grid fullWidth className="map-page">
      {/* ── Page Header ── */}
      <Column lg={16} md={8} sm={4}>
        <div className="map-page__header">
          <div className="map-page__header-content">
            <Heading className="map-page__title">Map View</Heading>
            <p className="map-page__description">
              Interactive map showing your properties and fleet vehicles
            </p>
          </div>
        </div>
      </Column>

      {/* ── Map ── */}
      <Column lg={11} md={8} sm={4} className="map-page__map-col">
        <Tile className="map-page__map-tile">
          <MapView
            properties={selectedAssetType === 'vehicles' ? [] : filteredProperties}
            vehicles={selectedAssetType === 'properties' ? [] : filteredVehicles}
            selectedAssetType={selectedAssetType}
          />
        </Tile>
      </Column>

      {/* ── Sidebar ── */}
      <Column lg={5} md={8} sm={4} className="map-page__sidebar">

        {/* Asset Type */}
        <div className="map-page__asset-type">
          <RadioButtonGroup
            name="asset-type"
            valueSelected={selectedAssetType}
            onChange={handleAssetTypeChange}
            orientation="horizontal"
            legendText="Show on map"
          >
            <RadioButton id="asset-all" labelText="All" value="all" />
            <RadioButton id="asset-properties" labelText="Properties" value="properties" />
            <RadioButton id="asset-vehicles" labelText="Vehicles" value="vehicles" />
          </RadioButtonGroup>
        </div>

        {/* Summary Stats */}
        <Tile className="map-page__stats-tile">
          <Heading className="map-page__tile-heading">Summary</Heading>
          <div className="map-page__stats-grid">
            <div className="map-page__stat">
              <span className="map-page__stat-label">Total Assets</span>
              <span className="map-page__stat-value">{stats.total}</span>
            </div>
            <div className="map-page__stat">
              <span className="map-page__stat-label">Active</span>
              <span className="map-page__stat-value map-page__stat-value--active">
                {stats.active}
              </span>
            </div>
            <div className="map-page__stat">
              <span className="map-page__stat-label">Monthly Premium</span>
              <span className="map-page__stat-value map-page__stat-value--premium">
                {formatCurrency(stats.monthlyPremium)}
              </span>
            </div>
            <div className="map-page__stat">
              <span className="map-page__stat-label">Open Claims</span>
              <span className="map-page__stat-value map-page__stat-value--claims">
                {stats.openClaims}
              </span>
            </div>
          </div>
        </Tile>

        {/* ── New inline filter panel ── */}
        <Tile className="map-page__filters-tile">
          <MapFilters
            facets={facets}
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
          />
        </Tile>

        {/* Legend */}
        <Tile className="map-page__legend-tile">
          <Heading className="map-page__tile-heading">Legend</Heading>
          <div className="map-page__legend-items">
            <div className="map-page__legend-item">
              <div className="map-page__legend-marker map-page__legend-marker--property" />
              <span className="map-page__legend-label">Properties</span>
            </div>
            <div className="map-page__legend-item">
              <div className="map-page__legend-marker map-page__legend-marker--vehicle" />
              <span className="map-page__legend-label">Vehicles</span>
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
