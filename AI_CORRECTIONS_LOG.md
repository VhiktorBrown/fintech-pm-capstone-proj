# AI Corrections Log — Borderless Capstone

This document captures instances where AI-generated analysis was wrong and was caught through PM judgment and interrogation. These are direct inputs for the **"Where AI fell short"** section of the Retrospective deliverable.

The brief is explicit: *"Give a specific example, not a general observation."* Every entry here is a specific example.

---

## Correction 1 — Airwallex Cannot Execute China CNAPS Payout for Nigerian Businesses

**Date:** 2026-05-11
**What AI stated:** Airwallex could handle the full China payout leg — USD→CNY conversion and free CNAPS transfer to the supplier — making LianLian Global unnecessary as a primary partner. AI demoted LianLian to "backup" and removed their flat fee from the cost model, reducing the estimated cost to ~1.0–1.3% with no flat component.

**Why it was wrong:**
- Airwallex holds a **Third-Party Online Payment Licence** in China (acquired via Guangzhou Shangwutong, 2023) — this covers domestic digital payments inside China, not cross-border inbound payments from foreign parties
- Airwallex does **not** hold a **SAFE (State Administration of Foreign Exchange) Cross-Border Business Licence** — the specific authorisation required for a foreign entity to receive USD from abroad, convert to CNY onshore, and deliver via CNAPS to a Chinese supplier
- Airwallex's CNY local transfer product has explicit eligibility restrictions: businesses must have a registered entity in mainland China OR a Chinese national UBO. Nigerian-registered importers meet neither condition
- Airwallex itself states it uses "partnering payment service providers licensed in China" for declarations — meaning even Airwallex relies on SAFE-licensed entities for cross-border China payouts

**What was correct:**
- LianLian Global holds the SAFE Cross-Border Business Licence — the mandatory licence for foreign businesses paying Chinese suppliers via CNAPS
- LianLian must remain the **primary** China payout partner, not a backup
- Airwallex's role is USD custody and cross-border USD transmission to LianLian only
- The cost stack must include LianLian's fee (~$5–12 per transaction or percentage — to be confirmed via commercial engagement)

**How it was caught:** Direct interrogation — "Don't they need a SAFE cross-border business license for that?" That single question exposed an unchecked assumption that Airwallex's general China payout capability applied to our specific use case (foreign business paying Chinese supplier). It did not.

**PM lesson:** Partner capability claims must be verified against the specific use case, not general product marketing. Airwallex says "pay Chinese suppliers" — but the eligibility fine print excluded our entire user base. Always check eligibility requirements, not just feature availability.

**Sources:**
- [Airwallex secures China Online Payment License](https://www.airwallex.com/newsroom/airwallex-secures-china-online-payment-license)
- [Airwallex — Guide to making payments to China (eligibility requirements)](https://help.airwallex.com/hc/en-gb/articles/4633986370447-Guide-to-making-payments-to-China)
- [Airwallex — Transfers to countries with capital controls](https://www.airwallex.com/docs/payouts/transfers/transfers-to-from-countries-with-regulatory-requirements)
- [LianLian Global — SAFE-licensed cross-border supplier payments to China](https://ibsintelligence.com/ibsi-news/lianlian-global-launches-worlds-first-cross-border-supplier-payments-guarantee-to-china/)

---

## Correction 2 — IMTO Licence Does Not Cover Outbound Payments

**Date:** 2026-05-10
**What AI stated:** *(Early in the brainstorm)* The context document framed IMTO as the relevant licence for Borderless, and suggested leveraging a partner with an IMTO licence as the MVP licensing strategy.

**Why it was wrong:**
- IMTO (International Money Transfer Operator) authorises **inbound** transfers only — foreign currency coming INTO Nigeria
- Borderless is an **outbound** product — Nigerian businesses paying Chinese suppliers
- Using IMTO as the stated licence for an outbound payment product would be factually wrong and immediately visible to any practitioner on the panel

**What was correct:**
- The right framework for outbound B2B payments from Nigeria is: CBN PSP licence (via Anchor partnership) + CBN Authorized FX Dealer (Providus Bank for NAFEM access) + US MSB (Airwallex) + SAFE licence (LianLian)
- IMTO becomes relevant only for **v2** — the inbound product (Nigerian businesses receiving international payments), where Anchor's IMTO licence will be leveraged

**How it was caught:** User confirmed awareness that IMTO is inbound-only and directed the licensing framework toward the correct model.

**PM lesson:** Licence names in fintech sound interchangeable but are not. IMTO, PSP, MSB, SAFE — each covers a specific direction and type of transaction. Getting the direction wrong (inbound vs. outbound) is a fundamental error, not a detail.

---

---

## Correction 3 — KYB Tier Documents Listed Without Rationale

**Date:** 2026-05-11
**What AI stated:** Each KYB tier listed the documents to collect but provided no explanation for why each document is required at that specific tier and not an earlier or later one.

**Why it was wrong:**
- A requirements document without rationale is not a PM artifact — the brief explicitly warns against prompt output masquerading as product thinking
- The panel will ask "why do you need a CAC Status Report at Tier 2 and not Tier 1?" and the answer must be specific, not "for compliance"
- Without the rationale, the tier structure cannot be defended — it just looks like a list

**What was correct:**
- Tier 1: CAC number (digital verification only — no physical document needed at this risk level); BVN + NIN (CBN baseline; non-negotiable at any tier); government ID (confirms the person behind the biometrics)
- Tier 2: CoI (confirms what the company is authorised to do, not just that it exists); CAC Status Report (current directors — directors change after incorporation); TIN (material taxable trade requires tax traceability); utility bill (real operating address, not just registered address)
- Tier 3: MEMART (internal governance rules — confirms director has authority to move $200K+); all directors' info (every director is a sanctions risk, not just the signing one); UBO declaration (beneficial ownership required by NFIU); source of funds (EDD requirement at this transaction size)

**How it was caught:** User asked directly — "What will I say is the rationale for the documents collected for each tier? Does it make sense?"

**PM lesson:** Every design decision in a regulated product must have a traceable rationale. "Compliance requires it" is not a rationale — the specific regulation and the specific risk it mitigates is the rationale. AI can list documents without understanding why they exist in that order.

---

## Correction 4 — KYB Upgrade Path Was Incomplete

**Date:** 2026-05-11
**What AI stated:** The KYB upgrade path only described one trigger: when a user attempts a transaction above their current tier limit, the system blocks them and prompts an upgrade.

**Why it was wrong:**
- Business owners plan payments in advance — they should be able to upgrade their tier before they hit a transaction wall
- Designing only a reactive upgrade path forces users into a poor experience: they discover their limitation only when trying to transact, not when they have time to prepare
- The profile/settings section of any serious financial product surfaces the user's account status and upgrade options at all times

**What was correct:**
- Two upgrade trigger paths must exist: (1) reactive (transaction blocked → upgrade CTA inline, transaction preserved), and (2) proactive (Profile → "Verification & Limits" section → "Upgrade Verification" button always accessible)
- Both paths lead to the same upgrade flow; only the context of entry differs
- A new screen (7a: Verification & Limits) needs to be added to the user journey

**How it was caught:** User stated directly — "There should also be able to do this probably from the KYC section or from their profile... not just when it detects that user is trying to transfer above the limit."

**PM lesson:** User flows are not complete when the happy path works. Every feature that has a limitation must also have a visible, self-service path for the user to resolve that limitation — not just a wall they hit by accident.

---

## Correction 5 — AML Structuring Detection Was Incomplete

**Date:** 2026-05-11
**What AI stated:** The AML framework included one structuring rule: "flag if multiple transactions cluster just below tier limits." This described tier-limit structuring only.

**Why it was wrong:**
- This missed the most classic money laundering pattern: keeping individual transactions below AML reportable thresholds (e.g., consistently sending $9,800 when $10,000 would trigger reporting) — this is called structuring or smurfing
- A compliance team reviewing our AML framework would immediately ask "how do you detect structuring below AML thresholds?" and the answer was not in the document
- The current rule only catches people trying to game our tier limits — it does not catch people trying to game AML reporting thresholds, which is a different and more serious crime

**What was correct:**
Four distinct monitoring rules are required:
1. Aggregate threshold: flag if rolling 5-day aggregate exceeds $10,000 where each individual transaction was below $10,000
2. Velocity: flag if 3+ transactions in 24 hours from the same account
3. Just-below-threshold pattern: flag if 3+ transactions in 30 days are consistently within 5% of the same ceiling
4. Multi-beneficiary dispersion: flag if payments go to 3+ different beneficiaries in one day (unusually wide dispersion for an SME importer)

**How it was caught:** User asked directly — "Do we check if the multiple different transactions that are under the reportable threshold have been initiated too? Since this is another way money launderers try to hide their money laundering activities."

**PM lesson:** AML is not a checklist — it is a pattern recognition system. AI can define individual checks but miss the relationships between transactions that reveal laundering intent. A PM building a regulated financial product must think in patterns, not individual events.

---

## Correction 6 — Fee Model Was Not Verified Against Costs

**Date:** 2026-05-11
**What AI stated:** The fee model (1.5% FX + $10 flat, capped at $2,500) was set without checking whether it covered costs and what margin it left. No margin table was produced.

**Why it was wrong:**
- At $3,000 transactions (Tier 1 small vendors): revenue was $55, cost was ~$51 → $4 margin. Any variance in LianLian's actual fee could produce a loss.
- At transactions above $192K: the $2,500 cap meant revenue was below cost (1.3% of $200K = $2,600 cost vs. $2,510 capped revenue = -$102 loss)
- A fee model is not a product decision until it has been verified to be profitable across the expected transaction range

**What was correct:**
- Fee revised to 1.5% FX + $15 flat, no cap
- This produces 13–17% margin across all transaction sizes
- An explicit caveat is required: this fee is set without knowledge of whether partners (Airwallex, LianLian) have their own fee caps; if they do, Borderless will pass savings to customers
- LianLian's actual per-transaction fee (~$5–12 estimated) must be confirmed via direct commercial engagement before the model is finalised

**How it was caught:** User asked directly — "Check the fees well to check if they cover costs and how much margin is left."

**PM lesson:** Pricing decisions require cost verification, not just competitive positioning. AI can set a fee that sounds reasonable and cite a competitor, but without checking the margin at each transaction size, the product could be systematically unprofitable at certain volume bands.

---

## Correction 7 — USD Wallet Infrastructure Never Addressed

**Date:** 2026-05-11
**What AI stated:** The product described a "USD wallet" for each user without ever explaining what infrastructure backs it — whether each customer needs their own USD virtual account or whether a pooled model is used.

**Why it was wrong:**
- An infrastructure question this fundamental cannot be left undefined in a product brief
- The answer changes the cost structure, the regulatory requirements, and the onboarding friction — these all have product and compliance implications
- A panel or technical reviewer will immediately ask "what backs the USD wallet?"

**What was correct:**
- For v1 outbound-only: the FBO (For Benefit Of) pooled model is correct. Borderless holds one pooled USD account at Airwallex's US banking partner. Each customer's USD balance is a ledger entry — not a separate US bank account.
- Individual USD virtual accounts (with unique US routing/account numbers) are only needed for v2 inbound — when users need to receive USD from external parties. That is IMTO territory and out of v1 scope.
- The NGN wallet IS backed by individual virtual accounts (one per user, issued by Anchor, NIBSS-mapped) because users need a unique account number to fund from their personal bank.

**How it was caught:** User asked — "For a customer to have a USD wallet where their converted money is placed in, do they need to have some kind of virtual account that supports it? Is that compulsory?"

**PM lesson:** "Wallet" is not an infrastructure decision — it is a UX label. Behind every wallet is a specific account model (FBO pooled vs. dedicated virtual account vs. ledger-only). AI can describe the user-facing wallet without specifying what backs it, which leaves a critical gap in the architecture note.

---

## Correction 8 — Settlement Relationship Between Airwallex and LianLian Was Ambiguous

**Date:** 2026-05-11
**What AI stated:** The context document implied that Airwallex transmits to LianLian on Borderless's behalf, without clarifying whether Borderless has a direct relationship with LianLian or whether Airwallex manages that relationship.

**Why it was wrong:**
- If Airwallex manages the LianLian relationship, Borderless would dispute mid-flight failures with Airwallex (not LianLian) — but the document said Borderless disputes with LianLian directly, which is contradictory
- An ambiguous partner relationship means the dispute escalation path, the SLA structure, and the API integration points are all undefined
- "Airwallex transmits to LianLian" says nothing about who holds the account, who initiates the CNAPS instruction, or who Borderless contracts with

**What was correct:**
- Borderless has TWO separate, parallel, direct API relationships — one with Airwallex (USD FBO pool) and one with LianLian (LGPS payout partner)
- These are parallel, not nested: Airwallex does not manage the LianLian relationship on Borderless's behalf
- A payment uses both: (1) Borderless calls LianLian API to create a payment order and get LianLian's USD receiving account; (2) Borderless calls Airwallex API to wire USD to that receiving account; (3) LianLian matches the USD and executes CNAPS
- Borderless disputes directly with LianLian because Borderless is a direct LianLian client under its own commercial SLA

**How it was caught:** User asked — "Is it that Borderless holds an account with LianLian or Airwallex holds an account with LianLian on behalf of Borderless... I am trying to understand the relationship."

**PM lesson:** Partner relationships must be stated as direct contracts, not implied through data flow. "A sends to B who sends to C" describes a payment flow, not a legal or commercial structure. The PM must know who holds the contract with whom, because that determines who owns the obligation and who escalates disputes.

---

## Correction 9 — Webhook Flow Was Never Mapped

**Date:** 2026-05-11
**What AI stated:** The settlement section described transaction states (In Progress, Completed, Failed) but never specified what triggers each state transition, which partner sends which webhook, what the specific webhook event names are, or when the user is notified.

**Why it was wrong:**
- "Transaction is marked Completed when CNAPS delivers" tells a developer nothing — what event fires, from which system, at what endpoint, triggers that status update?
- Without the webhook map, the settlement section cannot be implemented and cannot be defended technically in a panel
- The specific webhook events (Airwallex: `transfer.settled`; LianLian: `payout.delivered`) are the actual mechanism — describing outcomes without mechanisms is incomplete

**What was correct:**
Airwallex fires: `transfer.created` → `transfer.submitted` → `transfer.processing` → `transfer.settled` (or `transfer.failed`)
LianLian fires: `payout.received` → `payout.processing` → `payout.delivered` (or `payout.failed`)
User-facing status changes only on: `payout.delivered` (→ Completed) or `transfer.failed` / `payout.failed` (→ Failed). All intermediate events are internal only — no user-facing status flicker.

**How it was caught:** User asked — "I'd like to determine what the flow will look like for a customer... the relationship and when the webhook flows across each partner till it gets to Borderless is what I want to understand and map out."

**PM lesson:** Settlement is not a description of outcomes — it is a sequence of technical events with specific triggers and handlers. AI can describe what should happen without specifying the mechanism that makes it happen. The webhook map is the mechanism.

**Sources:**
- [Airwallex — Webhooks Overview](https://www.airwallex.com/docs/developer-tools/webhooks/webhooks-overview)
- [Airwallex — Transfer Statuses](https://www.airwallex.com/docs/payouts/transfers/create-a-transfer/transfer-statuses)
- [Airwallex — Transfer Webhook Events](https://www.airwallex.com/docs/developer-tools__listen-for-webhook-events__event-types__transfers)
- [Airwallex — Handle Failed Transfers](https://www.airwallex.com/docs/payouts__manage-transfers__handle-failed-transfers)
- [Airwallex — Failure Reasons](https://www.airwallex.com/docs/payouts__manage-transfers__failure-reasons)

---

---

## Correction 10 — PSSP Does Not Cover Virtual Account Issuance or Wallet Holding

**Date:** 2026-05-12
**What AI stated:** The previous drafts referenced the PSP or PSSP licence as the relevant CBN licence for Borderless's wallet function and virtual account issuance. The context document initially framed the compliance section around "CBN PSP licence (Category 3 — Payment Solution Services)" as the licence that would cover Borderless's NGN wallet infrastructure.

**Why it was wrong:**
- PSSP (Payment Solution Service Provider) is a sub-licence under the PSS category in the CBN's 2020 payment licensing framework. It explicitly prohibits holding customer funds or issuing e-money and wallets. A PSSP that holds customer balances is in direct CBN regulatory violation, not a grey area.
- The CBN 2020 circular created four licensing categories. The one that covers wallet issuance and holding customer funds is the Mobile Money Operator (MMO) licence (N2 billion capital requirement), not PSSP.
- For a deposit-taking institution that can issue virtual accounts, the correct licence is a Microfinance Bank (MFB) licence or a commercial bank licence, which is exactly what Anchor holds.
- Stating that Borderless's wallet infrastructure would be covered by PSSP was factually incorrect and would be immediately flagged by any practitioner on the panel who knows the CBN licensing framework.

**What was correct:**
- Anchor's MFB (Microfinance Bank) licence is what authorises virtual account issuance and naira wallet holding for Borderless users. MFBs are deposit-taking institutions licensed by CBN.
- PSSP covers the payment processing and aggregation layer (routing instructions, connecting to downstream partners) — not fund holding. This is the licence Borderless might eventually pursue for its payment processing function.
- If Borderless wanted to issue wallets independently, it would need either an MMO licence (N2B capital, held by Opay, Palmpay etc.) or its own MFB licence.
- The distinction matters because these are three entirely different regulatory permissions with different capital requirements, different permissible activities, and different compliance obligations.

**How it was caught:** User asked to do in-depth research on whether PSP is a licence or a category, and which specific category covers virtual account issuance for wallet funding.

**PM lesson:** In fintech compliance, licence names are not interchangeable. PSP, PSSP, MMO, MFB, and IMTO each cover specific activities — and the prohibitions within each licence matter as much as the permissions. Citing PSSP as a wallet licence would signal to a practitioner panel that you do not understand what your own product needs to operate legally. The CBN 2020 circular that restructured the licensing framework is publicly available and should be read directly, not summarised from secondary sources.

**Sources:**
- [CBN PSP Categorisation — CBN Official PDF](https://www.cbn.gov.ng/out/2020/ccd/categorization%20of%20psps.pdf)
- [New Licence Categorisations for Nigerian Payments System — Mondaq](https://www.mondaq.com/nigeria/financial-services/1017880/new-licence-categorisations-for-the-nigerian-payments-system)
- [PSSP Licence in Nigeria 2026 — Idara](https://www.goidara.com/blog/how-to-obtain-a-payment-solution-service-provider-pssp-license-in-nigeria)
- [MMO Licence in Nigeria 2025 — ICA](https://ica.ng/how-to-obtain-a-mobile-money-operator-mmo-license-in-nigeria-step-by-step-guide-2025/)
- [CBN Framework and Guidelines on Mobile Money Services, July 2021](https://www.cbn.gov.ng/Out/2021/CCD/Framework%20and%20Guidelines%20on%20Mobile%20Money%20Services%20in%20Nigeria%20-%20July%202021.pdf)

---

## [Template for Future Corrections]

**Date:**
**What AI stated:**
**Why it was wrong:**
**What was correct:**
**How it was caught:**
**PM lesson:**
**Sources:**

---

*Add new corrections chronologically. Each entry should be specific enough to quote directly in the Retrospective section of the capstone.*
