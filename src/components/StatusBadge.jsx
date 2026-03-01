import { statusColors, priorityColors, healthColors } from '../theme.js';
import { colors } from '../theme.js';
import { AlertCircle, ChevronUp, Minus, ChevronDown } from 'lucide-react';

export function StatusBadge({ status, size = 'sm' }) {
  const color = statusColors[status] || colors.textDim;
  const label = (status || '').replace(/_/g, ' ');
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? 10 : 12;
  return (
    <span
      style={{
        display: 'inline-block',
        padding,
        borderRadius: 6,
        fontSize,
        fontWeight: 600,
        textTransform: 'capitalize',
        color,
        background: color + '18',
        letterSpacing: 0.3,
      }}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const color = priorityColors[priority] || colors.textDim;
  const label = priority || 'none';
  const IconMap = { critical: AlertCircle, high: ChevronUp, medium: Minus, low: ChevronDown };
  const Icon = IconMap[priority];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'capitalize',
        color,
        background: color + '18',
      }}
      aria-label={`Priority: ${label}`}
    >
      {Icon && <Icon size={11} />}
      {label}
    </span>
  );
}

export function HealthDot({ health, size = 10, showLabel = false }) {
  const color = healthColors[health] || colors.textDim;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} aria-label={`Health: ${health || 'unknown'}`}>
      <span style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}60`,
        display: 'inline-block',
      }} aria-hidden="true" />
      {showLabel && <span style={{ fontSize: 11, color, textTransform: 'capitalize', fontWeight: 600 }}>{health}</span>}
    </span>
  );
}

export function ProgressBar({ value, height = 6, color }) {
  const barColor = color || (value >= 75 ? colors.green : value >= 40 ? colors.orange : colors.red);
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      style={{ width: '100%', height, background: colors.border, borderRadius: height / 2, overflow: 'hidden' }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: barColor,
        borderRadius: height / 2,
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}
