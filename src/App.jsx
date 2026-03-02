import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./data/store";
import { colors } from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";
import { useMediaQuery } from "./hooks/useMediaQuery";
import Dashboard from "./views/Dashboard";
import Chat from "./views/Chat";
import Projects from "./views/Projects";
import ProjectDetail from "./views/ProjectDetail";
import People from "./views/People";
import EmployeeDetail from "./views/EmployeeDetail";
import Emails from "./views/Emails";
import Deliverables from "./views/Deliverables";
import Meetings from "./views/Meetings";
import Reports from "./views/Reports";
import Alerts from "./views/Alerts";
import Settings from "./views/Settings";
import { LayoutDashboard, MessageSquare, FolderKanban, Users, Mail, PackageCheck, CalendarDays, BarChart3, AlertTriangle, Settings2, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";

const NAV = [
  { id: "dashboard",  Icon: LayoutDashboard, label: "Dashboard" },
  { id: "chat",       Icon: MessageSquare,   label: "Ask Employee X" },
  { id: "projects",   Icon: FolderKanban,    label: "Projects", children: [
    { id: "projects",     Icon: LayoutDashboard, label: "Dashboard" },
    { id: "deliverables", Icon: PackageCheck,    label: "Deliverables" },
    { id: "alerts",       Icon: AlertTriangle,   label: "Alerts & Risks" },
  ]},
  { id: "people",    Icon: Users,        label: "People", children: [
    { id: "people",    Icon: LayoutDashboard, label: "Dashboard" },
    { id: "emails",    Icon: Mail,            label: "Emails" },
    { id: "meetings",  Icon: CalendarDays,    label: "Meetings" },
  ]},
  { id: "reports",   Icon: BarChart3,   label: "Reports" },
  { id: "settings",  Icon: Settings2,   label: "Settings" },
];

const GROUP_MEMBER_IDS = {
  projects: ['projects', 'deliverables', 'alerts', 'projectDetail'],
  people:   ['people', 'emails', 'meetings', 'employeeDetail'],
};

function AppContent() {
  const { view, detailId, navigate, sidebarOpen, setSidebarOpen, theme, toggleTheme } = useStore();
  const { isMobile } = useMediaQuery();

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard />;
      case 'chat': return <Chat />;
      case 'projects': return <Projects />;
      case 'projectDetail': return <ProjectDetail projectId={detailId} />;
      case 'people': return <People />;
      case 'employeeDetail': return <EmployeeDetail employeeId={detailId} />;
      case 'emails': return <Emails />;
      case 'deliverables': return <Deliverables />;
      case 'meetings': return <Meetings />;
      case 'reports': return <Reports />;
      case 'alerts': return <Alerts />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const activeNav = view;

  // Determine which group the current view belongs to (if any)
  const activeGroupId = Object.entries(GROUP_MEMBER_IDS).find(([, ids]) => ids.includes(view))?.[0] || null;

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const init = {};
    if (activeGroupId) init[activeGroupId] = true;
    return init;
  });

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Auto-expand when navigating into a group
  useEffect(() => {
    if (activeGroupId) setExpandedGroups(prev => ({ ...prev, [activeGroupId]: true }));
  }, [activeGroupId]);

  const handleNavClick = (id) => {
    navigate(id);
    if (isMobile) setSidebarOpen(false);
  };

  // On mobile, sidebar is an overlay drawer
  const showSidebar = isMobile ? sidebarOpen : true;
  const sidebarWidth = isMobile ? 260 : sidebarOpen ? 220 : 56;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", color: colors.text, background: colors.bg }}>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 48, zIndex: 40,
          background: colors.sidebar, borderBottom: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
            style={{ background: 'none', border: 'none', color: colors.text, cursor: 'pointer', padding: 4 }}
          >
            <Menu size={22} />
          </button>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0,
          }}>X</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>Employee X</span>
        </div>
      )}

      {/* Overlay backdrop (mobile) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49 }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <aside style={{
          width: sidebarWidth,
          transition: isMobile ? "transform 0.25s ease" : "width 0.2s",
          background: colors.sidebar,
          borderRight: `1px solid ${colors.border}`,
          display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0,
          ...(isMobile ? { position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 } : {}),
        }} role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <div
            onClick={() => !isMobile && setSidebarOpen(!sidebarOpen)}
            style={{
              padding: (isMobile || sidebarOpen) ? "20px 18px 16px" : "20px 12px 16px", cursor: isMobile ? 'default' : 'pointer',
              display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${colors.border}`,
            }}
            role={isMobile ? undefined : "button"}
            tabIndex={isMobile ? undefined : 0}
            aria-label={isMobile ? undefined : (sidebarOpen ? "Collapse sidebar" : "Expand sidebar")}
            onKeyDown={e => { if (!isMobile && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setSidebarOpen(!sidebarOpen); } }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: "#fff", flexShrink: 0,
            }}>X</div>
            {(isMobile || sidebarOpen) && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, letterSpacing: -0.3 }}>Employee X</div>
                <div style={{ fontSize: 9, color: colors.textDim, letterSpacing: 1.2, textTransform: "uppercase" }}>AI Admin Assistant</div>
              </div>
            )}
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', padding: 4 }} aria-label="Close navigation">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Nav Items */}
          <nav style={{ flex: 1, padding: "8px 6px", overflowY: "auto" }}>
            {NAV.map(item => {
              const sideExpanded = isMobile || sidebarOpen;

              // Grouped nav item (has children)
              if (item.children) {
                const groupActive = activeGroupId === item.id;
                const isExpanded = !!expandedGroups[item.id];
                return (
                  <div key={item.id + "-group"}>
                    {/* Group header */}
                    <button
                      onClick={() => {
                        if (sideExpanded) {
                          toggleGroup(item.id);
                        } else {
                          handleNavClick(item.id);
                        }
                      }}
                      title={!sideExpanded ? item.label : undefined}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: sideExpanded ? "9px 12px" : "9px 0",
                        justifyContent: sideExpanded ? "flex-start" : "center",
                        borderRadius: 8, cursor: "pointer", marginBottom: 2,
                        background: groupActive && !sideExpanded ? colors.blue + "15" : "transparent",
                        color: groupActive ? colors.blue : colors.textDim,
                        fontWeight: groupActive ? 700 : 500, fontSize: 13,
                        transition: "background 0.15s",
                        border: "none", textAlign: "left",
                      }}
                      onMouseEnter={e => { if (!groupActive || sideExpanded) e.currentTarget.style.background = colors.bgHover; }}
                      onMouseLeave={e => { e.currentTarget.style.background = groupActive && !sideExpanded ? colors.blue + "15" : "transparent"; }}
                    >
                      <item.Icon size={16} style={{ flexShrink: 0 }} />
                      {sideExpanded && (
                        <>
                          <span style={{ flex: 1 }}>{item.label}</span>
                          <ChevronDown
                            size={14}
                            style={{
                              flexShrink: 0,
                              transition: "transform 0.2s",
                              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                              opacity: 0.5,
                            }}
                          />
                        </>
                      )}
                    </button>
                    {/* Children */}
                    {sideExpanded && isExpanded && item.children.map(child => {
                      const childActive = activeNav === child.id;
                      return (
                        <button
                          key={child.id + "-child"}
                          onClick={() => handleNavClick(child.id)}
                          aria-current={childActive ? "page" : undefined}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%",
                            padding: "7px 12px 7px 36px",
                            borderRadius: 8, cursor: "pointer", marginBottom: 1,
                            background: childActive ? colors.blue + "15" : "transparent",
                            color: childActive ? colors.blue : colors.textDim,
                            fontWeight: childActive ? 700 : 500, fontSize: 12,
                            transition: "background 0.15s",
                            border: "none", textAlign: "left",
                          }}
                          onMouseEnter={e => { if (!childActive) e.currentTarget.style.background = colors.bgHover; }}
                          onMouseLeave={e => { if (!childActive) e.currentTarget.style.background = childActive ? colors.blue + "15" : "transparent"; }}
                        >
                          <child.Icon size={14} style={{ flexShrink: 0 }} />
                          <span>{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }

              // Simple nav item (no children)
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={active ? "page" : undefined}
                  title={!sideExpanded ? item.label : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: sideExpanded ? "9px 12px" : "9px 0",
                    justifyContent: sideExpanded ? "flex-start" : "center",
                    borderRadius: 8, cursor: "pointer", marginBottom: 2,
                    background: active ? colors.blue + "15" : "transparent",
                    color: active ? colors.blue : colors.textDim,
                    fontWeight: active ? 700 : 500, fontSize: 13,
                    transition: "background 0.15s",
                    border: "none", textAlign: "left",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.bgHover; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? colors.blue + "15" : "transparent"; }}
                >
                  <item.Icon size={16} style={{ flexShrink: 0 }} />
                  {sideExpanded && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle + Status */}
          <div style={{ padding: (isMobile || sidebarOpen) ? "12px 16px" : "12px 0", borderTop: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
              style={{
                background: colors.bgHover, border: `1px solid ${colors.border}`, borderRadius: 8,
                padding: (isMobile || sidebarOpen) ? '6px 12px' : '6px',
                cursor: 'pointer', color: colors.textMuted, display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 500, transition: 'background 0.15s',
                width: (isMobile || sidebarOpen) ? 'auto' : undefined,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = colors.border; }}
              onMouseLeave={e => { e.currentTarget.style.background = colors.bgHover; }}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              {(isMobile || sidebarOpen) && (theme === 'light' ? 'Dark mode' : 'Light mode')}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 10, color: colors.green }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green, boxShadow: `0 0 6px ${colors.green}60` }} aria-hidden="true" />
              {(isMobile || sidebarOpen) && "Live · Employee X"}
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main id="main-content" style={{
        flex: 1, overflow: "auto",
        padding: isMobile ? '60px 16px 16px' : 28,
      }}>
        <ErrorBoundary key={view}>
          {renderView()}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
