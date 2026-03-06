import { callClaude } from './claude.service.js';
import getDb from '../db/database.js';

function getProjectsAndEmployees() {
  const db = getDb();
  const projects = db.prepare('SELECT id, name, description, status FROM projects').all();
  const employees = db.prepare('SELECT id, name, email, role FROM employees').all();
  return { projects, employees };
}

export async function analyzeEmail(emailData) {
  const { projects, employees } = getProjectsAndEmployees();

  const systemPrompt = `You are an AI email analyzer for the Innovation Lab team. Analyze incoming emails and return structured JSON.

Current Projects:
${projects.map(p => `- ID ${p.id}: "${p.name}" (${p.status}) — ${p.description || 'No description'}`).join('\n')}

Current Employees:
${employees.map(e => `- ID ${e.id}: ${e.name} <${e.email}> (${e.role})`).join('\n')}

Analyze the email and return ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "classification": "action_required" | "fyi" | "escalation" | "update" | "request" | "general",
  "priority": "urgent" | "high" | "normal" | "low",
  "project_id": <number or null — match to a project if relevant>,
  "employee_id": <number or null — match sender email to an employee>,
  "summary": "<1-2 sentence summary>",
  "actions": [
    {
      "type": "create_meeting" | "create_deliverable" | "update_deliverable" | "update_milestone" | "update_project_progress" | "flag_risk",
      "data": { <relevant fields for the action> }
    }
  ]
}

Action data schemas:
- create_meeting: { "title": "...", "date": "YYYY-MM-DD", "time": "HH:MM", "duration_minutes": N, "project_id": N, "summary": "..." }
- create_deliverable: { "title": "...", "project_id": N, "assignee_id": N, "priority": "...", "due_date": "YYYY-MM-DD", "description": "..." }
- update_deliverable: { "deliverable_id": N, "status": "...", "notes": "..." }
- update_milestone: { "milestone_id": N, "status": "...", "notes": "..." }
- update_project_progress: { "project_id": N, "progress": N, "health": "green"|"yellow"|"red" }
- flag_risk: { "project_id": N, "description": "..." }

Rules:
- Only create actions when the email clearly warrants them (meetings mentioned, tasks assigned, progress reported, risks identified).
- If no actions are warranted, return an empty actions array.
- Match sender email to employee_id when possible.
- If a [PRJ-N] tag is in the subject, use that project_id.
- Today's date is ${new Date().toISOString().split('T')[0]}.`;

  const userMessage = `From: ${emailData.from}
To: ${emailData.to}
Subject: ${emailData.subject}
Date: ${emailData.date}

${emailData.body}`;

  try {
    const response = await callClaude(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      2000
    );

    // Strip markdown code fences if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    const analysis = JSON.parse(cleaned);

    // Validate required fields with defaults
    return {
      classification: analysis.classification || 'general',
      priority: analysis.priority || 'normal',
      project_id: analysis.project_id || null,
      employee_id: analysis.employee_id || null,
      summary: analysis.summary || '',
      actions: Array.isArray(analysis.actions) ? analysis.actions : [],
    };
  } catch (err) {
    console.error('[EmailAnalyzer] Analysis failed:', err.message);
    return {
      classification: 'general',
      priority: 'normal',
      project_id: null,
      employee_id: null,
      summary: 'AI analysis failed — email stored as-is.',
      actions: [],
    };
  }
}
