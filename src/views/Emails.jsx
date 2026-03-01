import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { ErrorMsg } from '../components/Shared.jsx';
import { SkeletonList } from '../components/Skeleton.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { FilterGroup } from '../components/FilterBar.jsx';
import { colors, statusColors } from '../theme.js';
import api from '../api/client.js';
import { FolderOpen, User } from 'lucide-react';

export default function Emails() {
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useApi(() => api.getEmails(), [], { cacheKey: 'emails' });
  const { navigate } = useStore();

  if (loading) return <SkeletonList rows={8} />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const emails = data || [];

  const classFilters = ['all', 'action_required', 'escalation', 'update', 'request', 'fyi', 'general']
    .map(c => ({ key: c, label: c.replace(/_/g, ' ') }));
  const statusFilters = ['all', 'unread', 'read', 'replied', 'flagged']
    .map(s => ({ key: s, label: s }));

  let filtered = emails;
  if (classFilter !== 'all') filtered = filtered.filter(e => e.classification === classFilter);
  if (statusFilter !== 'all') filtered = filtered.filter(e => e.status === statusFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => e.subject?.toLowerCase().includes(q) || e.from_address?.toLowerCase().includes(q) || e.body?.toLowerCase().includes(q));
  }

  return (
    <div>
      <PageHeader
        title="Emails"
        subtitle={`${emails.length} total · ${emails.filter(e => e.status === 'unread').length} unread · ${emails.filter(e => e.classification === 'action_required').length} need action`}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search emails..." />
      </PageHeader>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterGroup label="Classification" filters={classFilters} active={classFilter} onChange={setClassFilter} />
        <FilterGroup label="Status" filters={statusFilters} active={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Email List */}
      <div>
        {filtered.map(e => (
          <div key={e.id} style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16, marginBottom: 8,
            borderLeft: `3px solid ${statusColors[e.classification] || colors.border}`,
            opacity: e.status === 'read' ? 0.8 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {e.status === 'unread' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.blue, flexShrink: 0 }} aria-label="Unread" />}
                  <span style={{ fontSize: 14, fontWeight: e.status === 'unread' ? 700 : 500, color: colors.text }}>{e.subject}</span>
                </div>
                <div style={{ fontSize: 11, color: colors.textDim }}>
                  {e.from_address} → {e.to_address}
                  {e.cc && <span> (CC: {e.cc})</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 4 }}>{e.date}</div>
                <PriorityBadge priority={e.priority} />
              </div>
            </div>

            {e.body && (
              <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.6, marginBottom: 8, padding: '8px 0', borderTop: `1px solid ${colors.border}15` }}>
                {e.body.length > 300 ? e.body.slice(0, 300) + '...' : e.body}
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusBadge status={e.classification} />
              <StatusBadge status={e.status} />
              {e.project_name && (
                <button onClick={(ev) => { ev.stopPropagation(); navigate('projectDetail', e.project_id); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: colors.blue, fontWeight: 600 }}>
                  <FolderOpen size={10} /> {e.project_name}
                </button>
              )}
              {e.employee_name && (
                <button onClick={(ev) => { ev.stopPropagation(); navigate('employeeDetail', e.employee_id); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: colors.purple, fontWeight: 600 }}>
                  <User size={10} /> {e.employee_name}
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.textDim, fontSize: 13 }}>No emails match filters</div>}
      </div>
    </div>
  );
}
