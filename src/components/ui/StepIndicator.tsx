import { Check } from 'lucide-react';

interface Props {
  steps: string[];
  current: number; // 0-indexed
}

export function StepIndicator({ steps, current }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#D4AF37' : active ? '#0A1628' : '#E2E8F0',
                color: done ? '#0A1628' : active ? '#FFFFFF' : '#5C667A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                boxShadow: active ? '0 0 0 3px rgba(212,175,55,0.2)' : 'none',
              }}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: active ? 600 : 400,
                color: active ? '#0A1628' : done ? '#D4AF37' : '#9CA3AF',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: i < current ? '#D4AF37' : '#E2E8F0',
                margin: '0 8px', marginBottom: 20,
                transition: 'background 0.2s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OnboardingProgress({ steps, current }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 3, background: i <= current ? '#D4AF37' : '#E2E8F0', borderRadius: 2, transition: 'background 0.2s' }} />
          <span style={{ fontSize: 10, color: i <= current ? '#D4AF37' : '#9CA3AF', fontWeight: i === current ? 600 : 400 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
