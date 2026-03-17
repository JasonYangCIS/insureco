import React from 'react';
import { Tag } from '@carbon/react';

export default function MapFiltersActiveTags({ activeTags, onRemoveTag }) {
  if (!activeTags || activeTags.length === 0) return null;

  return (
    <div className="map-filters__active-tags" aria-label="Active filters" role="list">
      {activeTags.map(({ facetKey, facetLabel, value, displayLabel }) => (
        <Tag
          key={`${facetKey}-${value}`}
          type="blue"
          filter
          title={`Remove ${facetLabel}: ${displayLabel}`}
          onClose={() => onRemoveTag(facetKey, value)}
          role="listitem"
        >
          {displayLabel}
        </Tag>
      ))}
    </div>
  );
}
