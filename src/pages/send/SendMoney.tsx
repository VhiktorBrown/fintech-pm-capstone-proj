import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, TextArea } from '../../components/ui/Input';
import { UploadZone } from '../../components/ui/UploadZone';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { VerifiedBadge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { mockSuppliersData } from '../../context/AppContext';
import { FLAT_FEE, FX_RATE_USD_CNY, TIER_LIMITS } from '../../data/mock';
import { Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

function fmt(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const STEPS = ['Select Corridor', 'Supplier & Purpose', 'Amount & Rate', 'Review & Send'];

const AML_SCENARIOS = [
  { id: 'none',             label: 'None — submit normally',                desc: 'No AML rule triggered. Payment proceeds as in_progress.' },
  { id: 'velocity',         label: 'Velocity structuring',                  desc: '3+ payments sent in a 24-hour window, regardless of individual amounts.' },
  { id: 'aggregate',        label: 'Aggregate threshold (smurfing)',         desc: 'Payments sum to >$10K within a rolling 5-business-day window, each individually below $10K.' },
  { id: 'tier_clustering',  label: 'Tier-limit structuring',                desc: 'Multiple amounts clustering just below the active tier limit (e.g. $2,900–$2,999 repeatedly).' },
  { id: 'just_below',       label: 'Just-below-threshold pattern',          desc: '3+ transactions within 5% of the same ceiling over 30 days — suggests threshold awareness.' },
  { id: 'multi_beneficiary',label: 'Multi-beneficiary dispersion',          desc: 'Payments to 3+ different new beneficiaries in a single day — unusual for a legitimate importer.' },
  { id: 'source_of_funds',  label: 'Source of funds concern',               desc: 'Funding account not previously seen or originating from a high-risk jurisdiction.' },
  { id: 'edd',              label: 'EDD required (>$200K, Tier 3)',         desc: 'Transaction above $200,000 — Enhanced Due Diligence applies before release.' },
];
const EDD_THRESHOLD = 200000;

const CORRIDORS = [
  { code: 'CN', flag: '🇨🇳', name: 'China', sub: 'Via CNAPS — same business day', active: true },
  { code: 'IN', flag: '🇮🇳', name: 'India', sub: 'Coming soon', active: false },
  { code: 'AE', flag: '🇦🇪', name: 'UAE', sub: 'Coming soon', active: false },
  { code: 'TR', flag: '🇹🇷', name: 'Turkey', sub: 'Coming soon', active: false },
];
const PURPOSES = [
  { value: '', label: 'Select payment reason' },
  { value: 'goods', label: 'Importation of goods' },
  { value: 'services', label: 'Service payment' },
  { value: 'professional', label: 'Professional fees or consultancy' },
  { value: 'ip', label: 'Intellectual property or licensing' },
  { value: 'other', label: 'Other' },
];

export function SendMoney() {
  const navigate = useNavigate();
  const { usdBalance, kybTier, deductUSD, addTransaction, transactions } = useApp();

  const [step, setStep] = useState(0);
  const [showEDD, setShowEDD] = useState(false);
  const [supplierId, setSupplierId] = useState(mockSuppliersData[0].id);
  const [addNew, setAddNew] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', reg: '', bank: '', account: '', cnaps: '', address: '' });
  const [regStatus, setRegStatus] = useState<'idle' | 'checking' | 'pass' | 'fail'>('idle');
  const [purpose, setPurpose] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [invoiceFile, setInvoiceFile] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [showTierBlock, setShowTierBlock] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [demoAmlRule, setDemoAmlRule] = useState('none');
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  const supplier = mockSuppliersData.find(s => s.id === supplierId) ?? mockSuppliersData[0];
  const amount = parseFloat(amountInput) || 0;
  const total = amount + FLAT_FEE;
  const cny = amount * FX_RATE_USD_CNY;
  const tierLimit = TIER_LIMITS[kybTier] as number;
  const overLimit = amount > tierLimit;
  const overBalance = total > usdBalance;
  const eddRequired = kybTier === 3 && amount > EDD_THRESHOLD;
  const canProceedStep1 = (addNew ? (newSupplier.name && regStatus === 'pass') : !!supplierId) && !!purpose && !!invoiceFile;
  const canProceedStep2 = amount > 0 && !overBalance && !overLimit && !showEDD;

  const handleRegCheck = (val: string) => {
    setNewSupplier(p => ({ ...p, reg: val }));
    if (val.length === 18) {
      setRegStatus('checking');
      setTimeout(() => setRegStatus(val.startsWith('91') ? 'pass' : 'fail'), 1200);
    } else {
      setRegStatus('idle');
    }
  };

  const handleAmountChange = (val: string) => {
    setAmountInput(val);
    const n = parseFloat(val) || 0;
    if (n > tierLimit) setShowTierBlock(true);
    else setShowTierBlock(false);
    if (kybTier === 3 && n > EDD_THRESHOLD) setShowEDD(true);
    else setShowEDD(false);
  };

  const handleSubmit = () => {
    const ref = 'BDL-2026-' + String(Math.floor(Math.random() * 90000) + 10000);
    // Demo override: if a specific AML rule is selected, use it directly
    const demoSelected = demoAmlRule !== 'none';
    const sessionSends = transactions.filter(t => t.type === 'send' && /^BDL-\d{4}-\d{5}$/.test(t.id));
    const autoVelocity = sessionSends.length >= 3;
    const flagged = demoSelected || eddRequired || autoVelocity;
    const status: 'in_progress' | 'under_review' = flagged ? 'under_review' : 'in_progress';
    const amlCheck = demoSelected
      ? `flagged — ${AML_SCENARIOS.find(s => s.id === demoAmlRule)!.label}: ${AML_SCENARIOS.find(s => s.id === demoAmlRule)!.desc}`
      : eddRequired ? 'flagged — EDD required (transaction above $200,000)'
      : autoVelocity ? 'flagged — velocity rule (3+ payments in 24 hours)'
      : 'passed';
    deductUSD(total);
    addTransaction({
      id: ref,
      ref,
      type: 'send',
      supplier: supplier.name,
      supplierId: supplier.id,
      amountUSD: amount,
      totalDeducted: total,
      cnyAmount: cny,
      exchangeRate: FX_RATE_USD_CNY,
      status,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      purpose,
      invoice: invoiceFile,
      amlCheck,
      kybTierAtTime: kybTier,
      submittedAt: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' }),
    });
    navigate(`/transactions/${ref}`);
  };

  if (upgrading) return <KYBUpgradeOverlay onBack={() => setUpgrading(false)} onDone={() => { setUpgrading(false); setShowTierBlock(false); }} />;

  return (
    <AuthLayout>
      <div className="page-centered fade-in">
        <div style={{ maxWidth: 600, width: '100%' }}>
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5C667A', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={14} /> {step > 0 ? 'Back' : 'Dashboard'}
          </button>
          <StepIndicator steps={STEPS} current={step} />

          {/* STEP 0 — Corridor Selector */}
          {step === 0 && (
            <Card>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Where are you sending?</h2>
              <p style={{ fontSize: 13, color: '#5C667A', marginBottom: 20 }}>Select a destination country. More corridors are being added as we onboard licensed payout partners.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {CORRIDORS.map(c => (
                  <button
                    key={c.code}
                    disabled={!c.active}
                    onClick={() => c.active && setStep(1)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      border: `1.5px solid ${c.active ? '#D4AF37' : '#E2E8F0'}`,
                      borderRadius: 10, background: c.active ? '#FBF4DC' : '#F8F9FC',
                      cursor: c.active ? 'pointer' : 'not-allowed', textAlign: 'left', opacity: c.active ? 1 : 0.6,
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{c.flag}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: c.active ? '#0A1628' : '#9CA3AF', marginBottom: 2 }}>{c.name}</p>
                      <p style={{ fontSize: 12, color: c.active ? '#5C667A' : '#9CA3AF' }}>{c.sub}</p>
                    </div>
                    {c.active
                      ? <span style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37' }}>Active →</span>
                      : <span style={{ background: '#E2E8F0', color: '#9CA3AF', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 9999 }}>Coming Soon</span>
                    }
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <Card>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Who are you paying?</h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0A1628', color: '#FFFFFF', borderRadius: 9999, padding: '4px 10px', fontSize: 11, fontWeight: 600, marginBottom: 20 }}>
                🇨🇳 Paying to: China via CNAPS
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2033', display: 'block', marginBottom: 8 }}>Select a supplier</label>
                {!addNew ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {mockSuppliersData.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSupplierId(s.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1.5px solid ${supplierId === s.id ? '#D4AF37' : '#E2E8F0'}`, borderRadius: 8, background: supplierId === s.id ? '#FBF4DC' : '#FFFFFF', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                          {s.name[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</p>
                          <p style={{ fontSize: 11, color: '#5C667A' }}>{s.bank}</p>
                        </div>
                        {s.verified ? <VerifiedBadge /> : <span style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>Unverified</span>}
                      </button>
                    ))}
                    <button onClick={() => setAddNew(true)} style={{ fontSize: 13, color: '#D4AF37', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '8px 4px' }}>
                      + Add new supplier
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '14px', background: '#F8F9FC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <Input label="Supplier Legal Name (as registered in China)" placeholder="Full legal name" value={newSupplier.name} onChange={e => setNewSupplier(p => ({ ...p, name: e.target.value }))} />
                    <div>
                      <Input
                        label="Chinese Business Registration Number (18 digits)"
                        placeholder="e.g. 9131000074985631XA"
                        maxLength={18}
                        helper="Used to verify the business via China's national registry"
                        value={newSupplier.reg}
                        onChange={e => handleRegCheck(e.target.value)}
                      />
                      {regStatus === 'checking' && <p style={{ fontSize: 12, color: '#5C667A', marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}><span className="spinner" style={{ width: 10, height: 10, border: '2px solid #E2E8F0', borderTop: '2px solid #D4AF37', borderRadius: '50%', display: 'inline-block' }} /> Verifying supplier...</p>}
                      {regStatus === 'pass' && <p style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>✓ Verified Supplier</p>}
                      {regStatus === 'fail' && <p style={{ fontSize: 12, color: '#D97706', marginTop: 4 }}>⚠ Could not verify this registration number. Payment will go to manual review if you continue.</p>}
                    </div>
                    <Input label="Bank Name" value={newSupplier.bank} onChange={e => setNewSupplier(p => ({ ...p, bank: e.target.value }))} />
                    <Input label="Bank Account Number" value={newSupplier.account} onChange={e => setNewSupplier(p => ({ ...p, account: e.target.value }))} />
                    <Input label="CNAPS Code" helper="6-digit code — ask your supplier" maxLength={12} value={newSupplier.cnaps} onChange={e => setNewSupplier(p => ({ ...p, cnaps: e.target.value }))} />
                    <TextArea label="Business Address in China" value={newSupplier.address} onChange={e => setNewSupplier(p => ({ ...p, address: e.target.value }))} />
                    <button onClick={() => setAddNew(false)} style={{ fontSize: 12, color: '#5C667A', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>← Back to saved suppliers</button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <Select
                  label="What is this payment for?"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  options={PURPOSES}
                />
                {purpose === 'other' && (
                  <div style={{ marginTop: 8 }}>
                    <Input placeholder="Describe the payment purpose" value={otherPurpose} onChange={e => setOtherPurpose(e.target.value)} />
                  </div>
                )}
              </div>

              <UploadZone label="Upload Proforma Invoice" scanEnabled onFile={setInvoiceFile} />

              <div style={{ marginTop: 24 }}>
                <Button fullWidth size="lg" onClick={() => setStep(2)} disabled={!canProceedStep1}>
                  Continue →
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 2 */}
          {step === 2 && !showTierBlock && (
            <Card>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>How much are you sending?</h2>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Amount in USD</label>
                  <span style={{ fontSize: 12, color: '#5C667A' }}>Balance: <strong>${fmt(usdBalance)}</strong></span>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: '#5C667A' }}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountInput}
                    onChange={e => handleAmountChange(e.target.value)}
                    min="0"
                    style={{
                      width: '100%', padding: '14px 14px 14px 30px',
                      fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                      border: `1.5px solid ${overBalance ? '#DC2626' : '#E2E8F0'}`, borderRadius: 8,
                      outline: 'none', background: overBalance ? '#FEF2F2' : '#FFFFFF',
                    }}
                  />
                </div>
                {overBalance && !overLimit && (
                  <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>
                    Insufficient USD balance. You have ${fmt(usdBalance)} available.{' '}
                    <button onClick={() => navigate('/convert')} style={{ color: '#DC2626', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: 12 }}>
                      Convert more NGN →
                    </button>
                  </p>
                )}
              </div>

              {amount > 0 && !overLimit && (
                <div style={{ background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 16 }} className="fade-in">
                  {[
                    ['You send', `$${fmt(amount)} USD`],
                    ['Transaction fee', `$${FLAT_FEE.toFixed(2)} (flat)`],
                    ['Total deducted', `$${fmt(total)} from wallet`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#5C667A' }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: '#E2E8F0', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#5C667A' }}>Exchange rate</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>1 USD = {FX_RATE_USD_CNY} CNY ⓘ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Supplier receives (est.)</span>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: '#D4AF37' }}>¥{fmt(cny)} CNY</span>
                  </div>
                  <div style={{ background: '#FFFBEB', border: '1px solid #D97706', borderRadius: 6, padding: '8px 10px' }}>
                    <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
                      ⚠ Indicative rate. The final CNY amount is set by our China payout partner at time of processing. Rates are typically within ±0.5% of the displayed rate.
                    </p>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 12, color: '#5C667A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                📅 Estimated delivery: Same business day (within Chinese banking hours)
              </p>

              {showEDD && (
                <div style={{ marginBottom: 16, padding: '14px 16px', background: '#EFF6FF', border: '1.5px solid #2563EB', borderRadius: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>Enhanced Due Diligence required</p>
                  <p style={{ fontSize: 12, color: '#1E40AF', lineHeight: 1.6 }}>
                    Transactions above $200,000 require a manual compliance review before they are processed. Your payment will be submitted and held under review. Our compliance team will release it within 48 hours after verifying your source of funds and invoice details.
                  </p>
                </div>
              )}

              <Button fullWidth size="lg" onClick={() => setStep(3)} disabled={!canProceedStep2}>
                {showEDD ? 'Submit for EDD Review →' : 'Continue →'}
              </Button>
            </Card>
          )}

          {/* TIER LIMIT BLOCK */}
          {step === 2 && showTierBlock && (
            <TierLimitBlock
              amount={amount}
              tier={kybTier}
              limit={tierLimit}
              onUpgrade={() => setUpgrading(true)}
              onCancel={() => { setShowTierBlock(false); setAmountInput(''); navigate('/dashboard'); }}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Card>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Review your payment</h2>
              <p style={{ fontSize: 13, color: '#D97706', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} /> Check everything carefully. Payments cannot be recalled once processed.
              </p>

              {/* Summary */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
                <Section label="SENDING TO">
                  <Row l="Supplier" v={supplier.name} right={<VerifiedBadge />} />
                  <Row l="Bank" v={supplier.bank} />
                  <Row l="Account" v={supplier.accountNumber.replace(/(.{4})/g, '$1 ').trim()} />
                  <Row l="CNAPS Code" v={supplier.cnapsCode} />
                  <Row l="Business Reg" v={supplier.businessReg} />
                </Section>
                <Section label="PAYMENT DETAILS">
                  <Row l="Amount" v={`$${fmt(amount)} USD`} />
                  <Row l="Transaction fee" v={`$${FLAT_FEE}`} />
                  <Row l="Total from wallet" v={`$${fmt(total)} USD`} bold />
                  <Row l="Purpose" v={PURPOSES.find(p => p.value === purpose)?.label ?? purpose} />
                </Section>
                <Section label="EXCHANGE (INDICATIVE)">
                  <Row l="Rate" v={`1 USD = ${FX_RATE_USD_CNY} CNY`} />
                  <Row l="Supplier receives" v={`≈ ¥${fmt(cny)} CNY`} bold />
                  <p style={{ fontSize: 11, color: '#9CA3AF', padding: '4px 14px 10px' }}>* Final CNY amount set by our China payout partner at processing</p>
                </Section>
                <Section label="DELIVERY">
                  <Row l="Method" v="CNAPS domestic transfer (China)" />
                  <Row l="Estimated time" v="Same business day" />
                </Section>
              </div>

              {/* Form M banner */}
              {purpose === 'goods' && (
                <div style={{ marginBottom: 20 }}>
                  <InfoBanner type="info" title="Form M Notice">
                    This payment is for imported goods. If you are formally importing goods into Nigeria, you may be required to file a Form M with your commercial bank. Your Borderless payment receipt can be used as supporting documentation. Borderless does not file Form M on your behalf.
                  </InfoBanner>
                </div>
              )}

              <Button fullWidth size="lg" onClick={handleSubmit}>
                Confirm & Send Payment
              </Button>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
                By confirming, you authorise Borderless to debit ${fmt(total)} from your USD wallet.
              </p>
              <button onClick={() => navigate('/dashboard')} style={{ fontSize: 12, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, display: 'block', width: '100%', textAlign: 'center' }}>
                Cancel and go back
              </button>

              {/* ── Demo AML Controls ── */}
              <div style={{ marginTop: 24, border: '1.5px dashed #D97706', borderRadius: 10, overflow: 'hidden' }}>
                <button
                  onClick={() => setShowDemoPanel(p => !p)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: '#FFFBEB', border: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#D97706', background: '#FEF3C7', border: '1px solid #D97706', borderRadius: 4, padding: '2px 6px' }}>DEMO</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>
                      AML scenario controls
                      {demoAmlRule !== 'none' && (
                        <span style={{ marginLeft: 8, color: '#DC2626', fontWeight: 700 }}>
                          ● {AML_SCENARIOS.find(s => s.id === demoAmlRule)!.label}
                        </span>
                      )}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#D97706' }}>{showDemoPanel ? '▲' : '▼'}</span>
                </button>

                {showDemoPanel && (
                  <div style={{ padding: '12px 14px 14px', background: '#FFFBEB', borderTop: '1px dashed #D97706' }}>
                    <p style={{ fontSize: 11, color: '#92400E', marginBottom: 12, lineHeight: 1.5 }}>
                      Select a rule to simulate. On "Confirm & Send", the transaction will be held for Manual Review with this rule recorded in the audit trail.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {AML_SCENARIOS.map(s => (
                        <label
                          key={s.id}
                          style={{
                            display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer',
                            padding: '8px 10px', borderRadius: 7,
                            background: demoAmlRule === s.id ? (s.id === 'none' ? '#F0FDF4' : '#FEF2F2') : 'transparent',
                            border: `1px solid ${demoAmlRule === s.id ? (s.id === 'none' ? '#059669' : '#DC2626') : 'transparent'}`,
                            transition: 'all 0.1s',
                          }}
                        >
                          <input
                            type="radio"
                            name="demoAmlRule"
                            value={s.id}
                            checked={demoAmlRule === s.id}
                            onChange={() => setDemoAmlRule(s.id)}
                            style={{ marginTop: 2, accentColor: s.id === 'none' ? '#059669' : '#DC2626', flexShrink: 0 }}
                          />
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: s.id === 'none' ? '#065F46' : '#7F1D1D', marginBottom: 1 }}>{s.label}</p>
                            <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.4 }}>{s.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid #F1F5F9' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 14px 4px' }}>{label}</p>
      {children}
    </div>
  );
}

function Row({ l, v, right, bold }: { l: string; v: string; right?: React.ReactNode; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 14px' }}>
      <span style={{ fontSize: 12, color: '#5C667A', minWidth: 120 }}>{l}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: bold ? 700 : 500, color: '#1A2033', textAlign: 'right' }}>{v}</span>
        {right}
      </div>
    </div>
  );
}

function TierLimitBlock({ amount, tier, limit, onUpgrade, onCancel }: {
  amount: number; tier: number; limit: number; onUpgrade: () => void; onCancel: () => void;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 40, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }} className="fade-in">
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Lock size={24} color="#D97706" />
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          You've reached your Tier {tier} limit
        </h2>
        <p style={{ fontSize: 14, color: '#5C667A', lineHeight: 1.6, marginBottom: 20 }}>
          Your Tier {tier} account allows a maximum of <strong>${limit.toLocaleString()} per transaction</strong>. Your payment of <strong>${amount.toLocaleString()}</strong> exceeds this limit.
        </p>

        <div style={{ background: '#FEF3C7', borderRadius: 8, padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#92400E' }}>Your limit</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>${limit.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#92400E' }}>Your payment</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>${amount.toLocaleString()} ✗</span>
          </div>
        </div>

        <div style={{ background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#D4AF37', marginBottom: 8 }}>
            Upgrade to Tier {Math.min(tier + 1, 3)} — {['', 'Starter', 'Growth', 'Business'][Math.min(tier + 1, 3)]}
          </p>
          <p style={{ fontSize: 12, color: '#5C667A', marginBottom: 10 }}>
            Tier {Math.min(tier + 1, 3)} unlocks up to ${tier === 1 ? '50,000' : '200,000+'} per transaction.
          </p>
          {['CAC Status Report (current directors list)', 'Tax Identification Number (TIN)', 'Utility bill (business address)'].map(d => (
            <div key={d} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: 12 }}>○</span>
              <span style={{ fontSize: 12, color: '#5C667A' }}>{d}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>Your payment details are saved. Complete your upgrade to release it.</p>
        </div>

        <Button fullWidth size="lg" onClick={onUpgrade}>Upgrade Now →</Button>
        <button onClick={onCancel} style={{ marginTop: 10, width: '100%', fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>
          Cancel payment
        </button>
      </div>
    </div>
  );
}

function KYBUpgradeOverlay({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { upgradeTier, kybTier } = useApp();
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [doneTier, setDoneTier] = useState<1|2|3|null>(null);

  const targetTier = Math.min(kybTier + 1, 3) as 1|2|3;
  const tierName = targetTier === 2 ? 'Growth' : 'Business';
  const isManualReview = targetTier === 3;

  const handleSubmit = () => {
    setUploading(true);
    const tierBeingUpgradedTo = targetTier;
    setTimeout(() => {
      setDoneTier(tierBeingUpgradedTo);
      if (!isManualReview) upgradeTier(tierBeingUpgradedTo);
      setDone(true);
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="page-centered fade-in">
        <div style={{ maxWidth: 560 }}>
          <Card>
            {done && doneTier ? (
              doneTier === 3 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>⏳</div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Application under review</h2>
                  <p style={{ fontSize: 14, color: '#5C667A', lineHeight: 1.6, marginBottom: 24 }}>
                    Your Tier 3 (Business) application has been submitted for manual review. Our compliance team will email you within 48 hours. Once approved, your payment will be released automatically.
                  </p>
                  <Button fullWidth size="lg" onClick={onDone}>Back to Dashboard →</Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div className="check-pop" style={{ width: 64, height: 64, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#0A1628', fontWeight: 700 }}>✓</div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Upgrade complete!</h2>
                  <p style={{ fontSize: 14, color: '#5C667A', marginBottom: 24 }}>You are now Tier {doneTier} ({doneTier === 2 ? 'Growth' : 'Business'}). Your payment details are ready to confirm.</p>
                  <Button fullWidth size="lg" onClick={onDone}>Return to Payment →</Button>
                </div>
              )
            ) : (
              <>
                <div style={{ background: '#EFF6FF', borderLeft: '4px solid #2563EB', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 24 }}>
                  <p style={{ fontSize: 13, color: '#1E40AF' }}>Your payment is saved. Complete your upgrade to release it.</p>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                  Upgrade to Tier {targetTier} — {tierName}
                </h2>
                <p style={{ fontSize: 13, color: '#5C667A', marginBottom: 16 }}>
                  {targetTier === 2
                    ? <>Unlocks up to <strong>$50,000 per transaction</strong> and <strong>$100,000/month</strong>.</>
                    : <>Unlocks <strong>no preset transaction cap</strong>. Transactions above $200,000 require Enhanced Due Diligence approval.</>}
                </p>

                {targetTier === 3 && (
                  <div style={{ background: '#FEF3C7', border: '1px solid #D97706', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 2 }}>Manual review required</p>
                    <p style={{ fontSize: 12, color: '#92400E' }}>Tier 3 (Business) upgrades are reviewed manually by our compliance team. This takes up to 48 hours. Your documents are submitted securely.</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  {targetTier === 2 ? (
                    <>
                      <UploadZone label="CAC Status Report" helper="Download from the CAC portal. Shows current directors." />
                      <Input label="Tax Identification Number (TIN)" placeholder="12-digit TIN" helper="Find this on your FIRS certificate" />
                      <UploadZone label="Utility Bill" helper="Must show your registered business address. Issued within 3 months." />
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
                <Button fullWidth size="lg" onClick={handleSubmit} disabled={uploading}>
                  {uploading ? 'Submitting...' : `Submit for Tier ${targetTier} Review →`}
                </Button>
                <button onClick={onBack} style={{ marginTop: 10, width: '100%', fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to payment</button>
              </>
            )}
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}
