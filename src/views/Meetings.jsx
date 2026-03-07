import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { ErrorMsg } from '../components/Shared.jsx';
import { SkeletonList } from '../components/Skeleton.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Avatar from '../components/Avatar.jsx';
import { colors } from '../theme.js';
import api from '../api/client.js';
import { Calendar, MapPin, FolderOpen, X, Clock, Users } from 'lucide-react';

/* ── Meeting Detail Modal ── */
function MeetingModal({ meeting: m, onClose, navigate }) {
  if (!m) return null;
  const dateStr = m.date ? new Date(m.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) : '';

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: colors.modalBackdrop, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={ev => ev.stopPropagation()} style={{
        background: colors.bgCard, border: colors.glassBorder, borderRadius: 18,
        width: '100%', maxWidth: 640, maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: colors.glassShadowElevated,
        backdropFilter: `blur(${colors.glassBlur})`, WebkitBackdropFilter: `blur(${colors.glassBlur})`,
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${colors.borderFaint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0, lineHeight: 1.4, flex: 1, paddingRight: 12 }}>{m.title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4, flexShrink: 0 }}><X size={20} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={11} style={{ color: colors.textDim }} />
              <span style={{ color: colors.text }}>{dateStr} {m.time && `at ${m.time}`}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={11} style={{ color: colors.textDim }} />
              <span style={{ color: colors.text }}>{m.duration_minutes} minutes</span>
            </div>
            {m.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={11} style={{ color: colors.textDim }} />
                <span style={{ color: colors.text }}>{m.location}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            <StatusBadge status={m.status} size="md" />
            {m.project_name && (
              <button onClick={() => { onClose(); navigate('projectDetail', m.project_id); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: colors.blue, fontWeight: 600 }}>
                <FolderOpen size={10} /> {m.project_name}
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Attendees */}
          {m.attendees && m.attendees.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.purple, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={10} /> Attendees
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {m.attendees.map(a => (
                  <button key={a.id} onClick={() => { onClose(); navigate('employeeDetail', a.id); }} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    background: colors.border, color: colors.textMuted, border: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <Avatar name={a.name} avatar={a.avatar} size={18} /> {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {m.summary && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Summary</div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', padding: 12, background: colors.bg, borderRadius: 8 }}>
                {m.summary}
              </div>
            </div>
          )}

          {/* Decisions */}
          {m.decisions && m.decisions.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.blue, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Decisions</div>
              {m.decisions.map((d, i) => (
                <div key={i} style={{ fontSize: 12, color: colors.text, padding: '6px 0 6px 12px', borderLeft: `2px solid ${colors.blue}`, marginBottom: 4 }}>
                  {d}
                </div>
              ))}
            </div>
          )}

          {/* Action Items */}
          {m.action_items && m.action_items.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.orange, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Action Items</div>
              {m.action_items.map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: colors.text, padding: '6px 0 6px 12px', borderLeft: `2px solid ${colors.orange}`, marginBottom: 4 }}>
                  {a}
                </div>
              ))}
            </div>
          )}

          {!m.summary && (!m.decisions || !m.decisions.length) && (!m.action_items || !m.action_items.length) && (
            <div style={{ color: colors.textDim, fontSize: 13, textAlign: 'center', padding: 20 }}>No details available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Meetings() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
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

      <div>
        {filtered.map(m => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            style={{
              background: colors.bgCard, border: colors.glassBorder, borderRadius: 16, padding: 18, marginBottom: 12,
              borderLeft: `3px solid ${m.status === 'scheduled' ? colors.blue : m.status === 'completed' ? colors.green : colors.textDim}`,
              backdropFilter: `blur(${colors.glassBlur})`, WebkitBackdropFilter: `blur(${colors.glassBlur})`,
              boxShadow: `${colors.glassShadow}, ${colors.glassInsetShadow}`,
              cursor: 'pointer', transition: 'background .15s',
            }}
            onMouseEnter={ev => ev.currentTarget.style.background = colors.bgHover}
            onMouseLeave={ev => ev.currentTarget.style.background = colors.bgCard}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 11, color: colors.textDim, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <Calendar size={10} /> {m.date} {m.time && `at ${m.time}`} · {m.duration_minutes}min
                  {m.location && <><MapPin size={10} style={{ marginLeft: 4 }} /> {m.location}</>}
                </div>
              </div>
              <StatusBadge status={m.status} size="md" />
            </div>

            {m.project_name && (
              <div style={{ marginBottom: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: colors.blue, fontWeight: 600 }}>
                  <FolderOpen size={10} /> {m.project_name}
                </span>
              </div>
            )}

            {m.attendees && m.attendees.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                {m.attendees.map(a => (
                  <span key={a.id} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: colors.border, color: colors.textMuted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Avatar name={a.name} avatar={a.avatar} size={18} /> {a.name}
                  </span>
                ))}
              </div>
            )}

            {m.summary && (
              <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.summary.length > 150 ? m.summary.slice(0, 150) + '...' : m.summary}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.textDim, fontSize: 13 }}>No meetings match filter</div>}
      </div>

      {selected && <MeetingModal meeting={selected} onClose={() => setSelected(null)} navigate={navigate} />}
    </div>
  );
}
