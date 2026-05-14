# Borderless — Capstone Brainstorm Session History

**Project:** ProductDive Fintech Payment PM Advanced Capstone
**Product:** Borderless
**Option:** B — The SME Treasurer
**Session dates:** 2026-05-10 to 2026-05-11

This document captures the substance of the brainstorming conversation — the questions asked, answers given, decisions made, corrections issued, and reasoning behind each pivot. It is written so that someone reading it cold (including a future AI session) can understand exactly how the product thinking evolved.

---

## Exchange 1 — Problem Selection and First Round of Questions

**User:** Shared the capstone brief. Leaning toward Option B (SME Treasurer). Wants to brainstorm together with intelligent questions, own every product decision, and be panel-ready.

**AI asked:**
1. Who is actually doing this job today — owner or finance manager?
2. Which pain is sharpest — speed, cost, or auditability?
3. Any real signal from this world (user research)?
4. What's your instinct on the solution mechanism?

---

## Exchange 2 — User Answers Round 1

**User answered:**
1. **Primary user:** The business owner. Finance manager permissions deferred to v2.
2. **Primary pain:** Cost first, speed second.
3. **Real user insight:** A friend's brother moves hundreds of millions of naira to Chinese suppliers. Uses informal agents — Nigerians with Chinese bank accounts who pay the supplier locally. Trust-based relationship built over years. FX rate is negotiated (agent charges a spread). Still requires a physical bank visit. Settlement: 2–3 days.
4. **Solution mechanism:** Shared detailed research on how a comparable product works — hub-and-spoke model, local rails on both ends, bypasses SWIFT. Key rails: NIBSS (Nigeria) and CNAPS (China). Key mechanism: NGN inflow → USD conversion → API call to SAFE-licensed Chinese payout partner → CNY local transfer to supplier.

**Key insight established:** The real competitor is the **informal agent**, not SWIFT, not any fintech. Our product just needs to beat the informal model on cost, speed, and access — not on the global payments industry.

**AI noted:** Do not reference the comparable product by name anywhere in the project.

---

## Exchange 3 — Product Name, Transaction Size, Differentiation

**User answered follow-up questions:**
- **Product name:** Borderless
- **Transaction size range:** Any amount — from a few million naira (small vendors, hair vendors) to hundreds of millions (high-volume importers like the contact)
- **Differentiation:** Focus on our own approach, not competitor comparison
- **KYB tiers:** User initiated the idea of tiered KYB with limits and requirements at each tier, noting it should align with a regulatory standard
- **MVP scope:** Outbound only (Nigeria → China). Inbound payments (receiving money into Nigeria) deferred to v2.
- **China only for v1:** Other corridors added as SAFE-equivalent payout partners are onboarded

**Decision locked:** Build for the full SME spectrum using a 3-tier KYB model. Limits in USD (not NGN) because naira-denominated limits shift with exchange rate moves.

---

## Exchange 4 — IMTO Licence Flag (Critical Correction)

**AI stated** (initial error): "We might leverage a partner with an IMTO licence."

**AI then self-corrected after research:**
- IMTO (International Money Transfer Operator) authorises **inbound** transfers only — foreign currency coming INTO Nigeria
- Borderless is an **outbound** product
- IMTO does not apply to our MVP at all
- The correct licensing framework for outbound B2B payments: CBN PSP licence + FX Authorized Dealer + US MSB + SAFE Cross-Border Business Licence (China)

**User confirmed:** Already knew IMTO was inbound only. MSB (Money Services Business) licence held by our USD infrastructure partner was the correct model.

**Decision logged:** IMTO = v2 inbound product only. Do not cite IMTO as our MVP licence.

---

## Exchange 5 — Partner Stack Named and Specific

After research, four partners were identified:

| Partner | Role | Licence |
|---|---|---|
| **Anchor** | Nigerian BaaS — NGN virtual accounts, NIBSS collection | Nigerian MFB + IMTO (for v2) + Canadian MSB |
| **Providus Bank** | FX Authorized Dealer — NGN→USD via NAFEM/I&E window | CBN Authorized Dealer |
| **Airwallex** | USD custody + cross-border transmission | US MSB (FinCEN) |
| **LianLian Global** | China CNAPS payout — USD→CNY via SAFE licence | SAFE Cross-Border Business Licence |

**Why Anchor specifically:** API-first BaaS, $2.5B+ processed, 1,000+ businesses. Their IMTO licence becomes critical for v2 inbound without needing to switch partners.

**Why Providus Bank specifically:** CBN-authorized dealer, known fintech-friendly bank, accesses NAFEM (Nigeria's official FX market) on our behalf.

**Why Airwallex specifically:** US MSB (FinCEN-registered), World's Best Cross-Border Payments Provider 2025 (Euromoney), no monthly fee on Explore tier.

**Why LianLian Global specifically:** SAFE-licensed, 65+ global licences, launched world's first cross-border Supplier Payments Guarantee to China, LGPS purpose-built for B2B cross-border to China.

---

## Exchange 6 — The FX Mechanism Explained

**User asked:** What does the FX dealing/BDC arrangement actually mean? Is it where we get rates or do the actual conversion? How if money doesn't cross the border?

**AI explained:**
- We do NOT use a BDC (Bureau de Change) — those are retail FX, small amounts, CBN has restricted them repeatedly
- We use an **authorized dealer** (Providus Bank — a commercial bank with CBN FX dealing rights)
- When the user converts NGN → USD, Providus Bank executes an FX purchase on the **NAFEM** (Nigeria Autonomous FX Market / I&E window) on our behalf
- Providus deducts their spread (~0.5–0.8%) and credits our **USD nostro account** held at Providus inside Nigeria
- Borderless reflects this as a USD wallet balance — it is a **ledger update**, not a cross-border transfer
- When a payment is initiated, Airwallex transmits the pre-funded USD to LianLian
- Individual transactions are ledger moves within pre-funded pools; actual settlement between pools is netted and batched

**Key principle:** Money does not cross a border per transaction. It moves within pre-funded liquidity pools that are settled periodically between partner banks.

---

## Exchange 7 — KYB Tier Structure

Three tiers were designed:

**Tier 1 — Starter**
- Documents: Business name, CAC registration (RC/BN), Owner BVN + NIN, valid government ID
- Limits: $3,000/transaction, $5,000/month
- No Proforma Invoice required at this tier
- Rationale: Aligned with PAPSS simplified corporate threshold; lowest friction to activate

**Tier 2 — Growth**
- Documents (Tier 1 +): Certificate of Incorporation or Business Name Certificate, CAC Status Report, TIN, utility bill
- Limits: $50,000/transaction, $100,000/month
- Proforma Invoice required per transaction from Tier 2 upward
- Rationale: Covers majority of SME importers; TIN introduced at size where tax traceability matters

**Tier 3 — Business**
- Documents (Tier 2 +): MEMART, all directors' IDs (BVN/NIN per director), UBO declaration (shareholders >25%), source of funds declaration
- Limits: No preset cap — EDD (Enhanced Due Diligence) model; manual review required above $200K
- Rationale: "Unlimited" is an EDD model, not a waived limit. No arbitrary ceiling; enhanced scrutiny above threshold.

**Upgrade path:** Triggered by user behaviour (attempting to transact above current tier limit), not time intervals. Upgrade flow is in-context — user does not lose their transaction.

---

## Exchange 8 — Fee Model (Initial and Corrected)

**Initial model:** 2% FX conversion + $10 flat transaction fee
- Based on estimated partner cost stack of ~1.5–2.5% + ~$10 flat

**User challenged:** The informal agent also charges a flat fee ($100 for transactions <$10K, $200 for transactions >$10K). Also — does our fee have a cap? No incentive for high-volume businesses without one.

**Research finding:** Airwallex's CNAPS transfer is free via local rail. AI concluded Airwallex could handle China payout entirely, dropped LianLian as primary, revised cost to 1.0–1.3% with no flat component.

**User challenged again:** "Don't they need a SAFE cross-border business licence for that?"

**AI investigated and confirmed the error** (see AI Corrections Log, Entry 1):
- Airwallex holds a Third-Party Online Payment Licence in China (domestic only), NOT a SAFE licence
- Airwallex's CNY local transfer eligibility excludes Nigerian businesses (requires Chinese entity or Chinese UBO)
- LianLian Global restored as primary China payout partner
- Cost stack revised back to include LianLian's fee

**Final fee model:**
- 1.5% FX conversion fee
- $10 flat transaction fee (covers LianLian's China payout cost — to be confirmed via commercial engagement)
- $5 minimum
- $2,500 cap on the percentage component
- All partner fees (Providus, Airwallex, LianLian) subject to reduction upon direct commercial negotiation — savings passed to customers

**Competitive comparison at $30,000:**
- Informal agent: $1,500 FX spread + $200 flat = $1,700
- Borderless: $450 FX + $10 flat = $460
- Saving: ~73%

---

## Exchange 9 — Core User Journey (24 Screens)

Mapped screen by screen:

**Onboarding (Screens 1–7):** Sign up → KYB Tier 1 RC/BN entry → Document upload → Director verification (BVN, NIN, live selfie) → KYB review → KYB approved/rejected → Tier status display

**Wallet & Funding (Screens 8–10):** Dashboard → Fund wallet (virtual NGN account details) → NGN credited instantly via NIBSS

**Convert (Screens 11–12):** NGN→USD conversion (real-time NAFEM rate, 1.5% fee shown) → Conversion complete (instant ledger update)

**Send Money (Screens 13–18):**
- 13: Corridor selector (China active; others "coming soon")
- 13a: Payment Reason dropdown (Importation of goods / Service payment / Professional fees / IP licensing / Other)
- 14: Add Beneficiary (supplier name, bank, account, CNAPS code, **Chinese Business Registration Number 18-digit**, address)
- 15: Invoice Upload (AI-scanned for HS codes, supplier name match, amount consistency)
- 16: FX Summary (rate, 1.5% fee, $10 flat, delivery estimate)
- 17: Review & Confirm (Form M banner shown if goods payment detected)
- 18: Payment Submitted (tracking reference)

**Compliance Gates (Screens 19–22):**
- 19: Tier Limit Exceeded (blocked, upgrade CTA)
- 20: Invoice Rejected (reason shown, re-upload prompt)
- 21: Manual Review Hold (2–4 hours estimate, support contact)
- 22: KYB Upgrade Flow (in-context, transaction preserved)

**Post-Transaction (Screens 23–24):**
- 23: Transaction History (status tags)
- 24: Transaction Detail (full audit trail — this is the "fully auditable" value prop)

---

## Exchange 10 — Three Corrections to the Journey and Fee Model

**User identified three gaps:**

1. **Chinese 18-digit business registration never collected** — Referenced in AML but not in the Add Beneficiary screen.
   - Fix: Added to Screen 14 (Add Beneficiary). Collected once per supplier at setup. Verified live via Qichacha API. Saved as "Verified Supplier" badge. Removed from Tier 3 KYB (it was a category error — it's a per-beneficiary document, not a document about the Borderless user).

2. **Informal agent fee model was incomplete** — Agent charges a flat fee on top of FX spread ($100 or $200 depending on transaction size).
   - Fix: Competitive analysis updated. Borderless fee model revised accordingly.

3. **Payment reason and Form M not designed** — Should we require Form M when goods importation is detected?
   - Decision: **Inform only, do not block.** Form M is the importer's obligation to their own bank. Borderless surfaces a notice on Screen 17 and generates a receipt usable as Form M evidence. EDD review at >$200K can request Form M number. Blocking would be regulatory overreach and would drive users back to informal agents.

---

## Exchange 11 — Airwallex/SAFE Licence Correction

**User challenged:** "How did you confirm that Airwallex can carry out the transfer to the supplier bank? Don't they need a SAFE cross-border business licence for that?"

**AI investigated:**
- Airwallex holds a Third-Party Online Payment Licence in China (2023, via Guangzhou Shangwutong acquisition) — this is for domestic China digital payments, NOT cross-border inbound from foreign entities
- Airwallex's CNY local transfer eligibility requires: China-registered business OR Chinese national UBO. Nigerian businesses qualify for neither.
- Airwallex explicitly uses SAFE-licensed backend partners for cross-border China declarations
- LianLian Global holds the actual SAFE Cross-Border Business Licence — the mandatory authorisation for a foreign entity to route USD into China, convert to CNY, and deliver via CNAPS

**Correction made:**
- LianLian Global restored as primary China payout partner (Partner 4, not backup)
- Airwallex corrected to: USD custody + cross-border USD transmission to LianLian only
- Partner 3 description updated to explicitly explain why Airwallex cannot do the China payout for our users
- All affected sections in context document updated

**User action:** Asked for this correction to be logged in a dedicated corrections document for use in the Retrospective.

---

## Exchange 12 — AI Corrections Log Created

User requested a dedicated document to log AI errors caught during the build — for use in the *"Where AI fell short"* section of the capstone Retrospective deliverable.

**File created:** `AI_CORRECTIONS_LOG.md`

Contains:
- Correction 1: Airwallex/SAFE licence error (with sources and PM lesson)
- Correction 2: IMTO inbound/outbound error (earlier in the session)
- Template for future corrections

---

## Decisions Locked (Summary)

| Decision | Choice |
|---|---|
| Product name | Borderless |
| Primary user | Business owner (v1); finance manager permissions deferred to v2 |
| Primary pain | Cost (FX spread) |
| Secondary pain | Speed |
| MVP scope | Outbound only; China corridor only |
| Inbound payments | v2 — via Anchor's IMTO licence |
| Real competitor | Informal agent model (not SWIFT, not any fintech) |
| Architecture | Hub-and-spoke: NGN → USD pool → LianLian → CNAPS |
| Partner 1 (NGN infra) | Anchor |
| Partner 2 (FX dealing) | Providus Bank |
| Partner 3 (USD transmission) | Airwallex |
| Partner 4 (China payout) | LianLian Global (SAFE-licensed); PingPong as backup |
| KYB tiers | 3 tiers (Starter / Growth / Business) with USD limits |
| Tier 3 "unlimited" | EDD model — no preset cap; manual review above $200K |
| Fee model | 1.5% FX + $10 flat; $5 minimum; $2,500 cap on % component |
| Partner fee caps | Subject to commercial negotiation; savings passed to customers |
| Form M policy | Inform only; do not block; EDD enforcement at >$200K |
| Supplier registration | Collected at Add Beneficiary (Screen 14), verified via Qichacha once |
| IMTO licence | Not applicable to MVP; v2 only |
| Own PSP licence | Deferred; target Month 12–18 |
| Own MSB licence | Deferred; use Airwallex's |

---

## Open Questions Remaining (Required for Deliverables)

1. **Mid-flight failure scenario** — USD has left Borderless but CNY has not reached supplier. Who holds the money? What does the user see? Resolution timeline? (Required: Architecture Note + Requirements doc)
2. **48-hour regulatory directive response** — If CBN issues a directive affecting cross-border payment products, what is Borderless's response plan? (Required: Compliance Summary)
3. **Dispute scenario** — Supplier claims payment not received; Borderless audit trail shows CNAPS confirmation. Escalation path with LianLian? (Required: Requirements doc)

---

## Files Created This Session

| File | Purpose |
|---|---|
| `CAPSTONE_CONTEXT.md` | Living product context document — updated every session |
| `AI_CORRECTIONS_LOG.md` | Log of AI errors caught during build — feeds Retrospective |
| `SESSION_HISTORY.md` | This file — full conversation history |
