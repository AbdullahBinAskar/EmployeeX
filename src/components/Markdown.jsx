import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { colors } from "../theme.js";

const markdownComponents = {
  h1: ({ children }) => <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, margin: '12px 0 4px' }}>{children}</div>,
  h2: ({ children }) => <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, margin: '12px 0 4px' }}>{children}</div>,
  h3: ({ children }) => <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: '10px 0 4px' }}>{children}</div>,
  p: ({ children }) => <div style={{ marginBottom: 6 }}>{children}</div>,
  strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
  ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: 20 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: 20 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 3 }}>{children}</li>,
  code: ({ inline, children }) => inline
    ? <code style={{ background: colors.bg, padding: '2px 5px', borderRadius: 4, fontSize: 12 }}>{children}</code>
    : <code>{children}</code>,
  pre: ({ children }) => <pre style={{ background: colors.bg, padding: 12, borderRadius: 8, overflow: 'auto', fontSize: 12, margin: '8px 0' }}>{children}</pre>,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '10px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: colors.bg }}>{children}</thead>,
  th: ({ children }) => <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: `2px solid ${colors.border}`, whiteSpace: 'nowrap' }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: '6px 12px', borderBottom: `1px solid ${colors.border}` }}>{children}</td>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: colors.blue, textDecoration: 'underline' }}>{children}</a>,
  hr: () => <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: '12px 0' }} />,
  blockquote: ({ children }) => <blockquote style={{ borderLeft: `3px solid ${colors.blue}`, paddingLeft: 12, margin: '8px 0', color: colors.textMuted }}>{children}</blockquote>,
};

export default function Markdown({ text }) {
  if (!text) return null;
  const normalized = text.replace(/<br\s*\/?>/gi, '  \n');
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{normalized}</ReactMarkdown>;
}
