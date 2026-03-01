import { useState, useEffect, useRef } from 'react';
import { colors } from '../theme.js';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', debounceMs = 300 }) {
  const [local, setLocal] = useState(value || '');
  const timerRef = useRef(null);

  // Sync local state when parent value changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setLocal(value || ''); }, [value]);

  const handleChange = (val) => {
    setLocal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), debounceMs);
  };

  const clear = () => {
    setLocal('');
    onChange('');
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.bgInput, minWidth: 200, maxWidth: 360,
    }}>
      <Search size={14} color={colors.textDim} style={{ flexShrink: 0 }} />
      <input
        value={local}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', background: 'transparent',
          color: colors.text, fontSize: 12, outline: 'none',
        }}
        aria-label={placeholder}
      />
      {local && (
        <button
          onClick={clear}
          aria-label="Clear search"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: colors.textDim }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
