import type { CSSProperties, ChangeEvent, ReactNode } from 'react';

interface InputProps {
  label?: string;
  helper?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  prefix?: string;
  suffix?: ReactNode;
  style?: CSSProperties;
  maxLength?: number;
}

interface SelectProps {
  label?: string;
  helper?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

interface TextAreaProps {
  label?: string;
  helper?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const inputBase: CSSProperties = {
  width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8,
  padding: '10px 14px', fontSize: 14, color: '#1A2033',
  background: '#FFFFFF', outline: 'none', transition: 'border-color 0.15s',
};

export function Input({ label, helper, error, placeholder, value, onChange, type = 'text', prefix, suffix, style, maxLength }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2033' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: 14, color: '#5C667A', fontWeight: 500, fontSize: 14, pointerEvents: 'none' }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          style={{
            ...inputBase,
            paddingLeft: prefix ? 28 : 14,
            paddingRight: suffix ? 40 : 14,
            borderColor: error ? '#DC2626' : '#E2E8F0',
            ...style,
          }}
          onFocus={e => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = error ? '#DC2626' : '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
        />
        {suffix && <span style={{ position: 'absolute', right: 14 }}>{suffix}</span>}
      </div>
      {helper && !error && <p style={{ fontSize: 12, color: '#5C667A' }}>{helper}</p>}
      {error && <p style={{ fontSize: 12, color: '#DC2626' }}>{error}</p>}
    </div>
  );
}

export function Select({ label, helper, value, onChange, options }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2033' }}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        style={{
          ...inputBase,
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23D4AF37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: 36,
          cursor: 'pointer',
        }}
        onFocus={e => { e.target.style.borderColor = '#D4AF37'; }}
        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {helper && <p style={{ fontSize: 12, color: '#5C667A' }}>{helper}</p>}
    </div>
  );
}

export function TextArea({ label, helper, placeholder, value, onChange, rows = 3 }: TextAreaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2033' }}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{ ...inputBase, resize: 'vertical' }}
        onFocus={e => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
      />
      {helper && <p style={{ fontSize: 12, color: '#5C667A' }}>{helper}</p>}
    </div>
  );
}
