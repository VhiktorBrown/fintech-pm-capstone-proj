# Borderless — Compliance Summary

**Version 1.0 | May 2026**

---

## Licences: What Applies, What We Hold, What We Are Deferring

### How the CBN Payment System Licensing Framework Is Structured

PSP is not a single licence. That is the first thing to get right. The CBN's December 2020 circular restructured the entire Nigerian payment system licensing regime into four broad categories:

1. **Switching and Processing** — for network operators and payment switches
2. **Mobile Money Operations (MMO)** — for entities that issue e-money, create and manage wallets, and hold customer funds
3. **Payment Solution Services (PSS)** — an umbrella that contains three separate sub-licences
4. **Regulatory Sandbox** — for testing new products under a controlled exemption

The PSS category is where most payment fintechs sit, and it breaks down into:

- **PSSP (Payment Solution Service Provider)** — N100 million minimum capital. Covers payment processing gateways, payment application development, merchant services aggregation, and collections. The CBN explicitly prohibits PSSP holders from holding customer funds or issuing e-money and wallets. A PSSP that holds customer balances is not bending the rules — it is in direct regulatory violation.
- **PTSP (Payment Terminal Service Provider)** — N100 million minimum capital. Covers POS terminal deployment and management.
- **Super Agent** — N50 million minimum capital. Covers agent banking recruitment and operations.

A company can hold all three PSS sub-licences simultaneously for a combined capital requirement of N250 million.

### Which Licence Covers What Borderless Actually Does

Borderless has two wallet types: a naira wallet and a USD wallet. These require different regulatory treatment, and neither is covered by a PSSP.

**The naira wallet (virtual account issuance) requires an MMO or MFB licence.**
To issue virtual accounts, hold naira balances for customers, and process NIBSS transactions, a company needs either a Mobile Money Operator (MMO) licence or a licensed deposit-taking institution such as a Microfinance Bank. The MMO licence carries a N2 billion capital requirement plus a N2 billion refundable escrow. A PSSP licence does not solve this problem at all. It is a separate licence category with an explicit prohibition on holding customer funds.

This is why Anchor is Partner 1 in our stack. Anchor holds a Nigerian Microfinance Bank (MFB) licence, which authorises them to accept deposits, issue virtual accounts, hold customer naira balances, and operate within the NIBSS clearing network. The naira wallet that Borderless users fund is not a Borderless bank account. It is a virtual account issued by Anchor under their MFB licence, with Borderless providing the product and UX layer on top.

**The USD wallet is a ledger balance, not a Nigerian deposit.**
The user's USD balance is a ledger entry backed by Borderless's pre-funded FBO pool at Airwallex. Because Airwallex holds this pool at a US banking partner, not in Nigeria, the USD wallet is not classified as a Nigerian deposit-taking activity. The USD wallet is covered by Airwallex's US MSB licence because the underlying pool sits offshore.

**The payment processing and aggregation layer falls under PSSP.**
Borderless's role in routing payment instructions, processing transactions, and connecting the user to downstream partners fits the PSSP description. This is the one CBN category Borderless could reasonably pursue for a standalone licence at the N100 million capital level. However, since we operate entirely through licensed partners at MVP, we have not applied for this either. It is on the roadmap.

### The Full Licence Map for Borderless

| Function | Required Licence | Who Holds It | Why |
|---|---|---|---|
| NGN virtual account issuance and naira wallet | MFB licence (deposit-taking) | Anchor | Anchor's MFB licence authorises deposit-taking and NIBSS virtual account issuance. PSSP explicitly cannot do this. |
| NGN to USD FX conversion and outward SWIFT wire | CBN Authorized Dealer licence | Providus Bank | Only CBN authorized dealers can access NAFEM and execute outward capital flows from Nigeria. BDCs cannot. |
| USD custody and cross-border USD transmission | US MSB via FinCEN | Airwallex | FinCEN-registered MSB is the legal basis for holding and transmitting USD across borders from a US-regulated pool. |
| USD to CNY conversion and CNAPS local payout | SAFE Cross-Border Business Licence | LianLian Global | Mandatory licence for a foreign entity to receive USD from abroad, convert to CNY, and pay via CNAPS. No alternative. |
| Payment processing and gateway layer | PSSP | Not held at MVP | Operating under partners. PSSP application is on the roadmap for when Borderless formalises its own payment layer. |
| Naira wallet issuance (if Borderless were independent) | MMO licence | Not held | N2B capital requirement impractical at MVP. Covered by Anchor's MFB licence. |
| Inbound international payments into Nigeria | CBN IMTO licence | Anchor (they hold this) | IMTO covers inbound only. Our MVP is outbound only. Anchor's IMTO covers our v2 inbound product without switching partners. |

### What We Are Pursuing

We do not hold any CBN licence at MVP. The partnership model is intentional and time-bounded. As volume grows, the planned path is to pursue a PSSP licence to formalise our payment processing layer (N100M capital, accessible at our scale), and to evaluate whether an MMO application or a deeper MFB partnership structure makes more sense as a long-term alternative to operating under Anchor. Direct licence ownership is the goal state. Partner licences are the MVP path.

---

## User Data: What We Collect, Why, and How We Protect It

### What We Collect and the Specific Reason for Each

**Business identity: business name and CAC registration number**
Why we collect it: CBN AML/CFT Regulations require verification that a business legally exists before financial services are provided. The RC or BN number is cross-referenced against the CAC API in real time.
Legal basis under NDPA 2023: Legal obligation.

**Director identity: BVN, NIN, government-issued ID, live selfie**
Why we collect it: CBN requires biometric identity verification of the individual who controls the business. BVN links the director to the Nigerian banking system. NIN is the national identity number. The live selfie confirms the person is physically present and that the face matches the ID document. These are also required for sanctions screening against OFAC, UN, and EU watchlists and Politically Exposed Person checks.
Legal basis: Legal obligation under CBN AML/CFT Regulations and FATF standards for customer due diligence.

**Business documents at Tier 2: Certificate of Incorporation, CAC Status Report, TIN, utility bill**
Why we collect it: The CoI confirms the company is authorised to conduct the trade it claims. The CAC Status Report shows current directors (directors change after incorporation; we need to screen who is actually in control today). The TIN confirms tax registration for transactions large enough to have tax implications. The utility bill verifies the physical operating address for regulatory enquiry readiness.
Legal basis: Legal obligation under CBN risk-based AML framework for medium-risk accounts.

**Enhanced KYB at Tier 3: MEMART, all directors' IDs, UBO declaration, source of funds**
Why we collect it: The MEMART confirms that directors have internal authority to move large sums without board approval restrictions. All directors' IDs are needed because every director is a potential sanctions risk, not just the signing one. The UBO declaration is required under NFIU beneficial ownership regulations. Source of funds is required under CBN EDD requirements for high-value accounts.
Legal basis: Legal obligation under NFIU Beneficial Ownership Regulations and CBN EDD requirements.

**Transaction data: amounts, dates, FX rates, beneficiary details, CNAPS references, timestamps**
Why we collect it: CBN AML/CFT Regulations require financial institutions to retain transaction records. The transaction audit trail is also the core product value: the digital record is what makes Borderless materially different from the informal agent model.
Legal basis: Legal obligation (AML record-keeping) and contract performance (the audit trail is the product).

**Proforma Invoice data: HS codes, goods description, amounts, supplier details**
Why we collect it: CBN cross-border payment documentation requirements mandate that goods payment transfers are supported by trade documentation. SAFE regulations in China require CNAPS inbound payments to be backed by a declared trade purpose. Without this, LianLian cannot legally process the CNAPS transfer.
Legal basis: Legal obligation under CBN cross-border payment documentation requirements and SAFE regulatory requirements.

**Device and session data: IP address, device fingerprint, session metadata**
Why we collect it: Required for AML velocity monitoring and fraud detection. Not used for marketing.
Legal basis: Legitimate interest in fraud prevention and AML compliance, proportionate to the risk profile of a cross-border payment product.

### How We Store and Protect It

**BVN and NIN: in-country only, no exceptions**
BVN and NIN are classified as Critical National Information Infrastructure under Nigeria's 2024 CNII Order. Both must be stored on Nigerian-hosted infrastructure. They are never transmitted to Airwallex or LianLian. Only the verification outcome from Smile ID (pass or fail, plus a reference ID) leaves Nigeria. Our agreement with Smile ID must contractually confirm Nigerian data residency before go-live.

**Data retention**
CBN AML/CFT Regulations override NDPA's shorter GAID defaults where they conflict. Financial transaction records are retained for 6 years after the last transaction. KYB documents are retained for 5 years after account closure. Contact data is deleted within 6 months of account closure where no AML retention obligation applies.

**Breach notification**
NDPA 2023 Section 40 requires notification to the Nigeria Data Protection Commission within 72 hours of becoming aware of a personal data breach. If the breach poses high risk to users, affected users must also be notified without undue delay.

**Data Processing Agreements**
Every partner that processes user data must have a signed DPA before go-live: Smile ID (biometric data, Nigerian residency confirmation required), Anchor (naira wallet and transaction data), Airwallex (payment instruction data, Standard Contractual Clauses for the US transfer), and LianLian Global (beneficiary data and payment instructions, cross-border transfer safeguards for data going to China).

**DPCO requirement**
Borderless must appoint a Data Protection Compliance Organisation registered with the NDPC to conduct annual audits and submit the Compliance Audit Report. A Data Protection Impact Assessment is required before go-live given that we process biometric identity data and financial data at scale.

### FCCPC Consumer Protection Framework

The FCCPC Digital Electronic Online and Non-Traditional Consumer Lending Regulations 2025 apply to consumer lenders. Borderless is a B2B payment platform, not a consumer lender, so those specific regulations do not apply. However, the broader Federal Competition and Consumer Protection Act 2018 applies to all businesses in Nigeria. The three points where it is most relevant to Borderless are fee disclosure, complaint resolution, and clear terms. Screen 16 (FX Summary) shows the exact fee (1.5 percent plus $15 flat) before the user confirms any transaction. There are no fees added after confirmation. Users have an in-app complaint channel with a defined SLA. Terms and conditions are presented before account activation and must be reviewed by Nigerian counsel to confirm no clause waives rights that are protected under Nigerian consumer protection law.

---

## How Borderless Handles AML Triggers and Flagged Transactions

AML monitoring runs in three stages.

**Stage 1: Onboarding**
Before a user transacts, Smile ID cross-references BVN and NIN against the NIMC database and runs a biometric liveness check. The director's name is screened against OFAC, UN, and EU sanctions watchlists and checked for Politically Exposed Person status. The business registration number is verified against the CAC API. If any check fails, KYB is rejected and the user cannot access the platform.

**Stage 2: Per-transaction monitoring**
Six automated rules run on every transaction before the payment instruction is sent to LianLian. If any rule fires, the transaction is held in Manual Review before USD is debited.

1. Tier-limit structuring: 3 or more transactions in 24 hours all within 5 percent of the user's single-transaction ceiling
2. Aggregate threshold structuring: Account total exceeds $10,000 within any rolling 5-business-day window where each individual transaction was below $10,000 — the classic smurfing pattern
3. Velocity: 3 or more transactions from the same account within any 24-hour period
4. Just-below-threshold pattern: 3 or more transactions in a rolling 30-day period consistently within 5 percent of the same ceiling
5. Multi-beneficiary dispersion: Payments to 3 or more different new beneficiaries in one day from the same account
6. Source of funds: Funding account has not been used with Borderless before, or origin is a high-risk jurisdiction

When a flag fires, the transaction is held. USD is not debited. The user sees a generic under-review message with a 2 to 4 business hour estimate. The specific rule that triggered the flag is never disclosed because disclosing it would help bad actors calibrate around the thresholds.

**Stage 3: Regulatory reporting**
Daily transaction returns are submitted to the CBN Director of Trade and Exchange. Suspicious Transaction Reports are filed with the NFIU within 24 hours of confirmed suspicious activity. All transactions above $200,000 are held for Enhanced Due Diligence review before processing.

---

## The 48-Hour Regulatory Directive Response Plan

There is something important to state upfront. Borderless holds no licences at MVP. It operates through four licensed partners. This means we cannot respond to a CBN directive the way a licensed entity does, because we have no direct CBN regulatory relationship. The 48-hour response plan is built around what we actually control: detecting the directive through partners, assessing scope with legal counsel, following the partners' compliance lead, and managing the product layer.

**The four types of directive and what each means**

An outbound FX restriction is the highest operational risk. Providus Bank would pause the FX service immediately. When they pause, our payment flow is broken. We pause too.

An enhanced AML or KYB compliance directive typically carries a 30 to 90 day compliance window. We continue operating while we prepare the compliance roadmap.

A directive requiring cross-border payment platforms to hold their own licence rather than operate through partners is the existential scenario. We pause the affected operations immediately and expedite our own licence application. We do not continue in a way CBN has explicitly prohibited.

A corridor-specific restriction means we disable the affected corridor in the product, notify users with pending transactions, and offer refunds.

**Hours 0 to 4: Detection**
Our primary channel is our licensed partners. Both Anchor and Providus Bank must be contractually required to notify Borderless within 4 hours of any directive affecting the services they provide. Without this clause in both contracts before go-live, we learn from the news after partners have already begun responding. Our compliance lead also monitors cbn.gov.ng directly and subscribes to legal alert services as a backup.

**Hours 4 to 12: Assessment**
Emergency meetings with Anchor's and Providus Bank's compliance teams. Their interpretation of the directive is legally authoritative for our Nigerian operations. Nigerian fintech-specialist legal counsel (not a generalist) reviews the directive and gives us a written opinion on whether the directive applies to Borderless directly or only through our partners, and whether we have an immediate obligation or a compliance window. Every communication is logged with timestamps.

**Hours 12 to 24: Decision and action**
If a partner pauses, we disable the affected product feature. If we have a compliance window, we begin drafting the roadmap. If an own licence is required, we pause and file. Any pause triggers user communication within 2 hours.

**Hours 24 to 48: Communication, documentation, and regulatory acknowledgement**
Users are notified via push notification and email: what is affected, why, what happens to in-flight transactions (pre-flight amounts revert to the USD wallet immediately; mid-flight amounts are covered by LianLian's Supplier Payments Guarantee within 2 to 5 business days), and what to expect next. If legal counsel confirms Borderless is directly addressable under the directive, we write a formal acknowledgement to CBN within 48 hours stating we have reviewed it, are assessing our position, and will submit a full compliance plan by the relevant deadline. Every action is documented: directive text, detection timestamp, all partner communications, legal counsel opinion, decisions made, and user communications sent. This is the record of good faith if CBN ever questions our response.

The honest framing is this: the partnership model is an MVP structure, not a permanent one. The more licences Borderless holds directly, the more control we have over our own regulatory response. That is the compliance argument for pursuing our own PSSP and eventually MMO or MFB licences, independent of the business case.

---

*Sources:*
*[CBN PSP Categorisation — CBN Official PDF](https://www.cbn.gov.ng/out/2020/ccd/categorization%20of%20psps.pdf)*
*[New Licence Categorisations for Nigerian Payments System — Mondaq](https://www.mondaq.com/nigeria/financial-services/1017880/new-licence-categorisations-for-the-nigerian-payments-system)*
*[PSSP Licence in Nigeria 2026 — Idara](https://www.goidara.com/blog/how-to-obtain-a-payment-solution-service-provider-pssp-license-in-nigeria)*
*[MMO Licence in Nigeria 2025 — ICA](https://ica.ng/how-to-obtain-a-mobile-money-operator-mmo-license-in-nigeria-step-by-step-guide-2025/)*
*[CBN Framework and Guidelines on Mobile Money Services, July 2021](https://www.cbn.gov.ng/Out/2021/CCD/Framework%20and%20Guidelines%20on%20Mobile%20Money%20Services%20in%20Nigeria%20-%20July%202021.pdf)*
*[Nigeria Data Protection Act 2023 — CookieYes](https://www.cookieyes.com/blog/nigeria-data-protection-act-ndpa/)*
*[Nigeria Data Localisation and Fintechs — Mondaq](https://www.mondaq.com/nigeria/fin-tech/1722826/how-nigerias-data-localization-regime-shapes-fintechs-handling-of-financial-identity-and-transaction-data)*
