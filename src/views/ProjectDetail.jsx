import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, HealthDot, ProgressBar, PriorityBadge } from '../components/StatusBadge.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import TabNav from '../components/TabNav.jsx';
import { colors } from '../theme.js';
import { card } from '../styles.js';
import api from '../api/client.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { Calendar, DollarSign, Users, Package, Mail, AlertTriangle } from 'lucide-react';

export default function ProjectDetail({ projectId }) {
  const { data, loading, error, refetch } = useApi(() => api.getProject(projectId), [projectId]);
  const { navigate } = useStore();
  const [tab, setTab] = useState('overview');
  const { isMobile } = useMediaQuery();

  if (loading) return <Loader text="Loading project..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;
  if (!data) return null;

  const p = data;
  const tabs = ['overview', 'deliverables', 'team', 'emails', 'meetings', 'milestones'];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Projects', view: 'projects' }, { label: p.name }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <HealthDot health={p.health} size={14} showLabel />
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>{p.name}</h1>
          </div>
          <div style={{ fontSize: 12, color: colors.textDim }}>{p.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <PriorityBadge priority={p.priority} />
          <StatusBadge status={p.status} size="md" />
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}><ProgressBar value={p.progress} height={8} /></div>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{p.progress}%</span>
      </div>

      {/* Meta Row */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, fontSize: 12, color: colors.textDim, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {p.start_date} → {p.target_date}</span>
        {p.budget && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><DollarSign size={12} /> {p.budget}</span>}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {p.members?.length || 0} members</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Package size={12} /> {p.deliverables?.length || 0} deliverables</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {p.emails?.length || 0} emails</span>
      </div>

      <TabNav tabs={tabs} active={tab} onChange={setTab} />

      <div role="tabpanel" id={`tabpanel-${tab}`}>
        {tab === 'overview' && <OverviewTab project={p} navigate={navigate} isMobile={isMobile} />}
        {tab === 'deliverables' && <DeliverablesTab deliverables={p.deliverables} navigate={navigate} />}
        {tab === 'team' && <TeamTab members={p.members} navigate={navigate} />}
        {tab === 'emails' && <EmailsTab emails={p.emails} />}
        {tab === 'meetings' && <MeetingsTab meetings={p.meetings} />}
        {tab === 'milestones' && <MilestonesTab milestones={p.milestones} />}
      </div>
    </div>
  );
}

function OverviewTab({ project, navigate, isMobile }) {
  const p = project;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
      <div style={card({ padding: 16 })}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Key Milestones</div>
        {(p.milestones || []).map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${colors.border}10` }}>
            <span style={{ fontSize: 12, color: m.status === 'completed' ? colors.green : m.status === 'overdue' ? colors.red : colors.textDim }}>
              {m.status === 'completed' ? '✓' : m.status === 'overdue' ? '!' : '○'}
            </span>
            <span style={{ fontSize: 12, color: colors.text, flex: 1 }}>{m.title}</span>
            <span style={{ fontSize: 10, color: colors.textDim }}>{m.due_date}</span>
            <StatusBadge status={m.status} />
          </div>
        ))}
      </div>

      <div style={card({ padding: 16 })}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Team</div>
        {(p.members || []).map(m => (
          <button key={m.id} onClick={() => navigate('employeeDetail', m.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${colors.border}10`, color: 'inherit', textAlign: 'left' }}>
            <span style={{ fontSize: 18 }}>{m.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{m.name}</div>
              <div style={{ fontSize: 10, color: colors.textDim }}>{m.role}</div>
            </div>
            <StatusBadge status={m.member_role} />
            <StatusBadge status={m.status} />
          </button>
        ))}
      </div>

      <div style={card({ padding: 16, gridColumn: isMobile ? undefined : 'span 2' })}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Deliverables</div>
        {(p.deliverables || []).slice(0, 6).map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${colors.border}10` }}>
            <StatusBadge status={d.status} />
            <span style={{ fontSize: 12, color: colors.text, flex: 1 }}>{d.title}</span>
            <span style={{ fontSize: 11, color: colors.textDim }}>{d.assignee_name || 'Unassigned'}</span>
            <PriorityBadge priority={d.priority} />
            <span style={{ fontSize: 10, color: colors.textDim }}>{d.due_date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliverablesTab({ deliverables, navigate }) {
  return (
    <div>
      {(deliverables || []).map(d => (
        <div key={d.id} style={card({ padding: 14, marginBottom: 8 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <StatusBadge status={d.status} />
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, flex: 1 }}>{d.title}</span>
            <PriorityBadge priority={d.priority} />
          </div>
          {d.description && <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>{d.description}</div>}
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: colors.textDim }}>
            <button onClick={() => d.assignee_id && navigate('employeeDetail', d.assignee_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: d.assignee_id ? 'pointer' : 'default', color: d.assignee_id ? colors.blue : colors.textDim, fontSize: 11 }}>
              {d.assignee_avatar} {d.assignee_name || 'Unassigned'}
            </button>
            <span>Due: {d.due_date}</span>
            {d.delay_days > 0 && <span style={{ color: colors.red, display: 'inline-flex', alignItems: 'center', gap: 3 }}><AlertTriangle size={10} /> {d.delay_days} days delayed</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamTab({ members, navigate }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
      {(members || []).map(m => (
        <button key={m.id} onClick={() => navigate('employeeDetail', m.id)} style={{
          ...card({ padding: 16 }), cursor: 'pointer', textAlign: 'left', color: 'inherit', width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{m.avatar}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{m.name}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>{m.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <StatusBadge status={m.member_role} />
            <StatusBadge status={m.status} />
          </div>
          {m.skills && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
              {JSON.parse(typeof m.skills === 'string' ? m.skills : '[]').slice(0, 3).map(s => (
                <span key={s} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: colors.border, color: colors.textDim }}>{s}</span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function EmailsTab({ emails }) {
  return (
    <div>
      {(emails || []).map(e => (
        <div key={e.id} style={{
          ...card({ padding: 14, marginBottom: 8 }),
          borderLeft: `3px solid ${e.priority === 'urgent' ? colors.red : e.priority === 'high' ? colors.orange : colors.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{e.subject}</span>
            <span style={{ fontSize: 10, color: colors.textDim }}>{e.date}</span>
          </div>
          <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 4 }}>{e.from_address} → {e.to_address}</div>
          {e.body && <div style={{ fontSize: 11, color: colors.textDim, lineHeight: 1.5 }}>{e.body.slice(0, 200)}...</div>}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <StatusBadge status={e.classification} />
            <StatusBadge status={e.status} />
          </div>
        </div>
      ))}
      {(!emails || !emails.length) && <div style={{ color: colors.textDim, fontSize: 13, textAlign: 'center', padding: 30 }}>No emails linked to this project</div>}
    </div>
  );
}

function MeetingsTab({ meetings }) {
  return (
    <div>
      {(meetings || []).map(m => (
        <div key={m.id} style={card({ padding: 14, marginBottom: 8 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{m.title}</span>
            <StatusBadge status={m.status} />
          </div>
          <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>{m.date} {m.time} · {m.duration_minutes}min · {m.location}</div>
          {m.attendees && <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>Attendees: {m.attendees.map(a => a.name).join(', ')}</div>}
          {m.summary && <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, lineHeight: 1.5 }}>{m.summary}</div>}
          {m.decisions?.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: colors.blue, marginBottom: 4 }}>DECISIONS</div>
              {m.decisions.map((d, i) => (
                <div key={i} style={{ fontSize: 11, color: colors.text, padding: '3px 0', paddingLeft: 10, borderLeft: `2px solid ${colors.blue}` }}>{d}</div>
              ))}
            </div>
          )}
          {m.action_items?.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: colors.orange, marginBottom: 4 }}>ACTION ITEMS</div>
              {m.action_items.map((a, i) => (
                <div key={i} style={{ fontSize: 11, color: colors.text, padding: '3px 0', paddingLeft: 10, borderLeft: `2px solid ${colors.orange}` }}>{a}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MilestonesTab({ milestones }) {
  return (
    <div>
      {(milestones || []).map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${colors.border}15` }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            background: m.status === 'completed' ? colors.green + '20' : m.status === 'overdue' ? colors.red + '20' : colors.border,
            color: m.status === 'completed' ? colors.green : m.status === 'overdue' ? colors.red : colors.textDim,
          }}>
            {m.status === 'completed' ? '✓' : m.status === 'overdue' ? '!' : '○'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{m.title}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>Due: {m.due_date}</div>
          </div>
          <StatusBadge status={m.status} />
        </div>
      ))}
    </div>
  );
}
