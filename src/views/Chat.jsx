import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAI } from "../hooks/useAI.js";
import { Loader } from "../components/Shared.jsx";
import { colors } from "../theme.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import { Send } from "lucide-react";

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

function ChatMarkdown({ text }) {
  if (!text) return null;
  // Normalize <br> / <br/> / <br /> tags to markdown line breaks
  const normalized = text.replace(/<br\s*\/?>/gi, '  \n');
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{normalized}</ReactMarkdown>;
}

const SUGGESTIONS = [
  "What's the status of the Q1 Marketing Campaign?",
  "Who should cover Lina's tasks while she's absent?",
  "Give me a pre-meeting brief for the Campaign Deep Dive",
  "وش وضع مشاريع القسم؟",
  "What are the biggest risks across all projects?",
  "Weekly department summary",
  "Compare project health across all active projects",
  "Which deliverables are at risk of missing deadlines?",
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { chat, loading } = useAI();
  const { isMobile } = useMediaQuery();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);

    const response = await chat(newMessages);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 900, color: "#fff",
        }} aria-hidden="true">X</div>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: colors.text, margin: 0 }}>Ask Employee X</h1>
          <div style={{ fontSize: 10, color: colors.textDim }}>AI-powered department intelligence</div>
        </div>
        <div style={{
          marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
          background: colors.green + "20", color: colors.green, letterSpacing: 0.5,
        }} aria-label="AI status: live">
          LIVE AI
        </div>
      </div>

      {/* Messages */}
      <div role="log" aria-live="polite" aria-label="Chat messages" style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        {messages.length === 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: colors.textDim, marginBottom: 12 }}>Try asking:</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  padding: "8px 14px", borderRadius: 10, fontSize: 12, cursor: "pointer",
                  background: colors.bgCard, border: `1px solid ${colors.border}`, color: colors.textMuted,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12,
          }}>
            <div style={{
              maxWidth: isMobile ? "90%" : "75%", padding: "12px 16px", borderRadius: 14, fontSize: 13, lineHeight: 1.7,
              background: m.role === "user" ? colors.blue : colors.bgCard,
              color: m.role === "user" ? "#fff" : colors.text,
              border: m.role === "user" ? "none" : `1px solid ${colors.border}`,
              borderBottomRightRadius: m.role === "user" ? 4 : 14,
              borderBottomLeftRadius: m.role === "user" ? 14 : 4,
              whiteSpace: m.role === "user" ? "pre-wrap" : undefined,
            }}>
              {m.role === "assistant" ? <ChatMarkdown text={m.content} /> : m.content}
            </div>
          </div>
        ))}

        {loading && <Loader text="Employee X is analyzing department data..." />}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexShrink: 0 }}>
        <label htmlFor="chat-input" className="sr-only" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>Message</label>
        <input
          id="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && send()}
          placeholder="Ask Employee X anything about the department..."
          disabled={loading}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${colors.border}`,
            background: colors.bgInput, color: colors.text, fontSize: 13, outline: "none",
          }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          style={{
            padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer",
            background: loading || !input.trim() ? colors.border : "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
            color: "#fff", fontWeight: 700, fontSize: 13,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}
        >
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
}
