import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ message }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', textAlign: 'center'
    }}>
      <Loader2 size={32} color="#3B82F6" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
      <p style={{ fontSize: 14, color: '#93C5FD', fontWeight: 500, margin: 0 }}>{message}</p>
    </div>
  );
}
