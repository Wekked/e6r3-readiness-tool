export default function ScoreRing({ score, size = 100 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E293B" strokeWidth={Math.max(4, size * 0.08)} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={Math.max(4, size * 0.08)}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: Math.max(10, size * 0.26), fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>{score}</span>
        {size > 50 && <span style={{ fontSize: 9, color: '#64748B' }}>/ 100</span>}
      </div>
    </div>
  );
}
