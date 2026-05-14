import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUserData } from '../../context/AppContext';

const account = mockUserData.virtualAccount;

export function FundWallet() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
    showToast('Copied to clipboard', text);
  };

  return (
    <AuthLayout>
      <div className="page-centered fade-in">
        <div style={{ maxWidth: 520 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5C667A', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={14} /> Back
          </button>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Fund your NGN wallet</h1>
          <p style={{ fontSize: 14, color: '#5C667A', marginBottom: 24 }}>Transfer NGN to your dedicated Borderless account. Credited instantly via NIBSS.</p>

          <Card style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#5C667A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Your dedicated account
            </p>
            {[
              { label: 'Bank', value: account.bank },
              { label: 'Account Name', value: account.accountName },
              { label: 'Account Number', value: account.accountNumber, copyKey: 'number' },
            ].map(({ label, value, copyKey }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: 12, color: '#5C667A' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2033' }}>{value}</span>
                  {copyKey && (
                    <button onClick={() => copy(value, copyKey)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === copyKey ? '#059669' : '#D4AF37', display: 'flex' }}>
                      {copied === copyKey ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Card>

          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => copy(`Bank: ${account.bank}\nAccount Name: ${account.accountName}\nAccount Number: ${account.accountNumber}`, 'all')}
            >
              {copied === 'all' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy all details</>}
            </Button>
          </div>

          <InfoBanner>
            Transfer from any Nigerian bank. Your NGN wallet is credited automatically via NIBSS — usually within seconds. This account number is unique to your Borderless account.
          </InfoBanner>
        </div>
      </div>
    </AuthLayout>
  );
}
