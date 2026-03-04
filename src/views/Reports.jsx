import { useState } from 'react';
import { useAI } from '../hooks/useAI.js';
import { Loader } from '../components/Shared.jsx';
import Markdown from '../components/Markdown.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { colors } from '../theme.js';
import { card } from '../styles.js';
import { BarChart3, TrendingUp, FolderKanban, Users } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'weekly', label: 'Weekly Activity', Icon: BarChart3, description: 'Project updates, email activity, meeting highlights, and risk flags for the past 7 days.' },
  { id: 'monthly', label: 'Monthly Performance', Icon: TrendingUp, description: 'Per-employee analysis, KPI dashboard, achievements, and strategic recommendations.' },
  { id: 'project', label: 'Cross-Project Status', Icon: FolderKanban, description: 'Health assessment, timeline adherence, deliverables, and blockers for each active project.' },
  { id: 'employee', label: 'Team Performance', Icon: Users, description: 'Workload distribution, KPI performance, and development areas for each team member.' },
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
      <PageHeader title="Reports" subtitle="AI-generated department intelligence reports" />

      {/* Report Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        {REPORT_TYPES.map(rt => (
          <button
            key={rt.id}
            onClick={() => !loading && generateReport(rt.id)}
            disabled={loading}
            style={{
              ...card(),
              padding: 16, cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left', color: 'inherit',
              background: selectedType === rt.id ? colors.blue + '15' : colors.bgCard,
              borderColor: selectedType === rt.id ? colors.blue : colors.border,
              opacity: loading && selectedType !== rt.id ? 0.5 : 1,
            }}
          >
            <rt.Icon size={24} color={selectedType === rt.id ? colors.blue : colors.textDim} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{rt.label}</div>
            <div style={{ fontSize: 11, color: colors.textDim, lineHeight: 1.5 }}>{rt.description}</div>
          </button>
        ))}
      </div>

      {/* Report Content */}
      {loading && <Loader text={`Generating ${REPORT_TYPES.find(r => r.id === selectedType)?.label || ''} report...`} />}

      {reportContent && (
        <div style={card({ padding: 24 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              {(() => { const rt = REPORT_TYPES.find(r => r.id === selectedType); return rt ? <rt.Icon size={18} /> : null; })()}
              {REPORT_TYPES.find(r => r.id === selectedType)?.label} Report
            </div>
            <div style={{ fontSize: 10, color: colors.textDim }}>Generated: {new Date().toLocaleString()}</div>
          </div>
          <div style={{
            fontSize: 13, color: colors.textMuted, lineHeight: 1.8,
            padding: 16, background: colors.bg, borderRadius: 10,
          }}>
            <Markdown text={reportContent} />
          </div>
        </div>
      )}
    </div>
  );
}
