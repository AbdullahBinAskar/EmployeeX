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
import Avatar from '../components/Avatar.jsx';
import { Calendar, DollarSign, Users, Package, Mail, AlertTriangle, Pencil, Plus, Trash2, X, Clock, ArrowRight, MapPin } from 'lucide-react';

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: colors.modalBackdrop, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...card({ padding: 24, borderRadius: 18, boxShadow: `${colors.glassShadowElevated}, ${colors.glassInsetShadow}`, background: colors.bgModal, backdropFilter: 'none', WebkitBackdropFilter: 'none' }), width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
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
            <Avatar name={m.name} avatar={m.avatar} size={28} />
            <span style={{ fontSize: 12, color: colors.text, flex: 1 }}>{m.name}</span>
            <select value={m.role} onChange={e => changeRole(m.employee_id, e.target.value)} style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", padding: '4px 8px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bgInput, color: colors.text }}>
              {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button onClick={() => removeMember(m.employee_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.red, padding: 4 }}><Trash2 size={14} /></button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8, padding: '10px 0', borderTop: `1px solid ${colors.border}` }}>
          <div style={{ flex: 1 }}>
            <FormField label="Add Member" type="select" value={addId} onChange={setAddId}
              options={available.map(e => ({ value: e.id, label: e.name }))} placeholder="Select employee..." />
          </div>
          <select value={addRole} onChange={e => setAddRole(e.target.value)} style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", padding: '8px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bgInput, color: colors.text }}>
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
          options={(members || []).map(m => ({ value: m.id, label: m.name }))} placeholder="Unassigned" />
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
  const { navigate, isAdmin } = useStore();
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
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: colors.purple, background: colors.purple + '15', padding: '2px 7px', borderRadius: 5, marginRight: 8, verticalAlign: 'middle' }}>PRJ-{p.id}</span>
              {p.name}
            </h1>
          </div>
          <div style={{ fontSize: 12, color: colors.textDim }}>{p.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isAdmin && <EditBtn onClick={() => setModal('editProject')} />}
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
        {tab === 'deliverables' && <DeliverablesTab deliverables={p.deliverables} members={p.members} projectId={p.id} onEdit={(d) => setModal({ type: 'deliverable', data: d })} onAdd={() => setModal({ type: 'deliverable' })} navigate={navigate} isAdmin={isAdmin} />}
        {tab === 'team' && <TeamTab members={p.members} navigate={navigate} onEdit={() => setModal('editTeam')} isAdmin={isAdmin} />}
        {tab === 'emails' && <EmailsTab emails={p.emails} navigate={navigate} />}
        {tab === 'meetings' && <MeetingsTab meetings={p.meetings} navigate={navigate} />}
        {tab === 'milestones' && <MilestonesTab milestones={p.milestones} projectId={p.id} onEdit={(m) => setModal({ type: 'milestone', data: m })} onAdd={() => setModal({ type: 'milestone' })} isAdmin={isAdmin} />}
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
            <Avatar name={m.name} avatar={m.avatar} size={32} />
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

function DeliverablesTab({ deliverables, members, projectId, onEdit, onAdd, navigate, isAdmin }) {
  return (
    <div>
      {isAdmin && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <AddBtn onClick={onAdd} label="Add Deliverable" />
      </div>}
      {(deliverables || []).map(d => (
        <div key={d.id} style={card({ padding: 14, marginBottom: 8 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <StatusBadge status={d.status} />
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, flex: 1 }}>{d.title}</span>
            {isAdmin && <button onClick={() => onEdit(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4 }}><Pencil size={13} /></button>}
            <PriorityBadge priority={d.priority} />
          </div>
          {d.description && <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>{d.description}</div>}
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: colors.textDim }}>
            <button onClick={() => d.assignee_id && navigate('employeeDetail', d.assignee_id)} style={{ background: 'none', border: 'none', padding: 0, cursor: d.assignee_id ? 'pointer' : 'default', color: d.assignee_id ? colors.blue : colors.textDim, fontSize: 11 }}>
              {d.assignee_name || 'Unassigned'}
            </button>
            <span>Due: {d.due_date}</span>
            {d.delay_days > 0 && <span style={{ color: colors.red, display: 'inline-flex', alignItems: 'center', gap: 3 }}><AlertTriangle size={10} /> {d.delay_days} days delayed</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamTab({ members, navigate, onEdit, isAdmin }) {
  return (
    <div>
      {isAdmin && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <EditBtn onClick={onEdit} label="Edit Team" />
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        {(members || []).map(m => (
          <button key={m.id} onClick={() => navigate('employeeDetail', m.id)} style={{
            ...card({ padding: 16 }), cursor: 'pointer', textAlign: 'left', color: 'inherit', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Avatar name={m.name} avatar={m.avatar} size={40} />
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

function ProjectEmailModal({ email: e, onClose, navigate }) {
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
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${colors.borderFaint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0, lineHeight: 1.4, flex: 1, paddingRight: 12 }}>{e.subject}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4, flexShrink: 0 }}><X size={20} /></button>
          </div>
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
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            <PriorityBadge priority={e.priority} />
            <StatusBadge status={e.classification} />
            {e.employee_name && (
              <button onClick={() => { onClose(); navigate('employeeDetail', e.employee_id); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: colors.purple, fontWeight: 600 }}>
                <Users size={10} /> {e.employee_name}
              </button>
            )}
          </div>
        </div>
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {e.body || 'No content.'}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailsTab({ emails, navigate }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      {(emails || []).map(e => (
        <div
          key={e.id}
          onClick={() => setSelected(e)}
          style={{
            ...card({ padding: 14, marginBottom: 8 }),
            borderLeft: `3px solid ${e.priority === 'urgent' ? colors.red : e.priority === 'high' ? colors.orange : colors.border}`,
            cursor: 'pointer', transition: 'background .15s',
          }}
          onMouseEnter={ev => ev.currentTarget.style.background = colors.bgHover}
          onMouseLeave={ev => ev.currentTarget.style.background = colors.bgCard}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{e.subject}</span>
            <span style={{ fontSize: 10, color: colors.textDim }}>{e.date ? new Date(e.date).toLocaleDateString() : ''}</span>
          </div>
          <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 4 }}>
            {e.from_address}
            {e.to_address && <span> <ArrowRight size={9} style={{ verticalAlign: 'middle' }} /> {e.to_address}</span>}
          </div>
          {e.body && <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.body.length > 150 ? e.body.slice(0, 150) + '...' : e.body}</div>}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <PriorityBadge priority={e.priority} />
            <StatusBadge status={e.classification} />
          </div>
        </div>
      ))}
      {(!emails || !emails.length) && <div style={{ color: colors.textDim, fontSize: 13, textAlign: 'center', padding: 30 }}>No emails linked to this project</div>}
      {selected && <ProjectEmailModal email={selected} onClose={() => setSelected(null)} navigate={navigate} />}
    </div>
  );
}

function ProjectMeetingModal({ meeting: m, onClose, navigate }) {
  if (!m) return null;
  const dateStr = m.date ? new Date(m.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) : '';

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: colors.modalBackdrop, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={ev => ev.stopPropagation()} style={{
        background: colors.bgModal, border: colors.glassBorder, borderRadius: 18,
        width: '100%', maxWidth: 640, maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: `${colors.glassShadowElevated}, ${colors.glassInsetShadow}`,
      }}>
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
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 12 }}>
            <StatusBadge status={m.status} size="md" />
          </div>
        </div>
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
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
          {m.summary && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Summary</div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', padding: 12, background: colors.bg, borderRadius: 8 }}>{m.summary}</div>
            </div>
          )}
          {m.decisions && m.decisions.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.blue, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Decisions</div>
              {m.decisions.map((d, i) => (
                <div key={i} style={{ fontSize: 12, color: colors.text, padding: '6px 0 6px 12px', borderLeft: `2px solid ${colors.blue}`, marginBottom: 4 }}>{d}</div>
              ))}
            </div>
          )}
          {m.action_items && m.action_items.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.orange, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Action Items</div>
              {m.action_items.map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: colors.text, padding: '6px 0 6px 12px', borderLeft: `2px solid ${colors.orange}`, marginBottom: 4 }}>{a}</div>
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

function MeetingsTab({ meetings, navigate }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      {(meetings || []).map(m => (
        <div
          key={m.id}
          onClick={() => setSelected(m)}
          style={{
            ...card({ padding: 14, marginBottom: 8 }),
            cursor: 'pointer', transition: 'background .15s',
          }}
          onMouseEnter={ev => ev.currentTarget.style.background = colors.bgHover}
          onMouseLeave={ev => ev.currentTarget.style.background = colors.bgCard}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{m.title}</span>
            <StatusBadge status={m.status} />
          </div>
          <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>{m.date} {m.time} · {m.duration_minutes}min{m.location ? ` · ${m.location}` : ''}</div>
          {m.attendees && <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 6 }}>Attendees: {m.attendees.map(a => a.name).join(', ')}</div>}
          {m.summary && (
            <div style={{ fontSize: 12, color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.summary.length > 150 ? m.summary.slice(0, 150) + '...' : m.summary}
            </div>
          )}
        </div>
      ))}
      {(!meetings || !meetings.length) && <div style={{ color: colors.textDim, fontSize: 13, textAlign: 'center', padding: 30 }}>No meetings</div>}
      {selected && <ProjectMeetingModal meeting={selected} onClose={() => setSelected(null)} navigate={navigate} />}
    </div>
  );
}

function MilestonesTab({ milestones, projectId, onEdit, onAdd, isAdmin }) {
  return (
    <div>
      {isAdmin && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <AddBtn onClick={onAdd} label="Add Milestone" />
      </div>}
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
          {isAdmin && <button onClick={() => onEdit(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textDim, padding: 4 }}><Pencil size={13} /></button>}
          <StatusBadge status={m.status} />
        </div>
      ))}
    </div>
  );
}
