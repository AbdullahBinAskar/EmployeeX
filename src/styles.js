import { colors } from './theme.js';

export const card = (extra) => ({
  background: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: 18,
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
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  textTransform: 'capitalize',
  border: `1px solid ${active ? colors.blue : colors.border}`,
  background: active ? colors.blue + '20' : 'transparent',
  color: active ? colors.blue : colors.textDim,
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
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  background: colors.bgInput,
  color: colors.text,
  fontSize: 12,
  outline: 'none',
};

export const btn = (extra) => ({
  padding: '6px 14px',
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  border: `1px solid ${colors.border}`,
  background: 'transparent',
  color: colors.text,
  ...extra,
});

export const btnPrimary = btn({
  background: colors.blue,
  color: '#fff',
  borderColor: colors.blue,
});

export const grid = (minWidth = '300px') => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
  gap: 14,
});
