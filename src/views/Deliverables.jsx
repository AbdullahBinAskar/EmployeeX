import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { ErrorMsg } from '../components/Shared.jsx';
import { SkeletonList } from '../components/Skeleton.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { FilterGroup } from '../components/FilterBar.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';
import { FolderOpen, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Deliverables() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useApi(() => api.getDeliverables(), [], { cacheKey: 'deliverables' });
  const { navigate } = useStore();

  if (loading) return <SkeletonList rows={8} />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const deliverables = data || [];

  const statusFilters = ['all', 'not_started', 'in_progress', 'in_review', 'completed', 'blocked', 'overdue']
    .map(s => ({ key: s, label: s.replace(/_/g, ' ') }));
  const priorityFilters = ['all', 'critical', 'high', 'medium', 'low']
    .map(p => ({ key: p, label: p }));

  let filtered = deliverables;
  if (statusFilter !== 'all') filtered = filtered.filter(d => d.status === statusFilter);
  if (priorityFilter !== 'all') filtered = filtered.filter(d => d.priority === priorityFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d => d.title?.toLowerCase().includes(q) || d.assignee_name?.toLowerCase().includes(q));
  }

  const statusCounts = {};
  deliverables.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

  return (
    <div>
      <PageHeader
        title="Deliverables"
        subtitle={`${deliverables.length} total · ${statusCounts.completed || 0} completed · ${(statusCounts.blocked || 0) + (statusCounts.overdue || 0)} at risk`}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search deliverables..." />
      </PageHeader>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterGroup label="Status" filters={statusFilters} active={statusFilter} onChange={setStatusFilter} />
        <FilterGroup label="Priority" filters={priorityFilters} active={priorityFilter} onChange={setPriorityFilter} />
      </div>

      {/* Deliverables List */}
      <div>
        {filtered.map(d => (
          <div key={d.id} style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 14, marginBottom: 8,
            borderLeft: `3px solid ${d.status === 'blocked' || d.status === 'overdue' ? colors.red : d.status === 'completed' ? colors.green : colors.blue}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <StatusBadge status={d.status} />
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, flex: 1 }}>{d.title}</span>
              <PriorityBadge priority={d.priority} />
            </div>

            {d.description && <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6, lineHeight: 1.5 }}>{d.description}</div>}

            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: colors.textDim, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('projectDetail', d.project_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, color: colors.blue, fontWeight: 600, fontSize: 11 }}>
                <FolderOpen size={10} /> {d.project_name}
              </button>
              <button onClick={() => d.assignee_id && navigate('employeeDetail', d.assignee_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: d.assignee_id ? 'pointer' : 'default', color: d.assignee_id ? colors.purple : colors.textDim, fontSize: 11 }}>
                {d.assignee_avatar} {d.assignee_name || 'Unassigned'}
              </button>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Calendar size={10} /> Due: {d.due_date}</span>
              {d.delay_days > 0 && <span style={{ color: colors.red, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><AlertTriangle size={10} /> {d.delay_days} days delayed</span>}
              {d.completed_date && <span style={{ color: colors.green, display: 'inline-flex', alignItems: 'center', gap: 3 }}><CheckCircle size={10} /> Completed: {d.completed_date}</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.textDim, fontSize: 13 }}>No deliverables match filters</div>}
      </div>
    </div>
  );
}
