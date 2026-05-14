# Borderless — Product Decisions Plan Log

*Saved from internal planning sessions. Documents the what, why, and execution status of each product decision made during the build.*

---

# Plan: Context Document Updates — Five Items

## Context
This plan covers five topics added to CAPSTONE_CONTEXT.md:
1. ~~Chinese 18-digit business registration — where collected~~ ✅ Done
2. ~~Informal agent flat fee + revised Borderless fee model~~ ✅ Done
3. ~~Payment reason field and Form M logic~~ ✅ Done
4. ~~How money moves from Providus Bank nostro to Airwallex (treasury sweep)~~ ✅ Done
5. ~~Settlement flow — user-level, partner-level, reconciliation, and failed transaction handling~~ ✅ Done

---

## Item 4: Nostro-to-Airwallex — The Treasury Sweep Explained

### The Question
"How does money in the nostro account move to Airwallex so it has access to send to LianLian?"

### The Answer (Two Distinct Steps — Often Confused)

**Step A: NGN → USD conversion at Providus Bank**
When the user converts NGN to USD on Borderless, Providus Bank buys USD on the NAFEM (Nigeria's official FX market), deducts their spread, and credits Borderless's USD **nostro account held at Providus Bank in Nigeria**. The USD now exists as a balance inside Nigeria — it has not crossed any border yet. This is a domestic FX purchase.

**Step B: The Treasury Sweep (Nostro → Airwallex)**
Separately — not per user transaction, but periodically — Borderless's treasury operation moves USD from the Providus nostro to Borderless's pre-funded pool at Airwallex. This works as follows:

1. Borderless maintains a target USD balance at Airwallex (e.g., always keep $300,000 in the pool)
2. As user payments go out, the Airwallex pool is depleted
3. When the pool drops below a trigger threshold, Borderless instructs Providus Bank to wire USD from the nostro to Airwallex's US banking account
4. Providus Bank sends a **SWIFT MT103 international wire** to Airwallex's US correspondent bank (Airwallex holds client funds at US banking partners like JPMorgan or equivalent)
5. This SWIFT wire settles in 1–2 business days
6. Airwallex credits Borderless's account on receipt
7. While the sweep is in transit, the existing pool balance continues serving user payment instructions

### Why This Does Not Break the User Experience
Individual user transactions (e.g., ₦50M payment to a Chinese supplier) are fulfilled from the **pre-funded pool at Airwallex** — not by triggering a real-time international wire. The treasury sweep is a background treasury management operation, completely invisible to the user. The same-day delivery to the supplier is possible because the pool is always pre-funded.

### SWIFT Used — But Only for Treasury Operations
SWIFT is used in the backend treasury sweep between Providus and Airwallex. It is NOT used for the user-facing payment (which goes NIBSS → Airwallex pool → LianLian → CNAPS). This is the key distinction. From the user's perspective, there is no SWIFT. From Borderless's treasury perspective, SWIFT is the mechanism for topping up the pool.

### Why Providus Bank Is Essential for the Sweep
The SWIFT wire from Nigeria to Airwallex is a capital outflow from Nigeria. Providus Bank, as a CBN-authorized dealer, has the regulatory authority to initiate and report this outward capital flow to the CBN. This is precisely why our FX partner must be an authorized dealer, not a BDC — BDCs cannot execute outward SWIFT wires.

---

## Item 5: Settlement Flow

### Overview
Settlement operates on four distinct layers. All four are in CAPSTONE_CONTEXT.md under Settlement Framework.

### Layer 1 — User-Facing Settlement (What the User Sees)

| Event | Timing | What Happens |
|---|---|---|
| User converts NGN → USD | T+0 (instant) | NGN wallet debited; USD wallet credited — ledger update, no delay |
| User initiates payment | T+0 (instant) | USD debited from user wallet immediately; payment enters "In Progress" |
| LianLian delivers CNY via CNAPS | T+0 to T+1 business day | Depends on initiation time, invoice scan, no AML flags |
| Borderless receives CNAPS confirmation | Same as above | Transaction marked "Completed"; CNAPS reference stored in Screen 24 |
| User sees completion | T+0 to T+1 | Push notification + status update |

### Layer 2 — Partner-Level Settlement

| Borderless ↔ Partner | Settlement Mechanism | Timing |
|---|---|---|
| Anchor | Invoice for NIBSS collection fees | Monthly |
| Providus Bank | FX spread deducted instantly; SWIFT sweep wires settle in 1–2 business days | Continuous / batch |
| Airwallex | Pre-funded pool debited per instruction; fees invoiced on schedule | Per instruction + periodic invoice |
| LianLian Global | Daily net settlement; CNAPS confirmation per delivery | T+1 business day net |

### Layer 3 — Reconciliation
Daily run matches four data sources using Borderless's unique transaction reference:
1. Anchor NIBSS inflow records → NGN wallet credits
2. Providus FX conversion records → USD wallet updates
3. Airwallex account statement → payment instructions sent
4. LianLian CNAPS delivery confirmations → transaction completions

### Layer 4 — Failed Transaction Settlement

**Scenario A — Pre-flight failure:** Invoice rejected, AML flag, KYB limit exceeded. USD never leaves wallet. Reversal immediate.

**Scenario B — Mid-flight failure:** USD transmitted to LianLian but CNY not delivered. LianLian holds USD, dispute raised under SLA (24–48hrs). LianLian's Supplier Payments Guarantee covers refund. USD returned to user wallet in 2–5 business days.

**Scenario C — Dispute (CNAPS confirmed but supplier claims non-receipt):** CNAPS reference is authoritative. User shares reference with supplier's bank. If unverifiable, Borderless escalates to LianLian for trace (3–5 business days).

---

## Items 1–3 (Historical Reference)

### Item 1: Chinese 18-Digit Business Registration
- **Problem:** Referenced in AML but never collected in the journey
- **Fix:** Added to Screen 14 (Add Beneficiary). Collected once per supplier. Verified via Qichacha API. Saves as "Verified Supplier" badge. Removed from Tier 3 KYB (category error — it's per-beneficiary, not per-business).

### Item 2: Informal Agent Fee Model + Revised Borderless Fee
- **Problem:** Informal agent fee was spread-only; it actually includes $100 flat (<$10K) or $200 flat (>$10K)
- **Fix:** Borderless fee revised to 1.5% FX + $10 flat + $5 minimum + $2,500 cap. Competitive comparison updated with correct two-part agent fee.

### Item 3: Payment Reason Field and Form M Logic
- **Problem:** Payment reason not collected; Form M not addressed
- **Fix:** Added Screen 13a (Payment Reason dropdown). Form M policy: inform only, do not block. Banner on Screen 17 for goods payments. EDD review at >$200K may request Form M number. Borderless receipt serves as Form M evidence.

### Note on Airwallex/LianLian (Corrected)
An earlier version of this plan incorrectly stated Airwallex could handle the China CNAPS payout. This was wrong. Airwallex holds a Third-Party Online Payment Licence in China (domestic only), not a SAFE Cross-Border Business Licence. Their CNY local transfer eligibility excludes Nigerian businesses. LianLian Global (SAFE-licensed) is the mandatory primary China payout partner. This is documented in AI_CORRECTIONS_LOG.md.
