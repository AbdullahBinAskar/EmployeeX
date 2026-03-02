const BASE_URL = '/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }
  return response.json();
}

const api = {
  // Dashboard
  dashboard: () => request('/dashboard'),

  // Department
  getDepartment: () => request('/department'),
  updateDepartment: (data) => request('/department', { method: 'PUT', body: data }),

  // Employees
  getEmployees: () => request('/employees'),
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (data) => request('/employees', { method: 'POST', body: data }),
  updateEmployee: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: data }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
  getEmployeeActivity: (id) => request(`/employees/${id}/activity`),

  // Projects
  getProjects: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/projects${qs}`);
  },
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) => request('/projects', { method: 'POST', body: data }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: data }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  updateProjectMembers: (id, members) => request(`/projects/${id}/members`, { method: 'PUT', body: { members } }),
  createMilestone: (projectId, data) => request(`/projects/${projectId}/milestones`, { method: 'POST', body: data }),
  updateMilestone: (projectId, mid, data) => request(`/projects/${projectId}/milestones/${mid}`, { method: 'PUT', body: data }),
  deleteMilestone: (projectId, mid) => request(`/projects/${projectId}/milestones/${mid}`, { method: 'DELETE' }),

  // Deliverables
  getDeliverables: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/deliverables${qs}`);
  },
  getDeliverable: (id) => request(`/deliverables/${id}`),
  createDeliverable: (data) => request('/deliverables', { method: 'POST', body: data }),
  updateDeliverable: (id, data) => request(`/deliverables/${id}`, { method: 'PUT', body: data }),
  deleteDeliverable: (id) => request(`/deliverables/${id}`, { method: 'DELETE' }),

  // Emails
  getEmails: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/emails${qs}`);
  },
  getEmail: (id) => request(`/emails/${id}`),
  createEmail: (data) => request('/emails', { method: 'POST', body: data }),
  updateEmail: (id, data) => request(`/emails/${id}`, { method: 'PUT', body: data }),

  // Meetings
  getMeetings: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/meetings${qs}`);
  },
  getMeeting: (id) => request(`/meetings/${id}`),
  createMeeting: (data) => request('/meetings', { method: 'POST', body: data }),
  updateMeeting: (id, data) => request(`/meetings/${id}`, { method: 'PUT', body: data }),

  // KPIs
  getKpis: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/kpis${qs}`);
  },
  createKpi: (data) => request('/kpis', { method: 'POST', body: data }),
  updateKpi: (id, data) => request(`/kpis/${id}`, { method: 'PUT', body: data }),
  deleteKpi: (id) => request(`/kpis/${id}`, { method: 'DELETE' }),

  // AI
  chat: (messages) => request('/ai/chat', { method: 'POST', body: { messages } }),
  report: (type) => request('/ai/report', { method: 'POST', body: { type } }),
  evaluate: (employeeId) => request('/ai/evaluate', { method: 'POST', body: { employeeId } }),
  insights: (type, id) => request('/ai/insights', { method: 'POST', body: { type, id } }),
  risks: () => request('/ai/risks', { method: 'POST', body: {} }),
};

export default api;
