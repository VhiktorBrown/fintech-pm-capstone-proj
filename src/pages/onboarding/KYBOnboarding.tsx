import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { UploadZone } from '../../components/ui/UploadZone';
import { OnboardingProgress } from '../../components/ui/StepIndicator';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { Card } from '../../components/ui/Card';
import { Camera } from 'lucide-react';

const STEPS = ['Business', 'Documents', 'Director', 'Review'];

export function KYBOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ cacNumber: '', bizType: '', directorBvn: '', directorNin: '', idType: '' });
  const [selfie, setSelfie] = useState(false);

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else navigate('/onboarding/review');
  };

  return (
    <div className="onboarding-page">
      <div style={{ width: '100%', maxWidth: 560 }} className="fade-in">
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: '#0A1628' }}>Borderless</h1>
        </div>

        <Card>
          <OnboardingProgress steps={STEPS} current={step} />

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Tell us about your business</h2>
                <p style={{ fontSize: 14, color: '#5C667A' }}>We need to verify your business before you can send money.</p>
              </div>
              <Input
                label="CAC Registration Number"
                placeholder="e.g. RC1234567 or BN1234567"
                helper="Find this on your Certificate of Incorporation or Business Name certificate"
                value={form.cacNumber}
                onChange={e => setForm(p => ({ ...p, cacNumber: e.target.value }))}
              />
              <Select
                label="Business Type"
                value={form.bizType}
                onChange={e => setForm(p => ({ ...p, bizType: e.target.value }))}
                options={[
                  { value: '', label: 'Select business type' },
                  { value: 'llc', label: 'Limited Liability Company' },
                  { value: 'bn', label: 'Business Name' },
                  { value: 'partnership', label: 'Partnership' },
                ]}
              />
              <InfoBanner>
                We verify your CAC number instantly against the CAC registry. No physical document needed at this step.
              </InfoBanner>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Upload your business document</h2>
                <p style={{ fontSize: 14, color: '#5C667A' }}>Certificate of Incorporation or Business Name Certificate.</p>
              </div>
              <UploadZone
                label="Certificate of Incorporation or Business Name Certificate"
                helper="PDF, JPG, PNG accepted. Max 10MB."
              />
              <InfoBanner>
                Your document is encrypted and stored securely in Nigeria. We only use it to verify your business registration.
              </InfoBanner>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Verify your identity</h2>
                <p style={{ fontSize: 14, color: '#5C667A' }}>As the business owner, we need to verify who you are.</p>
              </div>
              <Input
                label="Bank Verification Number (BVN)"
                placeholder="11-digit BVN"
                maxLength={11}
                helper="Your BVN is linked to your Nigerian bank account"
                value={form.directorBvn}
                onChange={e => setForm(p => ({ ...p, directorBvn: e.target.value }))}
              />
              <Input
                label="National Identification Number (NIN)"
                placeholder="11-digit NIN"
                maxLength={11}
                value={form.directorNin}
                onChange={e => setForm(p => ({ ...p, directorNin: e.target.value }))}
              />
              <Select
                label="Government ID Type"
                value={form.idType}
                onChange={e => setForm(p => ({ ...p, idType: e.target.value }))}
                options={[
                  { value: '', label: 'Select ID type' },
                  { value: 'passport', label: 'International Passport' },
                  { value: 'nin_card', label: 'National ID Card' },
                  { value: 'drivers', label: "Driver's Licence" },
                ]}
              />
              <UploadZone label="Upload Government ID" helper="Clear photo of the front page. Max 10MB." />

              {/* Selfie */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 20 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Camera size={16} color="#D4AF37" /> Take a live selfie
                </h3>
                <p style={{ fontSize: 13, color: '#5C667A', marginBottom: 14 }}>
                  We'll use this to confirm you're the person in the ID document.
                </p>
                {selfie ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#0A1628,#1B3A6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontSize: 22, fontWeight: 700 }}>B</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>✓ Selfie captured</p>
                      <button onClick={() => setSelfie(false)} style={{ fontSize: 12, color: '#5C667A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Retake</button>
                    </div>
                  </div>
                ) : (
                  <Button variant="secondary" onClick={() => setSelfie(true)}>Open Camera</Button>
                )}
              </div>

              <InfoBanner>
                Your BVN and NIN are verified through Smile ID and stored exclusively within Nigeria in compliance with the NDPA 2023 and CNII Order 2024. They are never shared with international partners.
              </InfoBanner>
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button fullWidth size="lg" onClick={next}>
              {step < STEPS.length - 1 ? 'Continue →' : 'Submit for Review →'}
            </Button>
            {step > 0 && (
              <Button fullWidth variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
