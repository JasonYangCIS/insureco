import React, { useState } from 'react';
import { Checkbox, Tag, Search } from '@carbon/react';
import { ChevronDown, ChevronUp, Close, Filter } from '@carbon/icons-react';
import './MapFilters.scss';

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
export default function MapFilters({
  facets = [],
  selectedFilters = {},
  onFiltersChange,
  searchable = false,
}) {
  // Track which accordion sections are open (all open by default)
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(facets.map((f) => [f.key, true]))
  );

  // Search query for location-type facets
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const totalActive = Object.values(selectedFilters).reduce(
    (sum, vals) => sum + vals.length,
    0
  );

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleOptionToggle = (facetKey, optionValue) => {
    const current = selectedFilters[facetKey] || [];
    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    onFiltersChange({ ...selectedFilters, [facetKey]: updated });
  };

  const handleClearFacet = (facetKey) => {
    onFiltersChange({ ...selectedFilters, [facetKey]: [] });
  };

  const handleClearAll = () => {
    const cleared = Object.fromEntries(Object.keys(selectedFilters).map((k) => [k, []]));
    onFiltersChange(cleared);
  };

  const handleRemoveTag = (facetKey, value) => {
    const updated = (selectedFilters[facetKey] || []).filter((v) => v !== value);
    onFiltersChange({ ...selectedFilters, [facetKey]: updated });
  };

  // ─── Build active tag list ───────────────────────────────────────────────────

  const activeTags = facets.flatMap((facet) =>
    (selectedFilters[facet.key] || []).map((value) => ({
      facetKey: facet.key,
      facetLabel: facet.label,
      value,
      displayLabel:
        facet.options.find((o) => o.value === value)?.label ?? value,
    }))
  );

  // ─── Filter options by search query ─────────────────────────────────────────

  const getFilteredOptions = (facet) => {
    if (!searchable || !searchQuery.trim()) return facet.options;
    const q = searchQuery.toLowerCase();
    return facet.options.filter((o) => o.label.toLowerCase().includes(q));
  };

  // ─── Ensure new facets open by default when facets prop changes ─────────────

  React.useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      facets.forEach((f) => {
        if (!(f.key in next)) next[f.key] = true;
      });
      return next;
    });
    setSearchQuery('');
  }, [facets]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="map-filters" role="search" aria-label="Map filters">
      {/* ── Panel header ── */}
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

      {/* ── Active filter tags ── */}
      {activeTags.length > 0 && (
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
      )}

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
        {facets.map((facet) => {
          const isOpen = openSections[facet.key] ?? true;
          const selectedCount = (selectedFilters[facet.key] || []).length;
          const visibleOptions = getFilteredOptions(facet);

          return (
            <div key={facet.key} className="map-filters__facet">
              {/* Facet header / accordion trigger */}
              <button
                className="map-filters__facet-header"
                onClick={() => toggleSection(facet.key)}
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
        })}
      </div>
    </div>
  );
}
