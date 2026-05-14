import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number | string;
  className?: string;
}

export function Card({ children, style, padding = 24, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 10,
        padding,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DarkCard({ children, style, padding = 24 }: CardProps) {
  return (
    <div style={{
      background: '#0A1628',
      borderRadius: 12,
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: '#5C667A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
      {children}
    </p>
  );
}
