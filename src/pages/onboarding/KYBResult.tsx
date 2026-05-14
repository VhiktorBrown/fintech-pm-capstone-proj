import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function KYBApproved() {
  const navigate = useNavigate();
  return (
    <div className="onboarding-page">
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }} className="fade-in">
        <div className="check-pop" style={{ width: 80, height: 80, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
          ✓
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#1A2033', marginBottom: 12 }}>You're verified!</h1>
        <p style={{ fontSize: 16, color: '#5C667A', lineHeight: 1.6, marginBottom: 28 }}>
          Your Tier 1 account is ready. You can now fund your wallet and start sending money to China.
        </p>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, marginBottom: 28, textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#5C667A' }}>Account level</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: "'Syne', sans-serif" }}>Tier 1 — Starter</span>
          </div>
          <div style={{ height: 1, background: '#F1F5F9', margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#5C667A' }}>Single transaction limit</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>up to $3,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#5C667A' }}>Monthly total limit</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>up to $5,000</span>
          </div>
          <p style={{ fontSize: 12, color: '#D4AF37' }}>Want higher limits? Upgrade anytime from your Profile.</p>
        </div>

        <Button fullWidth size="lg" onClick={() => navigate('/dashboard')}>Go to Dashboard →</Button>
      </div>
    </div>
  );
}

export function KYBRejected() {
  const navigate = useNavigate();
  return (
    <div className="onboarding-page">
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }} className="fade-in">
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36, color: '#DC2626' }}>
          ✕
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: '#1A2033', marginBottom: 12 }}>
          We couldn't verify your account
        </h1>

        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 16, marginBottom: 24, textAlign: 'left' }}>
          <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.6 }}>
            <strong>Reason:</strong> The name on your Certificate of Incorporation does not match the name registered under your CAC number. Please re-upload the correct document.
          </p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1A2033', marginBottom: 10 }}>What to fix:</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, marginBottom: 8 }}>
            <span style={{ color: '#DC2626' }}>○</span>
            <span style={{ fontSize: 13 }}>Re-upload your Certificate of Incorporation</span>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>
            If the issue persists, contact <a href="#" style={{ color: '#D4AF37' }}>support@borderless.ng</a>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button fullWidth onClick={() => navigate('/onboarding/business')}>Fix and Resubmit</Button>
          <Button fullWidth variant="ghost">Contact Support</Button>
        </div>
      </div>
    </div>
  );
}
