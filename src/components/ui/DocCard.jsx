import { X } from 'lucide-react';
import { DOCUMENT_TYPES } from '../../lib/constants';
import ScoreRing from './ScoreRing';

export default function DocCard({ doc, onRemove, compact }) {
  const dt = DOCUMENT_TYPES.find((d) => d.value === doc.type);
  const hasResults = doc.analysis && doc.analysis.overallScore > 0;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 10,
      border: `1px solid ${hasResults ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
      padding: compact ? '8px 12px' : '12px 16px',
      display: 'flex', alignItems: 'center', gap: 10
    }}>
      <span style={{ fontSize: compact ? 16 : 20 }}>{dt?.icon || '📄'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: compact ? 12 : 13, fontWeight: 500, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {doc.fileName}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>
          {dt?.shortLabel || doc.type} {doc.version ? `· v${doc.version}` : ''}
          {hasResults && <span style={{ color: '#3B82F6', marginLeft: 6 }}>✓ Analyzed</span>}
        </p>
      </div>
      {hasResults && <ScoreRing score={doc.analysis.overallScore} size={compact ? 36 : 44} />}
      {onRemove && (
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 2 }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
