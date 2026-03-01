import { StoreProvider, useStore } from "./data/store";
import { colors } from "./theme";
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

const NAV = [
  { id: "dashboard",    icon: "◉", label: "Dashboard" },
  { id: "chat",         icon: "◈", label: "Ask Employee X" },
  { id: "projects",     icon: "▣", label: "Projects" },
  { id: "people",       icon: "◆", label: "People" },
  { id: "emails",       icon: "◇", label: "Emails" },
  { id: "deliverables", icon: "⊕", label: "Deliverables" },
  { id: "meetings",     icon: "◎", label: "Meetings" },
  { id: "reports",      icon: "□", label: "Reports" },
  { id: "alerts",       icon: "△", label: "Alerts & Risks" },
  { id: "settings",     icon: "⚙", label: "Settings" },
];

function AppContent() {
  const { view, detailId, navigate, sidebarOpen, setSidebarOpen } = useStore();

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

  // Map detail views back to their parent nav item for highlighting
  const activeNav = view === 'projectDetail' ? 'projects' : view === 'employeeDetail' ? 'people' : view;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", color: colors.text, background: colors.bg }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 220 : 56, transition: "width 0.2s", background: "#080D18",
        borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0,
      }}>
        {/* Logo */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: sidebarOpen ? "20px 18px 16px" : "20px 12px 16px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#fff", flexShrink: 0,
          }}>X</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, letterSpacing: -0.3 }}>Employee X</div>
              <div style={{ fontSize: 9, color: colors.textDim, letterSpacing: 1.2, textTransform: "uppercase" }}>Big Brother</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: "8px 6px", overflowY: "auto" }}>
          {NAV.map(item => {
            const active = activeNav === item.id;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarOpen ? "9px 12px" : "9px 0",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 8, cursor: "pointer", marginBottom: 2,
                  background: active ? colors.blue + "15" : "transparent",
                  color: active ? colors.blue : colors.textDim,
                  fontWeight: active ? 700 : 500, fontSize: 13,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.bgHover; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            );
          })}
        </div>

        {/* Status */}
        <div style={{ padding: sidebarOpen ? "12px 16px" : "12px 0", borderTop: `1px solid ${colors.border}`, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 10, color: colors.green }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green, boxShadow: `0 0 6px ${colors.green}60` }} />
            {sidebarOpen && "Live · Employee X"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {renderView()}
      </div>
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
