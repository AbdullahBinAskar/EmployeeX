import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, Stat, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, HealthDot, ProgressBar, PriorityBadge } from '../components/StatusBadge.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi(() => api.dashboard(), []);
  const { navigate } = useStore();

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;
  if (!data) return null;

  const { department, stats, projects, alerts } = data;

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Department Pulse</h1>
          <div style={{ fontSize: 12, color: colors.textDim, marginTop: 4 }}>{department?.name} — Director: {department?.director} — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: colors.green }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.green, boxShadow: `0 0 6px ${colors.green}60` }} />
          Live
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <Stat icon="◆" label="Team" value={`${stats.employees.active}/${stats.employees.total}`} sub={`${stats.employees.absent} absent`} color={colors.blue} />
        <Stat icon="▣" label="Projects" value={stats.projects.active} sub={`${stats.projects.total} total`} color={colors.purple} />
        <Stat icon="⊕" label="Deliverables" value={`${stats.deliverables.completed}/${stats.deliverables.total}`} sub={`${stats.deliverables.overdue} at risk`} color={stats.deliverables.overdue > 0 ? colors.orange : colors.green} />
        <Stat icon="◇" label="Emails" value={stats.emails.unread} sub={`${stats.emails.action_required} need action`} color={stats.emails.unread > 3 ? colors.orange : colors.blue} />
        <Stat icon="◎" label="Meetings" value={stats.meetings.upcoming} sub={stats.meetings.next ? `Next: ${stats.meetings.next.title}` : 'None scheduled'} color={colors.cyan} />
        <Stat icon="△" label="KPIs" value={`${stats.kpis.exceeded} exceeded`} sub={`${stats.kpis.behind} behind · ${stats.kpis.at_risk} at risk`} color={stats.kpis.behind > 0 ? colors.orange : colors.green} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Project Health */}
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: colors.purple }}>▣</span> Project Health
          </div>
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => navigate('projectDetail', p.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${colors.border}20`, cursor: 'pointer' }}
            >
              <HealthDot health={p.health} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: colors.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <ProgressBar value={p.progress} height={4} />
                  <span style={{ fontSize: 10, color: colors.textDim, whiteSpace: 'nowrap' }}>{p.progress}%</span>
                </div>
              </div>
              <PriorityBadge priority={p.priority} />
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: colors.red }}>△</span> Alerts & Risks
            {alerts.length > 0 && <span style={{ fontSize: 10, background: colors.red + '20', color: colors.red, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{alerts.length}</span>}
          </div>
          {alerts.length === 0 && <div style={{ color: colors.textDim, fontSize: 13, padding: 20, textAlign: 'center' }}>All clear</div>}
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                padding: '10px 12px',
                marginBottom: 8,
                borderRadius: 8,
                borderLeft: `3px solid ${a.severity === 'critical' ? colors.red : colors.orange}`,
                background: (a.severity === 'critical' ? colors.red : colors.orange) + '08',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: a.severity === 'critical' ? colors.red : colors.orange, marginBottom: 3 }}>
                  {a.severity === 'critical' ? '● ' : '▲ '}{a.title}
                </div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
