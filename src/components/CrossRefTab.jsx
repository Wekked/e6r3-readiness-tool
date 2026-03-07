import { useState } from 'react';
import { Layers, Link2, Loader2 } from 'lucide-react';
import { callAPI, buildDocContent } from '../lib/api';
import { buildCrossRefPrompt } from '../lib/prompts';
import { SEVERITY_CONFIG } from '../lib/constants';
import DocCard from './ui/DocCard';
import FindingCard from './ui/FindingCard';
import ScoreRing from './ui/ScoreRing';
import LoadingOverlay from './ui/LoadingOverlay';

export default function CrossRefTab({ documents, crossRefResults, setCrossRefResults, analyzing, setAnalyzing }) {
  const [progress, setProgress] = useState('');
  const analyzed = documents.filter((d) => d.analysis && d.analysis.overallScore > 0);

  const runCrossRef = async () => {
    if (analyzed.length < 2) return;
    setAnalyzing(true);
    setProgress('Building cross-document analysis...');
    try {
      const content = [];
      for (const doc of analyzed) {
        content.push(...buildDocContent(doc));
        content.push({ type: 'text', text: `\n[ANALYSIS RESULTS for "${doc.fileName}" (${doc.typeLabel})]: ${JSON.stringify(doc.analysis)}\n` });
      }
      content.push({ type: 'text', text: buildCrossRefPrompt(analyzed.length) });
      const result = await callAPI('Focus on cross-document alignment and consistency analysis.', content);
      setCrossRefResults(result);
    } catch (err) {
      setCrossRefResults({ error: err.message });
    } finally {
      setAnalyzing(false);
      setProgress('');
    }
  };

  const typeColors = { inconsistency: '#DC2626', gap: '#D97706', alignment: '#2563EB', dependency: '#7C3AED' };
  const typeLabels = { inconsistency: 'Inconsistency', gap: 'Gap', alignment: 'Alignment', dependency: 'Dependency' };

  if (analyzed.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <Layers size={40} color="#334155" style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 15, color: '#94A3B8', fontWeight: 500, margin: '0 0 6px' }}>Add and analyze at least 2 documents</p>
        <p style={{ fontSize: 12, color: '#475569', margin: 0, maxWidth: 420, marginInline: 'auto', lineHeight: 1.5 }}>
          Cross-referencing compares documents against each other to find inconsistencies, gaps, and misalignments that single-document review would miss.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0', margin: '0 0 4px' }}>Cross-Document Analysis</h3>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Comparing {analyzed.length} documents for consistency & completeness</p>
        </div>
        <button onClick={runCrossRef} disabled={analyzing} style={{
          padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: analyzing ? 'rgba(59,130,246,0.1)' : 'linear-gradient(135deg, #7C3AED, #2563EB)',
          border: 'none', color: '#fff', cursor: analyzing ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, opacity: analyzing ? 0.5 : 1,
          boxShadow: analyzing ? 'none' : '0 2px 12px rgba(124,58,237,0.3)'
        }}>
          {analyzing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Link2 size={14} />}
          {crossRefResults && !crossRefResults.error ? 'Re-analyze' : 'Run Cross-Reference'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(analyzed.length, 3)}, 1fr)`, gap: 8, marginBottom: 20 }}>
        {analyzed.map((doc) => <DocCard key={doc.id} doc={doc} compact />)}
      </div>

      {analyzing && <LoadingOverlay message={progress || 'Analyzing cross-document consistency...'} />}

      {crossRefResults?.error && (
        <div style={{ padding: '12px 16px', background: 'rgba(220,38,38,0.1)', borderRadius: 8, border: '1px solid rgba(220,38,38,0.3)' }}>
          <p style={{ color: '#FCA5A5', fontSize: 13, margin: 0 }}>{crossRefResults.error}</p>
        </div>
      )}

      {crossRefResults?.crossFindings && (
        <>
          <div style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
            <ScoreRing score={crossRefResults.overallAlignment} size={80} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Cross-Document Alignment</h4>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>{crossRefResults.summary}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {['inconsistency', 'gap', 'alignment', 'dependency'].map((type) => {
              const count = crossRefResults.crossFindings.filter((f) => f.type === type).length;
              if (!count) return null;
              return (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[type] }} />
                  <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>{count} {typeLabels[type]}{count > 1 ? 's' : ''}</span>
                </div>
              );
            })}
          </div>

          {crossRefResults.crossFindings
            .sort((a, b) => (SEVERITY_CONFIG[a.severity]?.weight ?? 4) - (SEVERITY_CONFIG[b.severity]?.weight ?? 4))
            .map((f, i) => (
              <FindingCard key={i} finding={{
                ...f, section: f.ichSection,
                documents: f.documentsInvolved?.join(' ↔ '),
                documentExcerpt: [f.docAExcerpt, f.docBExcerpt].filter(Boolean).join(' | vs | ')
              }} />
            ))}
        </>
      )}
    </div>
  );
}
