export const colors = {
  bg: '#060A12',
  bgCard: '#0B1120',
  bgHover: '#111827',
  bgInput: '#0F172A',
  border: '#1E293B',
  borderLight: '#334155',

  text: '#E2E8F0',
  textMuted: '#94A3B8',
  textDim: '#64748B',

  blue: '#0EA5E9',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  red: '#EF4444',
  green: '#10B981',
  cyan: '#06B6D4',
  pink: '#EC4899',

  // Status-specific
  healthGreen: '#10B981',
  healthYellow: '#F59E0B',
  healthRed: '#EF4444',

  // Priority
  priorityCritical: '#EF4444',
  priorityHigh: '#F59E0B',
  priorityMedium: '#0EA5E9',
  priorityLow: '#64748B',
};

export const statusColors = {
  // Project status
  active: colors.green,
  planning: colors.blue,
  on_hold: colors.orange,
  completed: colors.purple,
  cancelled: colors.textDim,

  // Deliverable status
  not_started: colors.textDim,
  in_progress: colors.blue,
  in_review: colors.purple,
  blocked: colors.red,
  overdue: colors.red,

  // Meeting status
  scheduled: colors.blue,
  // completed already defined

  // Email status
  unread: colors.orange,
  read: colors.textDim,
  replied: colors.green,
  flagged: colors.red,

  // Email classification
  action_required: colors.red,
  fyi: colors.textDim,
  escalation: colors.orange,
  update: colors.blue,
  request: colors.purple,
  general: colors.textDim,

  // KPI status
  on_track: colors.green,
  at_risk: colors.orange,
  behind: colors.red,
  exceeded: colors.cyan,
  met: colors.green,

  // Employee status
  absent: colors.red,
  on_leave: colors.orange,
  inactive: colors.textDim,
};

export const healthColors = {
  green: colors.healthGreen,
  yellow: colors.healthYellow,
  red: colors.healthRed,
};

export const priorityColors = {
  critical: colors.priorityCritical,
  high: colors.priorityHigh,
  medium: colors.priorityMedium,
  low: colors.priorityLow,
};
