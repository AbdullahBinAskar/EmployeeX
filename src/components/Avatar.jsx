import { colors } from '../theme.js';

const AVATAR_COLORS = [
  '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981',
  '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F97316',
];

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, avatar, size = 44 }) {
  const fontSize = Math.round(size * 0.4);

  if (avatar) {
    return (
      <span style={{
        width: size, height: size, minWidth: size, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.5),
        background: colors.blue + '20',
      }}>
        {avatar}
      </span>
    );
  }

  const color = AVATAR_COLORS[hashName(name || '') % AVATAR_COLORS.length];

  return (
    <span style={{
      width: size, height: size, minWidth: size, borderRadius: '50%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: 700,
      background: color + '20', color, letterSpacing: 0.5,
    }}>
      {getInitials(name)}
    </span>
  );
}
