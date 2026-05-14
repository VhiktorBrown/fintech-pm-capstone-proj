import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { VerifiedBadge } from '../components/ui/Badge';
import { mockSuppliersData } from '../context/AppContext';
import { Users } from 'lucide-react';

export function Beneficiaries() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className="page fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700 }}>Beneficiaries</h1>
          <Button size="sm" onClick={() => navigate('/send')}>+ Add Supplier</Button>
        </div>

        {mockSuppliersData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#9CA3AF' }}>
            <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15 }}>No saved suppliers yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Add your first supplier when making a payment.</p>
            <div style={{ marginTop: 20 }}><Button onClick={() => navigate('/send')}>Send Money →</Button></div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {mockSuppliersData.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderBottom: i < mockSuppliersData.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                  {s.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</p>
                    {s.verified ? <VerifiedBadge /> : <span style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>Unverified</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#5C667A' }}>{s.bank} · {s.cnapsCode}</p>
                </div>
                <button onClick={() => navigate('/send')} style={{ fontSize: 13, color: '#D4AF37', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Pay →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
