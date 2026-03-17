import React from 'react';
import { Checkbox } from '@carbon/react';
import { ChevronDown, ChevronUp, Close } from '@carbon/icons-react';
import { useMapFilters } from './MapFiltersContext';

export default function MapFiltersFacet({ facet }) {
  const {
    openSections,
    selectedFilters,
    searchQuery,
    searchable,
    toggleSection,
    handleClearFacet,
    handleOptionToggle,
  } = useMapFilters();

  const isOpen = openSections[facet.key] ?? true;
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
      <div
        className="map-filters__facet-header"
        onClick={() => toggleSection(facet.key)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSection(facet.key);
          }
        }}
        role="button"
        tabIndex={0}
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
                handleClearFacet(facet.key);
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
      </div>

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
                    onChange={() => handleOptionToggle(facet.key, option.value)}
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
