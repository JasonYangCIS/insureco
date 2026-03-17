import React from 'react';
import { Filter } from '@carbon/icons-react';

export default function MapFiltersHeader({ totalActive, onClearAll }) {
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
          onClick={onClearAll}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
