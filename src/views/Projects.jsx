import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, HealthDot, ProgressBar, PriorityBadge } from '../components/StatusBadge.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const { data, loading, error, refetch } = useApi(() => api.getProjects(), []);
  const { navigate } = useStore();

  if (loading) return <Loader text="Loading projects..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const projects = data || [];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.health === filter);

  const filters = [
    { key: 'all', label: 'All', count: projects.length },
    { key: 'green', label: 'Healthy', count: projects.filter(p => p.health === 'green').length },
    { key: 'yellow', label: 'At Risk', count: projects.filter(p => p.health === 'yellow').length },
    { key: 'red', label: 'Critical', count: projects.filter(p => p.health === 'red').length },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Projects</h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filter === f.key ? colors.blue : colors.border}`,
              background: filter === f.key ? colors.blue + '20' : 'transparent',
              color: filter === f.key ? colors.blue : colors.textDim,
            }}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360, 1fr))', gap: 14 }}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => navigate('projectDetail', p.id)} style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18, cursor: 'pointer',
            borderLeft: `3px solid ${p.health === 'green' ? colors.green : p.health === 'yellow' ? colors.orange : colors.red}`,
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.blue; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HealthDot health={p.health} size={12} />
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{p.name}</span>
              </div>
              <PriorityBadge priority={p.priority} />
            </div>

            {/* Status + Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <StatusBadge status={p.status} />
              <div style={{ flex: 1 }}>
                <ProgressBar value={p.progress} height={5} />
              </div>
              <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600 }}>{p.progress}%</span>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: colors.textDim, marginBottom: 10 }}>
              <span>📅 {p.start_date} → {p.target_date}</span>
              {p.budget && <span>💰 {p.budget}</span>}
            </div>

            {/* Team + Deliverables */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.lead && <span style={{ color: colors.blue, fontWeight: 600 }}>{p.lead.avatar} {p.lead.name}</span>}
                {p.members && <span style={{ color: colors.textDim }}>+{p.members.length - 1} members</span>}
              </div>
              <div style={{ color: colors.textDim }}>
                {p.deliverable_completed}/{p.deliverable_count} deliverables
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
