import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { ErrorMsg } from '../components/Shared.jsx';
import { SkeletonGrid } from '../components/Skeleton.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Avatar from '../components/Avatar.jsx';
import { colors } from '../theme.js';
import { grid } from '../styles.js';
import api from '../api/client.js';

export default function People() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useApi(() => api.getEmployees(), [], { cacheKey: 'employees' });
  const { navigate } = useStore();

  if (loading) return <SkeletonGrid count={6} minWidth="280px" />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const employees = data || [];
  let filtered = filter === 'all' ? employees : employees.filter(e =>
    filter === 'absent' ? (e.status === 'absent' || e.status === 'on_leave') : e.status === filter
  );
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => e.name.toLowerCase().includes(q) || e.role?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q));
  }

  const filters = [
    { key: 'all', label: 'All', count: employees.length },
    { key: 'active', label: 'Active', count: employees.filter(e => e.status === 'active').length },
    { key: 'absent', label: 'Absent', count: employees.filter(e => e.status === 'absent' || e.status === 'on_leave').length },
  ];

  return (
    <div>
      <PageHeader title="Employees">
        <SearchBar value={search} onChange={setSearch} placeholder="Search people..." />
        <FilterBar filters={filters} active={filter} onChange={setFilter} label="Employee status filter" />
      </PageHeader>

      <div style={grid('280px')}>
        {filtered.map(emp => (
          <button
            key={emp.id}
            onClick={() => navigate('employeeDetail', emp.id)}
            style={{
              background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 18, cursor: 'pointer',
              opacity: emp.status === 'absent' || emp.status === 'on_leave' ? 0.7 : 1,
              transition: 'transform 0.15s', textAlign: 'left', color: 'inherit', width: '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Avatar name={emp.name} avatar={emp.avatar} size={44} />
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
              <div style={{ height: 4, background: colors.border, borderRadius: 2, overflow: 'hidden' }} role="progressbar" aria-valuenow={emp.capacity} aria-valuemin={0} aria-valuemax={100}>
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
          </button>
        ))}
      </div>
    </div>
  );
}
