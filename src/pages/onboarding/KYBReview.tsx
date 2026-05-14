import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Clock } from 'lucide-react';

export function KYBReview() {
  const navigate = useNavigate();

  const steps = [
    { label: 'Document check', status: 'done' },
    { label: 'Identity verification', status: 'progress' },
    { label: 'Account activation', status: 'pending' },
  ];

  return (
    <div className="onboarding-page">
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }} className="fade-in">
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#0A1628,#1B3A6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Clock size={32} color="#D4AF37" />
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#1A2033' }}>
          We're reviewing your application
        </h1>
        <p style={{ fontSize: 16, color: '#5C667A', lineHeight: 1.6, marginBottom: 32 }}>
          This usually takes 24–48 hours. We'll email you at{' '}
          <strong>bukola@adeyemiimports.ng</strong> as soon as it's done.
        </p>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, marginBottom: 28, textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < steps.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                background: s.status === 'done' ? '#DCFCE7' : s.status === 'progress' ? '#FEF3C7' : '#EEF2F9',
                color: s.status === 'done' ? '#059669' : s.status === 'progress' ? '#D97706' : '#9CA3AF',
              }}>
                {s.status === 'done' ? '✓' : s.status === 'progress' ? '⏳' : '○'}
              </div>
              <span style={{ fontSize: 14, color: s.status === 'pending' ? '#9CA3AF' : '#1A2033', fontWeight: s.status === 'progress' ? 600 : 400 }}>{s.label}</span>
              {s.status === 'progress' && <span style={{ fontSize: 11, color: '#D97706', marginLeft: 'auto' }}>In progress</span>}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>
          Need help? <a href="#" style={{ color: '#D4AF37' }}>support@borderless.ng</a>
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => navigate('/onboarding/approved')}>
            Simulate Approved →
          </Button>
          <Button variant="danger" onClick={() => navigate('/onboarding/rejected')}>
            Simulate Rejected
          </Button>
        </div>
      </div>
    </div>
  );
}
