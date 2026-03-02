import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { ErrorMsg } from '../components/Shared.jsx';
import { SkeletonGrid } from '../components/Skeleton.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { StatusBadge, HealthDot, ProgressBar, PriorityBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Avatar from '../components/Avatar.jsx';
import { colors } from '../theme.js';
import { grid } from '../styles.js';
import api from '../api/client.js';
import { Calendar, DollarSign } from 'lucide-react';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useApi(() => api.getProjects(), [], { cacheKey: 'projects' });
  const { navigate } = useStore();

  if (loading) return <SkeletonGrid count={4} minWidth="360px" />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const projects = data || [];
  let filtered = filter === 'all' ? projects : projects.filter(p => p.health === filter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }

  const filters = [
    { key: 'all', label: 'All', count: projects.length },
    { key: 'green', label: 'Healthy', count: projects.filter(p => p.health === 'green').length },
    { key: 'yellow', label: 'At Risk', count: projects.filter(p => p.health === 'yellow').length },
    { key: 'red', label: 'Critical', count: projects.filter(p => p.health === 'red').length },
  ];

  return (
    <div>
      <PageHeader title="Projects">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
        <FilterBar filters={filters} active={filter} onChange={setFilter} label="Project health filter" />
      </PageHeader>

      <div style={grid('360px')}>
        {filtered.map(p => (
          <button key={p.id} onClick={() => navigate('projectDetail', p.id)} style={{
            ...grid(),
            display: 'block',
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18, cursor: 'pointer',
            borderLeft: `3px solid ${p.health === 'green' ? colors.green : p.health === 'yellow' ? colors.orange : colors.red}`,
            transition: 'border-color 0.2s', textAlign: 'left', color: 'inherit', width: '100%',
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Calendar size={10} /> {p.start_date} → {p.target_date}</span>
              {p.budget && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><DollarSign size={10} /> {p.budget}</span>}
            </div>

            {/* Team + Deliverables */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.lead && <span style={{ color: colors.blue, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Avatar name={p.lead.name} avatar={p.lead.avatar} size={20} /> {p.lead.name}</span>}
                {p.members && <span style={{ color: colors.textDim }}>+{p.members.length - 1} members</span>}
              </div>
              <div style={{ color: colors.textDim }}>
                {p.deliverable_completed}/{p.deliverable_count} deliverables
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
