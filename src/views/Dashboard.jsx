import { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useStore } from '../data/store.jsx';
import { Stat, ErrorMsg } from '../components/Shared.jsx';
import { SkeletonStats, SkeletonCard } from '../components/Skeleton.jsx';
import { StatusBadge, HealthDot, ProgressBar, PriorityBadge } from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { colors } from '../theme.js';
import { card } from '../styles.js';
import api from '../api/client.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { Users, FolderKanban, PackageCheck, Mail, CalendarDays, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi(() => api.dashboard(), [], { cacheKey: 'dashboard' });
  const { navigate } = useStore();
  const { isMobile } = useMediaQuery();
  const [gmailStatus, setGmailStatus] = useState(null);
  const intervalRef = useRef(null);

  // Auto-refresh every 30 seconds + fetch Gmail listener status
  useEffect(() => {
    function tick() {
      refetch();
      api.getListenerStatus().then(setGmailStatus).catch(() => setGmailStatus(null));
    }
    // Initial status fetch
    api.getListenerStatus().then(setGmailStatus).catch(() => setGmailStatus(null));
    intervalRef.current = setInterval(tick, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) return (
    <div style={{ padding: '0 4px' }}>
      <SkeletonStats count={6} />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginTop: 24 }}>
        <SkeletonCard height={300} />
        <SkeletonCard height={300} />
      </div>
    </div>
  );
  if (error) return <ErrorMsg message={error} onRetry={refetch} />;
  if (!data) return null;

  const { department, stats, projects, alerts } = data;
  const isGmailLive = gmailStatus?.connected;

  return (
    <div style={{ padding: '0 4px' }}>
      <PageHeader
        title="Department Pulse"
        subtitle={`${department?.name} — Director: ${department?.director} — ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {gmailStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: isGmailLive ? colors.green : colors.red }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: isGmailLive ? colors.green : colors.red, boxShadow: `0 0 6px ${(isGmailLive ? colors.green : colors.red)}60` }} aria-hidden="true" />
              {isGmailLive ? 'Gmail Live' : 'Gmail Offline'}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: colors.green }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.green, boxShadow: `0 0 6px ${colors.green}60` }} aria-hidden="true" />
            Live
          </div>
        </div>
      </PageHeader>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <Stat icon={<Users size={12} />} label="Team" value={`${stats.employees.active}/${stats.employees.total}`} sub={`${stats.employees.absent} absent`} color={colors.blue} />
        <Stat icon={<FolderKanban size={12} />} label="Projects" value={stats.projects.active} sub={`${stats.projects.total} total`} color={colors.purple} />
        <Stat icon={<PackageCheck size={12} />} label="Deliverables" value={`${stats.deliverables.completed}/${stats.deliverables.total}`} sub={`${stats.deliverables.overdue} at risk`} color={stats.deliverables.overdue > 0 ? colors.orange : colors.green} />
        <Stat icon={<Mail size={12} />} label="Emails" value={stats.emails.unread} sub={`${stats.emails.action_required} need action`} color={stats.emails.unread > 3 ? colors.orange : colors.blue} />
        <Stat icon={<CalendarDays size={12} />} label="Meetings" value={stats.meetings.upcoming} sub={stats.meetings.next ? `Next: ${stats.meetings.next.title}` : 'None scheduled'} color={colors.cyan} />
        <Stat icon={<BarChart3 size={12} />} label="KPIs" value={`${stats.kpis.exceeded} exceeded`} sub={`${stats.kpis.behind} behind · ${stats.kpis.at_risk} at risk`} color={stats.kpis.behind > 0 ? colors.orange : colors.green} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        {/* Project Health */}
        <div style={card({ padding: 18 })}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FolderKanban size={14} color={colors.purple} /> Project Health Overview
          </div>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => navigate('projectDetail', p.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', cursor: 'pointer', width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${colors.borderFaint}`, color: 'inherit', textAlign: 'left' }}
            >
              <HealthDot health={p.health} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: colors.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: colors.purple, background: colors.purple + '15', padding: '1px 5px', borderRadius: 4, marginRight: 6 }}>PRJ-{p.id}</span>
                  {p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <ProgressBar value={p.progress} height={4} />
                  <span style={{ fontSize: 10, color: colors.textDim, whiteSpace: 'nowrap' }}>{p.progress}%</span>
                </div>
              </div>
              <PriorityBadge priority={p.priority} />
            </button>
          ))}
        </div>

        {/* Alerts */}
        <div style={card({ padding: 18 })}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: colors.red }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </span> Alerts & Risks
            {alerts.length > 0 && <span style={{ fontSize: 10, background: colors.red + '20', color: colors.red, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{alerts.length}</span>}
          </div>
          {alerts.length === 0 && <div style={{ color: colors.textDim, fontSize: 13, padding: 20, textAlign: 'center' }}>All clear</div>}
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                padding: '10px 12px',
                marginBottom: 8,
                borderRadius: 8,
                borderLeft: `3px solid ${a.severity === 'critical' ? colors.red : colors.orange}`,
                background: (a.severity === 'critical' ? colors.red : colors.orange) + '08',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: a.severity === 'critical' ? colors.red : colors.orange, marginBottom: 3 }}>
                  {a.title}
                </div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
