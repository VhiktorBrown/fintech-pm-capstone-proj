import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { mockUser, mockSuppliers, mockTransactions } from '../data/mock';
import type { Transaction } from '../data/mock';

interface SendFlowState {
  supplierId: string;
  supplierName: string;
  paymentReason: string;
  invoiceFile: string;
  amount: number;
  preservedAmount?: number;
}

interface AppState {
  ngnBalance: number;
  usdBalance: number;
  kybTier: 1 | 2 | 3;
  transactions: Transaction[];
  sendFlow: Partial<SendFlowState>;
  toast: { message: string; sub?: string; action?: { label: string; path: string } } | null;
  setSendFlow: (s: Partial<SendFlowState>) => void;
  convertNGN: (ngnAmount: number, usdAmount: number) => void;
  deductUSD: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
  showToast: (msg: string, sub?: string, action?: { label: string; path: string }) => void;
  dismissToast: () => void;
  upgradeTier: (tier: 1 | 2 | 3) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ngnBalance, setNgnBalance] = useState(mockUser.ngnBalance);
  const [usdBalance, setUsdBalance] = useState(mockUser.usdBalance);
  const [kybTier, setKybTier] = useState<1|2|3>(mockUser.kybTier);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [sendFlow, setSendFlowState] = useState<Partial<SendFlowState>>({});
  const [toast, setToast] = useState<AppState['toast']>(null);

  const setSendFlow = (s: Partial<SendFlowState>) =>
    setSendFlowState(prev => ({ ...prev, ...s }));

  const convertNGN = (ngnAmount: number, usdReceived: number) => {
    setNgnBalance(p => p - ngnAmount);
    setUsdBalance(p => p + usdReceived);
  };

  const deductUSD = (amount: number) => setUsdBalance(p => p - amount);

  const addTransaction = (tx: Transaction) =>
    setTransactions(prev => [tx, ...prev]);

  const showToast = (message: string, sub?: string, action?: { label: string; path: string }) => {
    setToast({ message, sub, action });
    setTimeout(() => setToast(null), 6000);
  };

  const dismissToast = () => setToast(null);
  const upgradeTier = (tier: 1|2|3) => setKybTier(tier);

  return (
    <AppContext.Provider value={{
      ngnBalance, usdBalance, kybTier, transactions, sendFlow,
      toast, setSendFlow, convertNGN, deductUSD, addTransaction,
      showToast, dismissToast, upgradeTier,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const mockUserData = mockUser;
export const mockSuppliersData = mockSuppliers;
