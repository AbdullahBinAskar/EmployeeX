import { colors } from '../theme.js';

const pulse = { animation: 'pulse 1.5s ease-in-out infinite' };

export function SkeletonLine({ width = '100%', height = 14, style }) {
  return (
    <div style={{
      width, height, borderRadius: 6,
      background: colors.border, ...pulse, ...style,
    }} />
  );
}

export function SkeletonCard({ height = 160 }) {
  return (
    <div style={{
      background: colors.bgCard, border: colors.glassBorder,
      borderRadius: 16, padding: 18, height,
    }}>
      <SkeletonLine width="60%" height={12} style={{ marginBottom: 12 }} />
      <SkeletonLine width="40%" height={10} style={{ marginBottom: 16 }} />
      <SkeletonLine width="100%" height={6} style={{ marginBottom: 12 }} />
      <SkeletonLine width="80%" height={10} />
    </div>
  );
}

export function SkeletonGrid({ count = 6, minWidth = '300px' }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
      gap: 14,
    }}>
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
          borderBottom: `1px solid ${colors.borderFaint}`,
        }}>
          <SkeletonLine width={32} height={32} style={{ borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <SkeletonLine width="50%" height={12} style={{ marginBottom: 6 }} />
            <SkeletonLine width="30%" height={10} />
          </div>
          <SkeletonLine width={60} height={20} style={{ borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          background: colors.bgCard, border: colors.glassBorder,
          borderRadius: 16, padding: 18, flex: 1, minWidth: 140,
        }}>
          <SkeletonLine width="40%" height={10} style={{ marginBottom: 8 }} />
          <SkeletonLine width="60%" height={22} style={{ marginBottom: 4 }} />
          <SkeletonLine width="50%" height={10} />
        </div>
      ))}
    </div>
  );
}
