import { useState } from 'react';
import { useApi, useMutation } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, Stat, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge, PriorityBadge, HealthDot, ProgressBar } from '../components/StatusBadge.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import TabNav from '../components/TabNav.jsx';
import FormField from '../components/FormField.jsx';
import Avatar from '../components/Avatar.jsx';
import { colors } from '../theme.js';
import { card, btn, btnPrimary } from '../styles.js';
import api from '../api/client.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { AlertTriangle, Pencil, X } from 'lucide-react';

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

/* ── Edit Employee Modal ── */
function EditEmployeeModal({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: employee.name || '', role: employee.role || '', email: employee.email || '',
    status: employee.status || 'active', capacity: employee.capacity ?? 100,
    skills: (employee.skills || []).join(', '), join_date: employee.join_date || '',
    phone: employee.phone || '', notes: employee.notes || '',
  });
  const { execute, loading } = useMutation((data) => api.updateEmployee(employee.id, data));
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    const payload = { ...form, capacity: Number(form.capacity), skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
    await execute(payload);
    onSaved();
    onClose();
  };

  return (
    <Modal title="Edit Employee" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FormField label="Name" value={form.name} onChange={set('name')} required />
        <FormField label="Role" value={form.role} onChange={set('role')} required />
        <FormField label="Email" value={form.email} onChange={set('email')} type="email" required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['active', 'absent', 'on_leave', 'inactive']} />
          <FormField label="Capacity (%)" type="number" value={form.capacity} onChange={set('capacity')} />
        </div>
        <FormField label="Skills (comma-separated)" value={form.skills} onChange={set('skills')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Join Date" type="date" value={form.join_date} onChange={set('join_date')} />
          <FormField label="Phone" value={form.phone} onChange={set('phone')} />
        </div>
        <FormField label="Notes" value={form.notes} onChange={set('notes')} type="textarea" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={btn()}>Cancel</button>
          <button onClick={save} disabled={loading || !form.name || !form.email} style={btnPrimary}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}

export default function EmployeeDetail({ employeeId }) {
  const { data, loading, error, refetch } = useApi(() => api.getEmployee(employeeId), [employeeId]);
  const { navigate } = useStore();
  const [tab, setTab] = useState('overview');
  const [editModal, setEditModal] = useState(false);
  const { isMobile } = useMediaQuery();

  if (loading) return <Loader text="Loading employee..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;
  if (!data) return null;

  const emp = data;
  const tabs = ['overview', 'projects', 'deliverables', 'kpis', 'emails', 'meetings'];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'People', view: 'people' }, { label: emp.name }]} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <Avatar name={emp.name} avatar={emp.avatar} size={56} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0 }}>{emp.name}</h1>
            <StatusBadge status={emp.status} size="md" />
            <button onClick={() => setEditModal(true)} style={btn({ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 })}>
              <Pencil size={12} /> Edit
            </button>
          </div>
          <div style={{ fontSize: 13, color: colors.textDim, marginTop: 2 }}>{emp.role} · {emp.email}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <Stat label="Capacity" value={`${emp.capacity}%`} color={emp.capacity > 90 ? colors.red : emp.capacity > 75 ? colors.orange : colors.green} />
        <Stat label="Projects" value={emp.projects?.length || 0} color={colors.purple} />
        <Stat label="Deliverables" value={emp.deliverables?.length || 0} sub={`${emp.deliverables?.filter(d => d.status === 'completed').length || 0} completed`} color={colors.blue} />
        <Stat label="KPIs" value={emp.kpis?.length || 0} sub={`${emp.kpis?.filter(k => k.status === 'exceeded').length || 0} exceeded`} color={colors.cyan} />
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {(emp.skills || []).map(s => (
          <span key={s} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: colors.blue + '15', color: colors.blue, fontWeight: 600 }}>{s}</span>
        ))}
      </div>

      <TabNav tabs={tabs} active={tab} onChange={setTab} />

      <div role="tabpanel" id={`tabpanel-${tab}`}>
        {tab === 'overview' && <OverviewTab emp={emp} navigate={navigate} isMobile={isMobile} />}
        {tab === 'projects' && <ProjectsTab projects={emp.projects} navigate={navigate} />}
        {tab === 'deliverables' && <DeliverablesTab deliverables={emp.deliverables} navigate={navigate} />}
        {tab === 'kpis' && <KpisTab kpis={emp.kpis} />}
        {tab === 'emails' && <EmailsTab emails={emp.emails} />}
        {tab === 'meetings' && <MeetingsTab meetings={emp.meetings} />}
      </div>

      {editModal && <EditEmployeeModal employee={emp} onClose={() => setEditModal(false)} onSaved={refetch} />}
    </div>
  );
}

function OverviewTab({ emp, navigate, isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
      <div style={card({ padding: 16 })}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Projects</div>
        {(emp.projects || []).map(p => (
          <button key={p.id} onClick={() => navigate('projectDetail', p.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', cursor: 'pointer', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${colors.borderFaint}`, color: 'inherit', textAlign: 'left' }}>
            <HealthDot health={p.health} />
            <span style={{ fontSize: 12, color: colors.text, flex: 1, fontWeight: 600 }}>{p.name}</span>
            <StatusBadge status={p.member_role} />
          </button>
        ))}
        {(!emp.projects || !emp.projects.length) && <div style={{ fontSize: 12, color: colors.textDim }}>No projects assigned</div>}
      </div>

      <div style={card({ padding: 16 })}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>KPIs</div>
        {(emp.kpis || []).map(k => (
          <div key={k.id} style={{ padding: '8px 0', borderBottom: `1px solid ${colors.borderFaint}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: colors.text }}>{k.metric_name}</span>
              <StatusBadge status={k.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ProgressBar value={k.target_value ? (k.current_value / k.target_value) * 100 : 0} height={4} />
              <span style={{ fontSize: 10, color: colors.textDim, whiteSpace: 'nowrap' }}>{k.current_value}{k.unit}/{k.target_value}{k.unit}</span>
            </div>
          </div>
        ))}
        {(!emp.kpis || !emp.kpis.length) && <div style={{ fontSize: 12, color: colors.textDim }}>No KPIs defined</div>}
      </div>

      <div style={card({ padding: 16, gridColumn: isMobile ? undefined : 'span 2' })}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Active Deliverables</div>
        {(emp.deliverables || []).filter(d => d.status !== 'completed').slice(0, 5).map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${colors.borderFaint}` }}>
            <StatusBadge status={d.status} />
            <span style={{ fontSize: 12, color: colors.text, flex: 1 }}>{d.title}</span>
            <button onClick={() => navigate('projectDetail', d.project_id)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 10, color: colors.blue, cursor: 'pointer' }}>{d.project_name}</button>
            <PriorityBadge priority={d.priority} />
            <span style={{ fontSize: 10, color: colors.textDim }}>{d.due_date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ projects, navigate }) {
  return (
    <div>
      {(projects || []).map(p => (
        <button key={p.id} onClick={() => navigate('projectDetail', p.id)} style={{
          ...card({ padding: 14, marginBottom: 8 }), cursor: 'pointer', width: '100%', textAlign: 'left', color: 'inherit',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <HealthDot health={p.health} showLabel />
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.text, flex: 1 }}>{p.name}</span>
            <StatusBadge status={p.member_role} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ProgressBar value={p.progress} height={4} />
            <span style={{ fontSize: 11, color: colors.textDim }}>{p.progress}%</span>
            <StatusBadge status={p.status} />
          </div>
        </button>
      ))}
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
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: colors.textDim }}>
            <button onClick={() => navigate('projectDetail', d.project_id)} style={{ background: 'none', border: 'none', padding: 0, color: colors.blue, cursor: 'pointer', fontSize: 11 }}>{d.project_name}</button>
            <span>Due: {d.due_date}</span>
            {d.delay_days > 0 && <span style={{ color: colors.red, display: 'inline-flex', alignItems: 'center', gap: 3 }}><AlertTriangle size={10} /> {d.delay_days}d delayed</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function KpisTab({ kpis }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
      {(kpis || []).map(k => {
        const pct = k.target_value ? (k.current_value / k.target_value) * 100 : 0;
        return (
          <div key={k.id} style={card({ padding: 16 })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{k.metric_name}</span>
              <StatusBadge status={k.status} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: colors.text, marginBottom: 4 }}>
              {k.current_value}<span style={{ fontSize: 12, color: colors.textDim }}>{k.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: colors.textDim, marginBottom: 8 }}>Target: {k.target_value}{k.unit} · {k.period}</div>
            <ProgressBar value={Math.min(pct, 100)} height={6} />
          </div>
        );
      })}
    </div>
  );
}

function EmailsTab({ emails }) {
  return (
    <div>
      {(emails || []).map(e => (
        <div key={e.id} style={card({ padding: 14, marginBottom: 8 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{e.subject}</span>
            <span style={{ fontSize: 10, color: colors.textDim }}>{e.date}</span>
          </div>
          <div style={{ fontSize: 11, color: colors.textDim }}>{e.from_address} → {e.to_address}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <StatusBadge status={e.classification} />
            <StatusBadge status={e.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MeetingsTab({ meetings }) {
  return (
    <div>
      {(meetings || []).map(m => (
        <div key={m.id} style={card({ padding: 14, marginBottom: 8 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{m.title}</span>
            <StatusBadge status={m.status} />
          </div>
          <div style={{ fontSize: 11, color: colors.textDim }}>{m.date} {m.time} · {m.duration_minutes}min</div>
          {m.summary && <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6, lineHeight: 1.5 }}>{m.summary}</div>}
        </div>
      ))}
    </div>
  );
}
