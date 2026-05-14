import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ConvertSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usdBalance } = useApp();
  const s = location.state as { ngn: number; usd: number; fee: number; rate: number } | null;
  const ngn = s?.ngn ?? 5_000_000;
  const usd = s?.usd ?? 3157.96;
  const fee = s?.fee ?? 48.08;
  const rate = s?.rate ?? 1560;

  return (
    <AuthLayout>
      <div className="page-centered fade-in">
        <div style={{ maxWidth: 460, textAlign: 'center' }}>
          <div className="check-pop" style={{ width: 72, height: 72, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 30, color: '#0A1628', fontWeight: 700 }}>
            ✓
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Conversion complete</h1>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, marginBottom: 20, textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {[
              ['You converted', `₦${fmt(ngn)} NGN`],
              ['You received', `$${fmt(usd)} USD`],
              ['Rate locked', `1 USD = ₦${rate.toLocaleString()}`],
              ['Fee paid', `$${fmt(fee)} (1.5%)`],
              ['Time', 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: 13, color: '#5C667A' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#0A1628', borderRadius: 9999, padding: '6px 16px', marginBottom: 24, fontSize: 13, fontWeight: 700 }}>
            USD Wallet: ${fmt(usdBalance)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button fullWidth size="lg" onClick={() => navigate('/send')}>Send Money to Supplier →</Button>
            <Button fullWidth variant="ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
