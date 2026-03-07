import { useState, useRef } from 'react';
import { Upload, Plus, Shield, Loader2 } from 'lucide-react';
import { DOCUMENT_TYPES, SEVERITY_CONFIG } from '../lib/constants';
import { readFileContent } from '../lib/fileUtils';
import DocCard from './ui/DocCard';
import FindingCard from './ui/FindingCard';
import ScoreRing from './ui/ScoreRing';
import LoadingOverlay from './ui/LoadingOverlay';

export default function WorkspaceTab({ documents, setDocuments, onAnalyze, analyzing, analyzeProgress }) {
  const fileRef = useRef(null);
  const [addType, setAddType] = useState('protocol');
  const [addVersion, setAddVersion] = useState('');

  const handleFiles = async (fileList) => {
    const newDocs = [];
    for (const file of Array.from(fileList)) {
      if (!(file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.docx') || file.name.endsWith('.txt'))) continue;
      const fileData = await readFileContent(file);
      newDocs.push({
        id: Date.now() + Math.random(),
        fileName: file.name,
        type: addType,
        typeLabel: DOCUMENT_TYPES.find((d) => d.value === addType)?.label || addType,
        version: addVersion || null,
        fileData,
        analysis: null
      });
    }
    setDocuments((prev) => [...prev, ...newDocs]);
    setAddVersion('');
  };

  return (
    <div>
      {/* Upload controls */}
      <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: 16, marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px auto', gap: 10, marginBottom: 12 }}>
          <select value={addType} onChange={(e) => setAddType(e.target.value)} style={{
            padding: '9px 12px', borderRadius: 7, background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: 13
          }}>
            {DOCUMENT_TYPES.map((dt) => <option key={dt.value} value={dt.value}>{dt.icon} {dt.label}</option>)}
          </select>
          <input value={addVersion} onChange={(e) => setAddVersion(e.target.value)} placeholder="Version"
            style={{ padding: '9px 12px', borderRadius: 7, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: 13 }} />
          <button onClick={() => fileRef.current?.click()} style={{
            padding: '9px 16px', borderRadius: 7, background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD', fontSize: 13,
            fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Plus size={14} /> Add File
          </button>
          <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.doc,.txt" onChange={(e) => handleFiles(e.target.files)} style={{ display: 'none' }} />
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed rgba(59,130,246,0.2)', borderRadius: 10, padding: '24px 16px',
            textAlign: 'center', cursor: 'pointer', background: 'rgba(59,130,246,0.03)'
          }}
        >
          <Upload size={24} color="#3B82F6" style={{ marginBottom: 6 }} />
          <p style={{ fontSize: 13, color: '#93C5FD', margin: '0 0 2px', fontWeight: 500 }}>Drop documents here</p>
          <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>PDF, DOCX, TXT — add multiple documents to enable cross-referencing</p>
        </div>
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#CBD5E1', margin: 0 }}>Documents ({documents.length})</h3>
            <button onClick={onAnalyze} disabled={analyzing}
              style={{
                padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: analyzing ? 'rgba(59,130,246,0.1)' : 'linear-gradient(135deg, #2563EB, #0891B2)',
                border: 'none', color: '#fff', cursor: analyzing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, opacity: analyzing ? 0.5 : 1
              }}>
              {analyzing ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Shield size={13} />}
              Analyze All Documents
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {documents.map((doc, i) => (
              <DocCard key={doc.id} doc={doc} onRemove={() => setDocuments((prev) => prev.filter((_, j) => j !== i))} />
            ))}
          </div>
        </div>
      )}

      {analyzing && <LoadingOverlay message={analyzeProgress} />}

      {/* Results */}
      {!analyzing && documents.some((d) => d.analysis && d.analysis.overallScore > 0) && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#CBD5E1', marginBottom: 12 }}>Individual Findings</h3>
          {documents.filter((d) => d.analysis && d.analysis.overallScore > 0).map((doc) => (
            <div key={doc.id} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: 18 }}>{DOCUMENT_TYPES.find((d) => d.value === doc.type)?.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{doc.fileName}</span>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0', lineHeight: 1.4 }}>{doc.analysis.summary}</p>
                </div>
                <ScoreRing score={doc.analysis.overallScore} size={56} />
              </div>
              {(doc.analysis.findings || [])
                .sort((a, b) => (SEVERITY_CONFIG[a.severity]?.weight ?? 4) - (SEVERITY_CONFIG[b.severity]?.weight ?? 4))
                .map((f, i) => <FindingCard key={i} finding={f} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
