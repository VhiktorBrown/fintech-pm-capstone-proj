import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ businessName: '', email: '', phone: '', password: '', confirm: '' });

  return (
    <div className="split-layout">
      {/* Left panel */}
      <div className="split-left">
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: '#FFFFFF', marginBottom: 16, lineHeight: 1.15 }}>
            Send money to China.<br />Transparently.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 40 }}>
            Built for Nigerian businesses. Cheaper than your agent. Faster than SWIFT.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['1.5% FX fee', 'Same-day delivery', 'Fully regulated'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: '16px 20px', background: 'rgba(212,175,55,0.1)', borderRadius: 10, border: '1px solid rgba(212,175,55,0.25)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Average saving vs informal agent</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: '#D4AF37' }}>73% cheaper</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>on a $10,000 transaction</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="split-right">
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#1A2033', marginBottom: 6 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 14, color: '#5C667A', marginBottom: 28 }}>
            For registered Nigerian businesses only.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Business Name" placeholder="Adeyemi Imports Ltd" value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} />
            <Input label="Business Email" type="email" placeholder="bukola@yourcompany.ng" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <Input label="Phone Number" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} />
          </div>

          <div style={{ marginTop: 24 }}>
            <Button fullWidth size="lg" onClick={() => navigate('/onboarding/business')}>
              Create Account →
            </Button>
          </div>

          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 16, lineHeight: 1.5 }}>
            By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
          <p style={{ fontSize: 13, color: '#5C667A', marginTop: 16, textAlign: 'center' }}>
            Already have an account?{' '}
            <a href="#" onClick={e => { e.preventDefault(); navigate('/dashboard'); }} style={{ color: '#D4AF37', fontWeight: 600 }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
