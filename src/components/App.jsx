import { useState } from 'react';
import { Shield, BarChart3 } from 'lucide-react';
import { TABS, DOCUMENT_TYPES } from '../lib/constants';
import { callAPI, buildDocContent } from '../lib/api';
import { buildAnalysisPrompt } from '../lib/prompts';
import WorkspaceTab from './WorkspaceTab';
import CrossRefTab from './CrossRefTab';
import CompareTab from './CompareTab';
import ChecklistTab from './ChecklistTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [documents, setDocuments] = useState([]);
  const [crossRefResults, setCrossRefResults] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState('');

  const analyzeDocuments = async () => {
    console.log('[E6R3] Starting analysis, documents:', documents.length);
    setAnalyzing(true);
    const toAnalyze = documents.filter((d) => !d.analysis);
    console.log('[E6R3] Documents to analyze:', toAnalyze.length);
    if (!toAnalyze.length) { setAnalyzing(false); return; }

    for (let i = 0; i < toAnalyze.length; i++) {
  // Wait between requests to avoid rate limiting
      if (i > 0) await new Promise(r => setTimeout(r, 30000));
      const doc = toAnalyze[i];
      setAnalyzeProgress(`Analyzing ${doc.fileName} (${i + 1}/${toAnalyze.length})...`);
      try {
        const content = [...buildDocContent(doc)];
        content.push({ type: 'text', text: buildAnalysisPrompt(doc.typeLabel) });
        const result = await callAPI('', content);
        setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, analysis: result } : d));
      } catch (err) {
        setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, analysis: { overallScore: 0, summary: `Error: ${err.message}`, findings: [] } } : d));
      }
    }
    setAnalyzing(false);
    setAnalyzeProgress('');
  };

  const analyzedCount = documents.filter((d) => d.analysis && d.analysis.overallScore > 0).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(168deg, #0B1929 0%, #0F2440 50%, #162D50 100%)',
      fontFamily: "'DM Sans', -apple-system, sans-serif", color: '#E5E7EB'
    }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <header style={{
        padding: '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Shield size={19} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#F9FAFB', fontFamily: "'Playfair Display', Georgia, serif" }}>
            E6(R3) Transition Readiness Tool
          </h1>
          <p style={{ fontSize: 10, color: '#64748B', margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
            Multi-Document Compliance Analysis · Cross-Referencing · Version Tracking
          </p>
        </div>
        {analyzedCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(59,130,246,0.1)', borderRadius: 6, border: '1px solid rgba(59,130,246,0.2)' }}>
            <BarChart3 size={13} color="#60A5FA" />
            <span style={{ fontSize: 12, color: '#93C5FD', fontWeight: 500 }}>{analyzedCount} doc{analyzedCount !== 1 ? 's' : ''} analyzed</span>
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <nav style={{
        display: 'flex', gap: 0, padding: '0 28px', overflowX: 'auto',
        borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.12)'
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          const needsDocs = tab.id !== 'workspace' && analyzedCount < 1;
          return (
            <button key={tab.id} onClick={() => !needsDocs && setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px',
                background: 'none', border: 'none', borderBottom: `2px solid ${active ? '#3B82F6' : 'transparent'}`,
                color: active ? '#93C5FD' : needsDocs ? '#334155' : '#64748B',
                cursor: needsDocs ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s', opacity: needsDocs ? 0.4 : 1, whiteSpace: 'nowrap'
              }}>
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 20px' }}>
        {activeTab === 'workspace' && (
          <WorkspaceTab documents={documents} setDocuments={setDocuments} onAnalyze={analyzeDocuments} analyzing={analyzing} analyzeProgress={analyzeProgress} />
        )}
        {activeTab === 'cross_ref' && (
          <CrossRefTab documents={documents} crossRefResults={crossRefResults} setCrossRefResults={setCrossRefResults} analyzing={analyzing} setAnalyzing={setAnalyzing} />
        )}
        {activeTab === 'compare' && (
          <CompareTab documents={documents} compareResults={compareResults} setCompareResults={setCompareResults} analyzing={analyzing} setAnalyzing={setAnalyzing} />
        )}
        {activeTab === 'checklist' && <ChecklistTab documents={documents} />}
      </div>

      <p style={{ textAlign: 'center', fontSize: 10, color: '#334155', padding: '12px 20px', lineHeight: 1.5 }}>
        AI-assisted compliance analysis for informational purposes only. Not regulatory advice. ICH E6(R3) Final · 06 Jan 2025
      </p>
    </div>
  );
}
