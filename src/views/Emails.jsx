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
import { FolderOpen, User, X, Clock, Tag, ArrowRight } from 'lucide-react';

/* ── Email Detail Modal ── */
function EmailModal({ email: e, onClose, navigate }) {
  if (!e) return null;

  const dateStr = e.date ? new Date(e.date).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '';

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: colors.modalBackdrop, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={ev => ev.stopPropagation()} style={{
        background: colors.bgModal, border: colors.glassBorder, borderRadius: 18,
        width: '100%', maxWidth: 640, maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: `${colors.glassShadowElevated}, ${colors.glassInsetShadow}`,
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${colors.borderFaint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0, lineHeight: 1.4, flex: 1, paddingRight: 12 }}>{e.subject}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4, flexShrink: 0 }}><X size={20} /></button>
          </div>

          {/* Meta info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: colors.textDim, fontWeight: 600, minWidth: 40 }}>From</span>
              <span style={{ color: colors.text }}>{e.from_address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: colors.textDim, fontWeight: 600, minWidth: 40 }}>To</span>
              <span style={{ color: colors.text }}>{e.to_address}</span>
            </div>
            {e.cc && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: colors.textDim, fontWeight: 600, minWidth: 40 }}>CC</span>
                <span style={{ color: colors.text }}>{e.cc}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={11} style={{ color: colors.textDim }} />
              <span style={{ color: colors.textDim }}>{dateStr}</span>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            <PriorityBadge priority={e.priority} />
            <StatusBadge status={e.classification} />

            {e.project_name && (
              <button onClick={() => { onClose(); navigate('projectDetail', e.project_id); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: colors.blue, fontWeight: 600 }}>
                <FolderOpen size={10} /> {e.project_name}
              </button>
            )}
            {e.employee_name && (
              <button onClick={() => { onClose(); navigate('employeeDetail', e.employee_id); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: colors.purple, fontWeight: 600 }}>
                <User size={10} /> {e.employee_name}
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{
            fontSize: 13, color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {e.body || 'No content.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Emails() {
  const [classFilter, setClassFilter] = useState('all');

  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const { data, loading, error, refetch } = useApi(() => api.getEmails(), [], { cacheKey: 'emails' });
  const { navigate } = useStore();

  if (loading) return <SkeletonList rows={8} />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const emails = data || [];

  const classFilters = ['all', 'action_required', 'escalation', 'update', 'request', 'fyi', 'general']
    .map(c => ({ key: c, label: c.replace(/_/g, ' ') }));
  let filtered = emails;
  if (classFilter !== 'all') filtered = filtered.filter(e => e.classification === classFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => e.subject?.toLowerCase().includes(q) || e.from_address?.toLowerCase().includes(q) || e.body?.toLowerCase().includes(q));
  }

  return (
    <div>
      <PageHeader
        title="Emails"
        subtitle={`${emails.length} total · ${emails.filter(e => e.classification === 'action_required').length} need action`}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search emails..." />
      </PageHeader>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterGroup label="Classification" filters={classFilters} active={classFilter} onChange={setClassFilter} />
      </div>

      {/* Email List */}
      <div>
        {filtered.map(e => (
          <div
            key={e.id}
            onClick={() => setSelectedEmail(e)}
            style={{
              background: colors.bgCard, border: colors.glassBorder, borderRadius: 14, padding: 16, marginBottom: 8,
              borderLeft: `3px solid ${statusColors[e.classification] || colors.border}`,
              backdropFilter: `blur(${colors.glassBlur})`, WebkitBackdropFilter: `blur(${colors.glassBlur})`,
              boxShadow: `${colors.glassShadow}, ${colors.glassInsetShadow}`,
              opacity: 1,
              cursor: 'pointer', transition: 'background .15s',
            }}
            onMouseEnter={ev => ev.currentTarget.style.background = colors.bgHover}
            onMouseLeave={ev => ev.currentTarget.style.background = colors.bgCard}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{e.subject}</span>
                </div>
                <div style={{ fontSize: 11, color: colors.textDim }}>
                  {e.from_address}
                  {e.to_address && <span> <ArrowRight size={9} style={{ verticalAlign: 'middle' }} /> {e.to_address}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 10, color: colors.textDim, marginBottom: 4 }}>{e.date ? new Date(e.date).toLocaleDateString() : ''}</div>
                <PriorityBadge priority={e.priority} />
              </div>
            </div>

            {e.body && (
              <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.5, marginBottom: 8, padding: '8px 0', borderTop: `1px solid ${colors.borderFaint}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.body.length > 150 ? e.body.slice(0, 150) + '...' : e.body}
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusBadge status={e.classification} />
  
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

      {/* Email Detail Modal */}
      {selectedEmail && <EmailModal email={selectedEmail} onClose={() => setSelectedEmail(null)} navigate={navigate} />}
    </div>
  );
}
