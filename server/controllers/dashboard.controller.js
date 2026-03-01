import getDb from '../db/database.js';

export function getDashboard(req, res) {
  const db = getDb();

  // Department info
  const department = db.prepare('SELECT * FROM department LIMIT 1').get();

  // Employee stats
  const totalEmployees = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
  const activeEmployees = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status = 'active'").get().count;
  const absentEmployees = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status IN ('absent', 'on_leave')").get().count;

  // Project stats
  const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'active'").get().count;
  const projectsByHealth = db.prepare(`
    SELECT health, COUNT(*) as count FROM projects WHERE status IN ('active', 'planning')
    GROUP BY health
  `).all();

  // Project summaries for dashboard
  const projects = db.prepare(`
    SELECT id, name, status, health, priority, progress, target_date
    FROM projects WHERE status IN ('active', 'planning')
    ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END
  `).all();

  // Deliverable stats
  const totalDeliverables = db.prepare('SELECT COUNT(*) as count FROM deliverables').get().count;
  const completedDeliverables = db.prepare("SELECT COUNT(*) as count FROM deliverables WHERE status = 'completed'").get().count;
  const overdueDeliverables = db.prepare("SELECT COUNT(*) as count FROM deliverables WHERE status IN ('overdue', 'blocked')").get().count;
  const upcomingDeliverables = db.prepare(`
    SELECT COUNT(*) as count FROM deliverables
    WHERE due_date <= date('now', '+7 days') AND status NOT IN ('completed')
  `).get().count;

  // Email stats
  const totalEmails = db.prepare('SELECT COUNT(*) as count FROM emails').get().count;
  const unreadEmails = db.prepare("SELECT COUNT(*) as count FROM emails WHERE status = 'unread'").get().count;
  const flaggedEmails = db.prepare("SELECT COUNT(*) as count FROM emails WHERE status = 'flagged'").get().count;
  const actionRequired = db.prepare("SELECT COUNT(*) as count FROM emails WHERE classification = 'action_required'").get().count;

  // Meeting stats
  const upcomingMeetings = db.prepare("SELECT COUNT(*) as count FROM meetings WHERE status = 'scheduled'").get().count;
  const nextMeeting = db.prepare("SELECT * FROM meetings WHERE status = 'scheduled' ORDER BY date, time LIMIT 1").get();
  if (nextMeeting) {
    nextMeeting.decisions = JSON.parse(nextMeeting.decisions || '[]');
    nextMeeting.action_items = JSON.parse(nextMeeting.action_items || '[]');
  }

  // KPI overview
  const kpisBehind = db.prepare("SELECT COUNT(*) as count FROM kpis WHERE status = 'behind'").get().count;
  const kpisAtRisk = db.prepare("SELECT COUNT(*) as count FROM kpis WHERE status = 'at_risk'").get().count;
  const kpisExceeded = db.prepare("SELECT COUNT(*) as count FROM kpis WHERE status = 'exceeded'").get().count;

  // Recent alerts (deliverables overdue or blocked, flagged emails, at-risk KPIs)
  const alerts = [];

  // Blocked/overdue deliverables
  const blockedDeliverables = db.prepare(`
    SELECT d.title, d.status, d.due_date, d.delay_days, p.name as project_name, e.name as assignee_name
    FROM deliverables d
    JOIN projects p ON p.id = d.project_id
    LEFT JOIN employees e ON e.id = d.assignee_id
    WHERE d.status IN ('blocked', 'overdue') OR (d.due_date < date('now') AND d.status NOT IN ('completed'))
  `).all();
  blockedDeliverables.forEach(d => {
    alerts.push({
      type: 'deliverable',
      severity: d.status === 'blocked' ? 'critical' : 'warning',
      title: `${d.title} — ${d.status}`,
      detail: `Project: ${d.project_name}. Assigned to: ${d.assignee_name || 'Unassigned'}. Due: ${d.due_date}${d.delay_days ? ` (${d.delay_days} days delayed)` : ''}`,
    });
  });

  // Flagged/urgent emails
  const urgentEmails = db.prepare(`
    SELECT subject, from_address, priority, classification, date
    FROM emails WHERE status = 'flagged' OR priority = 'urgent'
    ORDER BY date DESC LIMIT 5
  `).all();
  urgentEmails.forEach(e => {
    alerts.push({
      type: 'email',
      severity: e.priority === 'urgent' ? 'critical' : 'warning',
      title: e.subject,
      detail: `From: ${e.from_address}. ${e.classification}. ${e.date}`,
    });
  });

  // Absent employees with blocked work
  const absentWithWork = db.prepare(`
    SELECT e.name, COUNT(d.id) as blocked_items FROM employees e
    JOIN deliverables d ON d.assignee_id = e.id AND d.status IN ('blocked', 'in_progress')
    WHERE e.status IN ('absent', 'on_leave')
    GROUP BY e.id
  `).all();
  absentWithWork.forEach(e => {
    alerts.push({
      type: 'absence',
      severity: 'warning',
      title: `${e.name} is absent with ${e.blocked_items} active deliverables`,
      detail: 'Coverage may be needed for assigned items.',
    });
  });

  // KPIs behind
  const behindKpis = db.prepare(`
    SELECT k.metric_name, k.current_value, k.target_value, k.unit, e.name as employee_name
    FROM kpis k JOIN employees e ON e.id = k.employee_id
    WHERE k.status = 'behind'
  `).all();
  behindKpis.forEach(k => {
    alerts.push({
      type: 'kpi',
      severity: 'warning',
      title: `${k.metric_name} behind target`,
      detail: `${k.employee_name}: ${k.current_value}${k.unit} / ${k.target_value}${k.unit} target`,
    });
  });

  // Sort alerts by severity
  alerts.sort((a, b) => (a.severity === 'critical' ? -1 : 1) - (b.severity === 'critical' ? -1 : 1));

  res.json({
    department,
    stats: {
      employees: { total: totalEmployees, active: activeEmployees, absent: absentEmployees },
      projects: { total: totalProjects, active: activeProjects, byHealth: projectsByHealth },
      deliverables: { total: totalDeliverables, completed: completedDeliverables, overdue: overdueDeliverables, upcoming: upcomingDeliverables },
      emails: { total: totalEmails, unread: unreadEmails, flagged: flaggedEmails, action_required: actionRequired },
      meetings: { upcoming: upcomingMeetings, next: nextMeeting },
      kpis: { behind: kpisBehind, at_risk: kpisAtRisk, exceeded: kpisExceeded },
    },
    projects,
    alerts,
  });
}
