import type { CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'ghost-dark' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}

const base: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600,
  borderRadius: 8, transition: 'background 0.15s, opacity 0.15s',
  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
};

const variants: Record<Variant, CSSProperties> = {
  primary: { background: '#D4AF37', color: '#0A1628' },
  secondary: { background: 'transparent', color: '#D4AF37', border: '1.5px solid #D4AF37' },
  ghost: { background: 'transparent', color: '#5C667A', border: '1.5px solid #E2E8F0' },
  'ghost-dark': { background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)' },
  danger: { background: '#FEE2E2', color: '#7F1D1D', border: '1.5px solid #DC2626' },
};

const sizes: Record<Size, CSSProperties> = {
  sm: { fontSize: 12, padding: '6px 12px', height: 32 },
  md: { fontSize: 14, padding: '10px 20px', height: 40 },
  lg: { fontSize: 15, padding: '14px 24px', height: 52 },
};

export function Button({ variant = 'primary', size = 'md', children, onClick, disabled, fullWidth, type = 'button', style }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
