import type { ReactNode } from 'react';
import { Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

type BannerType = 'info' | 'success' | 'warning' | 'error';

interface Props {
  type?: BannerType;
  title?: string;
  children: ReactNode;
}

const config = {
  info:    { bg: '#EFF6FF', border: '#2563EB', icon: Info,         iconColor: '#2563EB', textColor: '#1E40AF' },
  success: { bg: '#F0FDF4', border: '#059669', icon: CheckCircle,  iconColor: '#059669', textColor: '#065F46' },
  warning: { bg: '#FFFBEB', border: '#D97706', icon: AlertTriangle, iconColor: '#D97706', textColor: '#92400E' },
  error:   { bg: '#FEF2F2', border: '#DC2626', icon: XCircle,      iconColor: '#DC2626', textColor: '#7F1D1D' },
};

export function InfoBanner({ type = 'info', title, children }: Props) {
  const c = config[type];
  const Icon = c.icon;
  return (
    <div style={{
      background: c.bg, borderLeft: `4px solid ${c.border}`,
      borderRadius: '0 8px 8px 0', padding: '12px 16px',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <Icon size={16} color={c.iconColor} style={{ marginTop: 1, flexShrink: 0 }} />
      <div style={{ color: c.textColor, fontSize: 13, lineHeight: 1.5 }}>
        {title && <p style={{ fontWeight: 600, marginBottom: 2 }}>{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function AlertBanner({ type = 'info', title, children }: Props) {
  const c = config[type];
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 8, padding: '12px 16px',
      color: c.textColor, fontSize: 13, lineHeight: 1.5,
    }}>
      {title && <p style={{ fontWeight: 600, marginBottom: 4 }}>{title}</p>}
      {children}
    </div>
  );
}
