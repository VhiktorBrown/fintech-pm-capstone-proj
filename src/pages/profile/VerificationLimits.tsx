import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { TierBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Circle } from 'lucide-react';
import { mockUserData } from '../../context/AppContext';

export function VerificationLimits() {
  const navigate = useNavigate();
  const { kybTier } = useApp();

  const tier1Docs = [
    'CAC Registration Number',
    'Certificate of Incorporation or Business Name Certificate',
    'Director BVN + NIN',
    'Live Selfie',
  ];

  const tier2Docs = [
    { label: 'CAC Status Report (current directors)', done: kybTier >= 2 },
    { label: 'Tax Identification Number (TIN)', done: kybTier >= 2 },
    { label: 'Utility bill (business address)', done: kybTier >= 2 },
    { label: 'Proforma Invoice (required per transaction)', done: false, info: true },
  ];

  const limits = [
    { tier: 1, txLimit: '$3,000', monthlyLimit: '$5,000', label: 'Starter' },
    { tier: 2, txLimit: '$50,000', monthlyLimit: '$100,000', label: 'Growth' },
    { tier: 3, txLimit: 'No preset cap', monthlyLimit: 'No preset cap (EDD above $200K)', label: 'Business' },
  ];

  return (
    <AuthLayout>
      <div className="page fade-in" style={{ maxWidth: 640 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Verification & Limits</h1>
        <p style={{ fontSize: 14, color: '#5C667A', marginBottom: 24 }}>{mockUserData.businessName}</p>

        {/* Current tier */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: '#5C667A', marginBottom: 6 }}>Your verified account level</p>
              <TierBadge tier={kybTier} />
            </div>
            {kybTier < 3 && (
              <Button size="sm" variant="secondary" onClick={() => navigate('/profile/upgrade')}>
                Upgrade →
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            <LimitStat label="Transaction limit" value={limits[kybTier - 1].txLimit} />
            <LimitStat label="Monthly limit" value={limits[kybTier - 1].monthlyLimit} />
          </div>

          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1A2033', marginBottom: 10 }}>Documents verified:</p>
            {tier1Docs.map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CheckCircle size={14} color="#059669" />
                <span style={{ fontSize: 13, color: '#1A2033' }}>{d}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tier limits overview */}
        <Card style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Tier limits overview</p>
          {limits.map(l => (
            <div key={l.tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TierBadge tier={l.tier as 1|2|3} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: '#5C667A' }}>Per transaction: <strong style={{ color: '#1A2033' }}>{l.txLimit}</strong></p>
                <p style={{ fontSize: 12, color: '#5C667A' }}>Monthly: <strong style={{ color: '#1A2033' }}>{l.monthlyLimit}</strong></p>
              </div>
            </div>
          ))}
        </Card>

        {/* Upgrade section */}
        {kybTier < 2 && (
          <Card>
            <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>Upgrade to Tier 2 — Growth</p>
            <p style={{ fontSize: 13, color: '#5C667A', marginBottom: 14 }}>Unlock up to <strong>$50,000 per transaction</strong> and <strong>$100,000/month</strong>.</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1A2033', marginBottom: 8 }}>Additional documents required:</p>
            {tier2Docs.map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Circle size={12} color="#9CA3AF" />
                <span style={{ fontSize: 13, color: '#5C667A' }}>{d.label}</span>
                {d.info && <span style={{ fontSize: 11, color: '#D97706', fontWeight: 500 }}>per transaction</span>}
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <Button onClick={() => navigate('/profile/upgrade')}>Upgrade to Tier 2 →</Button>
            </div>
          </Card>
        )}
      </div>
    </AuthLayout>
  );
}

function LimitStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#F8F9FC', borderRadius: 8, padding: '10px 14px', flex: 1 }}>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#1A2033' }}>{value}</p>
    </div>
  );
}
