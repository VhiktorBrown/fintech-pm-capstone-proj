import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { X, Menu } from 'lucide-react';

interface Props { children: ReactNode; }

export function AuthLayout({ children }: Props) {
  const { toast, dismissToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="auth-layout">
      {/* Mobile top bar — hidden on desktop via CSS */}
      <header className="mobile-header">
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Menu size={22} />
        </button>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
          Borderless
        </h1>
        <div style={{ width: 30 }} />
      </header>

      {/* Tap-outside overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="content-area">
        {children}
      </main>

      {/* Toast */}
      {toast && (
        <div
          className="slide-in"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
            background: '#0A1628', color: '#FFFFFF',
            borderRadius: 10, padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            maxWidth: 360, display: 'flex', gap: 12, alignItems: 'flex-start',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{toast.message}</p>
            {toast.sub && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{toast.sub}</p>}
          </div>
          <button onClick={dismissToast} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0, marginTop: 1 }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
