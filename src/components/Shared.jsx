import { colors } from '../theme.js';
import { card } from '../styles.js';

export function Loader({ text }) {
  return (
    <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", ...card(), color: colors.textDim, fontSize: 13 }}>
      <div style={{ width: 18, height: 18, border: `2px solid ${colors.border}`, borderTopColor: colors.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} aria-hidden="true" />
      {text || "Employee X is thinking..."}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export function Stat({ label, value, sub, color, icon }) {
  return (
    <div style={{ ...card(), padding: 18, flex: 1, minWidth: 140 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
        <span style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || colors.text }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: colors.textDim, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function ErrorMsg({ message, onRetry }) {
  return (
    <div role="alert" style={{ padding: 20, textAlign: 'center', color: colors.red }}>
      <div style={{ fontSize: 14, marginBottom: 8 }}>{message}</div>
      {onRetry && (
        <button onClick={onRetry} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 16px', color: colors.text, cursor: 'pointer', fontSize: 13 }}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, icon }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: colors.textDim, fontSize: 14 }}>
      {icon && <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>}
      <div>{message}</div>
    </div>
  );
}
