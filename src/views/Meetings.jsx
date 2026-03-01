import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { ErrorMsg } from '../components/Shared.jsx';
import { SkeletonList } from '../components/Skeleton.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';
import { Calendar, MapPin, FolderOpen } from 'lucide-react';

export default function Meetings() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useApi(() => api.getMeetings(), [], { cacheKey: 'meetings' });
  const { navigate } = useStore();

  if (loading) return <SkeletonList rows={6} />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const meetings = data || [];
  const statusFilters = ['all', 'scheduled', 'completed', 'cancelled']
    .map(s => ({ key: s, label: s }));
  let filtered = statusFilter === 'all' ? meetings : meetings.filter(m => m.status === statusFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.title?.toLowerCase().includes(q) || m.summary?.toLowerCase().includes(q));
  }

  return (
    <div>
      <PageHeader
        title="Meetings"
        subtitle={`${meetings.length} total · ${meetings.filter(m => m.status === 'scheduled').length} upcoming`}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search meetings..." />
        <FilterBar filters={statusFilters} active={statusFilter} onChange={setStatusFilter} label="Meeting status filter" />
      </PageHeader>

      {/* Meeting List */}
      <div>
        {filtered.map(m => (
          <div key={m.id} style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18, marginBottom: 12,
            borderLeft: `3px solid ${m.status === 'scheduled' ? colors.blue : m.status === 'completed' ? colors.green : colors.textDim}`,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 11, color: colors.textDim, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <Calendar size={10} /> {m.date} {m.time && `at ${m.time}`} · {m.duration_minutes}min
                  {m.location && <><MapPin size={10} style={{ marginLeft: 4 }} /> {m.location}</>}
                </div>
              </div>
              <StatusBadge status={m.status} size="md" />
            </div>

            {/* Project Link */}
            {m.project_name && (
              <div style={{ marginBottom: 8 }}>
                <button onClick={() => navigate('projectDetail', m.project_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: colors.blue, fontWeight: 600 }}>
                  <FolderOpen size={10} /> {m.project_name}
                </button>
              </div>
            )}

            {/* Attendees */}
            {m.attendees && m.attendees.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {m.attendees.map(a => (
                  <button
                    key={a.id}
                    onClick={() => navigate('employeeDetail', a.id)}
                    style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                      background: colors.border, color: colors.textMuted, border: 'none',
                    }}
                  >
                    {a.avatar} {a.name}
                  </button>
                ))}
              </div>
            )}

            {/* Summary */}
            {m.summary && (
              <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.6, marginBottom: 10, padding: 10, background: colors.bg, borderRadius: 8 }}>
                {m.summary}
              </div>
            )}

            {/* Decisions */}
            {m.decisions && m.decisions.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.blue, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Decisions</div>
                {m.decisions.map((d, i) => (
                  <div key={i} style={{ fontSize: 12, color: colors.text, padding: '4px 0 4px 12px', borderLeft: `2px solid ${colors.blue}`, marginBottom: 2 }}>
                    {d}
                  </div>
                ))}
              </div>
            )}

            {/* Action Items */}
            {m.action_items && m.action_items.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.orange, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Action Items</div>
                {m.action_items.map((a, i) => (
                  <div key={i} style={{ fontSize: 12, color: colors.text, padding: '4px 0 4px 12px', borderLeft: `2px solid ${colors.orange}`, marginBottom: 2 }}>
                    {a}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.textDim, fontSize: 13 }}>No meetings match filter</div>}
      </div>
    </div>
  );
}
