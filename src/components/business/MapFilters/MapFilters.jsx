import React from 'react';
import { Search } from '@carbon/react';
import MapFiltersHeader from './Header/Header';
import MapFiltersActiveTags from './ActiveTags/ActiveTags';
import MapFiltersFacet from './Facet/Facet';
import { MapFiltersProvider, useMapFiltersState, useMapFiltersDispatch } from './Context/Context';
import './MapFilters.scss';

function MapFiltersLayout() {
  const { searchable, searchQuery, facets } = useMapFiltersState();
  const { setSearchQuery } = useMapFiltersDispatch();

  return (
    <div className="map-filters" role="search" aria-label="Map filters">
      {/* ── Panel header ── */}
      <MapFiltersHeader />

      {/* ── Active filter tags ── */}
      <MapFiltersActiveTags />

      {/* ── Optional search ── */}
      {searchable && (
        <div className="map-filters__search">
          <Search
            size="sm"
            labelText="Search filters"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
      )}

      {/* ── Accordion facets ── */}
      <div className="map-filters__facets">
        {facets.map((facet) => (
          <MapFiltersFacet key={facet.key} facet={facet} />
        ))}
      </div>
    </div>
  );
}

/**
 * MapFilters - Inline accordion-style filter panel for the map sidebar.
 *
 * Replaces the previous FacetedFilterButton dropdown with an always-visible,
 * accessible filter UI. Each facet renders as a collapsible accordion section
 * with checkbox options and counts. Active filters are displayed as dismissible
 * Tag chips at the top of the panel.
 *
 * Props:
 *  - facets: Array<{ key, label, options: Array<{ value, label, count }> }>
 *  - selectedFilters: Object<facetKey, string[]>
 *  - onFiltersChange: (updatedFilters: Object) => void
 *  - searchable: boolean — show search input for the location facet (default false)
 */
export default function MapFilters(props) {
  return (
    <MapFiltersProvider {...props}>
      <MapFiltersLayout />
    </MapFiltersProvider>
  );
}
