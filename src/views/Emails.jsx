import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge.jsx';
import { colors, statusColors } from '../theme.js';
import api from '../api/client.js';

export default function Emails() {
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, loading, error, refetch } = useApi(() => api.getEmails(), []);
  const { navigate } = useStore();

  if (loading) return <Loader text="Loading emails..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const emails = data || [];

  const classifications = ['all', 'action_required', 'escalation', 'update', 'request', 'fyi', 'general'];
  const statuses = ['all', 'unread', 'read', 'replied', 'flagged'];

  let filtered = emails;
  if (classFilter !== 'all') filtered = filtered.filter(e => e.classification === classFilter);
  if (statusFilter !== 'all') filtered = filtered.filter(e => e.status === statusFilter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>Emails</h1>
        <span style={{ fontSize: 12, color: colors.textDim }}>{emails.length} total · {emails.filter(e => e.status === 'unread').length} unread · {emails.filter(e => e.classification === 'action_required').length} need action</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: colors.textDim, marginRight: 4 }}>Classification:</span>
          {classifications.map(c => (
            <button key={c} onClick={() => setClassFilter(c)} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              border: `1px solid ${classFilter === c ? colors.blue : colors.border}`,
              background: classFilter === c ? colors.blue + '20' : 'transparent',
              color: classFilter === c ? colors.blue : colors.textDim,
            }}>
              {c.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: colors.textDim, marginRight: 4 }}>Status:</span>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              border: `1px solid ${statusFilter === s ? colors.blue : colors.border}`,
              background: statusFilter === s ? colors.blue + '20' : 'transparent',
              color: statusFilter === s ? colors.blue : colors.textDim,
            }}>
              {s}
            </button>
          ))}
        </div>
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
                  {e.status === 'unread' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.blue, flexShrink: 0 }} />}
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

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <StatusBadge status={e.classification} />
              <StatusBadge status={e.status} />
              {e.project_name && (
                <span onClick={() => navigate('projectDetail', e.project_id)} style={{ fontSize: 10, color: colors.blue, cursor: 'pointer', fontWeight: 600 }}>
                  📁 {e.project_name}
                </span>
              )}
              {e.employee_name && (
                <span onClick={() => navigate('employeeDetail', e.employee_id)} style={{ fontSize: 10, color: colors.purple, cursor: 'pointer', fontWeight: 600 }}>
                  👤 {e.employee_name}
                </span>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.textDim, fontSize: 13 }}>No emails match filters</div>}
      </div>
    </div>
  );
}
