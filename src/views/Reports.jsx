import { useState } from 'react';
import { useAI } from '../hooks/useAI.js';
import { Loader } from '../components/Shared.jsx';
import { colors } from '../theme.js';

const REPORT_TYPES = [
  { id: 'weekly', label: 'Weekly Activity', icon: '📊', description: 'Project updates, email activity, meeting highlights, and risk flags for the past 7 days.' },
  { id: 'monthly', label: 'Monthly Performance', icon: '📈', description: 'Per-employee analysis, KPI dashboard, achievements, and strategic recommendations.' },
  { id: 'project', label: 'Cross-Project Status', icon: '▣', description: 'Health assessment, timeline adherence, deliverables, and blockers for each active project.' },
  { id: 'employee', label: 'Team Performance', icon: '◆', description: 'Workload distribution, KPI performance, and development areas for each team member.' },
];

export default function Reports() {
  const [selectedType, setSelectedType] = useState(null);
  const [reportContent, setReportContent] = useState(null);
  const { report, loading } = useAI();

  const generateReport = async (type) => {
    setSelectedType(type);
    setReportContent(null);
    const result = await report(type);
    setReportContent(result);
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, margin: 0, marginBottom: 6 }}>Reports</h1>
      <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 24 }}>AI-generated department intelligence reports</div>

      {/* Report Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        {REPORT_TYPES.map(rt => (
          <div
            key={rt.id}
            onClick={() => !loading && generateReport(rt.id)}
            style={{
              background: selectedType === rt.id ? colors.blue + '15' : colors.bgCard,
              border: `1px solid ${selectedType === rt.id ? colors.blue : colors.border}`,
              borderRadius: 12, padding: 16, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading && selectedType !== rt.id ? 0.5 : 1,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{rt.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{rt.label}</div>
            <div style={{ fontSize: 11, color: colors.textDim, lineHeight: 1.5 }}>{rt.description}</div>
          </div>
        ))}
      </div>

      {/* Report Content */}
      {loading && <Loader text={`Generating ${REPORT_TYPES.find(r => r.id === selectedType)?.label || ''} report...`} />}

      {reportContent && (
        <div style={{
          background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
              {REPORT_TYPES.find(r => r.id === selectedType)?.icon} {REPORT_TYPES.find(r => r.id === selectedType)?.label} Report
            </div>
            <div style={{ fontSize: 10, color: colors.textDim }}>Generated: {new Date().toLocaleString()}</div>
          </div>
          <div style={{
            fontSize: 13, color: colors.textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap',
            padding: 16, background: colors.bg, borderRadius: 10,
          }}>
            {reportContent}
          </div>
        </div>
      )}
    </div>
  );
}
