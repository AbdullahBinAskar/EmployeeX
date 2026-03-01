import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useAI } from '../hooks/useAI.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';

export default function Alerts() {
  const { data, loading, error, refetch } = useApi(() => api.dashboard(), []);
  const { risks: fetchRisks, loading: aiLoading } = useAI();
  const { navigate } = useStore();
  const [aiAnalysis, setAiAnalysis] = useState(null);

  if (loading) return <Loader text="Loading alerts..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const alerts = data?.alerts || [];
  const critical = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');

  const runAiAnalysis = async () => {
    const result = await fetchRisks();
    setAiAnalysis(result);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Alerts & Risks</h1>
          <div style={{ fontSize: 12, color: colors.textDim, marginTop: 4 }}>
            {alerts.length} alerts · {critical.length} critical · {warnings.length} warnings
          </div>
        </div>
        <button
          onClick={runAiAnalysis}
          disabled={aiLoading}
          style={{
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: aiLoading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)', color: '#fff', fontWeight: 700, fontSize: 12,
            opacity: aiLoading ? 0.6 : 1,
          }}
        >
          {aiLoading ? 'Analyzing...' : '🔍 AI Risk Analysis'}
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Critical', count: critical.length, color: colors.red, icon: '●' },
          { label: 'Warnings', count: warnings.length, color: colors.orange, icon: '▲' },
          { label: 'Deliverable Issues', count: alerts.filter(a => a.type === 'deliverable').length, color: colors.purple, icon: '⊕' },
          { label: 'Email Alerts', count: alerts.filter(a => a.type === 'email').length, color: colors.blue, icon: '◇' },
          { label: 'Absence Impact', count: alerts.filter(a => a.type === 'absence').length, color: colors.orange, icon: '◆' },
          { label: 'KPI Behind', count: alerts.filter(a => a.type === 'kpi').length, color: colors.cyan, icon: '△' },
        ].map(s => (
          <div key={s.label} style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '12px 16px', flex: 1, minWidth: 100, textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.icon} {s.count}</div>
            <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {critical.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.red, marginBottom: 10 }}>● Critical</div>
          {critical.map((a, i) => (
            <AlertCard key={i} alert={a} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Warning Alerts */}
      {warnings.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.orange, marginBottom: 10 }}>▲ Warnings</div>
          {warnings.map((a, i) => (
            <AlertCard key={i} alert={a} navigate={navigate} />
          ))}
        </div>
      )}

      {alerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: colors.green, fontSize: 14 }}>
          ✓ All clear — no active alerts or risks
        </div>
      )}

      {/* AI Analysis */}
      {aiLoading && <Loader text="Employee X is analyzing risks across all projects..." />}
      {aiAnalysis && (
        <div style={{
          background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24, marginTop: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 900, color: '#fff',
            }}>X</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>AI Risk Analysis</span>
            <span style={{ fontSize: 10, color: colors.textDim, marginLeft: 'auto' }}>Generated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap', padding: 16, background: colors.bg, borderRadius: 10 }}>
            {aiAnalysis}
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, navigate }) {
  const a = alert;
  const borderColor = a.severity === 'critical' ? colors.red : colors.orange;
  const typeIcons = { deliverable: '⊕', email: '◇', absence: '◆', kpi: '△' };

  return (
    <div style={{
      background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 14, marginBottom: 8,
      borderLeft: `3px solid ${borderColor}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 12 }}>{typeIcons[a.type] || '●'}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: borderColor }}>{a.title}</span>
        <span style={{
          fontSize: 9, padding: '2px 6px', borderRadius: 4, marginLeft: 'auto',
          background: borderColor + '15', color: borderColor, fontWeight: 600, textTransform: 'capitalize',
        }}>
          {a.type}
        </span>
      </div>
      <div style={{ fontSize: 11, color: colors.textDim, lineHeight: 1.5 }}>{a.detail}</div>
    </div>
  );
}
