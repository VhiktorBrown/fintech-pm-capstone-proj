import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { StatusBadge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ArrowRightLeft, Search } from 'lucide-react';

function fmt(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Failed', value: 'failed' },
];

export function TransactionHistory() {
  const navigate = useNavigate();
  const { transactions } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(tx => {
    const matchFilter = filter === 'all' || tx.status === filter || (filter === 'failed' && (tx.status === 'failed' || tx.status === 'failed_investigating'));
    const matchSearch = !search || (tx.supplier?.toLowerCase().includes(search.toLowerCase())) || tx.ref.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <AuthLayout>
      <div className="page fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700 }}>Transactions</h1>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: filter === f.value ? '#0A1628' : '#FFFFFF',
                  color: filter === f.value ? '#FFFFFF' : '#5C667A',
                  border: `1px solid ${filter === f.value ? '#0A1628' : '#E2E8F0'}`,
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search supplier or reference..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, color: '#1A2033', background: '#FFFFFF', outline: 'none', width: 240 }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
              <p>No transactions found</p>
            </div>
          ) : (
            filtered.map((tx, i) => (
              <div
                key={tx.id}
                onClick={() => navigate(`/transactions/${tx.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8F9FC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: tx.type === 'convert' ? '#EEF2F9' : '#FBF4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tx.type === 'convert' ? <ArrowRightLeft size={15} color="#5C667A" /> : <ArrowRight size={15} color="#D4AF37" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.type === 'convert' ? 'Convert NGN → USD' : tx.supplier}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>{tx.ref} · {tx.date}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: (tx.status === 'failed' || tx.status === 'failed_investigating') ? '#DC2626' : '#1A2033', marginBottom: 4 }}>
                    {tx.type === 'convert' ? `+$${fmt(tx.amountUSD!)}` : `-$${fmt(tx.amountUSD!)}`}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
