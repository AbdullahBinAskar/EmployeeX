import { useRef } from 'react';
import { filterBtn } from '../styles.js';
import { colors } from '../theme.js';

export default function FilterBar({ filters, active, onChange, label }) {
  const ref = useRef(null);

  const handleKeyDown = (e, idx) => {
    const items = ref.current?.querySelectorAll('button');
    if (!items) return;
    let next;
    if (e.key === 'ArrowRight') next = items[(idx + 1) % items.length];
    else if (e.key === 'ArrowLeft') next = items[(idx - 1 + items.length) % items.length];
    if (next) { e.preventDefault(); next.focus(); }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label || 'Filter options'}
      style={{ display: 'flex', gap: 6, overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' }}
    >
      {filters.map((f, idx) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={e => handleKeyDown(e, idx)}
            style={{ ...filterBtn(isActive), whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {f.label}{f.count != null ? ` (${f.count})` : ''}
          </button>
        );
      })}
    </div>
  );
}

export function FilterGroup({ label: groupLabel, filters, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <span style={{ fontSize: 10, color: colors.textDim, marginRight: 4, whiteSpace: 'nowrap' }}>{groupLabel}:</span>
      <FilterBar filters={filters} active={active} onChange={onChange} label={groupLabel} />
    </div>
  );
}
