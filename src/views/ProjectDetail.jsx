import { useState, useEffect } from 'react';
import { useApi, useMutation } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, HealthDot, ProgressBar, PriorityBadge } from '../components/StatusBadge.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import TabNav from '../components/TabNav.jsx';
import FormField from '../components/FormField.jsx';
import { colors } from '../theme.js';
import { card, btn, btnPrimary } from '../styles.js';
import api from '../api/client.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { Calendar, DollarSign, Users, Package, Mail, AlertTriangle, Pencil, Plus, Trash2, X } from 'lucide-react';

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...card({ padding: 24 }), width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4 }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Edit button helper ── */
function EditBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={btn({ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 })}>
      <Pencil size={12} /> {label || 'Edit'}
    </button>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
      <Plus size={12} /> {label || 'Add'}
    </button>
  );
}

/* ── Status / option constants ── */
const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'];
const HEALTH_OPTIONS = ['green', 'yellow', 'red'];
const PRIORITY_OPTIONS = ['critical', 'high', 'medium', 'low'];
const DELIVERABLE_STATUSES = ['not_started', 'in_progress', 'in_review', 'completed', 'blocked', 'overdue'];
const MILESTONE_STATUSES = ['pending', 'in_progress', 'completed', 'overdue'];
const MEMBER_ROLES = ['lead', 'member', 'reviewer'];

/* ────────────────────── Edit Project Modal ────────────────────── */
function EditProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: project.name || '', description: project.description || '',
    status: project.status || 'planning', health: project.health || 'green',
    priority: project.priority || 'medium', progress: project.progress || 0,
    start_date: project.start_date || '', target_date: project.target_date || '',
    budget: project.budget || '',
  });
  const { execute, loading } = useMutation((data) => api.updateProject(project.id, data));
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    await execute({ ...form, progress: Number(form.progress) });
    onSaved();
    onClose();
  };

  return (
    <Modal title="Edit Project" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FormField label="Name" value={form.name} onChange={set('name')} required />
        <FormField label="Description" value={form.description} onChange={set('description')} type="textarea" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={PROJECT_STATUSES} />
          <FormField label="Health" type="select" value={form.health} onChange={set('health')} options={HEALTH_OPTIONS} />
          <FormField label="Priority" type="select" value={form.priority} onChange={set('priority')} options={PRIORITY_OPTIONS} />
        </div>
        <FormField label="Progress (%)" type="number" value={form.progress} onChange={set('progress')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} />
          <FormField label="Target Date" type="date" value={form.target_date} onChange={set('target_date')} />
        </div>
        <FormField label="Budget" value={form.budget} onChange={set('budget')} placeholder="e.g. $50,000" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={btn()}>Cancel</button>
          <button onClick={save} disabled={loading} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ────────────────────── Edit Team Modal ────────────────────── */
function EditTeamModal({ project, onClose, onSaved }) {
  const [members, setMembers] = useState(
    (project.members || []).map(m => ({ employee_id: m.id, role: m.member_role || 'member', name: m.name, avatar: m.avatar }))
  );
  const [addId, setAddId] = useState('');
  const [addRole, setAddRole] = useState('member');
  const { data: allEmployees } = useApi(() => api.getEmployees(), []);
  const { execute, loading } = useMutation((data) => api.updateProjectMembers(project.id, data));

  const available = (allEmployees || []).filter(e => !members.some(m => m.employee_id === e.id));

  const addMember = () => {
    if (!addId) return;
    const emp = (allEmployees || []).find(e => e.id === Number(addId));
    if (!emp) return;
    setMembers(prev => [...prev, { employee_id: emp.id, role: addRole, name: emp.name, avatar: emp.avatar }]);
    setAddId('');
    setAddRole('member');
  };

  const removeMember = (empId) => setMembers(prev => prev.filter(m => m.employee_id !== empId));
  const changeRole = (empId, role) => setMembers(prev => prev.map(m => m.employee_id === empId ? { ...m, role } : m));

  const save = async () => {
    await execute(members.map(m => ({ employee_id: m.employee_id, role: m.role })));
    onSaved();
    onClose();
  };

  return (
    <Modal title="Edit Team" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map(m => (
          <div key={m.employee_id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1px solid ${colors.borderFaint}` }}>
            <span style={{ fontSize: 18 }}>{m.avatar}</span>
            <span style={{ fontSize: 12, color: colors.text, flex: 1 }}>{m.name}</span>
            <select value={m.role} onChange={e => changeRole(m.employee_id, e.target.value)} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bgInput, color: colors.text }}>
              {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button onClick={() => removeMember(m.employee_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.red, padding: 4 }}><Trash2 size={14} /></button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8, padding: '10px 0', borderTop: `1px solid ${colors.border}` }}>
          <div style={{ flex: 1 }}>
            <FormField label="Add Member" type="select" value={addId} onChange={setAddId}
              options={available.map(e => ({ value: e.id, label: `${e.avatar} ${e.name}` }))} placeholder="Select employee..." />
          </div>
          <select value={addRole} onChange={e => setAddRole(e.target.value)} style={{ fontSize: 11, padding: '8px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bgInput, color: colors.text }}>
            {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={addMember} disabled={!addId} style={{ ...btnPrimary, padding: '8px 12px' }}><Plus size={14} /></button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose} style={btn()}>Cancel</button>
          <button onClick={save} disabled={loading} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ────────────────────── Deliverable Modal ────────────────────── */
function DeliverableModal({ projectId, members, existing, onClose, onSaved }) {
  const isEdit = !!existing;
  const [form, setForm] = useState({
    title: existing?.title || '', description: existing?.description || '',
    status: existing?.status || 'not_started', priority: existing?.priority || 'medium',
    due_date: existing?.due_date || '', assignee_id: existing?.assignee_id || '',
  });
  const { execute, loading } = useMutation(
    isEdit ? (data) => api.updateDeliverable(existing.id, data) : (data) => api.createDeliverable(data)
  );
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    const payload = { ...form, project_id: projectId, assignee_id: form.assignee_id || null };
    await execute(payload);
    onSaved();
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Deliverable' : 'Add Deliverable'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FormField label="Title" value={form.title} onChange={set('title')} required />
        <FormField label="Description" value={form.description} onChange={set('description')} type="textarea" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={DELIVERABLE_STATUSES} />
          <FormField label="Priority" type="select" value={form.priority} onChange={set('priority')} options={PRIORITY_OPTIONS} />
        </div>
        <FormField label="Due Date" type="date" value={form.due_date} onChange={set('due_date')} />
        <FormField label="Assignee" type="select" value={form.assignee_id} onChange={set('assignee_id')}
          options={(members || []).map(m => ({ value: m.id, label: `${m.avatar} ${m.name}` }))} placeholder="Unassigned" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={btn()}>Cancel</button>
          <button onClick={save} disabled={loading || !form.title} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ────────────────────── Milestone Modal ────────────────────── */
function MilestoneModal({ projectId, existing, onClose, onSaved }) {
  const isEdit = !!existing;
  const [form, setForm] = useState({
    title: existing?.title || '', due_date: existing?.due_date || '',
    status: existing?.status || 'pending',
  });
  const { execute, loading } = useMutation(
    isEdit ? (data) => api.updateMilestone(projectId, existing.id, data) : (data) => api.createMilestone(projectId, data)
  );
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    await execute(form);
    onSaved();
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Milestone' : 'Add Milestone'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FormField label="Title" value={form.title} onChange={set('title')} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Due Date" type="date" value={form.due_date} onChange={set('due_date')} />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={MILESTONE_STATUSES} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={btn()}>Cancel</button>
          <button onClick={save} disabled={loading || !form.title} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ────────────────────── Main Component ────────────────────── */
export default function ProjectDetail({ projectId }) {
  const { data, loading, error, refetch } = useApi(() => api.getProject(projectId), [projectId]);
  const { navigate } = useStore();
  const [tab, setTab] = useState('overview');
  const { isMobile } = useMediaQuery();
  const [modal, setModal] = useState(null); // 'editProject' | 'editTeam' | { type: 'deliverable', data? } | { type: 'milestone', data? }

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
          <EditBtn onClick={() => setModal('editProject')} />
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
        {tab === 'deliverables' && <DeliverablesTab deliverables={p.deliverables} members={p.members} projectId={p.id} onEdit={(d) => setModal({ type: 'deliverable', data: d })} onAdd={() => setModal({ type: 'deliverable' })} navigate={navigate} />}
        {tab === 'team' && <TeamTab members={p.members} navigate={navigate} onEdit={() => setModal('editTeam')} />}
        {tab === 'emails' && <EmailsTab emails={p.emails} />}
        {tab === 'meetings' && <MeetingsTab meetings={p.meetings} />}
        {tab === 'milestones' && <MilestonesTab milestones={p.milestones} projectId={p.id} onEdit={(m) => setModal({ type: 'milestone', data: m })} onAdd={() => setModal({ type: 'milestone' })} />}
      </div>

      {/* Modals */}
      {modal === 'editProject' && <EditProjectModal project={p} onClose={() => setModal(null)} onSaved={refetch} />}
      {modal === 'editTeam' && <EditTeamModal project={p} onClose={() => setModal(null)} onSaved={refetch} />}
      {modal?.type === 'deliverable' && <DeliverableModal projectId={p.id} members={p.members} existing={modal.data} onClose={() => setModal(null)} onSaved={refetch} />}
      {modal?.type === 'milestone' && <MilestoneModal projectId={p.id} existing={modal.data} onClose={() => setModal(null)} onSaved={refetch} />}
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
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${colors.borderFaint}` }}>
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
          <button key={m.id} onClick={() => navigate('employeeDetail', m.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${colors.borderFaint}`, color: 'inherit', textAlign: 'left' }}>
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
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${colors.borderFaint}` }}>
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

function DeliverablesTab({ deliverables, members, projectId, onEdit, onAdd, navigate }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <AddBtn onClick={onAdd} label="Add Deliverable" />
      </div>
      {(deliverables || []).map(d => (
        <div key={d.id} style={card({ padding: 14, marginBottom: 8 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <StatusBadge status={d.status} />
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, flex: 1 }}>{d.title}</span>
            <button onClick={() => onEdit(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4 }}><Pencil size={13} /></button>
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

function TeamTab({ members, navigate, onEdit }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <EditBtn onClick={onEdit} label="Edit Team" />
      </div>
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

function MilestonesTab({ milestones, projectId, onEdit, onAdd }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <AddBtn onClick={onAdd} label="Add Milestone" />
      </div>
      {(milestones || []).map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${colors.borderFaint}` }}>
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
          <button onClick={() => onEdit(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4 }}><Pencil size={13} /></button>
          <StatusBadge status={m.status} />
        </div>
      ))}
    </div>
  );
}
