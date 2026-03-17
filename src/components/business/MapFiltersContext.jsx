import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const MapFiltersContext = createContext(null);

export function MapFiltersProvider({
  facets = [],
  selectedFilters = {},
  onFiltersChange,
  searchable = false,
  children,
}) {
  // Track which accordion sections are open (all open by default)
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(facets.map((f) => [f.key, true]))
  );

  // Search query for location-type facets
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const totalActive = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (sum, vals) => sum + (vals ? vals.length : 0),
        0
      ),
    [selectedFilters]
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

  const activeTags = useMemo(
    () =>
      facets.flatMap((facet) =>
        (selectedFilters[facet.key] || []).map((value) => ({
          facetKey: facet.key,
          facetLabel: facet.label,
          value,
          displayLabel:
            facet.options.find((o) => o.value === value)?.label ?? value,
        }))
      ),
    [facets, selectedFilters]
  );

  // ─── Ensure new facets open by default when facets prop changes ─────────────

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      let changed = false;
      facets.forEach((f) => {
        if (!(f.key in next)) {
          next[f.key] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    setSearchQuery('');
  }, [facets]);

  const value = {
    facets,
    selectedFilters,
    searchable,
    openSections,
    searchQuery,
    setSearchQuery,
    totalActive,
    activeTags,
    toggleSection,
    handleOptionToggle,
    handleClearFacet,
    handleClearAll,
    handleRemoveTag,
  };

  return (
    <MapFiltersContext.Provider value={value}>
      {children}
    </MapFiltersContext.Provider>
  );
}

export function useMapFilters() {
  const context = useContext(MapFiltersContext);
  if (!context) {
    throw new Error('useMapFilters must be used within a MapFiltersProvider');
  }
  return context;
}
