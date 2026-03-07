import { ClipboardCheck } from 'lucide-react';
import { SEVERITY_CONFIG, PROTOCOL_CHECKLIST, ICF_CHECKLIST } from '../lib/constants';
import SeverityBadge from './ui/SeverityBadge';

export default function ChecklistTab({ documents }) {
  const analyzed = documents.filter((d) => d.analysis && d.analysis.overallScore > 0);

  const sectionMap = {};
  analyzed.forEach((doc) => {
    (doc.analysis?.findings || []).forEach((f) => {
      const sec = f.section?.match(/^[\d]+\.?[\d]*/)?.[0] || f.section?.split(' ')[0] || 'Other';
      if (!sectionMap[sec]) sectionMap[sec] = [];
      sectionMap[sec].push({ ...f, docName: doc.fileName });
    });
  });

  if (!analyzed.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <ClipboardCheck size={40} color="#334155" style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>Analyze documents to see section-by-section checklists</p>
      </div>
    );
  }

  const hasProtocol = analyzed.some((d) => d.type === 'protocol');
  const hasICF = analyzed.some((d) => d.type === 'icf');
  const activeChecklist = hasProtocol ? PROTOCOL_CHECKLIST : hasICF ? ICF_CHECKLIST : null;
  const activeLabel = hasProtocol ? 'Protocol (Appendix B)' : hasICF ? 'ICF Elements (Section 2.8.10)' : null;

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0', margin: '0 0 6px' }}>Section-by-Section Compliance</h3>
      <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 20px' }}>Aggregated findings mapped to ICH E6(R3) sections</p>

      {/* Section map */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', marginBottom: 10 }}>Findings by ICH Section</h4>
        {Object.entries(sectionMap).length === 0 ? (
          <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 20 }}>No section data available.</p>
        ) : (
          Object.entries(sectionMap)
            .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
            .map(([section, findings]) => {
              const worst = findings.reduce((w, f) => Math.min(w, SEVERITY_CONFIG[f.severity]?.weight ?? 3), 3);
              const worstSev = Object.entries(SEVERITY_CONFIG).find(([, v]) => v.weight === worst)?.[0] || 'compliant';
              const c = SEVERITY_CONFIG[worstSev];
              return (
                <div key={section} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 4, borderLeft: `3px solid ${c.color}` }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', minWidth: 70, fontFamily: "'IBM Plex Mono', monospace" }}>§{section}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {findings.map((f, i) => <SeverityBadge key={i} severity={f.severity} small />)}
                  </div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{findings.length} finding{findings.length > 1 ? 's' : ''}</span>
                </div>
              );
            })
        )}
      </div>

      {/* Document-specific checklist */}
      {activeChecklist && (
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', marginBottom: 10 }}>{activeLabel} — Element Checklist</h4>
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            {activeChecklist.map((item, i) => {
              const allFindings = analyzed.flatMap((d) => d.analysis?.findings || []);
              const related = allFindings.filter((f) => f.section?.includes(item.ref) || (item.ref.length <= 4 && f.section?.startsWith(item.ref)));
              const status = related.length === 0 ? 'unchecked' :
                related.some((f) => f.severity === 'critical' || f.severity === 'major') ? 'issue' :
                related.some((f) => f.severity === 'minor') ? 'minor' :
                related.some((f) => f.severity === 'compliant') ? 'ok' : 'unchecked';
              const statusColors = { ok: '#059669', issue: '#DC2626', minor: '#D97706', unchecked: '#9CA3AF' };
              const statusIcons = { ok: '✓', issue: '✗', minor: '!', unchecked: '—' };
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < activeChecklist.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: status === 'unchecked' ? '#F3F4F6' : `${statusColors[status]}15`, color: statusColors[status], fontSize: 12, fontWeight: 700 }}>
                    {statusIcons[status]}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', minWidth: 75, fontFamily: "'IBM Plex Mono', monospace" }}>{item.ref}</span>
                  <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
