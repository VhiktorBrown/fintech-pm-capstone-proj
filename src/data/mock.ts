export const mockUser = {
  name: 'Bukola Adeyemi',
  businessName: 'Adeyemi Imports Ltd',
  email: 'bukola@adeyemiimports.ng',
  kybTier: 1 as 1 | 2 | 3,
  kybStatus: 'approved' as 'approved' | 'pending' | 'rejected',
  ngnBalance: 50_000_000,
  usdBalance: 32_450,
  virtualAccount: {
    bank: 'Providus Bank',
    accountName: 'Borderless / Adeyemi Imports Ltd',
    accountNumber: '5401234567',
  },
};

export const mockSuppliers = [
  {
    id: 'sup-1',
    name: 'Zhen Trading Co.',
    bank: 'Bank of China',
    accountNumber: '6217882344210055',
    cnapsCode: '102100099996',
    businessReg: '9131000074985631XA',
    address: 'No. 88 Nanjing Road, Huangpu District, Shanghai 200001',
    verified: true,
  },
  {
    id: 'sup-2',
    name: 'Guangzhou Textiles Ltd.',
    bank: 'China Construction Bank',
    accountNumber: '4367123456789012',
    cnapsCode: '105100000017',
    businessReg: '',
    address: 'No. 23 Zhongshan Avenue, Tianhe District, Guangzhou 510630',
    verified: false,
  },
];

export type TxStatus = 'delivered' | 'in_progress' | 'failed' | 'under_review' | 'complete' | 'failed_investigating' | 'refunded';

export interface Transaction {
  id: string;
  ref: string;
  type: 'send' | 'convert';
  supplier?: string;
  supplierId?: string;
  amountUSD?: number;
  totalDeducted?: number;
  cnyAmount?: number;
  exchangeRate?: number;
  amountNGN?: number;
  status: TxStatus;
  date: string;
  purpose?: string;
  invoice?: string;
  cnapsRef?: string;
  amlCheck?: string;
  kybTierAtTime?: number;
  deliveredAt?: string;
  submittedAt?: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    ref: 'BDL-2026-00842',
    type: 'send',
    supplier: 'Zhen Trading Co.',
    supplierId: 'sup-1',
    amountUSD: 5200,
    totalDeducted: 5215,
    cnyAmount: 37648,
    exchangeRate: 7.24,
    status: 'delivered',
    date: '10 May 2026',
    purpose: 'Importation of goods',
    invoice: 'inv_202605_zhen.pdf',
    cnapsRef: '202605100284AB3421',
    amlCheck: 'passed',
    kybTierAtTime: 1,
    submittedAt: '10 May 2026, 2:41 PM',
    deliveredAt: '10 May 2026, 4:05 PM',
  },
  {
    id: 'txn-2',
    ref: 'BDL-2026-00841',
    type: 'convert',
    amountNGN: 15_600_000,
    amountUSD: 10_000,
    exchangeRate: 1560,
    status: 'complete',
    date: '09 May 2026',
  },
  {
    id: 'txn-3',
    ref: 'BDL-2026-00840',
    type: 'send',
    supplier: 'Guangzhou Textiles Ltd.',
    supplierId: 'sup-2',
    amountUSD: 15_000,
    totalDeducted: 15_015,
    status: 'in_progress',
    date: '09 May 2026',
    purpose: 'Importation of goods',
    submittedAt: '09 May 2026, 10:12 AM',
  },
  {
    id: 'txn-4',
    ref: 'BDL-2026-00838',
    type: 'send',
    supplier: 'Shenzhen Electronics',
    amountUSD: 3000,
    totalDeducted: 3015,
    status: 'failed',
    date: '08 May 2026',
    purpose: 'Importation of goods',
    submittedAt: '08 May 2026, 3:20 PM',
  },
  {
    id: 'txn-5',
    ref: 'BDL-2026-00831',
    type: 'send',
    supplier: 'Zhen Trading Co.',
    supplierId: 'sup-1',
    amountUSD: 8500,
    totalDeducted: 8515,
    status: 'under_review',
    date: '07 May 2026',
    purpose: 'Service payment',
    submittedAt: '07 May 2026, 11:55 AM',
  },
];

export const FX_RATE_NGN_USD = 1560;
export const FX_RATE_USD_CNY = 7.24;
export const FLAT_FEE = 15;
export const FX_FEE_PCT = 0.015;
export const TIER_LIMITS = { 1: 3000, 2: 50000, 3: Infinity };
