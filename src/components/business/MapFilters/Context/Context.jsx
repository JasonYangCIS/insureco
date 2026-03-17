import React, { createContext, useContext, useReducer, useEffect, useMemo, useRef } from 'react';

const MapFiltersStateContext = createContext(null);
const MapFiltersDispatchContext = createContext(null);

function mapFiltersReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SECTION':
      return {
        ...state,
        openSections: {
          ...state.openSections,
          [action.key]: !state.openSections[action.key],
        },
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SYNC_FACETS': {
      const nextOpenSections = { ...state.openSections };
      let changed = false;
      action.facets.forEach((f) => {
        if (!(f.key in nextOpenSections)) {
          nextOpenSections[f.key] = true;
          changed = true;
        }
      });
      return changed ? { ...state, openSections: nextOpenSections } : state;
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function MapFiltersProvider({
  facets = [],
  selectedFilters = {},
  onFiltersChange,
  searchable = false,
  children,
}) {
  const [state, dispatch] = useReducer(mapFiltersReducer, {
    openSections: Object.fromEntries(facets.map((f) => [f.key, true])),
    searchQuery: '',
  });

  // Keep a stable ref to external props to prevent dispatch context from recreating on every selection change
  const selectedFiltersRef = useRef(selectedFilters);
  const onFiltersChangeRef = useRef(onFiltersChange);
  
  useEffect(() => {
    selectedFiltersRef.current = selectedFilters;
    onFiltersChangeRef.current = onFiltersChange;
  }, [selectedFilters, onFiltersChange]);

  // Derived state
  const totalActive = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (sum, vals) => sum + (vals ? vals.length : 0),
        0
      ),
    [selectedFilters]
  );

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

  // Sync missing facets to open by default
  useEffect(() => {
    dispatch({ type: 'SYNC_FACETS', facets });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  }, [facets]);

  const stateValue = useMemo(
    () => ({
      ...state,
      facets,
      selectedFilters,
      searchable,
      totalActive,
      activeTags,
    }),
    [state, facets, selectedFilters, searchable, totalActive, activeTags]
  );

  const dispatchValue = useMemo(() => {
    return {
      dispatch,
      toggleSection: (key) => dispatch({ type: 'TOGGLE_SECTION', key }),
      setSearchQuery: (payload) => dispatch({ type: 'SET_SEARCH_QUERY', payload }),
      
      // Filter mutation handlers
      handleOptionToggle: (facetKey, optionValue) => {
        const current = selectedFiltersRef.current[facetKey] || [];
        const updated = current.includes(optionValue)
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];
        onFiltersChangeRef.current?.({ ...selectedFiltersRef.current, [facetKey]: updated });
      },
      handleClearFacet: (facetKey) => {
        onFiltersChangeRef.current?.({ ...selectedFiltersRef.current, [facetKey]: [] });
      },
      handleClearAll: () => {
        const cleared = Object.fromEntries(
          Object.keys(selectedFiltersRef.current).map((k) => [k, []])
        );
        onFiltersChangeRef.current?.(cleared);
      },
      handleRemoveTag: (facetKey, value) => {
        const updated = (selectedFiltersRef.current[facetKey] || []).filter(
          (v) => v !== value
        );
        onFiltersChangeRef.current?.({ ...selectedFiltersRef.current, [facetKey]: updated });
      },
    };
  }, []); // Empty dependency array ensures dispatch context is completely stable

  return (
    <MapFiltersStateContext.Provider value={stateValue}>
      <MapFiltersDispatchContext.Provider value={dispatchValue}>
        {children}
      </MapFiltersDispatchContext.Provider>
    </MapFiltersStateContext.Provider>
  );
}

export function useMapFiltersState() {
  const context = useContext(MapFiltersStateContext);
  if (context === undefined || context === null) {
    throw new Error('useMapFiltersState must be used within a MapFiltersProvider');
  }
  return context;
}

export function useMapFiltersDispatch() {
  const context = useContext(MapFiltersDispatchContext);
  if (context === undefined || context === null) {
    throw new Error('useMapFiltersDispatch must be used within a MapFiltersProvider');
  }
  return context;
}
