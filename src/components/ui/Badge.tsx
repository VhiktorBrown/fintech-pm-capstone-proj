import type { CSSProperties, ReactNode } from 'react';
import type { TxStatus } from '../../data/mock';

type TierLevel = 1 | 2 | 3;

interface StatusBadgeProps { status: TxStatus; }
interface TierBadgeProps { tier: TierLevel; }

const statusMap: Record<TxStatus, { bg: string; color: string; dot: string; label: string }> = {
  delivered:           { bg: '#DCFCE7', color: '#065F46', dot: '#059669', label: 'Delivered' },
  in_progress:         { bg: '#FEF3C7', color: '#92400E', dot: '#D97706', label: 'In Progress' },
  failed:              { bg: '#FEE2E2', color: '#7F1D1D', dot: '#DC2626', label: 'Failed' },
  failed_investigating:{ bg: '#FEF3C7', color: '#92400E', dot: '#D97706', label: 'Failed — Investigating' },
  under_review:        { bg: '#FEF3C7', color: '#92400E', dot: '#D97706', label: 'Under Review' },
  complete:            { bg: '#DCFCE7', color: '#065F46', dot: '#059669', label: 'Complete' },
  refunded:            { bg: '#EEF2F9', color: '#3B4A6B', dot: '#5C667A', label: 'Refunded' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusMap[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif",
      padding: '3px 8px', borderRadius: 9999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

const tierMap: Record<TierLevel, { bg: string; color: string; border: string; label: string }> = {
  1: { bg: '#FBF4DC', color: '#92400E', border: '1px solid #D4AF37', label: 'Tier 1 — Starter' },
  2: { bg: '#D4AF37', color: '#0A1628', border: 'none', label: 'Tier 2 — Growth' },
  3: { bg: '#0A1628', color: '#D4AF37', border: 'none', label: 'Tier 3 — Business' },
};

export function TierBadge({ tier }: TierBadgeProps) {
  const t = tierMap[tier];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: t.bg, color: t.color, border: t.border,
      fontSize: 11, fontWeight: 600, fontFamily: "'Syne', sans-serif",
      padding: '4px 10px', borderRadius: 9999, cursor: 'pointer',
    }}>
      {t.label}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#DCFCE7', color: '#065F46',
      border: '1px solid #059669',
      fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif",
      padding: '3px 8px', borderRadius: 9999,
    }}>
      <span>✓</span> Verified Supplier
    </span>
  );
}

export function Chip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#EEF2F9', color: '#5C667A',
      fontSize: 11, fontWeight: 500, fontFamily: "'Inter', sans-serif",
      padding: '3px 8px', borderRadius: 9999, ...style,
    }}>
      {children}
    </span>
  );
}
