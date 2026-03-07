import { colors } from './theme.js';

export const card = (extra) => ({
  background: colors.bgCard,
  border: colors.glassBorder,
  borderRadius: 16,
  padding: 18,
  backdropFilter: `blur(${colors.glassBlur})`,
  WebkitBackdropFilter: `blur(${colors.glassBlur})`,
  boxShadow: `${colors.glassShadow}, ${colors.glassInsetShadow}`,
  ...extra,
});

export const pageTitle = {
  fontSize: 22,
  fontWeight: 800,
  color: colors.text,
  margin: 0,
};

export const filterBtn = (active) => ({
  padding: '5px 12px',
  borderRadius: 10,
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  textTransform: 'capitalize',
  border: active ? `1px solid ${colors.blue}` : colors.glassBorder,
  background: active ? colors.blue + '20' : 'rgba(255,255,255,0.08)',
  color: active ? colors.blue : colors.textDim,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
});

export const tabBtn = (active) => ({
  padding: '8px 16px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  textTransform: 'capitalize',
  border: 'none',
  borderBottom: `2px solid ${active ? colors.blue : 'transparent'}`,
  background: 'transparent',
  color: active ? colors.blue : colors.textDim,
});

export const input = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 10,
  border: colors.glassBorder,
  background: colors.bgInput,
  color: colors.text,
  fontSize: 12,
  outline: 'none',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};

export const btn = (extra) => ({
  padding: '6px 14px',
  borderRadius: 10,
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  border: colors.glassBorder,
  background: 'rgba(255,255,255,0.08)',
  color: colors.text,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  ...extra,
});

export const btnPrimary = btn({
  background: colors.blue,
  color: '#fff',
  borderColor: colors.blue,
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
});

export const modalOverlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: colors.modalBackdrop,
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
};

export const modalPanel = (extra) => ({
  background: colors.bgModal,
  border: colors.glassBorder,
  borderRadius: 18,
  boxShadow: `${colors.glassShadowElevated}, ${colors.glassInsetShadow}`,
  ...extra,
});

export const grid = (minWidth = '300px') => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
  gap: 14,
});
