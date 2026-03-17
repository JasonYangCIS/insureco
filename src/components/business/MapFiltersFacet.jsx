import React from 'react';
import { Checkbox } from '@carbon/react';
import { ChevronDown, ChevronUp, Close } from '@carbon/icons-react';

export default function MapFiltersFacet({
  facet,
  isOpen,
  selectedFilters,
  searchQuery,
  searchable,
  onToggleSection,
  onClearFacet,
  onOptionToggle,
}) {
  const selectedCount = (selectedFilters[facet.key] || []).length;

  const getFilteredOptions = () => {
    if (!searchable || !searchQuery.trim()) return facet.options;
    const q = searchQuery.toLowerCase();
    return facet.options.filter((o) => o.label.toLowerCase().includes(q));
  };

  const visibleOptions = getFilteredOptions();

  return (
    <div className="map-filters__facet">
      {/* Facet header / accordion trigger */}
      <button
        className="map-filters__facet-header"
        onClick={() => onToggleSection(facet.key)}
        aria-expanded={isOpen}
        aria-controls={`filter-section-${facet.key}`}
      >
        <span className="map-filters__facet-label">
          {facet.label}
          {selectedCount > 0 && (
            <span
              className="map-filters__facet-badge"
              aria-label={`${selectedCount} selected`}
            >
              {selectedCount}
            </span>
          )}
        </span>
        <div className="map-filters__facet-actions">
          {selectedCount > 0 && (
            <button
              className="map-filters__facet-clear"
              onClick={(e) => {
                e.stopPropagation();
                onClearFacet(facet.key);
              }}
              aria-label={`Clear ${facet.label} filter`}
              tabIndex={0}
            >
              <Close size={14} aria-hidden="true" />
            </button>
          )}
          {isOpen ? (
            <ChevronUp size={16} aria-hidden="true" />
          ) : (
            <ChevronDown size={16} aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Facet options */}
      {isOpen && (
        <div
          id={`filter-section-${facet.key}`}
          className="map-filters__facet-options"
          role="group"
          aria-label={`${facet.label} options`}
        >
          {visibleOptions.length === 0 ? (
            <p className="map-filters__no-options">No options found</p>
          ) : (
            visibleOptions.map((option) => {
              const isChecked = (selectedFilters[facet.key] || []).includes(
                option.value
              );
              return (
                <div key={option.value} className="map-filters__option-row">
                  <Checkbox
                    id={`filter-${facet.key}-${option.value}`}
                    labelText={option.label}
                    checked={isChecked}
                    onChange={() => onOptionToggle(facet.key, option.value)}
                  />
                  {option.count !== undefined && (
                    <span
                      className="map-filters__option-count"
                      aria-label={`${option.count} items`}
                    >
                      {option.count}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
