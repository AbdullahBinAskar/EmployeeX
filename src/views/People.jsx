import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';

export default function People() {
  const [filter, setFilter] = useState('all');
  const { data, loading, error, refetch } = useApi(() => api.getEmployees(), []);
  const { navigate } = useStore();

  if (loading) return <Loader text="Loading team..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const employees = data || [];
  const filtered = filter === 'all' ? employees : employees.filter(e => e.status === filter);

  const filters = [
    { key: 'all', label: 'All', count: employees.length },
    { key: 'active', label: 'Active', count: employees.filter(e => e.status === 'active').length },
    { key: 'absent', label: 'Absent', count: employees.filter(e => e.status === 'absent' || e.status === 'on_leave').length },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>People</h1>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map(emp => (
          <div
            key={emp.id}
            onClick={() => navigate('employeeDetail', emp.id)}
            style={{
              background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18, cursor: 'pointer',
              opacity: emp.status === 'absent' || emp.status === 'on_leave' ? 0.7 : 1,
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{
                width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, background: colors.blue + '20',
              }}>
                {emp.avatar}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{emp.name}</div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{emp.role}</div>
              </div>
              <StatusBadge status={emp.status} />
            </div>

            {/* Capacity Bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: colors.textDim, marginBottom: 4 }}>
                <span>Capacity</span>
                <span>{emp.capacity}%</span>
              </div>
              <div style={{ height: 4, background: colors.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  width: `${emp.capacity}%`, height: '100%', borderRadius: 2,
                  background: emp.capacity > 90 ? colors.red : emp.capacity > 75 ? colors.orange : colors.green,
                }} />
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(emp.skills || []).slice(0, 3).map(s => (
                <span key={s} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: colors.border, color: colors.textDim }}>{s}</span>
              ))}
              {(emp.skills || []).length > 3 && <span style={{ fontSize: 9, color: colors.textDim }}>+{emp.skills.length - 3}</span>}
            </div>

            {/* Contact */}
            <div style={{ marginTop: 10, fontSize: 10, color: colors.textDim }}>{emp.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
