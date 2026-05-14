import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FX_RATE_NGN_USD, FX_FEE_PCT } from '../../data/mock';

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Convert() {
  const navigate = useNavigate();
  const { ngnBalance, convertNGN } = useApp();
  const [ngnInput, setNgnInput] = useState('');

  const ngn = parseFloat(ngnInput.replace(/,/g, '')) || 0;
  const gross = ngn / FX_RATE_NGN_USD;
  const fee = gross * FX_FEE_PCT;
  const net = gross - fee;

  const handleConfirm = () => {
    if (net > 0 && ngn <= ngnBalance) {
      convertNGN(ngn, net);
      navigate('/convert/success', { state: { ngn, usd: net, fee, rate: FX_RATE_NGN_USD } });
    }
  };

  const over = ngn > ngnBalance;

  return (
    <AuthLayout>
      <div className="page-centered fade-in">
        <div style={{ maxWidth: 480 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5C667A', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={14} /> Back
          </button>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Convert NGN to USD</h1>
          <p style={{ fontSize: 14, color: '#5C667A', marginBottom: 24 }}>
            Your USD balance is what you'll use to pay Chinese suppliers.
          </p>

          <Card>
            {/* From */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5C667A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>FROM</label>
                <span style={{ fontSize: 12, color: '#5C667A' }}>NGN balance: <strong style={{ color: '#1A2033' }}>₦{fmt(ngnBalance)}</strong></span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, fontWeight: 600, color: '#5C667A' }}>₦</span>
                <input
                  type="text"
                  placeholder="0.00"
                  value={ngnInput}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setNgnInput(val ? parseInt(val).toLocaleString() : '');
                  }}
                  style={{
                    width: '100%', padding: '14px 14px 14px 32px',
                    fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                    border: `1.5px solid ${over ? '#DC2626' : '#E2E8F0'}`, borderRadius: 8,
                    outline: 'none', background: over ? '#FEF2F2' : '#FFFFFF',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                />
              </div>
              {over && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>Amount exceeds your NGN wallet balance.</p>}
            </div>

            {/* Rate row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Rate (live)</p>
                <p style={{ fontSize: 13, fontWeight: 600 }}>1 USD = ₦{FX_RATE_NGN_USD.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: '#5C667A' }}>Via Nigeria's official FX market (NAFEM)</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#D4AF37', background: 'none', border: 'none', cursor: 'pointer' }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {/* Fee breakdown */}
            {ngn > 0 && (
              <div style={{ background: '#F8F9FC', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#5C667A' }}>Gross USD</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>${fmt(gross)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#5C667A' }}>FX fee (1.5%)</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>-${fmt(fee)}</span>
                </div>
                <div style={{ height: 1, background: '#E2E8F0', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>You receive</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#D4AF37' }}>${fmt(net)}</span>
                </div>
              </div>
            )}

            <Button fullWidth size="lg" onClick={handleConfirm} disabled={net <= 0 || over}>
              Convert Now →
            </Button>

            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
              Rate is locked at the moment you confirm. Sourced from NAFEM official FX market via Providus Bank.
            </p>
          </Card>

          <button onClick={() => navigate('/convert/success', { state: { ngn: 5000000, usd: 3157.96, fee: 48.08, rate: 1560 } })} style={{ fontSize: 11, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, textDecoration: 'underline' }}>
            Demo: skip to success →
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
