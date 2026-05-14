import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UploadZone } from '../../components/ui/UploadZone';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export function KYBUpgrade() {
  const navigate = useNavigate();
  const { kybTier, upgradeTier } = useApp();
  const [tin, setTin] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedTier, setSubmittedTier] = useState<1 | 2 | 3 | null>(null);

  const targetTier = Math.min(kybTier + 1, 3) as 1 | 2 | 3;
  const tierName = targetTier === 2 ? 'Growth' : 'Business';
  const isManualReview = targetTier === 3;

  const handleSubmit = () => {
    setLoading(true);
    const tierBeingUpgradedTo = targetTier;
    setTimeout(() => {
      setSubmittedTier(tierBeingUpgradedTo);
      if (!isManualReview) {
        upgradeTier(tierBeingUpgradedTo);
      }
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="page-centered fade-in">
        <div style={{ maxWidth: 560, width: '100%' }}>
          <button onClick={() => navigate('/profile/verification')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5C667A', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={14} /> Verification & Limits
          </button>

          <Card>
            {submitted && submittedTier ? (
              submittedTier === 3 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>⏳</div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Application under review</h2>
                  <p style={{ fontSize: 14, color: '#5C667A', lineHeight: 1.6, marginBottom: 8 }}>
                    Your Tier 3 (Business) application has been submitted. Our compliance team will review it manually and email you at <strong>bukola@adeyemiimports.ng</strong> within 48 hours.
                  </p>
                  <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 24 }}>
                    Tier 3 applications require manual review because of the enhanced due diligence required for high-value transaction limits.
                  </p>
                  <Button fullWidth size="lg" onClick={() => navigate('/profile/verification')}>Back to Profile →</Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div className="check-pop" style={{ width: 64, height: 64, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#0A1628', fontWeight: 700 }}>✓</div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Upgrade complete!</h2>
                  <p style={{ fontSize: 14, color: '#5C667A', marginBottom: 24 }}>
                    You are now on Tier {submittedTier} ({submittedTier === 2 ? 'Growth' : 'Business'}). Your new limits are active.
                  </p>
                  <Button fullWidth size="lg" onClick={() => navigate('/profile/verification')}>Back to Profile →</Button>
                </div>
              )
            ) : (
              <>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                  Upgrade to Tier {targetTier} — {tierName}
                </h2>
                <p style={{ fontSize: 13, color: '#5C667A', marginBottom: 20 }}>
                  {targetTier === 2
                    ? <>Unlocks up to <strong>$50,000 per transaction</strong> and <strong>$100,000/month</strong>.</>
                    : <>Unlocks <strong>no preset transaction cap</strong>. Transactions above $200,000 require Enhanced Due Diligence approval.</>
                  }
                </p>

                {targetTier === 3 && (
                  <InfoBanner type="warning" title="Manual review required">
                    Tier 3 (Business) upgrades are reviewed manually by our compliance team. This takes up to 48 hours. Your documents are submitted securely.
                  </InfoBanner>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24, marginTop: targetTier === 3 ? 20 : 0 }}>
                  {targetTier === 2 ? (
                    <>
                      <UploadZone label="CAC Status Report" helper="Download from the CAC portal. Shows current directors and confirms no changes since incorporation." />
                      <Input label="Tax Identification Number (TIN)" placeholder="12-digit TIN" helper="Find this on your FIRS certificate or tax clearance letter" value={tin} onChange={e => setTin(e.target.value)} maxLength={12} />
                      <UploadZone label="Utility Bill" helper="Must show your registered business address. Issued within the last 3 months." />
                    </>
                  ) : (
                    <>
                      <UploadZone label="MEMART (Memorandum & Articles of Association)" helper="Confirms your directors have authority to conduct high-value transactions." />
                      <UploadZone label="All Directors' IDs" helper="Government-issued ID and BVN/NIN for every director on the CAC Status Report." />
                      <UploadZone label="UBO Declaration" helper="List all shareholders holding more than 25% of the company." />
                      <UploadZone label="Source of Funds Declaration" helper="A signed letter explaining the origin of your business funds." />
                    </>
                  )}
                </div>

                {targetTier === 2 && (
                  <InfoBanner>
                    Tier 2 review takes 24–48 hours. We'll email you at <strong>bukola@adeyemiimports.ng</strong> when approved.
                  </InfoBanner>
                )}

                <div style={{ marginTop: 20 }}>
                  <Button fullWidth size="lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : `Submit for Tier ${targetTier} Review →`}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}
