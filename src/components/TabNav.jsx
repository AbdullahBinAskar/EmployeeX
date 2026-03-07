import { useRef } from 'react';
import { tabBtn } from '../styles.js';
import { colors } from '../theme.js';

export default function TabNav({ tabs, active, onChange }) {
  const ref = useRef(null);

  const handleKeyDown = (e, idx) => {
    const items = ref.current?.querySelectorAll('[role="tab"]');
    if (!items) return;
    let next;
    if (e.key === 'ArrowRight') next = items[(idx + 1) % items.length];
    else if (e.key === 'ArrowLeft') next = items[(idx - 1 + items.length) % items.length];
    if (next) { e.preventDefault(); next.focus(); next.click(); }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: colors.glassBorder,
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}
    >
      {tabs.map((t, idx) => {
        const id = typeof t === 'string' ? t : t.id;
        const label = typeof t === 'string' ? t : t.label;
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${id}`}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={e => handleKeyDown(e, idx)}
            style={{ ...tabBtn(isActive), whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
