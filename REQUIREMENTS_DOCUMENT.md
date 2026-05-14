# **REQUIREMENTS DOCUMENT: BORDERLESS — B2B CROSS-BORDER PAYMENT PLATFORM (v1)**

**Product:** Borderless
**Feature Owner:** Product Team
**Last Updated:** May 2026
**Status:** Draft
**Version:** 1.0

---

## **1. FEATURE OVERVIEW**

### **What Borderless v1 Does**

Borderless is a cross-border B2B payment platform that lets Nigerian business owners pay their Chinese suppliers faster and cheaper than the informal agent model they currently rely on. In v1, the product does one thing: it lets a Nigerian business fund a naira wallet, convert to USD, and send payment to a Chinese supplier's bank account via a local CNAPS transfer. The supplier receives Chinese yuan within the same business day or next business day, and the business owner has a full digital audit trail of the transaction.

We are not building inbound payments, multi-user permissions, or multi-corridor support in v1. Those are future releases. Everything in this document is scoped to a single business owner paying a single Chinese supplier from a Nigerian business account.

### **Why It Matters**

The problem we are solving is not a SWIFT problem. It is an informal agent problem. Most Lagos-based importers paying Chinese suppliers today use a personal network of Nigerian agents who hold Chinese bank accounts. The FX rate is negotiated each time, the flat fee is $100 to $200 per transaction, and even with this optimised route the money takes 2 to 3 days. There is no audit trail. There is no recourse. And the entire arrangement depends on a trust relationship that took years to build, which means it is not available to every business that needs it.

Borderless replaces that with a fully regulated, auditable, predictable payment flow that is 70 to 82 percent cheaper than the agent model across every transaction size.

### **Who Uses This Feature**

**Primary User:**

- **Business Owner (Mobile App):** The person who runs the business, owns the CAC registration, and is personally responsible for making supplier payments. They fund the wallet, initiate conversions, and approve payments. In v1, this is the only user type. Role-based access for finance managers is a v2 feature.

**Upstream Partners (not users, but relevant to the flow):**

- **Anchor:** Issues the NGN virtual account; processes NIBSS inflows
- **Providus Bank:** Executes NGN to USD FX purchases on NAFEM
- **Airwallex:** Holds the pre-funded USD pool; wires USD to LianLian
- **LianLian Global:** Converts USD to CNY; delivers via CNAPS to the Chinese supplier

---

## **2. USER STORIES & JOBS TO BE DONE**

### **Business Owner User Stories (Primary Flow)**

**As a business owner completing onboarding, I want to:**

- Register my business using my CAC registration number so I can verify I am a legitimate Nigerian business
- Complete identity verification using my BVN, NIN, and a live selfie so the platform can confirm who I am
- See my current KYB tier, my transaction limits, and what I need to provide to upgrade so I always know where I stand
- Access my account verification status and upgrade my tier from my profile at any time, not just when I hit a limit

**As a business owner funding my wallet, I want to:**

- See a dedicated virtual account number I can use to transfer naira from any Nigerian bank so I do not need to share sensitive banking credentials
- See my wallet balance update instantly when my naira transfer lands so I know my funds are ready to use

**As a business owner converting funds, I want to:**

- See the exact exchange rate and fee before I confirm a conversion so I know exactly what I am getting
- Convert naira to USD in one step so my funds are ready to send without unnecessary delays

**As a business owner paying a Chinese supplier, I want to:**

- Add my supplier's bank details once and save them for future use so I do not have to re-enter them every time
- Upload a proforma invoice so the system can verify the payment purpose and keep me compliant
- See a clear summary of the total cost, the converted CNY amount, the fee, and the expected delivery window before I confirm
- Receive a notification when my payment is delivered so I know my supplier has been paid without having to chase them
- Access a full transaction record with a CNAPS reference number so I have documentation for my accountant, customs, or any audit

**As a business owner managing my limits, I want to:**

- Upgrade my KYB tier from within a blocked transaction so I can complete the payment without losing what I have already entered
- Understand clearly what documents I need to provide for the next tier so there are no surprises

---

### **Edge Case User Stories**

**Edge Case 1: Transaction Attempted Above Tier Limit**

**As a business owner who has hit my tier transaction limit, I want to:**

- See a clear explanation of why my transaction was blocked and exactly what I need to do to proceed
- Start the tier upgrade process without losing my in-progress transaction details so I do not have to re-enter everything when I come back

**Edge Case 2: Invoice Rejected Because Supplier Name Does Not Match**

**As a business owner whose invoice has been rejected, I want to:**

- Understand the specific reason the invoice was flagged so I can fix the right thing
- Re-upload a corrected invoice without having to restart the entire payment flow

---

### **Jobs to Be Done**

**When** my Chinese supplier is asking to be paid and I need to move money urgently,
**I want to** initiate a payment that arrives within hours, not days,
**So I can** maintain my supplier relationship and keep my supply chain moving.

**When** I need to explain a payment to my accountant or show documentation at customs,
**I want to** pull up a complete digital record of the transaction with the CNAPS reference and all fees shown,
**So I can** demonstrate that the payment was made through a legitimate, regulated channel.

---

## **3. ACCESS CHANNELS**

### **Business Owner Mobile App (iOS and Android)**

**Access Points:**

- App launch → Onboarding → KYB Verification
- Dashboard → Fund Wallet → View virtual account
- Dashboard → Convert → NGN to USD
- Dashboard → Send Money → Select China corridor → Add Beneficiary → Upload Invoice → Review → Confirm
- Profile → Verification and Limits → Upgrade KYB tier

**Key Screens:**

1. Sign Up and Business Details
2. KYB Tier 1 Verification (RC/BN, BVN, NIN, ID, live selfie)
3. KYB Review Status
4. Tier Status and Limits (also accessible from Profile)
5. Dashboard (NGN wallet, USD wallet, quick actions)
6. Fund Wallet (virtual NGN account details)
7. Convert (NGN to USD with rate and fee preview)
8. Send Money (corridor selector)
9. Payment Reason Selection
10. Add Beneficiary (supplier details)
11. Invoice Upload
12. FX Summary and Fee Breakdown
13. Review and Confirm
14. Payment In Progress
15. Transaction History
16. Transaction Detail with Audit Trail

---

## **4. CORE FUNCTIONALITY**

Borderless v1 delivers five core capabilities. Everything else is out of scope.

### **4.1 Business Onboarding and KYB**

- Three-tier KYB system (Starter, Growth, Business)
- Tier 1 activated during sign-up using basic business and identity documents
- Tier 2 and Tier 3 upgrades triggered by user request (from profile) or when a transaction is attempted above the current tier limit
- KYB failure and rejection states visible with clear remediation steps

### **4.2 NGN Wallet Funding**

- Unique NGN virtual account per user, issued by Anchor, mapped to NIBSS
- Funds credited instantly on NIBSS settlement
- No minimum deposit amount

### **4.3 NGN to USD Conversion**

- Real-time rate sourced from Providus Bank's NAFEM access
- Rate locked at the moment the user confirms the conversion
- Conversion is a ledger update, no delay

### **4.4 Supplier Payment (China Corridor Only)**

- Beneficiary added once, saved for reuse
- Proforma Invoice required for all Tier 2 and Tier 3 transactions
- AI-assisted invoice scan checks HS codes, supplier name match, and amount consistency
- Chinese supplier business registration verified via Qichacha API at beneficiary setup
- Payment instruction sent via LianLian Global API; USD wire via Airwallex

### **4.5 Transaction History and Audit Trail**

- Every transaction stored with full detail: amount, rate, CNY equivalent, CNAPS reference, timestamps, partner routing
- Accessible from dashboard; exportable for accounting and customs documentation

---

## **5. FUNCTIONAL REQUIREMENTS**

---

### **5.1 Business Onboarding and KYB**

#### **FR-1.1: KYB Tier 1 Onboarding**

**KYC Compliance Gate**

This is the compliance gate that controls access to the platform. A business cannot transact until Tier 1 KYB is approved. Here is the exact gate logic.

**User-Facing Behavior:**

- User downloads the app and begins sign-up
- User enters business email, password, business name, country (Nigeria), and phone number
- User enters CAC registration number (RC or BN)
- System verifies the registration number in real time against the CAC database
- User uploads Certificate of Incorporation or Business Name Certificate
- User enters BVN and NIN
- User completes a live selfie for biometric liveness check
- System shows a "Verification Under Review" screen with a 24 to 48 hour estimate and an email notification promise
- User receives email when verification is complete

**System Logic:**

- Smile ID cross-references BVN and NIN against the NIMC database in real time
- Smile ID runs liveness check on the selfie to confirm the face matches the government ID
- System screens the director's name against OFAC, UN, and EU sanctions watchlists and checks for Politically Exposed Person status
- CAC registration number is verified against the CAC API
- If all checks pass automatically: KYB status set to APPROVED; user notified within minutes
- If any check requires manual review: KYB status set to PENDING; compliance team reviews within 48 hours
- If any check fails: KYB status set to REJECTED; user is told the specific reason and what to do

**KYB Failure States and What the User Sees:**

- BVN or NIN does not match government database → "We could not verify your identity. Please confirm your BVN and NIN are correct and try again."
- Liveness check fails (face does not match ID) → "The selfie did not match your ID photo. Please retake in good lighting, looking directly at the camera."
- CAC number is invalid or inactive → "We could not find an active business with that registration number. Please check and try again."
- Director name appears on a sanctions list → Account is placed under manual review with no specific reason disclosed; compliance team investigates
- KYB is rejected after manual review → "Your account verification was unsuccessful. Please contact support to understand next steps."

**Validation:**

- CAC number: Required, must match the format for RC (RC followed by digits) or BN (BN followed by digits)
- BVN: Required, exactly 11 digits
- NIN: Required, exactly 11 digits
- Government ID: Required, must be a clear image, file size under 10MB
- Selfie: Required, live capture only (no photo uploads accepted)

**Edge Cases:**

- User's BVN was registered under a slightly different name spelling → Manual review triggered; compliance team cross-references; user notified within 48 hours
- CAC database is temporarily unreachable → "Business verification is taking a little longer than usual. We will notify you once it is complete." KYB set to PENDING; system retries automatically every 30 minutes

---

#### **FR-1.2: KYB Tier Limit Enforcement and Upgrade**

**User-Facing Behavior:**

- User attempts to initiate a payment above their current tier limit
- System blocks the transaction before it reaches the payment confirmation step
- Blocked screen (Screen 19) displays: current tier, the specific limit that was exceeded, the next tier's limits, and the documents required to upgrade
- "Upgrade Now" button launches the KYB upgrade flow in context
- Transaction details (supplier, amount, invoice) are preserved in the session
- After upgrade is approved, user is returned to the payment flow with their details pre-filled
- User can also access the upgrade flow proactively from Profile → "Verification and Limits" at any time (Screen 7a), before hitting a limit

**System Logic:**

- Transaction limit check runs before the FX Summary screen is shown
- System checks both the single transaction limit AND the monthly cumulative limit for the user's current tier
- If either limit is exceeded, the transaction is blocked and the upgrade flow is triggered
- KYB upgrade follows the same verification pipeline as initial onboarding, plus the additional documents specific to the next tier
- Upgrade approval timeline: automated checks for most Tier 2 upgrades; up to 48 hours for manual reviews or Tier 3 upgrades

**Tier Limits for Reference:**

- Tier 1: $3,000 single transaction, $5,000 monthly cumulative
- Tier 2: $50,000 single transaction, $100,000 monthly cumulative
- Tier 3: No preset cap; transactions above $200,000 require Enhanced Due Diligence approval before processing

**Edge Cases:**

- User's monthly cumulative limit is exceeded mid-month even though the single transaction is within limits → "You have reached your monthly payment limit for your current tier. Upgrade to Tier 2 to continue." Monthly limit resets on the first of each month.
- User initiates upgrade and then closes the app mid-flow → Uploaded documents are saved; user can resume the upgrade from Profile → Verification and Limits when they return

---

### **5.2 NGN Wallet Funding**

#### **FR-2.1: Wallet Funding via Virtual NGN Account**

**User-Facing Behavior:**

- User navigates to Dashboard → "Fund Wallet"
- Screen shows their unique NGN virtual account number, bank name (Anchor partner bank), and account name (their business name)
- User transfers naira from any Nigerian bank using their regular banking app
- NGN wallet balance updates instantly when funds arrive
- User receives a push notification: "Your naira wallet has been credited with [amount]."

**System Logic:**

- Each user is assigned a unique, persistent NGN virtual account number at KYB approval
- NIBSS processes the inbound transfer and sends a webhook notification to Anchor
- Anchor notifies Borderless via API
- Borderless credits the user's NGN wallet in the internal ledger
- Transaction is logged with: amount received, source bank, timestamp, NIBSS reference

**Edge Cases:**

- User transfers from a bank name that does not match their registered business name → Funds are received and credited; no restriction at funding stage (restriction applies at payment stage via AML monitoring)
- User transfers an odd amount (e.g., ₦10,000,007) → Full amount credited; no rounding

**Error Handling:**

- NIBSS settlement delayed (rare) → Funds appear as "Pending" in wallet; auto-credited when NIBSS confirms; user receives notification when credited
- User sends funds to a wrong account number → This is outside Borderless's control; user must resolve with their sending bank directly

---

### **5.3 NGN to USD Conversion**

#### **FR-3.1: Currency Conversion**

**User-Facing Behavior:**

- User taps "Convert" from the dashboard
- Screen shows the real-time NGN to USD rate, the 1.5 percent conversion fee, and the USD amount they will receive for the naira amount entered
- User enters the naira amount they want to convert
- Rate and resulting USD amount update in real time as they type
- User taps "Confirm Conversion"
- System shows a confirmation screen with: naira debited, USD credited, rate used, fee deducted
- USD wallet balance updates instantly
- Push notification: "You have converted [naira amount] to [USD amount] at a rate of [rate]."

**System Logic:**

- Rate is pulled from Providus Bank's NAFEM feed in real time
- The rate displayed to the user is the NAFEM rate minus Providus Bank's spread and plus Borderless's 1.5 percent margin
- Rate is locked at the exact moment the user taps "Confirm Conversion"
- Providus Bank executes the NAFEM purchase within seconds of confirmation
- Borderless credits the USD ledger balance from the pre-funded Airwallex pool; the nostro-to-Airwallex pool replenishment happens separately via treasury sweep
- Minimum conversion: $5 equivalent

**Edge Cases:**

- User tries to convert more naira than their current NGN wallet balance → "You do not have enough naira in your wallet to convert this amount. Please fund your wallet first."
- NAFEM rate changes significantly between screen load and confirmation (more than 1 percent in a single session) → Rate is refreshed automatically; user sees "The rate has been updated. Please review the new amount before confirming."

---

### **5.4 Supplier Payment (Primary Flow)**

#### **FR-4.1: Add Beneficiary**

**User-Facing Behavior:**

- User taps "Send Money" and selects China (the only active corridor in v1; other corridors show "Coming Soon")
- User selects "Add New Beneficiary"
- User enters:
  - Supplier legal name (as registered in China)
  - Bank name
  - Bank account number
  - CNAPS code (local Chinese routing number)
  - Chinese Business Registration Number (18 digits)
  - Business address in China
- System runs Qichacha verification in the background on the 18-digit registration number
- If verification passes: beneficiary is saved with a "Verified Supplier" badge; user proceeds
- If verification fails: "We could not verify this supplier in the Chinese business registry. Please confirm the registration number is correct. You can still proceed, but this payment will be held for manual review before it is sent."
- Saved beneficiaries appear in a list for future payments; user selects from the list instead of re-entering details

**System Logic:**

- Qichacha API call is made immediately on registration number entry; result is returned within seconds
- Verification status is stored against the beneficiary record
- Unverified beneficiaries can still be added and used, but all payments to them trigger a manual review hold before the payment instruction is sent to LianLian

**Validation:**

- Supplier legal name: Required
- Bank account number: Required
- CNAPS code: Required, must be exactly 12 digits
- Chinese Business Registration Number: Required, must be exactly 18 characters (alphanumeric)
- Business address: Required

---

#### **FR-4.2: Payment Reason Selection**

**User-Facing Behavior:**

- Displayed between corridor selection and Add Beneficiary
- Dropdown with five options:
  - Importation of goods
  - Service payment
  - Professional fees or consultancy
  - Intellectual property or licensing
  - Other (requires a short text description)
- If the proforma invoice scan in FR-4.3 detects HS codes, the payment reason is auto-set to "Importation of goods" and user is shown the selection pre-filled (they can override it)

**System Logic:**

- Payment reason is stored against the transaction record
- If "Importation of goods" is selected: a Form M awareness flag is queued to appear on the Review and Confirm screen (FR-4.5)
- Payment reason is submitted to LianLian with the payment instruction, as required for SAFE regulatory compliance

---

#### **FR-4.3: Proforma Invoice Upload**

**Required for all Tier 2 and Tier 3 transactions. Optional for Tier 1.**

**User-Facing Behavior:**

- User is prompted to upload a proforma invoice
- Accepted formats: PDF, JPG, PNG; maximum file size 10MB
- After upload, system shows: "Scanning your invoice..." with a brief loading state
- If scan passes: "Invoice accepted. Your payment details have been verified." User proceeds.
- If scan fails (see rejection logic): user sees the specific failure reason and a "Re-upload Invoice" button

**System Logic:**

- AI-assisted scan checks for:
  - HS codes present (required for Tier 2 and above)
  - Supplier name on the invoice matches the saved beneficiary name exactly (case-insensitive)
  - Invoice amount is consistent with the payment amount (within 10 percent tolerance)
  - Invoice is dated within 180 days
- If HS codes are detected: payment reason auto-set to "Importation of goods" (see FR-4.2)
- Invoice data (supplier name, goods description, HS codes, amount) is stored against the transaction

**Invoice Rejection Reasons and What the User Sees:**

- Supplier name on invoice does not match beneficiary name → "The supplier name on your invoice does not match the name on the bank account. Please check that both are identical. If your supplier uses a trading name, make sure the invoice shows the registered legal name."
- Invoice amount does not match payment amount by more than 10 percent → "The invoice amount does not match the amount you are sending. Please re-upload with an invoice that matches, or adjust your payment amount."
- HS codes missing → "Your invoice does not include product HS codes. Please request an updated invoice from your supplier that includes these codes."
- Invoice is dated more than 180 days ago → "This invoice is more than six months old. Please request a current invoice from your supplier."

---

#### **FR-4.4: FX Summary and Payment Confirmation**

**User-Facing Behavior:**

- User sees a summary screen before confirming the payment:
  - Amount in USD being sent
  - Equivalent CNY the supplier will receive (based on LianLian's confirmed rate)
  - FX rate applied (USD to CNY)
  - Borderless transaction fee: 1.5 percent of transaction value plus $15 flat fee
  - Net USD deducted from wallet
  - Estimated delivery: "Same business day if initiated before [time]; next business day otherwise"
- User taps "Confirm and Send"
- If payment reason is "Importation of goods": a banner is shown above the confirm button reading "This payment is for imported goods. If you are formally importing these goods into Nigeria, you may be required to file a Form M with your bank. Your Borderless payment receipt can be used as supporting documentation."
- After confirmation: user is taken to the Payment In Progress screen with a unique tracking reference number

**System Logic:**

- On user confirmation, Borderless simultaneously calls:
  - LianLian API: POST /payout/create (sends supplier CNAPS details, CNY amount, invoice reference); receives transaction_id and LianLian's USD receiving account
  - Airwallex API: POST /transfers (instructs USD wire from Borderless pool to LianLian's receiving account)
- USD is debited from user's USD wallet ledger at the moment of confirmation
- Internal transaction status set to IN_PROGRESS
- Both API calls must succeed before the transaction is marked as submitted; if either fails, the USD debit is reversed and the user is shown an error

**Validation:**

- User must have sufficient USD balance to cover both the payment amount and the flat fee
- Payment amount minimum: $5

---

#### **FR-4.5: Payment Status and Delivery Confirmation**

**User-Facing Behavior:**

- User sees "Payment In Progress" with the tracking reference number
- No status changes until a definitive outcome is reached
- When LianLian sends a payout.delivered webhook: status changes to "Payment Delivered"
- User receives: push notification + email with the CNAPS reference number and full transaction summary
- If Airwallex sends a transfer.failed webhook: status changes to "Payment Failed"; user receives notification with instructions to contact support

**System Logic (Webhook Chain):**

All intermediate events (Airwallex transfer.created, transfer.submitted, transfer.processing; LianLian payout.received, payout.processing) are logged internally. They do NOT update the user-facing status. Only the following events update what the user sees:

- LianLian payout.delivered → Status: "Payment Delivered"; CNAPS reference stored in Transaction Detail
- Airwallex transfer.failed → Status: "Payment Failed"; USD debit reversed to user's wallet
- LianLian payout.failed → Status: "Payment Failed - Investigating"; dispute raised with LianLian

**Design principle:** The user sees only "In Progress" until there is a definitive outcome. No intermediate status flicker.

---

### **5.5 Settlement and Reconciliation Flow**

**Settlement and Reconciliation Flow**

This is the required reconciliation flow for the requirements document.

#### **FR-5.1: Daily Reconciliation**

**System Logic:**

Every day at 11:59pm WAT, Borderless runs an automated reconciliation that matches four data sources using the Borderless unique transaction reference number as the reconciliation key:

| Data Source | Matched Against |
|---|---|
| Anchor NIBSS inflow records | Borderless NGN wallet credits |
| Providus Bank FX conversion records | Borderless USD wallet debits/credits |
| Airwallex account statement | Borderless payment instructions sent |
| LianLian CNAPS delivery confirmations | Borderless completed transaction records |

**Reconciliation Outcomes:**

- Full match across all four sources → Transaction marked RECONCILED; no action required
- Airwallex account shows a USD debit that does not match any Borderless payment instruction → Flagged as UNMATCHED DEBIT; compliance team investigates within 4 business hours
- LianLian shows a payout.delivered confirmation for a transaction that Airwallex has not yet marked as transfer.settled → Transaction stays IN_PROGRESS; flag raised for investigation; LianLian is contacted to confirm the USD receiving account was funded
- Borderless transaction shows COMPLETED but LianLian CNAPS confirmation is missing → Transaction downgraded to PENDING_CONFIRMATION; LianLian contacted for delivery trace

**Partner Settlement Timing:**

- Anchor: Monthly invoice for NIBSS collection fees
- Providus Bank: FX spread deducted at the point of each conversion; SWIFT sweep wires settle in 1 to 2 business days
- Airwallex: Pre-funded pool debited per payment instruction; fees invoiced on agreed periodic schedule
- LianLian Global: Daily net settlement; all transactions from Day N are netted and settled by Day N+1 morning

**What the Operations Team Sees:**

- A daily reconciliation dashboard showing: total transactions, total matched, total flagged
- Any flagged items appear in an investigation queue with the transaction reference, the specific mismatch, and a 4-hour SLA for resolution

---

### **5.6 AML Monitoring**

#### **FR-6.1: Per-Transaction AML Checks**

**System Logic:**

The following six rules run automatically in real time on every transaction before it is submitted to LianLian. A flag holds the transaction in Manual Review (Screen 21) before it proceeds.

**Rule 1 - Tier-limit structuring:** Flag if a user sends multiple transactions within a session that cluster just below their single-transaction tier limit. Pattern: 3 or more transactions in 24 hours all within 5 percent of the same ceiling.

**Rule 2 - Aggregate threshold structuring:** Flag if a single account's total transactions within any rolling 5-business-day window exceed $10,000, where each individual transaction was below $10,000.

**Rule 3 - Velocity:** Flag if 3 or more transactions are initiated from the same account within any 24-hour period.

**Rule 4 - Just-below-threshold pattern:** Flag if a user sends 3 or more transactions in a rolling 30-day period where each amount is consistently within 5 percent of the same ceiling.

**Rule 5 - Multi-beneficiary dispersion:** Flag if payments go to 3 or more different new beneficiaries in one day from the same account.

**Rule 6 - Source of funds:** Flag if the funding account has not been used with Borderless before, or if the origin is a high-risk jurisdiction.

**When a Flag Is Raised:**

- Transaction is held in Manual Review status
- User sees: "Your transaction is under review. This usually takes 2 to 4 business hours. We will notify you when it is resolved."
- Compliance team reviews and either approves (transaction proceeds) or rejects (transaction cancelled, USD reversed)
- If confirmed suspicious after review: STR filed with NFIU within 24 hours
- User is not told the specific rule that triggered the flag; generic "under review" message only

---

### **5.7 Failure and Dispute Handling**

**This is the required failure and dispute scenario for the requirements document.**

#### **FR-7.1: Mid-Flight Payment Failure**

**Scenario:** USD has been transmitted to LianLian's receiving account, but the CNY payout has not been delivered to the supplier. LianLian sends a payout.failed webhook.

**User-Facing Behavior:**

- Status changes to "Payment Failed - Investigating"
- Push notification and email: "Your payment to [supplier name] could not be delivered. We are investigating and will update you within 48 hours. Your funds are safe."
- Transaction Detail screen shows the failure status with a support reference number
- User can contact support directly from the Transaction Detail screen

**System Logic:**

- Borderless raises a dispute with LianLian via their dispute API or support portal within 2 hours of receiving the payout.failed webhook
- Dispute SLA: LianLian acknowledges within 24 hours; resolution within 2 to 5 business days
- LianLian's Supplier Payments Guarantee applies: if LianLian confirms delivery failure, they refund the USD equivalent back to the Borderless receiving account
- On refund received from LianLian: Airwallex credits Borderless's pool; Borderless credits the user's USD wallet
- Transaction status updated to "Refunded"; push notification and email sent: "Your payment of $[amount] has been returned to your USD wallet."
- Borderless logs the full dispute record: failure timestamp, LianLian dispute ticket ID, resolution timeline, refund confirmation

**What the User Does Not Need to Do:**

- The user does not need to contact LianLian directly
- The user does not need to chase a refund; it is processed automatically when LianLian confirms
- The user is not required to re-initiate the payment; they can choose to once the USD is back in their wallet

---

#### **FR-7.2: Supplier Claims Payment Not Received**

**Scenario:** LianLian has sent a payout.delivered webhook and Borderless shows the transaction as "Payment Delivered," but the supplier tells the business owner they have not received the money.

**User-Facing Behavior:**

- User opens the Transaction Detail screen (Screen 24) and taps "Report an Issue"
- User selects "Supplier says payment not received"
- System shows the CNAPS reference number with instructions: "Share this reference number with your supplier and ask them to contact their bank directly. This is the CNAPS confirmation number that proves the payment was made through the Chinese payment system. The supplier's bank can trace the payment using this reference."
- If the supplier's bank cannot find the payment using the CNAPS reference, user taps "Escalate to Borderless Support"
- Support team opens a payment trace request with LianLian
- LianLian provides a delivery trace report within 3 to 5 business days
- User is updated by email and in-app notification at each stage

**System Logic:**

- CNAPS reference is the authoritative delivery confirmation from the Chinese domestic payment system
- If CNAPS reference is valid and traceable at the supplier's bank: the issue is at the supplier's bank end; Borderless's obligation is discharged
- If CNAPS reference cannot be verified by LianLian's trace investigation: LianLian is responsible for resolution under their Supplier Payments Guarantee
- All communications with LianLian during the investigation are logged in the compliance record

---

## **6. EDGE CASES AND ERROR HANDLING**

### **6.1 Tier Limit Exceeded Mid-Transaction**

**EC-1: User Attempts Payment Above Current Tier Limit**

Scenario:
- User is at Tier 1 and attempts to send $4,000 to a Chinese supplier, which exceeds the $3,000 single-transaction limit

System Behavior:
- Transaction is blocked before the FX Summary screen is shown
- User sees a blocked screen that explains the specific limit that was exceeded, lists what the next tier allows, and shows the documents required for Tier 2 (Certificate of Incorporation, TIN, utility bill, CAC Status Report)
- "Upgrade Now" CTA launches the Tier 2 KYB upgrade flow

User Flow:
- User taps "Upgrade Now"
- System preserves all transaction details (supplier, amount, invoice) in the session
- User completes Tier 2 document upload
- System processes the upgrade (automated: instant; manual review: up to 48 hours)
- When upgrade is approved: user is returned to the transaction flow with details pre-filled
- User reviews and confirms the payment

Customer-Facing Message:
- "This payment exceeds your current limit of $3,000. Upgrade to Tier 2 to send up to $50,000 per transaction. Your payment details will be saved."

---

### **6.2 Invoice Supplier Name Does Not Match Bank Account Name**

**EC-2: Supplier Name Mismatch Between Invoice and Saved Beneficiary**

Scenario:
- User uploads a proforma invoice where the supplier name is "Guangzhou Trade Co." but the saved beneficiary bank account name is "GT Trading Limited"
- These are the same company but the names do not match exactly

System Behavior:
- Invoice scan fails the name match check
- Transaction is held before it reaches the Review and Confirm screen
- User sees the specific rejection reason

User Flow:
- User sees: "The supplier name on your invoice does not match the name on the bank account. Please confirm that both the invoice and bank account show the same legal business name."
- User has two options:
  - Re-upload a corrected invoice that shows the exact registered business name as on the bank account
  - Edit the beneficiary name to match the invoice exactly (if the invoice name is correct)
- After re-upload with matching names: scan passes; transaction proceeds

Compliance Note:
- This check exists because China's SAFE regulations and CNAPS require that the name on the payment instruction matches the recipient's registered bank account name exactly. A mismatch causes the payment to be held or rejected at the Chinese bank end.

---

### **6.3 Transaction Flagged for AML Manual Review**

**EC-3: AML Rule Triggers Manual Review Before Payment Is Sent**

Scenario:
- A business owner at Tier 2 sends three transactions in one day to three different new beneficiaries (Rule 5: multi-beneficiary dispersion). The third transaction triggers a flag before it is submitted to LianLian.

System Behavior:
- Transaction is held before the Airwallex and LianLian API calls are made
- USD is NOT debited from the user's wallet (no funds move)
- User sees the Manual Review screen

User Flow:
- User sees: "Your transaction is under review. This usually takes 2 to 4 business hours. We will notify you when it is resolved."
- User receives a push notification and email with the transaction reference number
- Compliance team reviews within 4 hours
- If the review concludes the payment is legitimate: transaction is released; USD is debited and payment instruction sent to LianLian as normal
- If the review concludes the pattern is suspicious: transaction is cancelled; user is notified; STR is filed with NFIU within 24 hours

What the User Is Not Told:
- The specific rule that triggered the flag is not disclosed to the user (this is standard AML practice; disclosing it would help bad actors game the system)

---

## **7. BUSINESS RULES AND CONSTRAINTS**

**BR-1: Single Corridor in v1**

Rule: The China corridor is the only active payment destination in v1. All other corridors are visible in the corridor selector but shown as "Coming Soon."

Rationale: China is the primary trade corridor for Nigerian importers in the hair, textiles, electronics, and industrial goods sectors. Launching with one corridor allows us to validate the core product with a focused partner stack (LianLian Global) before expanding.

---

**BR-2: Proforma Invoice Required from Tier 2 Upward**

Rule: All transactions initiated by Tier 2 or Tier 3 accounts require a proforma invoice. Tier 1 transactions do not require one.

Rationale: At Tier 1 transaction sizes ($3,000 and below), the AML risk is low enough that invoice verification is not proportionate. At Tier 2 ($50,000 and below), the transaction is large enough to attract AML scrutiny and the CBN cross-border payment documentation requirements apply.

---

**BR-3: Beneficiary Supplier Name Must Match Invoice Name Exactly**

Rule: The supplier name on the proforma invoice must match the beneficiary bank account name on Borderless. The check is case-insensitive but otherwise exact.

Rationale: SAFE regulations in China require the payer name and payee name to match the declared trade purpose exactly. A mismatch causes the CNAPS payment to be rejected or held at the Chinese bank end.

---

**BR-4: EDD Required for Transactions Above $200,000**

Rule: All transactions above $200,000 (Tier 3) are held pending Enhanced Due Diligence approval before the payment instruction is sent.

Rationale: CBN AML/CFT Regulations require Enhanced Due Diligence for high-value transactions. The compliance team reviews source of funds, invoice consistency, and supplier legitimacy before releasing.

Enforcement: Transaction status is set to PENDING_EDD after user confirmation. EDD review is completed within 48 business hours. User is notified of approval or rejection with reasons.

---

**BR-5: BVN and NIN Data Must Stay in Nigeria**

Rule: BVN and NIN data collected during KYB must be stored on Nigerian servers only. These fields are classified as Critical National Information Infrastructure under the 2024 CNII Order. They are never transmitted to Airwallex or LianLian.

Rationale: NDPA 2023 Section 41 and the CNII Order 2024 mandate in-country storage for BVN and NIN. Only the verification outcome (Pass/Fail plus reference ID from Smile ID) is shared with other systems.

---

**BR-6: No Inbound Payments in v1**

Rule: Borderless v1 does not receive international payments into Nigeria on behalf of users. Inbound payments fall under the IMTO regulatory framework and are scoped to v2.

---

## **8. SUCCESS METRICS**

These are defined in full in the Product Brief. Reference:

- Time to First Payment (Activation): 50 percent of approved businesses complete their first payment within 7 days of KYB approval
- Monthly Payment Volume: $250,000 in month 3; $1 million in month 6; $5 million in month 12
- KYB Tier Upgrade Rate: 40 percent of Tier 1 users upgrade to Tier 2 within 30 days of first payment
- Automated AML Clearance Rate (Compliance): At least 92 percent of transactions cleared without manual review
- Net Revenue per Transaction: Minimum $20 net margin per transaction across the portfolio

---

## **9. DEPENDENCIES**

### **9.1 Internal Dependencies**

**Critical:**

- KYB approval pipeline must be operational before any user can transact
- NGN virtual account issuance by Anchor must be functional before wallet funding is possible
- LianLian commercial agreement must be signed and API keys issued before the China payment flow can be tested

**Moderate:**

- Qichacha API integration for supplier verification
- Smile ID integration for biometric KYB checks
- CAC API integration for business registration verification

### **9.2 External Dependencies**

**Critical:**

- Anchor (NGN virtual accounts, NIBSS collection)
- Providus Bank (NAFEM FX execution, outward SWIFT wires)
- Airwallex (USD pool, API transfer to LianLian)
- LianLian Global (CNAPS payout, Supplier Payments Guarantee)

**Moderate:**

- Smile ID (biometric verification)
- Qichacha API (Chinese business registry)
- NFIU reporting gateway (for STR submissions)

---

## **10. FUTURE ENHANCEMENTS (POST-MVP)**

**FE-1: Inbound Payments (v2)**

- Allow Nigerian businesses to receive international payments into Borderless via Anchor's IMTO licence
- Issue USD virtual accounts per user for receiving USD directly from clients abroad

**FE-2: Role-Based Permissions**

- Add finance manager access with configurable limits and approval workflows
- Business owner retains primary account control and approves manager-initiated payments above a set threshold

**FE-3: Additional Corridors**

- Expand beyond China to India, UAE, Turkey, and other high-volume trade corridors as SAFE-equivalent licensed payout partners are onboarded

**FE-4: Bulk Payments**

- Allow Tier 3 accounts to upload a CSV of multiple supplier payments and process them in a single batch

**FE-5: Transaction Export and Accounting Integration**

- Allow users to export transaction history as a structured CSV or PDF
- Explore integration with accounting tools commonly used by Nigerian SMEs

---

## **11. OPEN QUESTIONS**

**Q-1: LianLian Per-Transaction Fee Confirmation**

Question: What is LianLian Global's actual per-transaction fee for CNAPS B2B payouts at MVP volume?

Current Assumption: Estimated at $5 to $12 per transaction based on market research.

Why It Matters: If the actual fee is higher than $12, our $15 flat fee may not cover costs at small transactions, and the fee model will need to be revised before launch.

Decision Required: Sign commercial agreement with LianLian and confirm fee structure before the product brief is finalised for development.

---

**Q-2: Qichacha API Access for Nigerian Business**

Question: Does Qichacha offer a direct API for foreign businesses, or does access require a Chinese entity registration?

Why It Matters: If direct API access is not available, we may need to route through a third-party data provider or build the supplier verification check differently.

Decision Required: Technical scoping with LianLian (who may be able to provide Qichacha verification as part of their LGPS service) before the beneficiary verification feature is built.

---

**Q-3: Airwallex Platform API Access for Nigerian Fintechs**

Question: Does Airwallex's platform API (the embedded finance product) support Nigerian-registered fintechs, or does it require registration in a supported jurisdiction?

Why It Matters: Our USD pool model depends on accessing Airwallex's infrastructure as a platform API client. If Nigerian-registered companies require a different onboarding path or have reduced feature access, the architecture may need to be adjusted.

---

## **12. APPENDIX**

### **12.1 Glossary**

**CNAPS:** China National Advanced Payment System. The domestic Chinese interbank clearing network used for local CNY transfers between Chinese bank accounts.

**CNAPS Code:** A 12-digit routing number required to identify a Chinese bank and branch for CNAPS transfers. Required for every supplier payment.

**EDD:** Enhanced Due Diligence. A compliance process requiring manual review of high-value transactions, typically involving verification of source of funds and business legitimacy.

**FX Spread:** The difference between the interbank FX rate and the rate charged to the customer. This is how informal agents and Borderless both price the currency conversion.

**HS Code:** Harmonised System Code. An internationally standardised numerical code that classifies traded products. Required on proforma invoices to declare what goods are being purchased.

**KYB:** Know Your Business. The process of verifying the identity and legitimacy of a business entity, analogous to KYC (Know Your Customer) for individuals.

**NAFEM:** Nigeria Autonomous Foreign Exchange Market. Nigeria's official interbank FX market where authorized dealers source foreign currency.

**NIBSS:** Nigeria Inter-Bank Settlement System. The domestic interbank payment network used for real-time transfers between Nigerian banks.

**Proforma Invoice:** A preliminary invoice from a supplier that confirms the details of an agreed transaction before final delivery. Required for trade finance documentation.

**SAFE:** State Administration of Foreign Exchange. China's regulatory body that oversees cross-border capital flows. A SAFE Cross-Border Business Licence is required to legally convert foreign currency to CNY and pay via CNAPS.

**STR:** Suspicious Transaction Report. A mandatory regulatory filing made to the NFIU within 24 hours when a transaction is confirmed to be suspicious.

**CNII:** Critical National Information Infrastructure. A classification under Nigeria's 2024 CNII Order. BVN and NIN data carry this designation and must be stored within Nigeria.

### **12.2 Related Documents**

- [Product Brief: Borderless v1](PRODUCT_BRIEF.md)
- [Capstone Context Document](CAPSTONE_CONTEXT.md)
- [AI Corrections Log](AI_CORRECTIONS_LOG.md)
- [Resources](RESOURCES.md)
