import getDb from '../db/database.js';

export function buildContext(mode = 'chat', options = {}) {
  const db = getDb();

  const department = db.prepare('SELECT * FROM department LIMIT 1').get();
  const employees = db.prepare('SELECT * FROM employees ORDER BY id').all();
  const projects = db.prepare('SELECT * FROM projects ORDER BY id').all();

  let context = `You are Employee X — the AI-powered "Big Brother" of the ${department.name} department.
You are CCed on every email, attend every meeting virtually, and track every deliverable, deadline, and KPI.
You have perfect memory and can cross-reference any piece of information.
Today's date: ${new Date().toISOString().split('T')[0]}.
Director: ${department.director}.
Employee X Email: ${department.employee_x_email}.

DEPARTMENT: ${department.name} (${department.name_ar || ''})
${department.description || ''}

`;

  // Employees section
  context += '=== TEAM (${employees.length} members) ===\n';
  employees.forEach(e => {
    const skills = JSON.parse(e.skills || '[]');
    context += `- ${e.name} (ID:${e.id}) | ${e.role} | Status: ${e.status} | Capacity: ${e.capacity}% | Skills: ${skills.join(', ')} | Email: ${e.email}\n`;
  });
  context += '\n';

  // Projects section
  context += `=== PROJECTS (${projects.length}) ===\n`;
  projects.forEach(p => {
    const tags = JSON.parse(p.tags || '[]');
    const members = db.prepare(`
      SELECT e.name, pm.role FROM project_members pm
      JOIN employees e ON e.id = pm.employee_id WHERE pm.project_id = ?
    `).all(p.id);
    const deliverables = db.prepare('SELECT title, status, due_date, delay_days FROM deliverables WHERE project_id = ?').all(p.id);
    const milestones = db.prepare('SELECT title, status, due_date FROM milestones WHERE project_id = ?').all(p.id);

    context += `\nPROJECT: ${p.name} (ID:${p.id})
  Status: ${p.status} | Health: ${p.health} | Priority: ${p.priority} | Progress: ${p.progress}%
  Timeline: ${p.start_date} → ${p.target_date} | Budget: ${p.budget || 'N/A'}
  Team: ${members.map(m => `${m.name} (${m.role})`).join(', ')}
  Milestones: ${milestones.map(m => `${m.title} [${m.status}] due ${m.due_date}`).join('; ') || 'None'}
  Deliverables: ${deliverables.map(d => `${d.title} [${d.status}] due ${d.due_date}${d.delay_days ? ` (${d.delay_days}d delayed)` : ''}`).join('; ') || 'None'}
`;
  });

  // Mode-specific enrichment
  if (mode === 'chat' || mode === 'report' || mode === 'risks') {
    // Include emails
    const emails = db.prepare('SELECT * FROM emails ORDER BY date DESC').all();
    context += `\n=== EMAILS (${emails.length} total, all CCed to Employee X) ===\n`;
    emails.forEach(e => {
      context += `[${e.date}] ${e.classification}/${e.priority} | From: ${e.from_address} → To: ${e.to_address} | Subject: ${e.subject}\n  ${(e.body || '').slice(0, 200)}\n`;
    });

    // Include meetings
    const meetings = db.prepare('SELECT * FROM meetings ORDER BY date DESC').all();
    context += `\n=== MEETINGS (${meetings.length}) ===\n`;
    meetings.forEach(m => {
      const attendees = db.prepare(`
        SELECT e.name FROM employees e
        JOIN meeting_attendees ma ON ma.employee_id = e.id WHERE ma.meeting_id = ?
      `).all(m.id);
      const decisions = JSON.parse(m.decisions || '[]');
      const actions = JSON.parse(m.action_items || '[]');
      context += `[${m.date} ${m.time || ''}] ${m.title} | Status: ${m.status} | Project: ${m.project_id || 'General'}
  Attendees: ${attendees.map(a => a.name).join(', ')}
  ${m.summary ? `Summary: ${m.summary}` : ''}
  ${decisions.length ? `Decisions: ${decisions.join('; ')}` : ''}
  ${actions.length ? `Actions: ${actions.join('; ')}` : ''}
`;
    });

    // Include KPIs
    const kpis = db.prepare(`
      SELECT k.*, e.name as employee_name FROM kpis k
      JOIN employees e ON e.id = k.employee_id ORDER BY k.employee_id
    `).all();
    context += `\n=== KPIs ===\n`;
    kpis.forEach(k => {
      context += `${k.employee_name} | ${k.metric_name}: ${k.current_value}${k.unit} / ${k.target_value}${k.unit} target [${k.status}]\n`;
    });
  }

  if (mode === 'evaluation' && options.employeeId) {
    // Deep employee context
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(options.employeeId);
    if (emp) {
      const kpis = db.prepare('SELECT * FROM kpis WHERE employee_id = ?').all(options.employeeId);
      const deliverables = db.prepare(`
        SELECT d.*, p.name as project_name FROM deliverables d
        JOIN projects p ON p.id = d.project_id WHERE d.assignee_id = ?
      `).all(options.employeeId);
      const emails = db.prepare('SELECT * FROM emails WHERE employee_id = ? ORDER BY date DESC').all(options.employeeId);
      const meetings = db.prepare(`
        SELECT m.* FROM meetings m
        JOIN meeting_attendees ma ON ma.meeting_id = m.id
        WHERE ma.employee_id = ? ORDER BY m.date DESC
      `).all(options.employeeId);

      context += `\n=== FOCUS: ${emp.name} EVALUATION DATA ===\n`;
      context += `KPIs: ${kpis.map(k => `${k.metric_name}: ${k.current_value}${k.unit}/${k.target_value}${k.unit} [${k.status}]`).join('; ')}\n`;
      context += `Deliverables: ${deliverables.map(d => `${d.title} (${d.project_name}) [${d.status}]`).join('; ')}\n`;
      context += `Email Activity: ${emails.length} emails tracked\n`;
      context += `Meeting Participation: ${meetings.length} meetings\n`;
    }
  }

  if (mode === 'insights' && options.type === 'project' && options.id) {
    // Already covered in the main projects section with full detail
    context += `\nFOCUS ANALYSIS on Project ID: ${options.id}\n`;
  }

  if (mode === 'insights' && options.type === 'employee' && options.id) {
    context += `\nFOCUS ANALYSIS on Employee ID: ${options.id}\n`;
  }

  return context;
}
