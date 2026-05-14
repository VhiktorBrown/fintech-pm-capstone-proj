import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/Badge';
import { ArrowRight, ArrowRightLeft, List, Plus } from 'lucide-react';
import { mockUserData } from '../context/AppContext';

function fmt(n: number, currency = '') {
  return currency + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Dashboard() {
  const navigate = useNavigate();
  const { ngnBalance, usdBalance, transactions } = useApp();
  const recent = transactions.slice(0, 5);

  return (
    <AuthLayout>
      <div className="page fade-in">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Welcome back,</p>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: '#1A2033' }}>
            {mockUserData.businessName}
          </h1>
        </div>

        {/* Wallet cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <WalletCard
            label="NGN Wallet"
            balance={'₦' + fmt(ngnBalance)}
            sub="Available"
            action="Fund Wallet"
            onAction={() => navigate('/wallet/fund')}
          />
          <WalletCard
            label="USD Wallet"
            balance={'$' + fmt(usdBalance)}
            sub="Available"
            action="Convert NGN"
            onAction={() => navigate('/convert')}
            dark2
          />
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => navigate('/send')}
          style={{
            width: '100%', padding: '16px 24px', marginBottom: 20,
            background: '#D4AF37', borderRadius: 10, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#0A1628',
            boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
          }}
        >
          <ArrowRight size={20} /> Send Money to China
        </button>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
          {[
            { icon: Plus, label: 'Fund Wallet', path: '/wallet/fund' },
            { icon: ArrowRightLeft, label: 'Convert', path: '/convert' },
            { icon: List, label: 'Transactions', path: '/transactions' },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              style={{
                padding: '14px 8px', background: '#FFFFFF', borderRadius: 10,
                border: '1px solid #E2E8F0', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.15s',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF2F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color="#0A1628" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1A2033' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Recent transactions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600 }}>Recent transactions</h2>
            <button onClick={() => navigate('/transactions')} style={{ fontSize: 12, color: '#D4AF37', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
              <p style={{ fontSize: 15 }}>No transactions yet</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Fund your wallet and make your first payment.</p>
            </div>
          ) : (
            <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {recent.map((tx, i) => (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/transactions/${tx.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    borderBottom: i < recent.length - 1 ? '1px solid #F1F5F9' : 'none',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8F9FC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: tx.type === 'convert' ? '#EEF2F9' : '#FBF4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {tx.type === 'convert' ? <ArrowRightLeft size={15} color="#5C667A" /> : <ArrowRight size={15} color="#D4AF37" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1A2033', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.type === 'convert' ? 'Convert NGN → USD' : tx.supplier}
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF' }}>{tx.date}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: tx.status === 'failed' ? '#DC2626' : '#1A2033', marginBottom: 4 }}>
                      {tx.type === 'convert' ? `+$${fmt(tx.amountUSD!)}` : `-$${fmt(tx.amountUSD!)}`}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

function WalletCard({ label, balance, sub, action, onAction, dark2 }: {
  label: string; balance: string; sub: string; action: string; onAction: () => void; dark2?: boolean;
}) {
  return (
    <div style={{ background: dark2 ? '#1B3A6B' : '#0A1628', borderRadius: 12, padding: 20, color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(212,175,55,0.06)' }} />
      <p style={{ fontSize: 11, fontWeight: 600, color: '#D4AF37', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p className="tabular" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#FFFFFF', marginBottom: 2, lineHeight: 1.2 }}>{balance}</p>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>{sub}</p>
      <button
        onClick={onAction}
        style={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
      >
        {action}
      </button>
    </div>
  );
}
