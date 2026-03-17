import React from 'react';
import { Tag } from '@carbon/react';
import { useMapFiltersState, useMapFiltersDispatch } from './MapFiltersContext';
import './MapFiltersActiveTags.scss';

export default function MapFiltersActiveTags() {
  const { activeTags } = useMapFiltersState();
  const { handleRemoveTag } = useMapFiltersDispatch();

  if (!activeTags || activeTags.length === 0) return null;

  return (
    <div className="map-filters__active-tags" aria-label="Active filters" role="list">
      {activeTags.map(({ facetKey, facetLabel, value, displayLabel }) => (
        <Tag
          key={`${facetKey}-${value}`}
          type="blue"
          filter
          title={`Remove ${facetLabel}: ${displayLabel}`}
          onClose={() => handleRemoveTag(facetKey, value)}
          role="listitem"
        >
          {displayLabel}
        </Tag>
      ))}
    </div>
  );
}
