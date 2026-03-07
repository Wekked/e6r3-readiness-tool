// CompareTab — Version comparison between two documents
// Full implementation mirrors the artifact's CompareTab logic
// TODO: Port complete from artifact JSX

import { useState } from 'react';
import { GitCompare, ArrowRight, Loader2 } from 'lucide-react';
import { callAPI, buildDocContent } from '../lib/api';
import { buildComparePrompt } from '../lib/prompts';
import SeverityBadge from './ui/SeverityBadge';
import ScoreRing from './ui/ScoreRing';
import LoadingOverlay from './ui/LoadingOverlay';

export default function CompareTab({ documents, compareResults, setCompareResults, analyzing, setAnalyzing }) {
  const [docA, setDocA] = useState(null);
  const [docB, setDocB] = useState(null);
  const [progress, setProgress] = useState('');
  const analyzed = documents.filter((d) => d.analysis && d.analysis.overallScore > 0);

  const runCompare = async () => {
    if (!docA || !docB) return;
    setAnalyzing(true);
    setProgress('Comparing document versions...');
    try {
      const content = [
        ...buildDocContent(docA),
        { type: 'text', text: `\n[ANALYSIS for "${docA.fileName}" ${docA.version ? `v${docA.version}` : '(Version A)'}]: ${JSON.stringify(docA.analysis)}\n` },
        ...buildDocContent(docB),
        { type: 'text', text: `\n[ANALYSIS for "${docB.fileName}" ${docB.version ? `v${docB.version}` : '(Version B)'}]: ${JSON.stringify(docB.analysis)}\n` },
        { type: 'text', text: buildComparePrompt() }
      ];
      const result = await callAPI('Focus on version-to-version compliance changes.', content);
      setCompareResults(result);
    } catch (err) {
      setCompareResults({ error: err.message });
    } finally {
      setAnalyzing(false);
      setProgress('');
    }
  };

  const statusConfig = {
    resolved: { color: '#059669', bg: '#ECFDF5', label: 'Resolved', icon: '✅' },
    new: { color: '#DC2626', bg: '#FEF2F2', label: 'New Issue', icon: '🆕' },
    persists: { color: '#D97706', bg: '#FFFBEB', label: 'Persists', icon: '⏳' },
    modified_better: { color: '#2563EB', bg: '#EFF6FF', label: 'Improved', icon: '📈' },
    modified_worse: { color: '#DC2626', bg: '#FEF2F2', label: 'Degraded', icon: '📉' }
  };

  if (analyzed.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 24px' }}>
        <GitCompare size={36} color="#334155" style={{ marginBottom: 10 }} />
        <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Analyze at least 2 documents to enable comparison</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0', margin: '0 0 6px' }}>Version Comparison</h3>
      <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>
        Compare two versions of a document to track compliance trajectory.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end', marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Document A (Earlier)</label>
          <select value={docA?.id || ''} onChange={(e) => setDocA(analyzed.find((d) => String(d.id) === e.target.value))}
            style={{ width: '100%', padding: '9px 10px', borderRadius: 7, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: 12 }}>
            <option value="">Select...</option>
            {analyzed.map((d) => <option key={d.id} value={String(d.id)}>{d.fileName} {d.version ? `(v${d.version})` : ''}</option>)}
          </select>
        </div>
        <ArrowRight size={18} color="#475569" style={{ marginBottom: 10 }} />
        <div>
          <label style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Document B (Newer)</label>
          <select value={docB?.id || ''} onChange={(e) => setDocB(analyzed.find((d) => String(d.id) === e.target.value))}
            style={{ width: '100%', padding: '9px 10px', borderRadius: 7, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: 12 }}>
            <option value="">Select...</option>
            {analyzed.filter((d) => !docA || String(d.id) !== String(docA.id)).map((d) => <option key={d.id} value={String(d.id)}>{d.fileName} {d.version ? `(v${d.version})` : ''}</option>)}
          </select>
        </div>
      </div>

      <button onClick={runCompare} disabled={!docA || !docB || analyzing} style={{
        padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
        background: (!docA || !docB || analyzing) ? 'rgba(59,130,246,0.1)' : 'linear-gradient(135deg, #0891B2, #2563EB)',
        border: 'none', color: '#fff', cursor: (!docA || !docB || analyzing) ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, opacity: (!docA || !docB || analyzing) ? 0.4 : 1, marginBottom: 20
      }}>
        {analyzing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <GitCompare size={14} />}
        Compare Versions
      </button>

      {analyzing && <LoadingOverlay message={progress} />}

      {compareResults?.error && (
        <div style={{ padding: '12px 16px', background: 'rgba(220,38,38,0.1)', borderRadius: 8 }}>
          <p style={{ color: '#FCA5A5', fontSize: 13, margin: 0 }}>{compareResults.error}</p>
        </div>
      )}

      {compareResults?.changes && (
        <>
          <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'center' }}><ScoreRing score={compareResults.versionAScore} size={64} /><p style={{ fontSize: 10, color: '#6B7280', margin: '4px 0 0' }}>Version A</p></div>
              <ArrowRight size={20} color={compareResults.trajectory === 'improving' ? '#059669' : '#DC2626'} />
              <div style={{ textAlign: 'center' }}><ScoreRing score={compareResults.versionBScore} size={64} /><p style={{ fontSize: 10, color: '#6B7280', margin: '4px 0 0' }}>Version B</p></div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: compareResults.trajectory === 'improving' ? '#059669' : '#DC2626' }}>
                {compareResults.trajectory === 'improving' ? '📈 Improving' : compareResults.trajectory === 'degrading' ? '📉 Degrading' : '➡️ Mixed'}
              </span>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: '4px 0 0' }}>{compareResults.summary}</p>
            </div>
          </div>
          {compareResults.changes.map((change, i) => {
            const sc = statusConfig[change.status] || statusConfig.persists;
            return (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB', borderLeft: `3px solid ${sc.color}`, marginBottom: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 4, background: sc.bg, color: sc.color }}>{sc.icon} {sc.label}</span>
                  <SeverityBadge severity={change.severity} small />
                  <span style={{ fontSize: 10, color: '#6B7280', fontFamily: "'IBM Plex Mono', monospace" }}>{change.section}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', margin: '0 0 6px' }}>{change.title}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#4B5563' }}>
                  <div style={{ padding: '6px 10px', background: '#FEF2F2', borderRadius: 5 }}><strong style={{ fontSize: 10, color: '#9CA3AF' }}>VERSION A:</strong><p style={{ margin: '2px 0 0' }}>{change.versionAState}</p></div>
                  <div style={{ padding: '6px 10px', background: '#ECFDF5', borderRadius: 5 }}><strong style={{ fontSize: 10, color: '#9CA3AF' }}>VERSION B:</strong><p style={{ margin: '2px 0 0' }}>{change.versionBState}</p></div>
                </div>
                {change.recommendation && <p style={{ fontSize: 12, color: '#059669', margin: '8px 0 0', fontStyle: 'italic' }}>→ {change.recommendation}</p>}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
