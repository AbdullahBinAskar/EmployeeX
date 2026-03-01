import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useAI } from '../hooks/useAI.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { SkeletonStats, SkeletonList } from '../components/Skeleton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { colors } from '../theme.js';
import { card } from '../styles.js';
import api from '../api/client.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { AlertCircle, AlertTriangle as AlertTriangleIcon, PackageCheck, Mail, Users, BarChart3, Search } from 'lucide-react';

export default function Alerts() {
  const { data, loading, error, refetch } = useApi(() => api.dashboard(), [], { cacheKey: 'dashboard' });
  const { risks: fetchRisks, loading: aiLoading } = useAI();
  const { navigate } = useStore();
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const { isMobile } = useMediaQuery();

  if (loading) return (
    <div>
      <SkeletonStats count={6} />
      <div style={{ marginTop: 20 }}><SkeletonList rows={5} /></div>
    </div>
  );
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const alerts = data?.alerts || [];
  const critical = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');

  const runAiAnalysis = async () => {
    const result = await fetchRisks();
    setAiAnalysis(result);
  };

  const summaryStats = [
    { label: 'Critical', count: critical.length, color: colors.red, Icon: AlertCircle },
    { label: 'Warnings', count: warnings.length, color: colors.orange, Icon: AlertTriangleIcon },
    { label: 'Deliverable Issues', count: alerts.filter(a => a.type === 'deliverable').length, color: colors.purple, Icon: PackageCheck },
    { label: 'Email Alerts', count: alerts.filter(a => a.type === 'email').length, color: colors.blue, Icon: Mail },
    { label: 'Absence Impact', count: alerts.filter(a => a.type === 'absence').length, color: colors.orange, Icon: Users },
    { label: 'KPI Behind', count: alerts.filter(a => a.type === 'kpi').length, color: colors.cyan, Icon: BarChart3 },
  ];

  return (
    <div>
      <PageHeader
        title="Alerts & Risks"
        subtitle={`${alerts.length} alerts · ${critical.length} critical · ${warnings.length} warnings`}
      >
        <button
          onClick={runAiAnalysis}
          disabled={aiLoading}
          style={{
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: aiLoading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)', color: '#fff', fontWeight: 700, fontSize: 12,
            opacity: aiLoading ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <Search size={14} /> {aiLoading ? 'Analyzing...' : 'AI Risk Analysis'}
        </button>
      </PageHeader>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {summaryStats.map(s => (
          <div key={s.label} style={{
            ...card(), padding: '12px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <s.Icon size={18} /> {s.count}
            </div>
            <div style={{ fontSize: 10, color: colors.textDim, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {critical.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.red, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={14} /> Critical
          </div>
          {critical.map((a, i) => (
            <AlertCard key={i} alert={a} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Warning Alerts */}
      {warnings.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.orange, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangleIcon size={14} /> Warnings
          </div>
          {warnings.map((a, i) => (
            <AlertCard key={i} alert={a} navigate={navigate} />
          ))}
        </div>
      )}

      {alerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: colors.green, fontSize: 14 }}>
          All clear — no active alerts or risks
        </div>
      )}

      {/* AI Analysis */}
      {aiLoading && <Loader text="Employee X is analyzing risks across all projects..." />}
      {aiAnalysis && (
        <div style={card({ padding: 24, marginTop: 20 })}>
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

function AlertCard({ alert }) {
  const a = alert;
  const borderColor = a.severity === 'critical' ? colors.red : colors.orange;

  return (
    <div style={{
      ...card(), padding: 14, marginBottom: 8,
      borderLeft: `3px solid ${borderColor}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
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
