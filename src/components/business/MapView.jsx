import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTheme } from '../../contexts/ThemeContext';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Button, Tag } from '@carbon/react';
import { Building, CarFront } from '@carbon/icons-react';
import { formatCurrency, getStatusTagType } from '../../utils/businessHelpers';
import 'leaflet/dist/leaflet.css';
import './MapView.scss';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon for properties (building/red)
const propertyIcon = new L.DivIcon({
  className: 'custom-marker property-marker',
  html: `<div class="marker-icon">
    <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 2L6 12v18h8v-10h4v10h8V12L16 2zm0 2.8L24 13v15h-4V18h-8v10H8V13l8-8.2z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom icon for vehicles (car/blue)
const vehicleIcon = new L.DivIcon({
  className: 'custom-marker vehicle-marker',
  html: `<div class="marker-icon">
    <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor">
      <path d="M26 14h-2.276l-2.276-4.553A2.004 2.004 0 0019.658 8H12.34a2.004 2.004 0 00-1.789 1.106L8.277 14H6a2.002 2.002 0 00-2 2v7a2.002 2.002 0 002 2v3h2v-3h20v3h2v-3a2.002 2.002 0 002-2v-7a2.002 2.002 0 00-2-2zM12.341 10h7.317l2 4H10.343zM6 23v-7h20v7zM10 18a2 2 0 11-2 2 2.002 2.002 0 012-2zm14 0a2 2 0 11-2 2 2.002 2.002 0 012-2z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom cluster icon function for properties (red clusters)
const createPropertyClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let sizeClass = 'marker-cluster-small';
  
  if (count >= 100) {
    sizeClass = 'marker-cluster-large';
  } else if (count >= 10) {
    sizeClass = 'marker-cluster-medium';
  }
  
  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-property ${sizeClass}`,
    iconSize: L.point(40, 40, true),
  });
};

// Custom cluster icon function for vehicles (blue clusters)
const createVehicleClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let sizeClass = 'marker-cluster-small';
  
  if (count >= 100) {
    sizeClass = 'marker-cluster-large';
  } else if (count >= 10) {
    sizeClass = 'marker-cluster-medium';
  }
  
  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-vehicle ${sizeClass}`,
    iconSize: L.point(40, 40, true),
  });
};

// Component to fit map bounds to markers
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [positions, map]);

  return null;
}

/**
 * MapAccessibility — patches Leaflet-generated DOM elements that cannot
 * receive ARIA attributes via React props (zoom buttons, popup close button).
 * Addresses WCAG 2.1: 1.1.1, 2.1.1, 2.4.7, 4.1.2
 */
function MapAccessibility() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    // ── Zoom control buttons ────────────────────────────────────────────────
    // Leaflet renders these as <a href="#"> with only "+" / "−" text content,
    // which is insufficient for screen readers and keyboard users.
    const patchZoomButtons = () => {
      const zoomIn = container.querySelector('.leaflet-control-zoom-in');
      const zoomOut = container.querySelector('.leaflet-control-zoom-out');
      if (zoomIn) {
        zoomIn.setAttribute('aria-label', 'Zoom in');
        zoomIn.setAttribute('title', 'Zoom in');
        zoomIn.setAttribute('role', 'button');
      }
      if (zoomOut) {
        zoomOut.setAttribute('aria-label', 'Zoom out');
        zoomOut.setAttribute('title', 'Zoom out');
        zoomOut.setAttribute('role', 'button');
      }
    };
    patchZoomButtons();

    // ── Popup close button (injected dynamically) ────────────────────────────
    // The "×" close button has no accessible label by default.
    const observer = new MutationObserver(() => {
      const closeBtn = container.querySelector(
        '.leaflet-popup-close-button:not([aria-label])'
      );
      if (closeBtn) {
        closeBtn.setAttribute('aria-label', 'Close popup');
        closeBtn.setAttribute('title', 'Close popup');
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    // ── Attribution links ───────────────────────────────────────────────────
    // Ensure attribution links open in new tab with accessible hint
    const attrLinks = container.querySelectorAll(
      '.leaflet-control-attribution a'
    );
    attrLinks.forEach((link) => {
      if (!link.getAttribute('aria-label')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    return () => observer.disconnect();
  }, [map]);

  return null;
}

/**
 * MapView - Reusable Leaflet map component
 * Displays properties and vehicles on an interactive map
 */
// Tile layer configurations
const TILE_LAYERS = {
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
  },
};

// Internal sub-component that can read the map instance and swap tile layers reactively
function ThemedTileLayer({ isDark }) {
  const tileConfig = isDark ? TILE_LAYERS.dark : TILE_LAYERS.light;

  return (
    <TileLayer
      key={isDark ? 'dark' : 'light'}
      attribution={tileConfig.attribution}
      url={tileConfig.url}
      maxZoom={19}
    />
  );
}

export default function MapView({ properties = [], vehicles = [], selectedAssetType = 'all' }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Determine which assets to show
  const showProperties = selectedAssetType === 'all' || selectedAssetType === 'properties';
  const showVehicles = selectedAssetType === 'all' || selectedAssetType === 'vehicles';

  // Collect all marker positions for bounds fitting (memoized to prevent recalculation)
  const allPositions = useMemo(() => {
    const positions = [];

    if (showProperties) {
      properties.forEach(prop => {
        if (prop.lat && prop.lng) {
          positions.push([prop.lat, prop.lng]);
        }
      });
    }

    if (showVehicles) {
      vehicles.forEach(vehicle => {
        if (vehicle.lastKnownLocation?.lat && vehicle.lastKnownLocation?.lng) {
          positions.push([vehicle.lastKnownLocation.lat, vehicle.lastKnownLocation.lng]);
        }
      });
    }

    return positions;
  }, [properties, vehicles, showProperties, showVehicles]);

  // Default center (California)
  const defaultCenter = [37.5, -121.5];
  const defaultZoom = 7;

  return (
    // Key on parent div forces React to create new DOM element when selectedAssetType changes
    // This prevents "Map container is already initialized" error in React Strict Mode
    <div
      key={`map-container-${selectedAssetType}`}
      className="map-view-container"
      role="region"
      aria-label="Interactive asset map. Use arrow keys to pan, + and − to zoom."
    >
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="leaflet-map"
        scrollWheelZoom={true}
      >
        <ThemedTileLayer isDark={isDark} />

        {/* WCAG patches for Leaflet-generated DOM */}
        <MapAccessibility />

        {/* Fit bounds to all markers */}
        <FitBounds positions={allPositions} />

        {/* Property Markers with Clustering (Red) */}
        {showProperties && (
          <MarkerClusterGroup 
            chunkedLoading
            iconCreateFunction={createPropertyClusterIcon}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            maxClusterRadius={80}
          >
            {properties.map((property) => {
              if (!property.lat || !property.lng) return null;

              return (
                <Marker
                  key={property.id}
                  position={[property.lat, property.lng]}
                  icon={propertyIcon}
                >
                  <Popup className="custom-popup">
                    <div className="popup-content">
                      <h4 className="popup-title">{property.name}</h4>
                      <p className="popup-address">{property.address}</p>
                      <div className="popup-details">
                        <div className="popup-row">
                          <span className="popup-label">Type:</span>
                          <span className="popup-value">{property.propertyType}</span>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Status:</span>
                          <Tag type={getStatusTagType(property.status)} size="sm">
                            {property.status}
                          </Tag>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Monthly Premium:</span>
                          <span className="popup-value popup-premium">
                            {formatCurrency(property.monthlyPremium)}
                          </span>
                        </div>
                        {property.openClaims > 0 && (
                          <div className="popup-row">
                            <span className="popup-label">Open Claims:</span>
                            <span className="popup-value popup-claims">{property.openClaims}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        kind="primary"
                        size="sm"
                        className="popup-button"
                        onClick={() => navigate(`/business/properties/${property.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}

        {/* Vehicle Markers with Clustering (Blue) */}
        {showVehicles && (
          <MarkerClusterGroup 
            chunkedLoading
            iconCreateFunction={createVehicleClusterIcon}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            maxClusterRadius={80}
          >
            {vehicles.map((vehicle) => {
              if (!vehicle.lastKnownLocation?.lat || !vehicle.lastKnownLocation?.lng) return null;

              return (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lastKnownLocation.lat, vehicle.lastKnownLocation.lng]}
                  icon={vehicleIcon}
                >
                  <Popup className="custom-popup">
                    <div className="popup-content">
                      <h4 className="popup-title">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="popup-address">{vehicle.licensePlate}</p>
                      <div className="popup-details">
                        <div className="popup-row">
                          <span className="popup-label">Type:</span>
                          <span className="popup-value">{vehicle.vehicleType}</span>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Driver:</span>
                          <span className="popup-value">{vehicle.assignedDriver}</span>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Status:</span>
                          <Tag type={getStatusTagType(vehicle.status)} size="sm">
                            {vehicle.status}
                          </Tag>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Monthly Premium:</span>
                          <span className="popup-value popup-premium">
                            {formatCurrency(vehicle.monthlyPremium)}
                          </span>
                        </div>
                        {vehicle.openClaims > 0 && (
                          <div className="popup-row">
                            <span className="popup-label">Open Claims:</span>
                            <span className="popup-value popup-claims">{vehicle.openClaims}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        kind="primary"
                        size="sm"
                        className="popup-button"
                        onClick={() => navigate(`/business/fleet/${vehicle.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}
