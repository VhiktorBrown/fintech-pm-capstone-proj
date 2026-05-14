import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import { SignUp } from './pages/SignUp';
import { KYBOnboarding } from './pages/onboarding/KYBOnboarding';
import { KYBReview } from './pages/onboarding/KYBReview';
import { KYBApproved, KYBRejected } from './pages/onboarding/KYBResult';
import { Dashboard } from './pages/Dashboard';
import { FundWallet } from './pages/wallet/FundWallet';
import { Convert } from './pages/convert/Convert';
import { ConvertSuccess } from './pages/convert/ConvertSuccess';
import { SendMoney } from './pages/send/SendMoney';
import { TransactionHistory } from './pages/transactions/TransactionHistory';
import { TransactionDetail } from './pages/transactions/TransactionDetail';
import { VerificationLimits } from './pages/profile/VerificationLimits';
import { KYBUpgrade } from './pages/profile/KYBUpgrade';
import { Beneficiaries } from './pages/Beneficiaries';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding/business" element={<KYBOnboarding />} />
          <Route path="/onboarding/documents" element={<KYBOnboarding />} />
          <Route path="/onboarding/director" element={<KYBOnboarding />} />
          <Route path="/onboarding/review" element={<KYBReview />} />
          <Route path="/onboarding/approved" element={<KYBApproved />} />
          <Route path="/onboarding/rejected" element={<KYBRejected />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet/fund" element={<FundWallet />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/convert/success" element={<ConvertSuccess />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
          <Route path="/profile/verification" element={<VerificationLimits />} />
          <Route path="/profile/upgrade" element={<KYBUpgrade />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
