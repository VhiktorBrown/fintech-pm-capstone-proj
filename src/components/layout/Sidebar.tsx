import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Send, List, Users, UserCircle, HelpCircle, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TierBadge } from '../ui/Badge';
import { mockUserData } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/send', icon: Send, label: 'Send Money' },
  { to: '/convert', icon: ArrowRightLeft, label: 'Convert' },
  { to: '/transactions', icon: List, label: 'Transactions' },
  { to: '/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/profile/verification', icon: UserCircle, label: 'Profile' },
];

export function Sidebar() {
  const { kybTier } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div style={{ padding: '0 20px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
          Borderless
        </h1>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Pay China, Simply</p>
        <div onClick={() => navigate('/profile/verification')} style={{ cursor: 'pointer', marginTop: 12 }}>
          <TierBadge tier={kybTier} />
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '16px 8px', flex: 1 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 12px', borderRadius: 8, marginBottom: 2,
              color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
              background: isActive ? '#1B3A6B' : 'transparent',
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
              transition: 'all 0.12s',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ padding: '16px 8px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '0 12px', marginBottom: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>{mockUserData.businessName}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{mockUserData.email}</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', width: '100%', color: 'rgba(255,255,255,0.45)', fontSize: 13, borderRadius: 8 }}>
          <HelpCircle size={15} />
          Support
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', width: '100%', color: 'rgba(255,255,255,0.45)', fontSize: 13, borderRadius: 8 }}
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </nav>
  );
}
