import { SEVERITY_CONFIG } from '../../lib/constants';

export default function SeverityBadge({ severity, small }) {
  const c = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.minor;
  const Icon = c.icon;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: small ? '1px 7px' : '2px 10px', borderRadius: 999,
        fontSize: small ? 10 : 12, fontWeight: 600,
        color: c.color, background: c.bg, border: `1px solid ${c.border}`
      }}
    >
      <Icon size={small ? 10 : 13} /> {c.label}
    </span>
  );
}
