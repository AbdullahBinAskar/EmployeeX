import { useStore } from '../data/store.jsx';
import { colors } from '../theme.js';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  const { navigate } = useStore();

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 12 }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <ChevronRight size={12} color={colors.textDim} aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" style={{ fontSize: 12, color: colors.text, fontWeight: 600 }}>{item.label}</span>
              ) : (
                <button
                  onClick={() => navigate(item.view, item.id)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 12, color: colors.textDim,
                  }}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
