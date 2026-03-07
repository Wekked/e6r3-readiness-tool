import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SEVERITY_CONFIG } from '../../lib/constants';
import SeverityBadge from './SeverityBadge';

export default function FindingCard({ finding }) {
  const [open, setOpen] = useState(false);
  const c = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.minor;

  return (
    <div style={{
      background: '#fff', borderRadius: 8, border: `1px solid ${c.border}`,
      borderLeft: `3px solid ${c.color}`, marginBottom: 8, overflow: 'hidden'
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
      }}>
        <span style={{ color: c.color, marginTop: 2, flexShrink: 0 }}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
            <SeverityBadge severity={finding.severity} small />
            <span style={{ fontSize: 10, color: '#6B7280', fontFamily: "'IBM Plex Mono', monospace" }}>{finding.section}</span>
            {finding.documents && (
              <span style={{ fontSize: 10, color: '#7C3AED', fontFamily: "'IBM Plex Mono', monospace", background: '#F5F3FF', padding: '0 5px', borderRadius: 3 }}>
                {finding.documents}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#1F2937', lineHeight: 1.35 }}>{finding.title}</p>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px 38px', fontSize: 12.5, color: '#374151', lineHeight: 1.55 }}>
          <Section label="Issue">{finding.description}</Section>
          {finding.documentExcerpt && (
            <Section label="Document Excerpt">
              <div style={{ padding: '6px 10px', background: '#F9FAFB', borderRadius: 5, borderLeft: '2px solid #D1D5DB', fontStyle: 'italic', fontSize: 12 }}>
                "{finding.documentExcerpt}"
              </div>
            </Section>
          )}
          <Section label="E6(R3) Requirement">{finding.requirement}</Section>
          <Section label="Recommendation" color="#059669">{finding.recommendation}</Section>
        </div>
      )}
    </div>
  );
}

function Section({ label, color = '#6B7280', children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong style={{ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</strong>
      {typeof children === 'string' ? <p style={{ margin: '3px 0 0' }}>{children}</p> : <div style={{ marginTop: 3 }}>{children}</div>}
    </div>
  );
}
