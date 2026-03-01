import { callClaude } from '../services/claude.service.js';
import { buildContext } from '../services/context.service.js';

export async function chat(req, res) {
  const { messages } = req.body;
  if (!messages || !messages.length) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const systemPrompt = buildContext('chat');
  const response = await callClaude(messages, systemPrompt);
  res.json({ response });
}

export async function generateReport(req, res) {
  const { type } = req.body; // weekly, monthly, project, employee
  const systemPrompt = buildContext('report');

  const prompts = {
    weekly: 'Generate a comprehensive weekly activity report for the Marketing department covering the past 7 days. Include: Executive Summary, Project Status Updates, Key Deliverables Progress, Email Activity Summary, Meeting Highlights, Risk Flags, and Recommendations. Use data from the context provided.',
    monthly: 'Generate a monthly performance report for the Marketing department. Include: Department Overview, Per-Employee Performance Analysis, Project Progress Summary, KPI Dashboard, Budget Utilization, Key Achievements, Areas of Concern, and Strategic Recommendations.',
    project: 'Generate a cross-project status report. For each active project, provide: Health Assessment, Progress vs Timeline, Key Milestones, Deliverable Status, Team Performance, Risks & Blockers, and Next Steps.',
    employee: 'Generate a team performance summary. For each employee, provide: Current Workload, Project Contributions, KPI Performance, Recent Activity Highlights, Strengths Demonstrated, and Development Areas.',
  };

  const prompt = prompts[type] || prompts.weekly;
  const messages = [{ role: 'user', content: prompt }];
  const response = await callClaude(messages, systemPrompt, 3000);
  res.json({ response, type });
}

export async function evaluate(req, res) {
  const { employeeId } = req.body;
  if (!employeeId) return res.status(400).json({ error: 'employeeId is required' });

  const systemPrompt = buildContext('evaluation', { employeeId });
  const messages = [{
    role: 'user',
    content: `Generate a comprehensive performance evaluation for this employee. Include: Executive Summary, Key Strengths (with evidence from projects, deliverables, emails, and KPIs), Areas for Improvement, Key Achievements This Quarter, Goals for Next Quarter, and Overall Assessment with a rating. Be specific and reference actual data from the context.`
  }];

  const response = await callClaude(messages, systemPrompt, 2500);
  res.json({ response });
}

export async function getInsights(req, res) {
  const { type, id } = req.body; // type: project | employee | department

  const systemPrompt = buildContext('insights', { type, id });

  const prompts = {
    project: 'Analyze this project and provide actionable insights: Current health assessment with reasoning, potential risks and bottlenecks, team utilization and balance, timeline feasibility, and 3-5 specific recommendations for improvement.',
    employee: 'Analyze this employee\'s performance and provide insights: Workload assessment, project contribution quality, collaboration patterns from emails and meetings, KPI trajectory, and specific recommendations for growth and development.',
    department: 'Analyze the department\'s overall performance and provide strategic insights: Resource allocation efficiency, project portfolio health, team dynamics, risk areas, and top 5 strategic recommendations.',
  };

  const prompt = prompts[type] || prompts.department;
  const messages = [{ role: 'user', content: prompt }];
  const response = await callClaude(messages, systemPrompt, 2000);
  res.json({ response, type });
}

export async function getRisks(req, res) {
  const systemPrompt = buildContext('risks');
  const messages = [{
    role: 'user',
    content: 'Identify and analyze all current risks, delays, and potential issues across the department. For each risk: describe the issue, assess severity (critical/high/medium/low), identify affected projects and people, estimate impact, and recommend mitigation actions. Also identify any emerging patterns or early warning signs.'
  }];

  const response = await callClaude(messages, systemPrompt, 2500);
  res.json({ response });
}
