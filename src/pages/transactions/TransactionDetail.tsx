import { useNavigate, useParams } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { StatusBadge, VerifiedBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { useApp } from '../../context/AppContext';
import { mockSuppliersData } from '../../context/AppContext';
import { ArrowLeft, Copy, Check, FileText, Download, Clock } from 'lucide-react';
import { useState } from 'react';

function fmt(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { transactions } = useApp();
  const [copied, setCopied] = useState<string | null>(null);
  const [disputeStep, setDisputeStep] = useState<0 | 1 | 2>(0);
  const [escalated, setEscalated] = useState(false);

  const tx = transactions.find(t => t.id === id);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!tx) return (
    <AuthLayout>
      <div className="page">
        <p>Transaction not found.</p>
        <button onClick={() => navigate('/transactions')} style={{ color: '#D4AF37', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>← Back to transactions</button>
      </div>
    </AuthLayout>
  );

  const supplier = mockSuppliersData.find(s => s.id === tx.supplierId);
  const isInProgress = tx.status === 'in_progress';
  const isDelivered = tx.status === 'delivered';
  const isFailed = tx.status === 'failed' || tx.status === 'failed_investigating';
  const isReview = tx.status === 'under_review';

  const timelineNodes = [
    { label: 'Payment submitted', sub: 'Your payment is confirmed and funds are secured.', done: true, ts: tx.submittedAt },
    { label: 'Processing your payment', sub: 'Your payment is being processed. This usually takes 2–6 hours.', done: isDelivered || isFailed, ts: tx.submittedAt },
    { label: 'In transit', sub: "Your payment is on its way to your supplier.", done: isDelivered, active: isInProgress, ts: isDelivered ? 'En route' : undefined },
    { label: 'Delivered to supplier', sub: "Payment confirmed in your supplier's account.", done: isDelivered, ts: tx.deliveredAt },
  ];

  return (
    <AuthLayout>
      <div className="page fade-in">
        <button onClick={() => navigate('/transactions')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#D4AF37', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Transactions
        </button>

        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700 }}>Transaction Details</h1>
            <StatusBadge status={tx.status} />
          </div>

          {/* Tracking timeline (for in_progress / delivered / failed) */}
          {tx.type === 'send' && (
            <Card style={{ marginBottom: 16 }}>
              {isReview ? (
                <ManualReviewState ref_={tx.ref} amlCheck={tx.amlCheck} />
              ) : (
                <Timeline nodes={timelineNodes} failed={isFailed} />
              )}
              {isDelivered && tx.cnapsRef && (
                <div style={{ marginTop: 16, padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#065F46', marginBottom: 4 }}>CNAPS delivery confirmed</p>
                  <p style={{ fontSize: 12, color: '#5C667A', marginBottom: 6 }}>Share this reference with your supplier if they need to trace this payment at their Chinese bank.</p>
                </div>
              )}
            </Card>
          )}

          {/* Section 1: Summary */}
          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Summary</p>
            {tx.type === 'send' ? (
              <>
                <DetailRow l="Amount sent" v={`$${fmt(tx.amountUSD!)} USD`} />
                <DetailRow l="Total deducted" v={`$${fmt(tx.totalDeducted!)} USD (incl. $15 fee)`} bold />
                {tx.cnyAmount && <DetailRow l="Supplier received" v={`¥${fmt(tx.cnyAmount)} CNY`} />}
                {tx.exchangeRate && <DetailRow l="Exchange rate used" v={`1 USD = ${tx.exchangeRate} CNY`} />}
              </>
            ) : (
              <>
                <DetailRow l="Converted" v={`₦${(tx.amountNGN!).toLocaleString()} NGN`} />
                <DetailRow l="Received" v={`$${fmt(tx.amountUSD!)} USD`} bold />
                <DetailRow l="Rate" v={`1 USD = ₦${(tx.exchangeRate! as number).toLocaleString()}`} />
              </>
            )}
          </Card>

          {/* Section 2: Recipient */}
          {supplier && (
            <Card style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Recipient</p>
              <DetailRow l="Supplier" v={supplier.name} right={supplier.verified ? <VerifiedBadge /> : undefined} />
              <DetailRow l="Bank" v={supplier.bank} />
              <DetailRow l="Account" v={supplier.accountNumber.replace(/(.{4})/g, '$1 ').trim()} />
              <DetailRow l="CNAPS Code" v={supplier.cnapsCode} />
              <DetailRow l="Business Reg" v={supplier.businessReg} />
            </Card>
          )}

          {/* Section 3: Compliance */}
          {tx.type === 'send' && (
            <Card style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Compliance & Verification</p>
              <DetailRow l="Payment purpose" v={tx.purpose ?? '—'} />
              {tx.invoice && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#5C667A' }}>Proforma Invoice</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={13} color="#5C667A" />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{tx.invoice}</span>
                    <button style={{ color: '#D4AF37', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                  </div>
                </div>
              )}
              <DetailRow l="Invoice scan" v={tx.amlCheck ? '✓ Passed — supplier name, amount verified' : '—'} />
              <DetailRow l="AML check" v={tx.amlCheck ? '✓ Passed' : '—'} />
              <DetailRow l="KYB tier at time" v={tx.kybTierAtTime ? `Tier ${tx.kybTierAtTime} — ${['', 'Starter', 'Growth', 'Business'][tx.kybTierAtTime]}` : '—'} />
            </Card>
          )}

          {/* Section 4: Audit trail */}
          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Audit Trail</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                tx.submittedAt && { ts: tx.submittedAt, label: 'Payment submitted' },
                tx.submittedAt && tx.totalDeducted && { ts: tx.submittedAt, label: `$${fmt(tx.totalDeducted)} debited from your USD wallet` },
                tx.status === 'delivered' && tx.deliveredAt && { ts: tx.deliveredAt, label: '✓ Payment delivered to supplier', green: true },
                (tx.status === 'failed' || tx.status === 'failed_investigating') && { ts: '—', label: 'Delivery failed — dispute raised on your behalf', warn: true },
              ].filter(Boolean).map((e: any, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <span style={{ fontSize: 11, color: '#9CA3AF', minWidth: 160, flexShrink: 0 }}>{e.ts}</span>
                  <span style={{ fontSize: 13, color: e.green ? '#059669' : e.warn ? '#D97706' : '#1A2033', fontWeight: e.green ? 600 : 400 }}>{e.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 5: References */}
          <Card style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>References</p>
            {[
              { label: 'Borderless reference', value: tx.ref },
              ...(tx.cnapsRef && isDelivered ? [{ label: 'CNAPS reference', value: tx.cnapsRef, note: true }] : []),
            ].map(({ label, value, note }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                <div>
                  <p style={{ fontSize: 12, color: '#5C667A', marginBottom: 2 }}>{label}</p>
                  {(note) && <p style={{ fontSize: 11, color: '#9CA3AF' }}>Share with your supplier's bank to trace this payment.</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
                  <button onClick={() => copy(value, label)} style={{ color: copied === label ? '#059669' : '#D4AF37', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    {copied === label ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </Card>

          {isDelivered && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="secondary" style={{ gap: 8 }}>
                <Download size={14} /> Download Receipt
              </Button>
              {disputeStep === 0 && (
                <button
                  onClick={() => setDisputeStep(1)}
                  style={{ fontSize: 13, color: '#5C667A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0, textAlign: 'left' }}
                >
                  Report an issue with this payment
                </button>
              )}
            </div>
          )}
          {(isFailed) && (
            <Button onClick={() => navigate('/send')}>Retry Payment →</Button>
          )}

          {/* Dispute panel */}
          {isDelivered && disputeStep === 1 && (
            <Card style={{ marginTop: 16 }} className="fade-in">
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Report an Issue</p>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Supplier says payment not received?</h3>
              <p style={{ fontSize: 13, color: '#5C667A', lineHeight: 1.6, marginBottom: 16 }}>
                The CNAPS reference below is your proof of delivery. Ask your supplier to share it with their bank — any Chinese bank can trace a payment using this reference number.
              </p>
              {tx.cnapsRef && (
                <div style={{ background: '#F0FDF4', border: '1px solid #059669', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 6 }}>CNAPS Delivery Reference</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#059669', flex: 1 }}>{tx.cnapsRef}</span>
                    <button onClick={() => copy(tx.cnapsRef!, 'cnaps-dispute')} style={{ color: copied === 'cnaps-dispute' ? '#059669' : '#D4AF37', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      {copied === 'cnaps-dispute' ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                  <p style={{ fontSize: 11, color: '#5C667A', marginTop: 6 }}>
                    Instruct your supplier: "Please share this CNAPS reference number with your bank's customer service and ask them to trace an incoming domestic transfer."
                  </p>
                </div>
              )}
              <p style={{ fontSize: 13, color: '#5C667A', marginBottom: 16 }}>
                If your supplier's bank cannot find the payment using this reference, we will escalate directly to our China payout partner and open a formal trace investigation.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button onClick={() => { setEscalated(true); setDisputeStep(2); }} style={{ flex: 1 }}>
                  Escalate to Borderless Support →
                </Button>
                <button onClick={() => setDisputeStep(0)} style={{ fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
                  Cancel
                </button>
              </div>
            </Card>
          )}

          {isDelivered && disputeStep === 2 && (
            <Card style={{ marginTop: 16 }} className="fade-in">
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>🔍</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Trace request raised</h3>
                <p style={{ fontSize: 13, color: '#5C667A', lineHeight: 1.6, marginBottom: 8 }}>
                  We've opened a payment trace investigation with LianLian Global, our China payout partner. They will investigate using the CNAPS reference and report back within <strong>3 to 5 business days</strong>.
                </p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
                  You will receive an email update at each stage of the investigation. No further action is required from you.
                </p>
                <InfoBanner type="info">
                  If LianLian confirms a delivery failure, your funds will be returned to your USD wallet under their Supplier Payments Guarantee.
                </InfoBanner>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

function DetailRow({ l, v, right, bold }: { l: string; v: string; right?: React.ReactNode; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F9FAFB' }}>
      <span style={{ fontSize: 12, color: '#5C667A', minWidth: 150 }}>{l}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: bold ? 700 : 500, textAlign: 'right' }}>{v}</span>
        {right}
      </div>
    </div>
  );
}

function Timeline({ nodes, failed }: { nodes: Array<{ label: string; sub: string; done: boolean; active?: boolean; ts?: string }>; failed: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#5C667A', marginBottom: 16 }}>Payment tracking</p>
      {nodes.map((n, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < nodes.length - 1 ? 0 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: n.done ? '#059669' : n.active ? '#D97706' : '#E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#FFFFFF',
            }} className={n.active ? 'pulse' : ''}>
              {n.done ? '✓' : n.active ? '⏳' : i + 1}
            </div>
            {i < nodes.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, background: n.done ? '#059669' : '#E2E8F0', margin: '3px 0' }} />}
          </div>
          <div style={{ paddingBottom: 16, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: n.active || n.done ? 600 : 400, color: n.active || n.done ? '#1A2033' : '#9CA3AF', marginBottom: 2 }}>{n.label}</p>
            <p style={{ fontSize: 12, color: '#5C667A' }}>{n.sub}</p>
            {n.ts && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{n.ts}</p>}
          </div>
        </div>
      ))}
      {failed && (
        <InfoBanner type="warning" title="Delivery failed — we're on it">
          The payment could not be delivered. We've raised a dispute on your behalf. Your funds will be returned to your USD wallet within 2–5 business days.
        </InfoBanner>
      )}
    </div>
  );
}

function ManualReviewState({ ref_, amlCheck }: { ref_: string; amlCheck?: string }) {
  const [showDemoDetail, setShowDemoDetail] = useState(false);
  const hasDemoRule = amlCheck && amlCheck.startsWith('flagged —');

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Clock size={24} color="#D97706" />
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Your payment is under review</h3>
      <p style={{ fontSize: 13, color: '#5C667A', lineHeight: 1.6, marginBottom: 12 }}>
        We've flagged this payment for a routine compliance check. This typically takes <strong>2–4 business hours</strong>. You don't need to do anything — we'll email you when it's cleared.
      </p>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>Ref: {ref_}</p>
      <InfoBanner type="info">
        No funds have left your account yet. Your USD wallet has been debited. If the review finds an issue, your funds will be returned immediately.
      </InfoBanner>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>
        Questions? <a href="#" style={{ color: '#D4AF37' }}>compliance@borderless.ng</a>
      </p>

      {hasDemoRule && (
        <div style={{ marginTop: 16, border: '1.5px dashed #D97706', borderRadius: 8, overflow: 'hidden', textAlign: 'left' }}>
          <button
            onClick={() => setShowDemoDetail(p => !p)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FFFBEB', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#D97706', background: '#FEF3C7', border: '1px solid #D97706', borderRadius: 4, padding: '2px 5px' }}>DEMO</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>Why was this flagged?</span>
            </div>
            <span style={{ fontSize: 11, color: '#D97706' }}>{showDemoDetail ? '▲' : '▼'}</span>
          </button>
          {showDemoDetail && (
            <div style={{ padding: '10px 12px', background: '#FFFBEB', borderTop: '1px dashed #D97706' }}>
              <p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.6 }}>{amlCheck}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
