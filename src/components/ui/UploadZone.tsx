import { useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

type ScanState = 'idle' | 'scanning' | 'pass' | 'fail_name' | 'fail_amount' | 'warn_hs';

interface Props {
  label?: string;
  helper?: string;
  onFile?: (filename: string) => void;
  scanEnabled?: boolean;
}

export function UploadZone({ label, helper, onFile, scanEnabled }: Props) {
  const [file, setFile] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanState>('idle');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (name: string) => {
    setFile(name);
    if (scanEnabled) {
      setScan('scanning');
      setTimeout(() => {
        setScan('pass');
        onFile?.(name);
      }, 1500);
    } else {
      onFile?.(name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0].name);
  };

  const simulateFail = (type: ScanState) => {
    setFile('invoice_test.pdf');
    setScan(type);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2033' }}>{label}</label>}

      {!file || scan === 'idle' ? (
        <label
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '28px 20px', cursor: 'pointer',
            border: `2px dashed ${dragOver ? '#D4AF37' : '#E2E8F0'}`,
            borderRadius: 10, background: dragOver ? '#FBF4DC' : '#F8F9FC',
            transition: 'all 0.15s',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f.name); }}
        >
          <UploadCloud size={28} color="#5C667A" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#1A2033' }}>Drag and drop your file here</p>
            <p style={{ fontSize: 12, color: '#D4AF37', marginTop: 2 }}>or browse files</p>
          </div>
          <p style={{ fontSize: 11, color: '#9CA3AF' }}>PDF, JPG, PNG — Max 10MB</p>
          <input type="file" style={{ display: 'none' }} onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      ) : (
        <div>
          {scan === 'scanning' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#EEF2F9', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div className="spinner" style={{ width: 16, height: 16, border: '2px solid #E2E8F0', borderTop: '2px solid #D4AF37', borderRadius: '50%' }} />
              <span style={{ fontSize: 13, color: '#5C667A' }}>Scanning invoice...</span>
            </div>
          )}
          {scan === 'pass' && (
            <div style={{ padding: '14px 16px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #059669' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CheckCircle size={16} color="#059669" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>Invoice verified</span>
              </div>
              <p style={{ fontSize: 12, color: '#065F46' }}>Supplier name matches · Amount detected: $5,200.00 · Payment reason: Importation of goods</p>
            </div>
          )}
          {(scan === 'fail_name' || scan === 'fail_amount') && (
            <div style={{ padding: '14px 16px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #DC2626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AlertCircle size={16} color="#DC2626" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#7F1D1D' }}>Invoice rejected</span>
              </div>
              <p style={{ fontSize: 12, color: '#7F1D1D', marginBottom: 10 }}>
                {scan === 'fail_name'
                  ? "The supplier name on the invoice ('Zhen Trade') does not match the registered beneficiary name ('Zhen Trading Co.'). Please re-upload the invoice with the exact registered business name."
                  : "The invoice amount ($6,200) does not match the amount you entered ($5,200). Please upload the correct invoice."}
              </p>
              <button onClick={() => { setFile(null); setScan('idle'); }} style={{ fontSize: 12, fontWeight: 600, color: '#DC2626', background: 'none', border: '1px solid #DC2626', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
                Re-upload Invoice
              </button>
            </div>
          )}
          {scan === 'warn_hs' && (
            <div style={{ padding: '14px 16px', background: '#FFFBEB', borderRadius: 8, border: '1px solid #D97706' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AlertCircle size={16} color="#D97706" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>No HS codes detected</span>
              </div>
              <p style={{ fontSize: 12, color: '#92400E', marginBottom: 8 }}>Your invoice does not contain HS (Harmonised System) product codes. This may cause delays at Chinese customs. We recommend re-uploading with HS codes.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => { setFile(null); setScan('idle'); }} style={{ fontSize: 12, fontWeight: 600, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Re-upload</button>
                <button onClick={() => { setScan('pass'); onFile?.(file!); }} style={{ fontSize: 12, fontWeight: 600, color: '#5C667A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Continue anyway →</button>
              </div>
            </div>
          )}
          {scan !== 'scanning' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 12px', background: '#EEF2F9', borderRadius: 6 }}>
              <FileText size={14} color="#5C667A" />
              <span style={{ fontSize: 12, color: '#5C667A', flex: 1 }}>{file}</span>
              {scan !== 'pass' && (
                <button onClick={() => { setFile(null); setScan('idle'); }} style={{ color: '#5C667A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {scanEnabled && !file && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>Demo scan states:</span>
          <button onClick={() => simulateFail('fail_name')} style={{ fontSize: 11, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Name mismatch</button>
          <button onClick={() => simulateFail('warn_hs')} style={{ fontSize: 11, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>No HS codes</button>
        </div>
      )}

      {helper && <p style={{ fontSize: 12, color: '#5C667A' }}>{helper}</p>}
    </div>
  );
}
