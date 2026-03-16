import React, { useState, useEffect } from 'react';
import { Checkbox } from '@carbon/react';
import './CascadingFilter.scss';

/**
 * CascadingFilter - A two-panel filter UI
 * Left panel: filter category list
 * Right panel: checkbox options for the selected category
 *
 * Props:
 *  categories       - Array<{ id, label, options: Array<{ id, label, count }> }>
 *  selectedFilters  - { [categoryId]: string[] }
 *  onChange         - (categoryId, selectedValues: string[]) => void
 *  onClearAll       - () => void
 */
export default function CascadingFilter({
  categories = [],
  selectedFilters = {},
  onChange,
  onClearAll,
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? null);

  // Keep activeCategory valid when categories list changes (e.g. asset type switch)
  useEffect(() => {
    if (categories.length === 0) return;
    const stillValid = categories.some((c) => c.id === activeCategory);
    if (!stillValid) setActiveCategory(categories[0].id);
  }, [categories, activeCategory]);

  const activeCat = categories.find((c) => c.id === activeCategory);
  const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr?.length > 0);

  const handleOptionChange = (evt, { checked }) => {
    const optionId = evt.target.id.replace(`filter-${activeCategory}-`, '');
    const current = selectedFilters[activeCategory] || [];
    const updated = checked
      ? [...current, optionId]
      : current.filter((v) => v !== optionId);
    onChange(activeCategory, updated);
  };

  return (
    <div className="cascading-filter" role="group" aria-label="Map filters">
      {/* ── Left: category list ── */}
      <div className="cascading-filter__left" role="list" aria-label="Filter categories">
        <div className="cascading-filter__section-label" aria-hidden="true">
          FILTER BY
        </div>

        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          const selCount = (selectedFilters[cat.id] || []).length;

          return (
            <button
              key={cat.id}
              role="listitem"
              className={`cascading-filter__category-btn${isActive ? ' cascading-filter__category-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
              aria-label={`${cat.label}${selCount > 0 ? `, ${selCount} selected` : ''}`}
            >
              <span className="cascading-filter__category-label">
                {cat.label}
                {selCount > 0 && (
                  <span className="cascading-filter__badge" aria-hidden="true">
                    {selCount}
                  </span>
                )}
              </span>
              <span className="cascading-filter__chevron" aria-hidden="true">
                {isActive ? (
                  /* Right chevron — active */
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M11 8L5.99999 13L5.29999 12.3L9.59999 8L5.29999 3.7L5.99999 3L11 8Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  /* Down chevron — collapsed */
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect width="16" height="16" fill="white" fillOpacity="0.01" />
                    <path
                      d="M8 11L3 6.00002L3.7 5.30002L8 9.60002L12.3 5.30002L13 6.00002L8 11Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Right: checkbox options ── */}
      <div
        className="cascading-filter__right"
        role="group"
        aria-label={`${activeCat?.label ?? ''} filter options`}
      >
        <div className="cascading-filter__options-header">{activeCat?.label}</div>

        <div className="cascading-filter__options-list">
          {activeCat?.options.map((option) => {
            const cbId = `filter-${activeCategory}-${option.id.replace(/\s+/g, '-').toLowerCase()}`;
            const isChecked = (selectedFilters[activeCategory] || []).includes(option.id);

            return (
              <div key={option.id} className="cascading-filter__option-row">
                <Checkbox
                  id={cbId}
                  labelText={option.label}
                  checked={isChecked}
                  onChange={(evt, { checked }) => {
                    const current = selectedFilters[activeCategory] || [];
                    const updated = checked
                      ? [...current, option.id]
                      : current.filter((v) => v !== option.id);
                    onChange(activeCategory, updated);
                  }}
                />
                <span
                  className="cascading-filter__option-count"
                  aria-label={`${option.count} items`}
                >
                  ({option.count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Clear All ── */}
      <div className="cascading-filter__clear-panel">
        <button
          className={`cascading-filter__clear-btn${hasActiveFilters ? ' cascading-filter__clear-btn--enabled' : ''}`}
          onClick={onClearAll}
          disabled={!hasActiveFilters}
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
