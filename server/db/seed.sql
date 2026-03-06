-- Employee X Seed Data — Innovation Lab (Minimal)
-- 3 employees, 3 placeholder projects, zero emails/meetings/deliverables (all from live Gmail)

-- Department
INSERT INTO department (name, name_ar, director, employee_x_email, color, description)
VALUES ('Innovation Lab', 'مختبر الابتكار', 'Abdullah Bin Askar', 'abdullahonlinebot@gmail.com', '#0EA5E9',
        'AI-driven innovation lab focused on platform redesign, AI integration, and client solutions.');

-- Employees
INSERT INTO employees (name, role, email, status, skills, capacity, join_date)
VALUES
  ('Abdullah Bin Askar', 'Director & Lead Engineer', 'abdullahonlinebot@gmail.com', 'active',
   '["AI/ML", "System Architecture", "Project Management", "Full-Stack Development"]', 100, '2024-01-15'),
  ('Raghad', 'UI/UX Designer', 'raghad@innovationlab.com', 'active',
   '["UI Design", "UX Research", "Figma", "Prototyping"]', 100, '2024-06-01'),
  ('Lama', 'Backend Developer', 'lama@innovationlab.com', 'active',
   '["Node.js", "Python", "Database Design", "API Development"]', 100, '2024-08-01');

-- Projects
INSERT INTO projects (name, description, status, health, priority, progress, start_date, target_date, budget, tags)
VALUES
  ('Platform Redesign', 'Complete redesign of the main platform UI/UX with modern component library', 'active', 'green', 'high', 25,
   '2026-02-01', '2026-06-30', 'SAR 150,000', '["design", "frontend", "ux"]'),
  ('AI Integration', 'Integrate Claude AI assistant capabilities across all platform modules', 'active', 'green', 'critical', 40,
   '2026-01-15', '2026-05-31', 'SAR 200,000', '["ai", "backend", "integration"]'),
  ('Client Portal', 'Build a self-service client portal with dashboards and reporting', 'planning', 'yellow', 'medium', 5,
   '2026-03-01', '2026-08-31', 'SAR 120,000', '["portal", "client", "dashboard"]');

-- Project Members
INSERT INTO project_members (project_id, employee_id, role) VALUES
  (1, 1, 'lead'), (1, 2, 'member'),
  (2, 1, 'lead'), (2, 3, 'member'),
  (3, 1, 'lead'), (3, 2, 'member'), (3, 3, 'member');

-- Milestones
INSERT INTO milestones (project_id, title, due_date, status) VALUES
  (1, 'Design System Complete', '2026-03-31', 'in_progress'),
  (1, 'Component Library v1', '2026-04-30', 'pending'),
  (1, 'Platform Launch', '2026-06-30', 'pending'),
  (2, 'AI Chat Module Live', '2026-03-15', 'completed'),
  (2, 'AI Report Generation', '2026-04-15', 'in_progress'),
  (2, 'Full AI Integration', '2026-05-31', 'pending'),
  (3, 'Portal Requirements', '2026-03-31', 'in_progress'),
  (3, 'Portal MVP', '2026-06-30', 'pending'),
  (3, 'Portal Launch', '2026-08-31', 'pending');

-- KPIs
INSERT INTO kpis (employee_id, metric_name, target_value, current_value, unit, period, status) VALUES
  (1, 'Projects Delivered', 3, 1, 'projects', 'Q1 2026', 'on_track'),
  (1, 'Team Velocity', 85, 78, '%', 'Q1 2026', 'on_track'),
  (2, 'Design Deliverables', 12, 5, 'screens', 'Q1 2026', 'on_track'),
  (2, 'User Testing Sessions', 4, 1, 'sessions', 'Q1 2026', 'at_risk'),
  (3, 'API Endpoints Delivered', 20, 12, 'endpoints', 'Q1 2026', 'on_track'),
  (3, 'Code Coverage', 80, 72, '%', 'Q1 2026', 'at_risk');
