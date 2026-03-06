import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import departmentRoutes from './routes/department.routes.js';
import employeesRoutes from './routes/employees.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import deliverablesRoutes from './routes/deliverables.routes.js';
import emailsRoutes from './routes/emails.routes.js';
import meetingsRoutes from './routes/meetings.routes.js';
import kpisRoutes from './routes/kpis.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { startEmailListener, stopEmailListener } from './services/email-listener.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/department', departmentRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/deliverables', deliverablesRoutes);
app.use('/api/emails', emailsRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/kpis', kpisRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve built frontend in production
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('{*path}', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  app.use(notFound);
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Employee X server running on http://localhost:${PORT}`);

  // Start Gmail IMAP listener
  if (process.env.EMAIL_POLL_ENABLED !== 'false') {
    startEmailListener();
  }
});

// Graceful shutdown
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    console.log(`\n${signal} received — shutting down...`);
    await stopEmailListener();
    process.exit(0);
  });
}
