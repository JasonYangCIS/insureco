import React from 'react';
import { Filter } from '@carbon/icons-react';
import { useMapFiltersState, useMapFiltersDispatch } from './MapFiltersContext';
import './MapFiltersHeader.scss';

export default function MapFiltersHeader() {
  const { totalActive } = useMapFiltersState();
  const { handleClearAll } = useMapFiltersDispatch();

  return (
    <div className="map-filters__header">
      <div className="map-filters__title-row">
        <Filter size={16} aria-hidden="true" />
        <span className="map-filters__title">Filters</span>
        {totalActive > 0 && (
          <span className="map-filters__count-badge" aria-label={`${totalActive} active filters`}>
            {totalActive}
          </span>
        )}
      </div>
      {totalActive > 0 && (
        <button
          className="map-filters__clear-all"
          onClick={handleClearAll}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
