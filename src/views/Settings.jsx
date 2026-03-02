import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Loader, ErrorMsg } from '../components/Shared.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TabNav from '../components/TabNav.jsx';
import Avatar from '../components/Avatar.jsx';
import { colors } from '../theme.js';
import { card, btn, btnPrimary, input as inputStyle } from '../styles.js';
import FormField from '../components/FormField.jsx';
import { cacheInvalidateMany } from '../hooks/useCache.js';
import api from '../api/client.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { Building2, Users, FolderKanban, BarChart3, ShieldOff } from 'lucide-react';

const sections = [
  { id: 'department', label: 'Department', Icon: Building2 },
  { id: 'employees', label: 'Employees', Icon: Users },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'kpis', label: 'KPIs', Icon: BarChart3 },
];

export default function Settings() {
  const { isAdmin } = useStore();
  const [section, setSection] = useState('department');

  const tabs = sections.map(s => ({ id: s.id, label: s.label }));

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12, color: colors.textDim }}>
        <ShieldOff size={40} />
        <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>Not Authorized</div>
        <div style={{ fontSize: 13 }}>Enable admin mode to access settings.</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <TabNav tabs={tabs} active={section} onChange={setSection} />

      <div role="tabpanel" id={`tabpanel-${section}`}>
        {section === 'department' && <DepartmentSection />}
        {section === 'employees' && <EmployeesSection />}
        {section === 'projects' && <ProjectsSection />}
        {section === 'kpis' && <KpisSection />}
      </div>
    </div>
  );
}

function DepartmentSection() {
  const { data, loading, error, refetch } = useApi(() => api.getDepartment(), []);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  if (loading) return <Loader text="Loading department..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const dept = data;

  const startEdit = () => {
    setForm({ ...dept });
    setEditing(true);
  };

  const save = async () => {
    await api.updateDepartment(form);
    setEditing(false);
    cacheInvalidateMany(['dashboard']);
    refetch();
  };

  return (
    <div style={card({ padding: 20 })}>
      {!editing ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{dept.name}</div>
            <button onClick={startEdit} style={btn()}>Edit</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
            <Field label="Director" value={dept.director} />
            <Field label="Employee X Email" value={dept.employee_x_email} />
            <Field label="Arabic Name" value={dept.name_ar} />
            <Field label="Color" value={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: dept.color }} />{dept.color}</span>} />
            <Field label="Description" value={dept.description} style={{ gridColumn: 'span 2' }} />
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Edit Department</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <InputField label="Arabic Name" value={form.name_ar} onChange={v => setForm({ ...form, name_ar: v })} />
            <InputField label="Director" value={form.director} onChange={v => setForm({ ...form, director: v })} />
            <InputField label="Employee X Email" value={form.employee_x_email} onChange={v => setForm({ ...form, employee_x_email: v })} />
            <InputField label="Color" value={form.color} onChange={v => setForm({ ...form, color: v })} />
            <InputField label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={save} style={btnPrimary}>Save</button>
            <button onClick={() => setEditing(false)} style={btn()}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmployeesSection() {
  const { data, loading, error, refetch } = useApi(() => api.getEmployees(), []);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const { isMobile } = useMediaQuery();

  if (loading) return <Loader text="Loading employees..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const employees = data || [];

  const startAdd = () => {
    setForm({ name: '', role: '', email: '', status: 'active', skills: '', capacity: 100, join_date: '' });
    setAdding(true);
    setEditId(null);
  };

  const startEdit = (emp) => {
    setForm({ ...emp, skills: (emp.skills || []).join(', ') });
    setEditId(emp.id);
    setAdding(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = 'Name is required';
    if (!form.role?.trim()) errs.role = 'Role is required';
    if (!form.email?.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
    if (editId) {
      await api.updateEmployee(editId, payload);
    } else {
      await api.createEmployee(payload);
    }
    setAdding(false);
    setEditId(null);
    setErrors({});
    cacheInvalidateMany(['employees', 'dashboard']);
    refetch();
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    await api.deleteEmployee(id);
    cacheInvalidateMany(['employees', 'dashboard']);
    refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: colors.textDim }}>{employees.length} employees</span>
        <button onClick={startAdd} style={btnPrimary}>+ Add Employee</button>
      </div>

      {(adding || editId) && (
        <div style={card({ padding: 16, marginBottom: 16 })}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 12 }}>{editId ? 'Edit' : 'Add'} Employee</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
            <FormField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required error={errors.name} />
            <FormField label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} required error={errors.role} />
            <FormField label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" required error={errors.email} />
            <FormField label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} type="select" options={['active', 'absent', 'on_leave', 'inactive']} />
            <FormField label="Skills (comma-separated)" value={form.skills} onChange={v => setForm({ ...form, skills: v })} />
            <FormField label="Capacity %" value={form.capacity} onChange={v => setForm({ ...form, capacity: parseInt(v) || 0 })} type="number" />
            <FormField label="Join Date" value={form.join_date} onChange={v => setForm({ ...form, join_date: v })} type="date" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={save} style={btnPrimary}>Save</button>
            <button onClick={() => { setAdding(false); setEditId(null); }} style={btn()}>Cancel</button>
          </div>
        </div>
      )}

      {employees.map(emp => (
        <div key={emp.id} style={{ ...card(), padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={emp.name} avatar={emp.avatar} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{emp.name}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>{emp.role} · {emp.email}</div>
          </div>
          <StatusBadge status={emp.status} />
          <button onClick={() => startEdit(emp)} style={btn()}>Edit</button>
          <button onClick={() => remove(emp.id)} style={btn({ color: colors.red, borderColor: colors.red + '40' })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection() {
  const { data, loading, error, refetch } = useApi(() => api.getProjects(), []);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});

  if (loading) return <Loader text="Loading projects..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const projects = data || [];

  const startAdd = () => {
    setForm({ name: '', description: '', status: 'planning', health: 'green', priority: 'medium', start_date: '', target_date: '', budget: '' });
    setAdding(true);
  };

  const save = async () => {
    await api.createProject(form);
    setAdding(false);
    cacheInvalidateMany(['projects', 'dashboard']);
    refetch();
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    await api.deleteProject(id);
    cacheInvalidateMany(['projects', 'dashboard']);
    refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: colors.textDim }}>{projects.length} projects</span>
        <button onClick={startAdd} style={btnPrimary}>+ Add Project</button>
      </div>

      {adding && (
        <div style={card({ padding: 16, marginBottom: 16 })}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Add Project</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InputField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <InputField label="Priority" value={form.priority} onChange={v => setForm({ ...form, priority: v })} />
            <InputField label="Start Date" value={form.start_date} onChange={v => setForm({ ...form, start_date: v })} />
            <InputField label="Target Date" value={form.target_date} onChange={v => setForm({ ...form, target_date: v })} />
            <InputField label="Budget" value={form.budget} onChange={v => setForm({ ...form, budget: v })} />
            <InputField label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={save} style={btnPrimary}>Create</button>
            <button onClick={() => setAdding(false)} style={btn()}>Cancel</button>
          </div>
        </div>
      )}

      {projects.map(p => (
        <div key={p.id} style={{ ...card(), padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{p.name}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>{p.status} · {p.priority} · {p.progress}%</div>
          </div>
          <StatusBadge status={p.status} />
          <button onClick={() => remove(p.id)} style={btn({ color: colors.red, borderColor: colors.red + '40' })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function KpisSection() {
  const { data, loading, error, refetch } = useApi(() => api.getKpis(), []);

  if (loading) return <Loader text="Loading KPIs..." />;
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;

  const kpis = data || [];

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this KPI?')) return;
    await api.deleteKpi(id);
    cacheInvalidateMany(['dashboard']);
    refetch();
  };

  return (
    <div>
      <span style={{ fontSize: 13, color: colors.textDim, display: 'block', marginBottom: 12 }}>{kpis.length} KPIs tracked</span>
      {kpis.map(k => (
        <div key={k.id} style={{ ...card(), padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{k.metric_name}</div>
            <div style={{ fontSize: 11, color: colors.textDim }}>
              {k.employee_name} · {k.current_value}{k.unit} / {k.target_value}{k.unit} · {k.period}
            </div>
          </div>
          <StatusBadge status={k.status} />
          <button onClick={() => remove(k.id)} style={btn({ color: colors.red, borderColor: colors.red + '40' })}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Helpers
function Field({ label, value, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: colors.text }}>{value || '—'}</div>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>{label}</label>
      <input
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}
