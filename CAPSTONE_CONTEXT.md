# Capstone Project Context — ProductDive Fintech PM Program

**Last Updated:** 2026-05-12 (Session 8)
**Program:** Fintech Payment Product Manager Advanced — ProductDive
**Selected Option:** B — The SME Treasurer
**Product Name:** Borderless

---

## Problem Statement (Sharpened)
A Lagos-based SME owner who imports goods from China currently relies on informal agents
(Nigerians with Chinese bank accounts) to move money to Chinese suppliers. The process
requires physical bank visits, trust-based relationships not available to all importers, opaque
FX rates negotiated per transaction, and still takes 2–3 days. The formal banking alternative
(SWIFT) takes 3–5 days and costs $40+ per transfer.

**Primary pain: Cost (FX spread markup by informal agents). Secondary pain: Speed.**
**Real competitor: The informal agent — not SWIFT, not any existing fintech.**

---

## Real User Insight
- Source: SME owner who moves hundreds of millions of naira to Chinese suppliers
- Current workflow (informal agent model):
  1. Owner physically goes to the bank → transfers naira to agent's Nigerian account
  2. Agent (Nigerian with a Chinese bank account) pays from local Chinese account to supplier
  3. FX rate is negotiated per transaction — agent charges purely on FX spread (markup above market)
  4. Settlement takes 2–3 days even via this "optimised" informal route
  5. Trust-based relationship built over years — inaccessible to most SMEs
- Transaction size range: any amount — from a few million naira (small vendors, hair vendors) to hundreds of millions (high-volume importers)
- The informal model carries regulatory risk — compliance is itself a core value prop for businesses that are scaling

---

## Primary User
- **Who:** Business owner (not a finance manager)
- **Why this matters:** KYB is tied to the owner's identity and business registration. UX must serve an owner, not a finance ops specialist.
- **Future release:** Role-based permissions (finance manager, limited access) deferred to v2

---

## MVP Scope
- **Outbound only** — Nigerian businesses paying Chinese suppliers
- **Inbound payments deferred to v2** — receiving money into Nigeria falls under the IMTO regulatory framework; for v2, we will leverage Anchor's IMTO licence (which they secured in 2025/2026) so that Nigerian exporters or businesses can also receive international payments via Borderless. This is not in scope for the MVP.
- **China corridor only** — v1 supports only China; other corridors (e.g., India, UAE, Turkey) added as we onboard SAFE/equivalent-licensed payout partners per market

---

## Solution Model (Hub-and-Spoke)
**Do not reference Raenest by name anywhere in deliverables.**

### Money Flow (Step by Step)
```
1. User sends NGN via NIBSS into Borderless NGN wallet
   (collected via Anchor's Nigerian virtual account infrastructure)
         ↓
2. User requests NGN → USD conversion
   Borderless instructs Providus Bank (authorized FX dealer) to purchase USD
   on the NAFEM (Nigeria Autonomous FX Market) on our behalf.
   The bank deducts its spread (~0.5–0.8%) and credits our USD nostro account.
   Borderless reflects USD in the user's wallet — this is a LEDGER UPDATE.
   No money crosses a border at this step.
         ↓
3. User initiates payment to Chinese supplier
   TWO parallel API calls are made simultaneously:
   (A) Borderless calls LianLian API → creates a payment order with supplier CNAPS
       details and amount → LianLian returns a unique transaction_id and their
       USD receiving account details.
   (B) Borderless calls Airwallex API → instructs a USD wire from Borderless's
       Airwallex pool to LianLian's USD receiving account (obtained in step A).
   These are TWO direct relationships — Airwallex does NOT manage LianLian on
   Borderless's behalf. They are parallel, not nested.
         ↓
4. LianLian Global (SAFE Cross-Border Business Licence holder) detects the incoming
   USD, matches it to the transaction_id from step 3A, converts to CNY,
   converts to CNY, and initiates a CNAPS local transfer to the supplier's bank account.
   LianLian's SAFE licence is the legal authorisation for a foreign entity to route
   USD into China, convert to CNY, and pay via local rails. Airwallex cannot do
   this for Nigerian businesses — their China payout eligibility is restricted to
   China-registered entities or Chinese-UBO exporters.
   To the supplier, this looks like a domestic Chinese bank transfer.
         ↓
5. Supplier receives CNY. No SWIFT. No incoming wire fee.
```

### Why Money Does Not Cross the Border Per Transaction
This is a pre-funded, netted liquidity model. Borderless maintains pre-funded USD pools with Airwallex, sourced through periodic settlement with our Nigerian bank partner. Individual user transactions are ledger moves within these pools. The actual international settlement between pools happens on a net, batched basis between partner banks — not per user transaction. This is what makes same-day or next-day delivery possible.

### Treasury Sweep — How the Airwallex Pool Is Funded
There are two distinct steps that are commonly confused:

**Step A (Domestic FX Purchase):** When a user converts NGN → USD on Borderless, Providus Bank buys USD on the NAFEM market and credits Borderless's USD nostro account held **at Providus Bank in Nigeria**. This USD has not crossed any border — it sits in a nostro account inside Nigeria.

**Step B (The Treasury Sweep):** Separately — and not per user transaction — Borderless periodically moves USD from the Providus nostro to its pre-funded pool at Airwallex. This is how it works:
1. Borderless maintains a target USD balance at Airwallex (e.g., always keep $300,000 in the pool)
2. As user payments go out, the Airwallex pool depletes
3. When the pool drops below a trigger threshold, Borderless instructs Providus Bank to wire USD to Airwallex's US banking account
4. Providus Bank sends a **SWIFT MT103 international wire** to Airwallex's US correspondent bank (Airwallex holds client funds at US banking partners)
5. This SWIFT wire settles in 1–2 business days
6. Meanwhile, the existing Airwallex pool balance continues serving user payment instructions without interruption
7. Airwallex credits Borderless's account on receipt of the wire

**Why the user experience is unaffected:** Individual user transactions are fulfilled from the pre-funded Airwallex pool — not from a real-time international wire. The treasury sweep is a background operational process invisible to the user. Same-day delivery to the supplier remains possible because the pool is always kept funded.

**SWIFT is used — but only for treasury operations, not user transactions.** From the user's perspective, there is no SWIFT. From Borderless's treasury operations perspective, SWIFT is the mechanism for topping up the Airwallex pool from the Providus nostro. This is the key distinction to understand and to articulate to the panel.

**Why Providus Bank is essential for the sweep:** A SWIFT wire from Nigeria is a capital outflow — it requires CBN reporting and authorization. Providus Bank, as a CBN-authorized dealer, has the regulatory authority to execute and report this outward capital flow. A BDC cannot do this. This is why our FX partner must be a licensed commercial bank, not a bureau de change.

### Why This Beats the Informal Agent
| Dimension | Informal Agent | Borderless |
|---|---|---|
| FX cost | 3–5% spread + $100–200 flat, opaque | 1.5% + $15 flat, no cap, transparent |
| Speed | 2–3 days | Same day to next day |
| Access | Trust-based, years to build | Open to any registered business |
| Auditability | Paper trail, informal | Full digital audit trail per transaction |
| Compliance | Regulatory risk on owner | Fully regulated pipeline |
| Physical visit | Required (bank) | None — 100% digital |

---

## Partner Stack (Named and Specific)

### Partner 1 — Nigerian Infrastructure: Anchor
**Role:** Provides Nigerian NGN virtual accounts, NIBSS collection, BaaS API layer for Borderless
**Licence held:** Nigerian Microfinance Bank licence + CBN IMTO licence + Canadian MSB registration (as of April 2026)
**Why Anchor:**
- API-first BaaS platform designed for fintechs to embed financial products without their own bank licence
- $2.5B+ processed, 1,000+ businesses onboarded — proven at scale
- Their IMTO licence becomes critical for our v2 inbound product, meaning we don't need to switch partners as we grow
- Their Canadian MSB allows for cross-border capabilities that could expand our infrastructure later
**What they do for us:** Issue NGN virtual accounts to Borderless users, collect NGN inflows via NIBSS, provide the API infrastructure for our wallet

### Partner 2 — FX Authorized Dealer: Providus Bank
**Role:** NGN → USD conversion via the NAFEM (Nigeria Autonomous FX Market / I&E window)
**Licence held:** CBN Authorized Dealer licence (full commercial bank with FX dealing rights)
**Why Providus Bank:**
- Known fintech-friendly commercial bank; has existing partnerships with multiple Nigerian fintechs for FX and virtual account infrastructure
- As a CBN-authorized dealer, they can legally access the official FX market (I&E window) to source USD on our behalf
- Alternative: Stanbic IBTC (strong FX desk, fintech relationships)
**What they do for us (two distinct functions):**
1. **FX conversion:** When a Borderless user converts NGN to USD, Providus executes the FX purchase on NAFEM, charges their spread (~0.5–0.8%), and credits Borderless's USD nostro account held at Providus. The USD sits in Nigeria — no border crossed at this step.
2. **Outward SWIFT wire (treasury sweep):** Periodically, Providus Bank executes a SWIFT MT103 international wire from Borderless's nostro to Borderless's Airwallex account at Airwallex's US banking partner. This is a capital outflow from Nigeria, and Providus Bank — as a CBN-authorized dealer — has the regulatory authority to execute and report it to CBN. This is the mechanism that keeps the Airwallex pre-funded pool stocked.
**Important distinction:** We are NOT using a Bureau de Change (BDC). BDCs cannot execute outward international SWIFT wires. Providus is an authorized dealer (commercial bank) — the only entity type capable of both FX dealing and cross-border capital outflows on our behalf.

### Partner 3 — USD Custody and Cross-Border Transmission: Airwallex
**Role:** Holds Borderless's pre-funded USD pool offshore; transmits USD to LianLian Global; provides the US-regulated money transmission layer
**Licence held:** US MSB registered with FinCEN (US Treasury); Third-Party Online Payment Licence in China (acquired 2023 via Guangzhou Shangwutong); licences in 50+ jurisdictions; named World's Best Cross-Border Payments Provider 2025 (Euromoney)
**Why Airwallex:**
- US MSB with FinCEN registration provides the legal basis for holding and transmitting USD across borders
- Supports 60+ currencies at interbank rates; payouts in 150+ countries via local rails
- Explore tier has no monthly fee — viable for early-stage before volume justifies higher-tier plans
- API-first infrastructure; well-documented for fintech integrations
**What they do for us:** We maintain a pre-funded USD balance with Airwallex. When a Borderless user initiates a China payment, our system calls the Airwallex API to debit our USD balance and route the payment to LianLian Global for China local delivery. Airwallex does NOT handle the China payout itself for our use case — their CNY local transfer eligibility is restricted to China-registered businesses or Chinese-UBO exporters; Nigerian-registered businesses do not qualify. Airwallex's role ends at USD transmission to LianLian.
**Why Airwallex cannot do the China payout directly:** Airwallex holds a Third-Party Online Payment Licence in China (for domestic online payments), not a SAFE Cross-Border Business Licence. Their CNY local transfer product requires the business to have Chinese entity registration or a Chinese national UBO. Our users — Nigerian importers — have neither. Any claim that Airwallex handles the CNAPS payout for Borderless users was an error; LianLian Global is the correct and necessary partner for that leg.
**Future:** As volume grows, Borderless will evaluate obtaining its own MSB or EMI licence to reduce reliance on Airwallex and improve margins.

### Partner 4 — China Local Payout: LianLian Global
**Role:** Receives USD from Airwallex; converts to CNY; executes CNAPS local transfer to Chinese supplier's bank account
**Licence held:** 65+ regulatory approvals globally, including **SAFE (State Administration of Foreign Exchange) Cross-Border Business Licence** — the specific licence that authorises a foreign entity to receive USD from abroad, convert to CNY onshore, and pay via China's local rails
**Why LianLian Global is necessary (not optional):**
- SAFE Cross-Border Business Licence is the only regulatory basis for a foreign-originated payment to be legally converted to CNY and delivered via CNAPS to a Chinese supplier's account
- Airwallex's Third-Party Online Payment Licence does not cover this — it is for domestic China payments only
- LianLian's LGPS (LianLian Global Payout Service) is purpose-built for foreign businesses paying Chinese suppliers — exactly our use case
- Launched world's first cross-border Supplier Payments Guarantee to China (directly relevant)
- Supports real-time RMB credits via CNAPS
**What they do for us:** Receives the USD instruction from Airwallex, verifies supplier legitimacy (Qichacha cross-reference supports this), converts to CNY at the onshore rate, and initiates a CNAPS transfer. The supplier sees a domestic Chinese transfer — no SWIFT, no incoming wire fee.
**Fee to Borderless:** Not publicly published; estimated $5–12 per transaction or percentage-based — to be confirmed via direct commercial engagement. Subject to reduction at volume.
**Backup:** PingPong (60+ global licences, SAFE-licensed; alternative if LianLian's terms are unfavourable)

### Partner Relationships — Technical Structure
Borderless holds **two direct, parallel, independent API relationships**. They are not nested.

| Relationship | What Borderless holds | What it is used for |
|---|---|---|
| Borderless ↔ Airwallex | Direct client account; pre-funded USD FBO pool | USD custody; outward USD wire to LianLian's receiving account |
| Borderless ↔ LianLian Global | Direct LGPS partner account | Payment order creation; CNY payout instruction; dispute escalation |

Airwallex does NOT manage the LianLian relationship on Borderless's behalf. When a payment is initiated, Borderless makes two API calls independently — one to each partner. This is why Borderless raises disputes directly with LianLian (direct client relationship) rather than through Airwallex.

### USD Wallet Infrastructure — FBO Pooled Model
Each customer's USD balance on Borderless is a **ledger entry**, not an individual bank account.

| Wallet | Infrastructure | Per-user bank account? |
|---|---|---|
| NGN wallet | Anchor-issued virtual NGN account per user (NIBSS-mapped) | **Yes** — each user gets a unique NGN virtual account number so they can fund via bank transfer |
| USD wallet | Borderless internal ledger entry backed by Borderless's single pooled FBO USD account at Airwallex's US banking partner | **No** — it is a ledger balance. No individual US bank account per user. |

Individual USD virtual accounts (with unique US routing/account numbers) are only needed when users need to **receive USD from third parties** — the v2 inbound use case (IMTO territory). For v1 outbound-only, a ledger balance backed by the pooled FBO account is entirely sufficient.

---

## Licencing Framework

### What Each Licence Is and Why It Applies (or Doesn't)

| Licence | Holder | Applies to Borderless? | Why |
|---|---|---|---|
| CBN PSP (Payment Solution Services) | Anchor (holds MFB; Borderless operates under their infrastructure) | Yes — via partnership | Required to collect NGN and issue wallets in Nigeria; ₦5B capital requirement makes own licence unrealistic at MVP |
| CBN Authorized FX Dealer | Providus Bank | Yes — via partnership | Required to legally source USD from Nigeria's official FX market (NAFEM/I&E window) for the NGN→USD conversion step |
| US MSB (FinCEN) | Airwallex | Yes — via partnership | Required to legally hold and transmit USD across borders from the US-regulated offshore pool |
| SAFE Cross-Border Business Licence | LianLian Global | Yes — via partnership | Required to legally receive USD from abroad, convert to CNY, and pay via CNAPS to a Chinese supplier. Airwallex holds a Third-Party Online Payment Licence in China (domestic only) — it does not cover this leg for foreign-originated payments to Chinese suppliers. LianLian is the mandatory partner. |
| IMTO (Inbound only) | Anchor (they hold this) | NOT for MVP — v2 only | IMTO only covers inbound transfers into Nigeria. Our MVP is outbound only. For v2 (receiving payments into Nigeria), we leverage Anchor's IMTO licence without changing partners. |

### Why IMTO Does Not Apply to Our MVP
IMTO authorises only **inbound** transfers — foreign currency coming INTO Nigeria. Borderless v1 is an **outbound** product — Nigerian businesses paying suppliers abroad. These are different regulatory frameworks. Citing IMTO as our MVP licence would be factually incorrect and would immediately signal to the panel that we do not understand our own product's regulatory basis.

### MVP Licencing Strategy (with rationale)
1. **Operate under Anchor's MFB/infrastructure** for Nigerian NGN collection (avoids ₦5B PSP capital requirement)
2. **Partner with Providus Bank** as FX authorized dealer for NGN→USD conversion
3. **Use Airwallex's US MSB** for USD custody and cross-border transmission (Borderless is their client; their licence covers our operations)
4. **Use LianLian Global's SAFE licence** for China local payout (USD→CNY + CNAPS); Airwallex transmits USD to LianLian but cannot execute the China payout directly for Nigerian businesses
5. **Apply for own CBN PSP licence in parallel** — target Month 12 to 18
6. **Future own MSB/EMI:** As volume scales, evaluate whether to obtain our own MSB (US or Canada) to reduce Airwallex dependency and improve per-transaction margins

---

## KYB Tier Structure

*Note: CBN publishes explicit limits for individual KYC tiers. For business KYB, no equivalent published table exists. Borderless sets limits within CBN's risk-based AML/CFT framework. Limits are in USD (not NGN) — because the product is cross-border and naira-denominated limits shift with every rate move. This framing is more defensible.*

### Tier 1 — Starter
**Use case:** Small vendors, first-time importers (hair vendors, small goods buyers, new businesses)
**Rationale for limits:** Aligned with PAPSS simplified corporate documentation threshold ($5,000). Intentionally low friction to activate — reduces drop-off during onboarding.

| Document | Why Required | Why at This Tier (Not Later) |
|---|---|---|
| Business name + CAC registration number (RC or BN) | Verifies the business legally exists in Nigeria's CAC registry | The RC/BN number can be verified instantly via CAC API — no physical document needed. At $3K/$5K limits, digital verification is proportionate to the risk. |
| Owner BVN + NIN | BVN ties the owner to the Nigerian banking system (biometric-linked); NIN is the national identity number. Together they confirm a real, identifiable Nigerian resident is behind the account. | Non-negotiable CBN baseline for any financial account regardless of tier. Digitally verifiable in real time via Smile ID. |
| Valid government ID (international passport preferred) | Confirms the physical person behind the BVN/NIN numbers. Prevents identity hijacking where someone uses another person's credentials. | At Tier 1 sizes, a single ID with biometric liveness check is proportionate. |

*No Proforma Invoice required at this tier — small amounts, low risk, prioritise activation.*

### Tier 2 — Growth
**Use case:** Growing SMEs making regular payments to Chinese suppliers
**Rationale for limits:** $50,000/transaction covers the majority of SME importers at this scale.

| Document (Tier 1 +) | Why Introduced at Tier 2 (Not Tier 1) | Limits |
|---|---|---|
| Certificate of Incorporation OR Business Name Certificate | Tier 1 CAC number confirms the business exists. The CoI reveals WHAT the company is authorised to do (its objects), the founding directors, and share structure. At $50K/transaction, we must confirm the company is actually authorised to trade goods internationally — not just that it has a registration number. | Single transaction: up to **$50,000** |
| CAC Status Report (current directors list) | Directors can change after incorporation. The Status Report shows CURRENT directors, not just founding ones. At $50K we must screen the right people against sanctions lists. | Monthly cumulative: up to **$100,000** |
| Tax Identification Number (TIN) | At this transaction size, the business is conducting material taxable trade. TIN links the business to Nigeria's tax system and creates traceability for FIRS if CBN or NFIU require disclosure. | |
| Utility bill (verifies registered business address) | A registered CAC address can be a lawyer's office — the utility bill confirms the real operating location. At $50K, regulatory enquiry readiness requires a verified physical address. | |
| **Proforma Invoice required per transaction from Tier 2 upward** | At $50K, transactions are large enough to attract AML scrutiny. Invoice provides the "purpose of payment" — without it we cannot verify the business reason for the transfer. | |

### Tier 3 — Business
**Use case:** High-volume importers (hundreds of millions of naira per transaction)
**Rationale for limits:** "No preset cap" is an EDD (Enhanced Due Diligence) model — not a waived limit. Every transaction above $200,000 requires mandatory manual compliance review before release. No arbitrary hard ceiling exists, but no automatic clearance above $200K.

| Document (Tier 2 +) | Why Introduced at Tier 3 (Not Tier 2) | Limits |
|---|---|---|
| MEMART (Memorandum & Articles of Association) | The CoI (Tier 2) shows what the company is authorised to do. MEMART defines internal governance: borrowing limits, who can authorise large transactions, restrictions on directors' authority. At $200K+ EDD level, we must confirm no internal governance rule prohibits the director from moving these amounts without board approval. | **No preset cap** |
| Director information for ALL directors (ID, BVN, NIN per director) | At Tier 2, we screened the signing director. At Tier 3, every director is a risk vector. A company can have a clean "face" director while a sanctioned individual holds a background directorship. All must be screened against OFAC, UN, EU, and NFIU watchlists. | Transactions above **$200,000** require Enhanced Due Diligence (EDD) review before release |
| UBO declaration (all shareholders with >25% stake) | Beneficial ownership is the gold standard of AML. Knowing who signed the incorporation papers is not enough — we need to know who ultimately benefits from the money flows. Required by NFIU beneficial ownership regulations and CBN AML/CFT framework for high-value accounts. | |
| Source of funds declaration | At EDD level, we must understand where the business's money originates. Prevents legitimate-looking import businesses from being used as layering vehicles for illicit funds. | |

*Note: Chinese Supplier Business Licence (18-digit) is NOT a KYB document for the Borderless user. It is a per-beneficiary verification step collected when a new supplier is added (see Screen 14). Removed from KYB tier to correct a category error.*

### KYB Upgrade Path
All users start at Tier 1 on registration. Two distinct trigger paths exist for upgrade — both lead to the same upgrade flow:

**Path 1 — Proactive (from Profile):**
- User navigates to Profile → "Verification & Limits" (Screen 7a — always accessible)
- Sees: current tier badge, active limits, next tier requirements, "Upgrade Verification" CTA button
- Can initiate upgrade at any time before attempting a transaction
- Rationale: Business owners planning a large payment need to prepare in advance. The profile must always surface their tier status and the path to upgrade — not just when they hit a wall.

**Path 2 — Reactive (triggered by transaction attempt):**
- User attempts a transaction above their current tier limit
- Blocked screen (Screen 19) shows the upgrade CTA and what the next tier requires
- Upgrade flow launches in-context — the in-progress transaction is preserved
- User completes verification, returns to complete the transaction without re-entering details
- Rationale: Hitting a limit should not be a dead end. Transaction context is preserved so friction is minimised.

Both paths lead to the same upgrade flow. Tier 3 upgrade can also be triggered by compliance review flagging high-volume activity — in which case Borderless initiates the EDD request proactively.

---

## Fee Structure (Built from Partner Costs)

### Cost Stack
| Layer | Partner | Estimated Cost to Borderless |
|---|---|---|
| NIBSS collection + virtual account | Anchor | ~₦100–200 flat (~$0.12) |
| NGN → USD FX spread | Providus Bank (authorized dealer) | ~0.5–0.8% of converted amount |
| USD cross-border transmission | Airwallex | ~0.3–0.5% |
| USD → CNY conversion + CNAPS payout | LianLian Global (SAFE-licensed) | ~$5–12 per transaction — not publicly published; to be confirmed via direct commercial engagement |
| **Total cost per transaction** | | **~0.8–1.3% + $5–12 flat (LianLian)** |

**Partner fee cap note:** No partner (Providus Bank, Airwallex, or LianLian Global) publicly publishes a maximum fee cap on their services. All rates are negotiated at the point of signing commercial agreements. **These fees are set without knowledge of whether partners have caps.** If partners confirm a cap or volume ceiling during commercial engagement, Borderless will pass those savings to customers by reducing its own fee or introducing a customer-facing cap. The model below is the best-estimate baseline only — subject to revision once LianLian's actual per-transaction fee is confirmed.

### Borderless Fee to Users (Decided Model)
- **FX conversion fee: 1.5%** of total transaction value
- **Transaction flat fee: $15** (covers LianLian China payout cost + margin; raised from $10 to protect margin at small transactions)
- **Minimum fee: $5**
- **No percentage cap** — previous $2,500 cap was removed because it created losses above $192K transactions (1.3% of $192K = $2,496 cost vs. $2,510 revenue = near-zero margin; above $192K = loss)
- **Informal agent fee for comparison:** 3–5% FX spread PLUS $100 flat (transactions <$10K) or $200 flat (transactions >$10K)

### Margin Analysis (Why the Model Was Revised)
Previous model ($10 flat + $2,500 cap) had two problems:
1. At $3K transactions: $4 margin — any LianLian fee variance above estimate = loss
2. Above $192K: cap made revenue less than cost = guaranteed loss

| Transaction | Revenue (1.5% + $15) | Cost (1.3% + $12) | Margin | Margin % |
|---|---|---|---|---|
| $3,000 | **$60** | **$51** | $9 | 17.6% |
| $10,000 | **$165** | **$142** | $23 | 13.9% |
| $30,000 | **$465** | **$402** | $63 | 13.5% |
| $100,000 | **$1,515** | **$1,312** | $203 | 13.4% |
| $200,000 | **$3,015** | **$2,612** | $403 | 13.4% |
| $500,000 | **$7,515** | **$6,512** | $1,003 | 13.4% |

### Competitive Comparison

| Transaction Size | Informal Agent (5% + flat) | Borderless (1.5% + $15 flat) | Saving |
|---|---|---|---|
| $3,000 | $150 FX + $100 flat = **$250** | **$60** | 76% cheaper |
| $10,000 | $500 FX + $100 flat = **$600** | **$165** | 73% cheaper |
| $30,000 | $1,500 FX + $200 flat = **$1,700** | **$465** | 73% cheaper |
| $100,000 | $5,000 FX + $200 flat = **$5,200** | **$1,515** | 71% cheaper |
| $200,000 | $10,000 FX + $200 flat = **$10,200** | **$3,015** | 70% cheaper |
| Traditional SWIFT bank | $40–100 fee + 3–5% FX | — | 3–5 days; not comparable |

---

## Core User Journey (Screen by Screen)

### Onboarding
1. Sign Up — business email, password, business name, Nigeria, phone number
2. KYB Tier 1 — RC/BN number entry
3. KYB Tier 1 — Document upload (Certificate of Incorporation or Business Name certificate)
4. KYB Tier 1 — Director verification: BVN, NIN, live selfie (fraud gate)
5. KYB Review Screen — "Under review, 24–48 hrs" with email notification promise
6. KYB Approved → Dashboard | KYB Rejected → reason displayed + what to fix
7. Tier Status Screen — current tier, current limits, upgrade path visible
7a. Verification & Limits (Profile section) — always accessible from Profile; shows tier badge, active transaction limits, next tier document requirements, "Upgrade Verification" CTA button; this is the proactive upgrade path available at any time

### Wallet & Funding
8. Dashboard — NGN wallet balance, USD wallet balance, quick action buttons
9. Fund Wallet — virtual NGN account details (Anchor-issued, NIBSS-mapped)
10. NGN funds arrive → wallet credited instantly via NIBSS, push notification sent

### Convert
11. Convert Screen — NGN → USD, real-time rate (sourced from NAFEM via Providus Bank), fee shown (1.5%), user confirms
12. Conversion complete — USD wallet updated instantly (ledger move, no bank delay)

### Send Money (Pay Supplier)
13. Send Money — corridor selector (China active; others shown as "coming soon")
13a. Payment Reason — dropdown: Importation of goods / Service payment / Professional fees or consultancy / Intellectual property or licensing / Other (requires text description). *If "Importation of goods" is selected, a Form M awareness banner is queued for Screen 17. Auto-populated if Proforma Invoice scan detects HS codes.*
14. Add Beneficiary — supplier legal name (as registered in China), bank name, bank account number, CNAPS code, **Chinese Business Registration Number (18 digits) ← verified once against Qichacha API; saved as "Verified Supplier" badge on pass; warning shown on fail**, business address in China
15. Invoice Upload — Proforma Invoice (AI-scanned: HS codes present, amount consistent, supplier name matches beneficiary name exactly; if HS codes detected and payment reason not yet set, auto-sets to "Importation of goods")
16. FX Summary — amount in USD, equivalent CNY, rate (1.5% fee shown explicitly), total deducted, delivery estimate (no flat fee line)
17. Review & Confirm — full summary before submission. *If payment reason is "Importation of goods": banner displayed — "This payment is for imported goods. If formally importing into Nigeria, you may be required to file a Form M with your bank. Your Borderless payment receipt can be used as supporting documentation."*
18. Payment Submitted — in-progress screen with tracking reference

### Compliance Gates (mandatory in prototype — non-negotiable per brief)
19. Tier Limit Exceeded — blocked screen, shows upgrade CTA and what Tier 2 requires
20. Invoice Rejected — reason displayed (e.g., "Supplier name on invoice does not match bank account name"), re-upload prompt
21. Manual Review Hold — "Transaction under review, typically 2–4 business hours", support contact
22. KYB Upgrade Flow — in-context, does not lose transaction, collects next tier documents

### Post-Transaction
23. Transaction History — list with status: Completed / Pending / Failed / Under Review
24. Transaction Detail — full audit trail: amount sent, rate locked, CNY received, timestamps, reference number, partner routing path

*Screen 24 (Transaction Detail) is the "fully auditable" value proposition. It replaces the informal paper trail entirely and gives the importer something they can show to customs, accountants, or regulators.*

---

## AML Framework

### Stage 1 — Onboarding
- Identity verification via Smile ID (BVN + NIN cross-reference, ID document scan, live selfie liveness check)
- Sanctions screening: OFAC, UN, EU watchlists; PEP (Politically Exposed Person) check
- Business verification: CAC database cross-reference for RC/BN number

### Stage 2 — Per-Transaction Monitoring
- Proforma Invoice review (AI-assisted: HS code validation, supplier name matches beneficiary exactly, amount vs. invoice consistency)
- Supplier legitimacy: Chinese 18-digit business registration is verified against Qichacha **at the point of beneficiary setup (Screen 14), not per transaction**. Once verified, the beneficiary is saved as "Verified Supplier." For unverified beneficiaries, the transaction is flagged for manual review before release.
- Velocity check: flag if current transaction exceeds 150% of user's 90-day average
- **Tier-limit structuring:** flag if multiple transactions cluster just below tier limits (e.g., consistently sending $2,900–$2,999 to stay under the $3,000 single-transaction limit)
- **Aggregate threshold structuring (smurfing):** flag if a single account's transactions sum to more than $10,000 within any rolling 5-business-day window, where each individual transaction was below $10,000. This is the classic pattern of keeping individual amounts below AML reporting thresholds while the aggregate is suspicious.
- **Velocity structuring:** flag if 3 or more transactions are initiated from the same account within any 24-hour period, regardless of individual amounts
- **Just-below-threshold pattern:** flag if a user sends 3 or more transactions in a rolling 30-day period where each amount is consistently within 5% of the same ceiling (e.g., always $2,850–$2,999). Legitimate businesses do not repeatedly hit the same ceiling — this pattern indicates awareness of the threshold.
- **Multi-beneficiary dispersion:** flag if payments go to 3 or more different new beneficiaries in one day from the same account. Legitimate SME importers pay a small number of regular suppliers — rapid dispersion to many new payees is an unusual pattern.
- Source of funds flag: if funding account has not been used before or origin is a high-risk jurisdiction

*All six rules run in real time. A flag holds the transaction in Manual Review (Screen 21) pending compliance team review (2–4 business hours). If confirmed suspicious after review → STR filed with NFIU within 24 hours.*

### Stage 3 — Regulatory Reporting
- Daily transaction returns submitted to CBN Director of Trade and Exchange
- Suspicious Transaction Reports (STRs) filed with NFIU within 24 hours of flag
- All transactions above $200,000 held pending EDD review (Tier 3 mechanism)

---

## Settlement Framework

### Layer 1 — Webhook Chain and User-Facing Status

**T=0: Payment submitted by user**
- Borderless validates: KYB tier, invoice scan, AML rules → if any fail, transaction goes to Manual Review (Screen 21) before proceeding
- Borderless debits user's USD wallet; internal status: `IN_PROGRESS`; user sees "Payment In Progress"
- Borderless calls **LianLian API** (`POST /payout/create`) → receives `{transaction_id, receiving_usd_account}`
- Borderless calls **Airwallex API** (`POST /transfers`) → instructs USD wire to LianLian's receiving account

**Airwallex Webhook Events → Borderless (internal only, no user-facing change)**
| Airwallex Event | Meaning | Borderless Action |
|---|---|---|
| `transfer.created` | Airwallex received the transfer instruction | Log internally |
| `transfer.submitted` | Submitted to Airwallex's banking partner | Log internally |
| `transfer.processing` | USD in transit to LianLian's receiving account | Log internally |
| `transfer.settled` | USD arrived at LianLian's account | Log; await LianLian webhook |
| `transfer.failed` | Airwallex could not deliver USD | Reverse user wallet debit; mark "Failed"; send push notification |

**LianLian Webhook Events → Borderless**
| LianLian Event | Meaning | Borderless Action |
|---|---|---|
| `payout.received` | LianLian received and matched the USD to transaction_id | Log internally |
| `payout.processing` | CNAPS transfer initiated to supplier's bank | Log internally |
| `payout.delivered` | CNAPS confirmed delivery; supplier's bank has credited the account | **Mark "Completed"; store CNAPS reference in Transaction Detail (Screen 24); send push notification + email** |
| `payout.failed` | CNAPS delivery failed (supplier bank rejected, account closed, etc.) | Raise dispute with LianLian under SLA; notify user "Payment failed — investigating" |

**User-Facing Status Transitions (only these cause UI changes)**
| Trigger | User Sees |
|---|---|
| Payment submitted (T=0) | "Payment In Progress" |
| `payout.delivered` from LianLian | "Payment Delivered ✓" |
| `transfer.failed` from Airwallex | "Payment Failed" |
| `payout.failed` from LianLian | "Payment Failed — Investigating" |
| Mid-flight refund confirmed | "Refunded to your USD wallet" |

**Design principle:** All intermediate Airwallex events (`transfer.created`, `transfer.submitted`, `transfer.processing`) and LianLian events (`payout.received`, `payout.processing`) are logged internally only. They do NOT update the user-facing status. The user sees only "In Progress" until there is a definitive outcome — this prevents status flicker and confusion.

**Timeline:**
- Best case (Chinese business hours, clean invoice, no AML flags): 2–6 hours
- Typical: same business day or next business day
- Failed + refunded: 2–5 business days

### Layer 2 — Partner-Level Settlement (Behind the Scenes)

| Borderless ↔ Partner | Settlement Mechanism | Timing |
|---|---|---|
| Anchor | Invoice for NIBSS collection fees | Monthly per agreed schedule |
| Providus Bank | FX spread deducted instantly at conversion; SWIFT sweep wires settle in 1–2 business days | Continuous FX + periodic batch sweep |
| Airwallex | Pre-funded pool debited per payment instruction; fees invoiced on agreed schedule | Per instruction + periodic invoice |
| LianLian Global | Daily net settlement — all transactions from Day N netted and settled Day N+1 morning; CNAPS confirmation sent per delivery | T+1 business day net |

### Layer 3 — Reconciliation

A daily reconciliation run matches four data sources using Borderless's unique transaction reference number as the key across all systems:

1. Anchor NIBSS inflow records → matched against Borderless NGN wallet credits
2. Providus Bank FX conversion records → matched against Borderless USD wallet updates
3. Airwallex account statement → matched against Borderless payment instructions sent
4. LianLian CNAPS delivery confirmations → matched against Borderless transaction completions

Any unmatched record triggers a manual investigation queue. The transaction reference number on Screen 24 (Transaction Detail) is the reconciliation anchor that connects all four systems.

### Layer 4 — Failed Transaction Settlement

**Scenario A — Pre-flight failure (fails before USD reaches LianLian)**
- Examples: Invoice rejected by AI scan, AML flag raised, KYB tier limit exceeded
- USD remains in user wallet (never transmitted to LianLian)
- Reversal is immediate — user wallet balance unchanged
- Transaction marked "Failed" with reason displayed
- Resolution: Same day, typically within minutes

**Scenario B — Mid-flight failure (USD transmitted to LianLian but CNY not delivered)**
- LianLian holds the USD value internally pending investigation
- Borderless raises a dispute with LianLian under the agreed SLA (24–48 hours initial response)
- LianLian's **Supplier Payments Guarantee** product applies — it exists specifically to cover failed delivery scenarios
- LianLian refunds USD equivalent back to Airwallex pool → Airwallex credits Borderless's pool → Borderless credits user's USD wallet
- Transaction marked "Failed — Refunded"
- User notification: "Your payment could not be delivered. $X has been returned to your USD wallet."
- Total resolution timeline: 2–5 business days (partner SLA dependent)

**Scenario C — Delivery confirmed but supplier claims non-receipt (dispute)**
- The CNAPS reference number (visible in Transaction Detail, Screen 24) is the authoritative record — it is the Chinese domestic payment system's delivery confirmation
- Borderless provides the CNAPS reference to the user
- User shares the CNAPS reference with their supplier — the supplier's Chinese bank can trace the payment using this reference
- If supplier's bank confirms receipt: dispute resolved at the supplier's bank (not a Borderless issue)
- If CNAPS reference cannot be verified: Borderless escalates to LianLian Global for a payment trace investigation
- LianLian provides a delivery trace report within their SLA (typically 3–5 business days)

---

## Float and FX Exposure — Architecture Note

*This section directly answers the capstone brief requirement: "What is your hypothesis on how float and FX exposure would be managed, and which partner would own that risk?"*

### What Float Means in Borderless

Float is money that is "in transit" — debited from one party but not yet credited to another. Three distinct float points exist in Borderless:

**Float Point 1 — NGN Deposit Float**
- The window between a user sending NGN via NIBSS and it appearing in their Borderless NGN wallet
- **Who holds it:** Anchor's infrastructure during NIBSS settlement
- **Risk level:** Negligible — NIBSS settles in near-real time (seconds to minutes)
- **Rationale for Anchor holding this:** Anchor issues and manages the NGN virtual accounts. They are the licensed MFB infrastructure layer. It is appropriate and legally correct for them to hold the brief deposit float — they are the CBN-licensed entity managing NGN inflows.

**Float Point 2 — USD Pool Float (Pre-funded Liquidity)**
- Borderless maintains a target USD balance at Airwallex to fund outbound payments. This is committed capital sitting idle between treasury sweeps and payment instructions.
- **Who holds it:** Borderless owns this risk entirely
- **Risk:** Opportunity cost (idle capital not earning returns) + if NGN strengthens significantly, the naira cost of maintaining the pool increases
- **Rationale for Borderless holding this:** No other party can hold this risk on our behalf. The pool is Borderless's operating capital. The mitigation is pool right-sizing: maintain only 3–5 days of expected payment volume in the pool, not weeks. This limits exposure without creating payment delays. Formal treasury hedging of this pool is deferred to post-MVP when daily volume justifies the hedge premium.

**Float Point 3 — Settlement Float (USD at LianLian)**
- From when Borderless instructs LianLian to deliver CNY to the supplier until the CNAPS credit appears in the supplier's account (T to T+1 business day), the USD value sits on LianLian's books.
- **Who holds it:** LianLian holds this risk
- **Risk:** Delivery failure during CNAPS transit
- **Rationale for LianLian holding this:** LianLian is the SAFE-licensed entity responsible for the China local delivery. They hold the USD, execute the conversion, and bear the operational responsibility for CNAPS delivery. Their **Supplier Payments Guarantee** product is the contractual backstop — it explicitly covers failed delivery and commits to refund. This is why disputes for mid-flight failures go directly to LianLian, not to Airwallex.

---

### What FX Exposure Means in Borderless

FX exposure is the risk of financial loss due to exchange rate movement between the moment a rate is quoted and the moment the underlying conversion actually settles. There are three distinct FX conversion moments in our product:

**FX Moment 1 — NGN → USD (Providus Bank executing on NAFEM)**

| | Detail |
|---|---|
| When it happens | User clicks Confirm on the Convert screen |
| Rate lock mechanism | Rate is shown to user; user confirms; Providus Bank executes the NAFEM purchase within seconds |
| Who absorbs the rate-move risk | **Borderless** — we have committed a rate to the user, but Providus executes at the live NAFEM rate at the moment of execution |
| Why Borderless, not Providus | Providus is our execution agent — they access the NAFEM market on our behalf and pass us the rate. We are the ones showing a committed rate to the user. The gap between "rate shown" and "rate executed" is our risk. |
| Why this risk is manageable | The execution window is seconds, not minutes. Rate moves in this window are basis-point level under normal conditions. Our 1.5% fee spread includes a natural buffer — the rate we show the user is slightly below the exact mid-market, creating a margin that absorbs minor variance. |
| Risk this does NOT cover | A macro NGN devaluation event (e.g., CBN emergency FX adjustment) during that seconds window would be abnormal and immaterial at MVP transaction volumes. |

**FX Moment 2 — USD → CNY (LianLian Global executing in China)**

| | Detail |
|---|---|
| When it happens | LianLian receives the USD in their receiving account and initiates the CNY conversion and CNAPS payout |
| Rate lock mechanism | LianLian locks the CNY rate when they accept the payment instruction from Borderless |
| Who absorbs the rate-move risk | **LianLian Global** — they absorb the USD/CNY conversion risk entirely |
| Why LianLian, not Borderless | LianLian is a SAFE-licensed entity with institutional CNY position management. Converting foreign currency to CNY and managing the associated FX exposure is their core regulatory competency. Their fee includes a margin that covers this exposure. At scale, LianLian uses FX forward contracts and CNY position hedging — this is their institutional treasury function, not ours. |
| PM perspective | This risk belongs permanently to LianLian at all transaction volumes. Borderless does not build CNY hedging capability at any stage — that is LianLian's structural advantage as our partner. |

**FX Moment 3 — USD Pool at Airwallex (Idle Float Between Sweeps)**

| | Detail |
|---|---|
| When it happens | Continuously — the USD pool at Airwallex sits between treasury sweeps and payment instructions |
| Who absorbs the risk | **Borderless** — the pool is our operating capital |
| What the risk is | If USD weakens vs CNY between a treasury sweep and the next payment instruction, each payment buys marginally fewer CNY. In the current Nigerian macro environment (USD generally stable to appreciating vs NGN), this risk is asymmetric and not the dominant concern. |
| Mitigation | Right-sizing the pool (3–5 days of expected volume, not weeks). This minimises idle exposure without creating payment delays. |
| Post-MVP plan | When daily transaction volume reaches a threshold where the hedge premium is justified, Borderless introduces FX forward contracts to lock future CNY rates for the pool. This is not an MVP-stage capability. |

---

### PM Hypothesis Summary (for Architecture Note Deliverable)

FX exposure in Borderless is distributed as follows, with explicit rationale for each:

| Risk Type | Who Absorbs It | Rationale |
|---|---|---|
| NGN/USD rate variance at conversion (seconds window) | Borderless | We quote the rate; we own the gap between quote and execution. Mitigated by fee spread buffer. |
| USD pool idle float risk | Borderless | It is our operating capital. Mitigated by pool right-sizing; formal hedging deferred to post-MVP. |
| USD/CNY conversion risk | LianLian Global | Their core regulatory and institutional competency as a SAFE-licensed entity. Included in their fee. |
| Settlement float during CNAPS delivery | LianLian Global | They hold the USD and bear delivery obligation. Covered by Supplier Payments Guarantee. |

**We are not formally hedging any FX exposure at MVP.** The 1.5% fee spread is the natural buffer for the NGN/USD leg. LianLian's institutional treasury function manages the CNY leg. The pool idle risk is managed through sizing policy. This is the appropriate PM-level hypothesis — we have identified who owns each risk and why, without claiming a treasury-level implementation we do not yet have.

---

## Data Privacy and Protection — Compliance Summary

*This section directly answers the capstone brief requirement: "What user data you're collecting, why, and how it's stored and protected. Reference: FCCPC Consumer Protection Framework and Nigeria Data Protection Act."*

### What Borderless Collects and Why — Full Table with Rationale

| Data Category | Specific Data Points | Why Collected | Why This Legal Basis | Retention Period |
|---|---|---|---|---|
| Business identity | Business name, CAC registration number (RC or BN) | CBN AML/CFT Regulations require identification of the business entity before any financial services are provided. Without this, we cannot complete KYB and the account cannot be activated. | **Legal obligation** — CBN AML/CFT Regulations 2022 mandate business identity verification for all financial institutions | 5 years after account closure |
| Director identity | BVN, NIN, government-issued ID, live selfie photograph | CBN requires biometric identity verification of the individual controlling the business. BVN links the director to the Nigerian banking system; NIN is the national identity number. Live selfie prevents identity document fraud. Without this, we cannot screen against sanctions lists (OFAC, UN, EU). | **Legal obligation** — CBN AML/CFT Regulations + FATF standards for customer due diligence | 5 years after account closure |
| Business documents | Certificate of Incorporation, CAC Status Report, TIN, utility bill | At Tier 2, we must confirm the company is authorised to conduct the trade it claims (CoI), screen current directors (CAC Status Report), confirm tax compliance (TIN), and verify physical operating address (utility bill). | **Legal obligation** — CBN risk-based AML framework for medium-risk accounts | 5 years after account closure |
| Enhanced KYB documents | MEMART, all directors' IDs, UBO declaration, source of funds declaration | At Tier 3 / EDD level, NFIU's beneficial ownership regulations require us to know who ultimately benefits from the money flows — not just who manages the company. Source of funds is required for EDD accounts under CBN AML/CFT Regulations. | **Legal obligation** — NFIU Beneficial Ownership Regulations + CBN EDD requirements for high-value accounts | 5 years after account closure |
| Contact details | Email address, phone number | Required to send account notifications (KYB status, payment confirmations), 2FA codes, and to reach the business owner if compliance review is required. Cannot deliver the service without this. | **Contract performance** — necessary to operate the account | While account is active; delete within 6 months of closure |
| Transaction data | Amounts, dates, FX rates, beneficiary names, CNAPS references, Borderless reference numbers, timestamps | Dual purpose: (1) Legal obligation — CBN AML/CFT Regulations require financial institutions to maintain transaction records for 5 years minimum; (2) Product value — this audit trail IS the "fully auditable" feature of Borderless; the user's ability to see their payment history is core to the product. | **Legal obligation** (AML record-keeping) + **Contract performance** (audit trail is the product) | 6 years after last transaction (CBN record-keeping mandate) |
| Proforma Invoice data | Goods description, HS codes, quantities, supplier details, invoice amounts | CBN trade finance documentation requirements mandate that cross-border payments for goods importation are supported by trade documentation. SAFE/CNAPS compliance requires that China payouts are backed by declared trade purpose. Without this, LianLian cannot legally process the CNAPS transfer. | **Legal obligation** — CBN cross-border payment documentation requirements + SAFE regulatory requirements for inbound China payments | 6 years (trade finance records) |
| Supplier data | Chinese supplier name, 18-digit business registration, CNAPS code, bank account, address | Payment execution requires these details. Supplier registration number is used for Qichacha legitimacy verification (AML requirement — screen the entity receiving funds). Without complete supplier details, payment cannot be routed or verified. | **Contract performance** — required to execute the payment; **Legal obligation** — AML requirement to screen payment recipients | Duration of beneficiary relationship + 5 years |
| Device and session data | IP address, device fingerprint, session metadata | Required for AML velocity monitoring (detecting structuring across sessions), fraud detection (identifying anomalous login or transaction patterns), and security logging. Not used for marketing. | **Legitimate interest** — fraud prevention and AML monitoring; proportionate to the risk of financial crime in a cross-border payment product | Rolling 12-month window for security logs; transaction-linked logs retained with transaction data |
| Payment reason | User-selected purpose (importation of goods, service payment, etc.) | AML categorisation — payment purpose is a required field in CBN cross-border payment reporting. Also triggers the Form M awareness banner and links to SAFE compliance requirements for China payouts. | **Legal obligation** — CBN cross-border payment reporting requirements | Retained with transaction data (6 years) |

---

### NDPA 2023 — How It Applies to Borderless Specifically

**1. Lawful Basis (Section 25, NDPA 2023)**
Every data category above has a documented lawful basis — not a generic claim of "compliance." The primary bases are:
- **Legal obligation:** KYB data, transaction data, invoice data — mandated by CBN AML/CFT Regulations and NFIU requirements. These cannot be refused by the user.
- **Contract performance:** Contact details, supplier data — required to deliver the service the user signed up for.
- **Legitimate interest:** Device and session data — fraud prevention and AML monitoring are legitimate interests that outweigh the privacy intrusion, given that we are a cross-border payment platform with significant money laundering risk exposure.

**2. Data Residency — The Critical Constraint (NDPA 2023 Section 41 + CNII Order 2024)**
BVN and NIN are designated **Critical National Information Infrastructure (CNII)** under Nigeria's 2024 CNII Order. This means:
- BVN and NIN data must be stored **within Nigeria** on Nigerian-hosted infrastructure. They cannot leave the country.
- Consequence for Borderless: Our identity verification partner (Smile ID) must store verification results and the underlying biometric data on Nigerian servers — we must contractually verify this before signing with them.
- Raw BVN/NIN values are **never transmitted to Airwallex or LianLian**. Only the verification outcome (Pass/Fail + reference ID) leaves Nigeria.
- Transaction data and business documents: stored in Nigeria or NDPC-approved jurisdictions with adequate safeguards.
- Cross-border data transfers to Airwallex (US) and LianLian (China) are permitted only for the payment instruction data (amounts, beneficiary details, CNAPS codes) — not for personal KYB data. Standard Contractual Clauses must be in place with each partner.

**3. Data Retention (NDPA 2023 + CBN AML/CFT Regulations)**
CBN's AML/CFT record-keeping obligations take precedence over NDPA's shorter default retention periods:
- Financial transaction records: **6 years** after last transaction
- KYB documents: **5 years** after account closure
- Contact data: deleted within **6 months** of account closure (no AML override applies here)
- Device/session logs: **12 months** rolling (security purpose only — no longer justified after this window)

**4. Breach Notification (NDPA 2023 Section 40)**
Borderless must notify the Nigeria Data Protection Commission (NDPC) within **72 hours** of becoming aware of a personal data breach. If the breach poses high risk to users (e.g., exposure of BVN, transaction history, or KYB documents), we must also notify the affected users without undue delay.

**5. Data Processing Agreements — All Partners**
Every partner that touches user data must have a signed DPA before going live:
- **Smile ID:** Biometric identity verification (BVN, NIN, live selfie) — DPA must confirm Nigerian data residency for CNII-classified data
- **Anchor:** NGN wallet infrastructure, NIBSS transaction data — DPA required
- **Airwallex:** Receives payment instruction data (amounts, beneficiary CNAPS codes) — DPA with Standard Contractual Clauses for US transfer required
- **LianLian Global:** Receives beneficiary data and payment instructions — DPA with cross-border transfer safeguards required; data sent to China must have documented adequacy basis

**6. DPCO Requirement**
Borderless must appoint a Data Protection Compliance Organisation (DPCO) — a NDPC-registered firm — to:
- Conduct annual data protection audits
- Submit the annual Compliance Audit Report to NDPC
- Conduct a Data Protection Impact Assessment (DPIA) before go-live, given that we process biometric data (KYB) and financial data at scale (both are high-risk categories requiring DPIA under NDPA)

**7. Privacy Notice (Required Before Onboarding)**
The Privacy Notice must be presented before a user creates an account. It must state, in plain language:
- What is collected (all categories above)
- Why (legal basis per category — not generic "for compliance")
- Who it is shared with (Smile ID, Anchor, Airwallex, LianLian — named explicitly)
- How long it is retained (per category, per the table above)
- User rights: access, correction, portability, deletion (with the caveat that AML retention obligations override deletion requests for KYB and transaction data)
- How to exercise rights (contact DPO)

---

### FCCPC Consumer Protection Framework — What Applies and Where

Note: The FCCPC's Digital, Electronic, Online and Non-Traditional Consumer Lending Regulations 2025 apply specifically to consumer lenders. Borderless is a **B2B payment platform** — these specific lending regulations do not apply. However, the broader Federal Competition and Consumer Protection Act 2018 (which the FCCPC enforces) applies to all businesses operating in Nigeria. Relevant requirements:

| FCCPC Principle | Where Borderless Implements It | Rationale for This Approach |
|---|---|---|
| Full fee disclosure before commitment | Screen 16 (FX Summary) — shows exact 1.5% fee + $15 flat before user confirms; no fees added post-confirmation | The FCCPC prohibits hidden charges. Our FX Summary screen is the pre-commitment disclosure moment. The user must see and confirm the full cost before the transaction is irreversible. |
| No hidden or undisclosed charges | All fees are disclosed on Screen 16; partner costs are absorbed into our margin — the user pays one transparent fee | Any fee not disclosed before commitment is an FCCPC violation. Our single blended fee model (1.5% + $15) eliminates the risk of hidden itemised charges appearing at confirmation. |
| Right to complaint resolution | In-app support channel with defined response SLA; escalation path to compliance team; transaction dispute process via CNAPS reference | FCCPC requires businesses to have an accessible complaint mechanism. Without this, users have no recourse path and Borderless is exposed to regulatory action. |
| Protection against unfair contract terms | Terms of service must not waive CBN-mandated protections, NDPA rights, or FCCPC consumer rights | The FCCPC can void contract clauses that are unfair or that strip users of statutory rights. Our T&Cs must be reviewed by Nigerian counsel before launch. |
| Clear pre-contractual disclosure | Privacy Notice and T&Cs must be accepted before account activation | Users must know what they are agreeing to before they are bound by it. Pre-activation consent is the implementation. |

---

## Product Decisions Log (with Rationale)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Target user | Business owner only (v1) | Simplicity; single identity simplifies KYB; permissions layer (finance manager, approvals) is v2 |
| Primary pain | Cost (FX spread) | Validated by real user research — informal agent charges 3–5% FX spread, purely opaque |
| Secondary pain | Speed | 2–3 days via informal agent is still too slow for working capital management |
| Solution model | Hub-and-spoke: NGN→USD pool→CNAPS | Avoids SWIFT entirely; local rails on both ends enable same-day delivery |
| Real competitor | Informal agent model | Not SWIFT, not any formal fintech — the informal agent is what SME importers actually use |
| Product name | Borderless | Descriptive, B2B-appropriate, positions the product as boundary-removing |
| MVP scope | Outbound only, China only | Inbound = IMTO territory, deferred to v2 using Anchor's IMTO; other corridors need separate payout partner negotiations |
| Nigerian infra partner | Anchor | API-first BaaS, MFB + IMTO + MSB licensed, proven at scale, v2 inbound compatible |
| FX authorized dealer | Providus Bank | CBN-authorized dealer with fintech partnership track record; accesses NAFEM (I&E window) legally |
| USD custody + transmission | Airwallex | US MSB (FinCEN), World's Best Cross-Border Payments Provider 2025, no-monthly-fee tier for early stage |
| China payout partner | LianLian Global (primary); PingPong (backup) | SAFE Cross-Border Business Licence is mandatory for foreign entities paying Chinese suppliers via CNAPS; Airwallex holds only a Third-Party Online Payment Licence (domestic China); their CNY local transfer product excludes Nigerian businesses (requires Chinese entity or Chinese-UBO); LianLian is the correct and necessary partner |
| KYB model | 3-tier (Starter/Growth/Business) with USD limits | Covers full SME spectrum; USD limits are rate-stable unlike naira |
| Tier 3 "unlimited" | EDD model (no preset cap; manual review above $200K) | Industry-standard mechanism; legally defensible; no arbitrary hard ceiling for high-volume importers |
| Fee model | 1.5% FX + $15 flat; $5 minimum; no cap | Cost stack is ~0.8–1.3% + $5–12 (LianLian); margin is 13–17% across all transaction sizes; cap removed because it created losses above $192K; flat raised from $10 to $15 to protect margin at small transactions; fee set without knowledge of partner caps — subject to revision after commercial engagement |
| Informal agent actual fee | 3–5% spread + $100 flat (<$10K) or $200 flat (>$10K) | Corrected from spread-only; flat fee component confirmed from user research |
| Payment reason field | Collected at Send Money step (Screen 13a) | Required for AML categorisation; auto-populated from Proforma Invoice HS code scan |
| Form M policy | Inform only — not blocked | Borderless is a payment platform, not a customs broker; obligation rests with importer; we surface the notice and provide receipt as evidence; EDD review at >$200K can request Form M number |
| Supplier registration (18-digit) | Collected at Add Beneficiary (Screen 14), not per transaction | Per-beneficiary verification via Qichacha API; saves as "Verified Supplier" badge; not a KYB document |
| Own MSB licence | Deferred — use Airwallex's | Airwallex's MSB covers our operations at MVP; own MSB/EMI is a scale-up milestone tied to margin improvement |
| Own PSP licence | Deferred — operate under Anchor | CBN PSP requires ₦5B capital; partner model correct for MVP; own PSP target Month 12–18 |
| IMTO | Not applicable to MVP; v2 via Anchor | IMTO = inbound only; our MVP is outbound only; Anchor's IMTO will cover v2 inbound without partner change |

---

## Open Questions (Remaining — Required for Deliverables)
1. ~~**Mid-flight failure scenario:**~~ **CLOSED** — LianLian holds the USD; Borderless raises dispute under SLA; LianLian's Supplier Payments Guarantee covers the refund; USD returned to user wallet in 2–5 business days. Full detail in Settlement Framework, Layer 4, Scenario B.
2. ~~**Form M:**~~ **CLOSED** — Borderless informs but does not block. Form M obligation rests with the importer and their bank. Borderless generates a per-transaction receipt usable as Form M evidence. At EDD review (>$200K), Form M number may be requested.
3. ~~**48-hour regulatory directive response plan:**~~ **CLOSED** — Full response plan documented below in the "48-Hour Regulatory Directive Response" section. Core answer: Borderless does not respond to CBN directly (no direct regulatory relationship at MVP); it detects directives through partner notification, assesses scope with legal counsel, follows partner compliance leads, and communicates transparently to users. Four directive types mapped with specific responses.
4. ~~**Dispute scenario:**~~ **CLOSED** — CNAPS reference number is the authoritative record. User shares it with their supplier's bank. If unverifiable, Borderless escalates to LianLian for a payment trace (3–5 business days). Full detail in Settlement Framework, Layer 4, Scenario C.

---

## 48-Hour Regulatory Directive Response — Compliance Summary

*This section directly answers the capstone brief requirement: "What would you do in the first 48 hours if a regulatory body issued a directive that directly affected your product category?"*

### Why the Partnership Model Changes the Response

A licensed entity (a bank, a PSP holder) receives CBN directives directly, responds to CBN directly, and is directly sanctionable. Borderless at MVP is none of those things. It has no direct CBN filing relationship. Its licensed partners do. This is the structural reality that defines the entire response plan — and it must be stated honestly, not papered over.

**The correct frame:** Borderless detects directives through its partners, assesses scope with legal counsel, follows the licensed partners' compliance lead, and controls the user-facing product layer (what to pause, what to communicate).

A generic "we will pause operations and inform CBN" answer is wrong for Borderless at MVP. We cannot "inform CBN" because we have no CBN reporting channel. We pause what we can pause, and we follow what our licensed partners tell us.

---

### Types of Directive and What Each Means for Borderless

| Type | Description | Immediate Impact on Borderless |
|---|---|---|
| **A — Outbound FX restriction** | CBN restricts outbound USD transfers or NAFEM access (has historical precedent in Nigeria) | Providus Bank cannot execute FX purchases on our behalf. Payment flow is broken. Borderless must pause payments. |
| **B — Enhanced AML/KYB requirements** | CBN issues new compliance standards (e.g., the March 2026 Baseline Standards for Automated AML) | No immediate operational pause. Compliance window of 30–90 days. Borderless must draft and submit a compliance roadmap. |
| **C — Licensing requirement for unlicensed fintechs** | CBN mandates that fintechs operating in cross-border payments must hold their own PSP or equivalent licence | Borderless must pause the unlicensed activity immediately and expedite own PSP licence application. |
| **D — Corridor-specific restriction** | CBN restricts payments to a specific country | Pause the affected corridor in the product. Configuration change, not systemic failure. |

---

### The 48-Hour Response Plan

**Hours 0–4: Detection**

CBN publishes all circulars publicly on cbn.gov.ng. Two detection channels:
1. **Primary — Partner notification:** Anchor and Providus Bank receive CBN directives directly as licensed institutions. Borderless's commercial agreements with both must include a contractual clause requiring them to notify Borderless within 4 hours of any directive affecting the services they provide. *Rationale: without this clause, Borderless learns from media — hours or days late, after partners have already begun responding.*
2. **Secondary — Direct monitoring:** Borderless's compliance lead monitors cbn.gov.ng and subscribes to Nigerian fintech legal alert services.

**Immediate action:** Compliance lead reads the full directive text. Initial question: does this apply to (a) licensed partners only, (b) unlicensed fintechs explicitly, or (c) both? Flag to legal counsel and senior leadership.

---

**Hours 4–12: Assessment**

- **Emergency call with Anchor and Providus Bank compliance teams.** Their interpretation of the directive is legally authoritative for our Nigerian operations — we follow their lead, not the reverse. *Rationale: they are the licensed entities; their compliance obligations determine what they can continue to do for us.*
- **Nigerian fintech-specialist legal counsel** reviews the full directive. Key question: Is Borderless directly addressable, or only through its licensed partners? What is the compliance window?
- **Notify Airwallex and LianLian** if the directive has cross-border implications from their own regulators (FinCEN or SAFE).
- **Log every communication with timestamps.** This compliance record is proof of good faith in the event CBN queries our response.

---

**Hours 12–24: Decision and Immediate Action**

Decision point — four outcomes:

**If partner pauses (Outcome A):** Borderless must pause the affected product feature immediately — no alternative exists without our licensed partners. Disable the affected flow. User communication within 2 hours of the pause decision.

**If compliance window exists (Outcome B):** Operations continue. Draft internal compliance roadmap within the 48-hour window identifying what needs to change and by when.

**If own licence required (Outcome C):** Pause the unlicensed activity immediately. Do not continue operating in a directly prohibited manner. Expedite PSP licence application (planned Month 12–18; now accelerated). Engage CBN's fintech licensing team for any available grace period. *Rationale: this is why proactively pursuing the own PSP licence matters — the partnership model is an MVP structure, not our intended permanent state. This scenario accelerates that timeline.*

**If corridor restricted (Outcome D):** Disable the affected corridor in the product (configuration change). Notify all users with pending transactions. Offer USD wallet balance refund.

---

**Hours 24–48: Communication, Documentation, Continuity**

**User communication (mandatory if service interrupted):**
- Channel: in-app notification + email, within 2 hours of the pause decision
- Content: what is affected, why (regulatory directive), what happens to in-flight transactions, timeline to resolution
- In-flight transaction handling: pre-flight amounts revert to USD wallet immediately; mid-flight transactions covered by LianLian's Supplier Payments Guarantee (2–5 business day refund)
- Tone: transparent and specific — not vague "regulatory changes" language

**Internal compliance documentation:**
Every action is formally logged — directive text, detection timestamp, all partner communications (timestamped), legal counsel's written opinion, the decision made, user communications sent. *Rationale: this record is proof of good faith if CBN queries how quickly and appropriately Borderless responded.*

**CBN acknowledgement (if directly addressable):**
If legal counsel confirms Borderless is directly addressed by the directive, Borderless writes a formal acknowledgement to CBN within 48 hours. Content: we have received and reviewed the directive; we are assessing our compliance position; we will submit a full compliance plan by [date within the window]. *Rationale: demonstrating responsiveness before full compliance is achieved is better than silence.*

**Partner coordination:** All four partners (Anchor, Providus, Airwallex, LianLian) are informed of Borderless's status and any product changes. They must not learn of a pause through user complaints.

---

### Pre-Conditions Required BEFORE Any Directive Arrives

| Pre-condition | Why It Matters |
|---|---|
| Partner notification clause in all four contracts | Without it, Borderless learns from media — hours or days late |
| Pre-built in-app and email notification templates | Cannot notify users within 2 hours without pre-existing communication infrastructure |
| Retainer with Nigerian fintech-specialist legal counsel | Cannot get a legal opinion in 4–8 hours without counsel already briefed on the product |
| Documented product pause capability per feature | Every feature (corridor selector, conversion, payment submission) must have a defined pause mechanism |
| Internal compliance incident log | Good faith requires a timestamped record of all actions |
| CBN website monitoring | Backup detection channel if partner notification fails |

---

### What the Panel Will Probe — The Honest Answers

**"You hold no licences — how can you respond to CBN?"**
We don't respond to CBN directly — our licensed partners do. This is the structural reality of the MVP model, and we state it honestly rather than claiming authority we don't have. Our partner contracts include notification obligations that make us fast followers, and we are actively pursuing our own PSP licence (Month 12–18) to change this dynamic over time.

**"What if the directive specifically prohibits the partnership model?"**
We pause immediately and pursue our own licence. We do not continue operating in a directly prohibited manner. The PSP licence application exists precisely because we recognise that indefinite reliance on partner licences is a regulatory risk. This scenario accelerates that timeline.

**"What happens to users' money during a forced pause?"**
No funds are lost. Pre-flight transactions revert to the user's USD wallet immediately. Mid-flight transactions are covered by LianLian's Supplier Payments Guarantee (2–5 business day refund). All users receive transparent notification within 2 hours of the pause decision.

---

## Key Constraints
- MVP must show compliance gate visibly inside the product (non-negotiable per brief)
- KYB failure, transaction limit breach, and AML flagging scenarios must be in the prototype
- Panel will probe compliance specifics — no generic answers
- No mention of Raenest anywhere in deliverables
- IMTO does not apply to MVP — do not cite as our licence framework
- PSP capital requirement (₦5B) confirms MVP must operate under a licensed partner
- Fee model must be defensible from partner cost structure — not borrowed from competitors

---

## Notes from Brainstorm Sessions

### Session 1 — 2026-05-10
- Confirmed primary user is the business owner; v2 adds permissions
- Confirmed cost (FX spread markup) is primary pain; speed is secondary
- Validated real user insight: informal agent model is the true competitive baseline
- Compliance is a value prop — informal model carries regulatory risk
- Hub-and-spoke architecture confirmed: NIBSS → USD pool → CNAPS

### Session 2 — 2026-05-10
- Product named: Borderless
- Transaction size range: any amount to hundreds of millions
- FX fee model initiated; later revised
- IMTO flagged as inapplicable — correct licence framework established
- KYB tiers defined; "unlimited" is an EDD model

### Session 3 — 2026-05-11
- MSB clarified: not held by Borderless at MVP — held by Airwallex (our USD partner); Borderless is a client
- IMTO explicitly mapped to v2 inbound product via Anchor (who holds IMTO)
- MVP scope locked: outbound only, China only
- KYB tiers fully refined with USD limits and document requirements per tier
- Core user journey mapped: 24 screens
- 2024 CBN update: fintechs cannot hold IMTO directly — confirmed Anchor holds it for us in v2

### Session 4 — 2026-05-11
- Partners named specifically: Anchor (NGN infra), Providus Bank (FX authorized dealer), Airwallex (USD + transmission), LianLian Global (China CNAPS payout)
- FX dealing mechanism explained: Providus accesses NAFEM/I&E window; NGN→USD is a domestic FX purchase, not a border crossing; USD sits in nostro at Providus before moving to Airwallex; individual transactions are ledger moves within pre-funded pools
- Fee structure rebuilt from partner cost stack: ~1.5–2.5% + ~$10 flat per transaction; Borderless charges users 2% + $10 (later revised)
- Rationale added to all product decisions

### Session 5 — 2026-05-11
- Informal agent full fee structure confirmed: 3–5% FX spread PLUS $100 flat (<$10K) or $200 flat (>$10K)
- Added Screen 13a (Payment Reason) to user journey; added Chinese Business Registration Number to Screen 14
- Chinese 18-digit registration corrected from Tier 3 KYB document → per-beneficiary verification at Setup
- AML Stage 2 clarified: Qichacha verification at beneficiary setup, not per transaction
- Form M question closed: inform-only policy confirmed; Borderless generates receipt as evidence; EDD enforcement only at >$200K
- Partner fee caps noted as subject to commercial negotiation; savings passed to customers if confirmed

### Session 6 — 2026-05-11
- CORRECTION: Airwallex cannot execute China CNAPS payout for Borderless's users
  - Airwallex holds a Third-Party Online Payment Licence in China (domestic payments only) — NOT a SAFE Cross-Border Business Licence
  - Airwallex's CNY local transfer product requires Chinese entity registration or Chinese national UBO; Nigerian businesses do not qualify
  - LianLian Global restored as PRIMARY China payout partner (SAFE licence = the mandatory authorisation for foreign-originated USD → CNY → CNAPS)
  - Airwallex's role corrected to: USD custody + cross-border USD transmission to LianLian only
- Cost stack revised: ~1.0–1.5% + LianLian flat/percentage (~$5–12, to be confirmed)
- Borderless fee revised: 1.5% FX + $10 flat; cap and flat fee subject to partner negotiation
- This correction is a real-world example of "where AI fell short" for the Retrospective section of the capstone
- 3 open questions remain for deliverables (mid-flight failure, 48-hour directive response, dispute scenario)

### Session 7 — 2026-05-11
- Treasury sweep mechanism explained: two distinct steps — (A) domestic FX purchase at Providus creates USD in nostro inside Nigeria; (B) periodic SWIFT MT103 wire from Providus nostro to Airwallex's US banking account tops up the pre-funded pool
- SWIFT is used — but only for background treasury operations, not user-facing transactions
- Providus Bank's role expanded: now covers both FX dealing AND outward SWIFT wire execution (capital outflow requires authorized dealer; BDC cannot do this)
- Settlement Framework added: 4 layers (user-facing, partner-level, reconciliation, failed transactions)
- Open Question 1 closed: mid-flight failure → LianLian holds USD → dispute raised under SLA → Supplier Payments Guarantee covers refund → USD back to user in 2–5 days
- Open Question 4 closed: dispute scenario → CNAPS reference is authoritative → user shares with supplier's bank → if unverifiable, escalate to LianLian for trace
- 1 open question remains: 48-hour regulatory directive response plan (Compliance Summary)

### Session 8 — 2026-05-12
- KYB tier document rationale added: each document now has a "why at this tier" explanation, not just a list of what to collect
- KYB upgrade path corrected: two trigger paths now documented — proactive (from Profile → Verification & Limits, Screen 7a) and reactive (transaction blocked → upgrade CTA); both preserve transaction context
- AML structuring detection expanded: added 4 new named rules — aggregate threshold structuring, velocity structuring, just-below-threshold pattern, multi-beneficiary dispersion; prior "structuring detection" renamed to "tier-limit structuring" to distinguish from AML threshold structuring
- Fee model revised: flat fee raised from $10 to $15; percentage cap removed (was creating losses above $192K); margin table added showing 13–17% margin across all transaction sizes; caveat added that fee is set without knowledge of partner caps
- USD wallet infrastructure clarified: USD wallet is a ledger balance backed by FBO pooled account at Airwallex (not a per-user US bank account); NGN wallet is per-user Anchor-issued virtual account; distinction documented in new "Wallet Infrastructure" section
- Settlement relationship clarified: Borderless has TWO parallel direct API relationships (Airwallex and LianLian) — they are not nested; money flow Step 3 updated to show both parallel API calls explicitly
- Webhook flow mapped in full: Airwallex events (transfer.created → transfer.submitted → transfer.processing → transfer.settled / transfer.failed); LianLian events (payout.received → payout.processing → payout.delivered / payout.failed); user sees only "In Progress" until definitive outcome — intermediate events are internal only

### Session 9 — 2026-05-12
- Float and FX Exposure section added (Architecture Note deliverable)
  - Three float points identified: NGN deposit float (Anchor, negligible), USD pool float (Borderless owns, managed by pool right-sizing), settlement float (LianLian holds, covered by Supplier Payments Guarantee)
  - Three FX conversion moments mapped with rationale for who absorbs each: NGN→USD (Borderless, mitigated by fee spread), USD→CNY (LianLian, their core competency), USD pool idle (Borderless, managed by pool sizing, no formal hedge at MVP)
  - PM hypothesis stated: not formally hedging at MVP; fee spread is natural buffer for NGN/USD; LianLian owns CNY risk; formal treasury (FX forwards) deferred to post-MVP
- Data Privacy and Protection section added (Compliance Summary deliverable)
  - Full data collection table with specific data points, WHY collected, WHY that legal basis, retention period
  - NDPA 2023 requirements: lawful basis per category, data residency (BVN/NIN = CNII, must stay in Nigeria), retention periods (6 years transaction data per CBN, 5 years KYB), breach notification (72 hours to NDPC), DPAs required with all four partners, DPCO requirement, Privacy Notice requirements
  - FCCPC principles: confirmed FCCPC Digital Lending Regulations 2025 do NOT apply to Borderless (B2B payment platform, not consumer lender); broader FCCPA 2018 applies; implementation mapped per principle
  - Rationale included for every requirement explaining WHY it applies to our specific product
- 48-hour regulatory directive response plan still outstanding — last remaining open question

### Session 10 — 2026-05-12
- 48-hour regulatory directive response plan documented — ALL open questions now closed
- Core insight: Borderless has no direct CBN regulatory relationship at MVP; it detects directives through licensed partners (Anchor, Providus Bank), responds through partner frameworks, and controls the product layer
- Four directive types mapped: FX restriction (partner pauses → Borderless pauses), AML/KYB enhancement (compliance window, draft roadmap), own licence requirement (immediate pause + expedite PSP application), corridor restriction (configuration change)
- 48-hour timeline defined: 0–4hr detection, 4–12hr assessment with partners + legal counsel, 12–24hr decision + immediate action, 24–48hr communication + documentation + CBN acknowledgement
- Pre-conditions required before any directive: partner notification clauses in all four contracts, pre-built notification infrastructure, legal counsel retainer, documented product pause capability
- Panel defence points documented: why no direct CBN response is correct (not evasive), what happens to user funds during a pause, what the own-licence scenario triggers
- Context document is now complete across all required deliverable sections
