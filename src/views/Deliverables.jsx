import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';

export default function Deliverables() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { data, loading, error, refetch } = useApi(() => api.getDeliverables(), []);
  const { navigate } = useStore();

  if (loading) return <Loader text="Loading deliverables..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const deliverables = data || [];

  const statuses = ['all', 'not_started', 'in_progress', 'in_review', 'completed', 'blocked', 'overdue'];
  const priorities = ['all', 'critical', 'high', 'medium', 'low'];

  let filtered = deliverables;
  if (statusFilter !== 'all') filtered = filtered.filter(d => d.status === statusFilter);
  if (priorityFilter !== 'all') filtered = filtered.filter(d => d.priority === priorityFilter);

  const statusCounts = {};
  deliverables.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Deliverables</h1>
        <span style={{ fontSize: 12, color: colors.textDim }}>
          {deliverables.length} total · {statusCounts.completed || 0} completed · {(statusCounts.blocked || 0) + (statusCounts.overdue || 0)} at risk
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: colors.textDim, marginRight: 4 }}>Status:</span>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              border: `1px solid ${statusFilter === s ? colors.blue : colors.border}`,
              background: statusFilter === s ? colors.blue + '20' : 'transparent',
              color: statusFilter === s ? colors.blue : colors.textDim,
            }}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: colors.textDim, marginRight: 4 }}>Priority:</span>
          {priorities.map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              border: `1px solid ${priorityFilter === p ? colors.blue : colors.border}`,
              background: priorityFilter === p ? colors.blue + '20' : 'transparent',
              color: priorityFilter === p ? colors.blue : colors.textDim,
            }}>
              {p}
            </button>
          ))}
        </div>
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
              <span onClick={() => navigate('projectDetail', d.project_id)} style={{ color: colors.blue, cursor: 'pointer', fontWeight: 600 }}>
                📁 {d.project_name}
              </span>
              <span onClick={() => d.assignee_id && navigate('employeeDetail', d.assignee_id)} style={{ color: d.assignee_id ? colors.purple : colors.textDim, cursor: d.assignee_id ? 'pointer' : 'default' }}>
                {d.assignee_avatar} {d.assignee_name || 'Unassigned'}
              </span>
              <span>📅 Due: {d.due_date}</span>
              {d.delay_days > 0 && <span style={{ color: colors.red, fontWeight: 600 }}>⚠ {d.delay_days} days delayed</span>}
              {d.completed_date && <span style={{ color: colors.green }}>✓ Completed: {d.completed_date}</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.textDim, fontSize: 13 }}>No deliverables match filters</div>}
      </div>
    </div>
  );
}
