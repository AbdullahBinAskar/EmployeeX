import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';

export default function Meetings() {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, loading, error, refetch } = useApi(() => api.getMeetings(), []);
  const { navigate } = useStore();

  if (loading) return <Loader text="Loading meetings..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const meetings = data || [];
  const statuses = ['all', 'scheduled', 'completed', 'cancelled'];
  const filtered = statusFilter === 'all' ? meetings : meetings.filter(m => m.status === statusFilter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Meetings</h1>
        <span style={{ fontSize: 12, color: colors.textDim }}>
          {meetings.length} total · {meetings.filter(m => m.status === 'scheduled').length} upcoming
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            border: `1px solid ${statusFilter === s ? colors.blue : colors.border}`,
            background: statusFilter === s ? colors.blue + '20' : 'transparent',
            color: statusFilter === s ? colors.blue : colors.textDim,
          }}>
            {s}
          </button>
        ))}
      </div>

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
                <div style={{ fontSize: 11, color: colors.textDim }}>
                  📅 {m.date} {m.time && `at ${m.time}`} · {m.duration_minutes}min
                  {m.location && ` · 📍 ${m.location}`}
                </div>
              </div>
              <StatusBadge status={m.status} size="md" />
            </div>

            {/* Project Link */}
            {m.project_name && (
              <div style={{ marginBottom: 8 }}>
                <span onClick={() => navigate('projectDetail', m.project_id)} style={{ fontSize: 11, color: colors.blue, cursor: 'pointer', fontWeight: 600 }}>
                  📁 {m.project_name}
                </span>
              </div>
            )}

            {/* Attendees */}
            {m.attendees && m.attendees.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {m.attendees.map(a => (
                  <span
                    key={a.id}
                    onClick={() => navigate('employeeDetail', a.id)}
                    style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                      background: colors.border, color: colors.textMuted,
                    }}
                  >
                    {a.avatar} {a.name}
                  </span>
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
