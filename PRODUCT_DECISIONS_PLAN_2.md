# Borderless — Product Decisions Plan 2

*Covers seven precision gaps identified in brainstorm Session 8. All items are research-backed and ready for execution in CAPSTONE_CONTEXT.md pending user approval.*

---

## Item 1: KYB Tier Document Rationale — Why Each Document at Each Tier

### Verdict: The documents are correct. The rationale is missing.
The tier structure is sound but the context doc only lists WHAT to collect, not WHY each document is required at that specific tier and not earlier. The panel will ask.

### Tier 1 Rationale
| Document | Why at Tier 1 | Why sufficient here |
|---|---|---|
| Business name + CAC registration number (RC/BN) | Verifies the business legally exists in Nigeria's CAC registry. The number alone can be instantly verified via CAC API — no physical document required. | At $3K/$5K limits, instant digital verification is sufficient. Low friction is by design. |
| Owner BVN + NIN | BVN ties the owner to the Nigerian banking system (biometric-linked). NIN is the national identity number. Together they confirm the director is a real, identifiable Nigerian resident. CBN requires BVN/NIN as a baseline for any financial account. | Digitally verifiable in real time via Smile ID. Non-negotiable regardless of tier. |
| Valid government ID (passport preferred) | Confirms the physical person behind the BVN/NIN numbers. Prevents identity hijacking. | At Tier 1 sizes, a single ID with biometric liveness check is proportionate to the risk. |

### Tier 2 Rationale
| Document | Why introduced at Tier 2, not Tier 1 |
|---|---|
| Certificate of Incorporation / Business Name Certificate | Tier 1 CAC number confirms the business exists. The CoI reveals WHAT the company is authorised to do (its objects), founding directors, and share structure. At $50K/transaction, we must confirm the company is actually authorised to trade goods internationally. |
| CAC Status Report | Directors can change after incorporation. The Status Report shows the CURRENT director list, not just the founding ones. At $50K, we must screen the right people against sanctions lists. |
| TIN | At this size, the business is conducting material taxable trade. TIN links the business to Nigeria's tax system and creates traceability for FIRS if CBN or NFIU ever require disclosure. |
| Utility bill | Verifies the physical address of operation. A registered CAC address can be a lawyer's office — the utility bill confirms the real operating location. At $50K, we need this for regulatory enquiry readiness. |

### Tier 3 Rationale
| Document | Why introduced at Tier 3, not Tier 2 |
|---|---|
| MEMART | The CoI (Tier 2) shows what the company is authorised to do. MEMART defines internal governance rules: borrowing limits, who can authorise large transactions, restrictions on directors' authority. At $200K+ EDD level, we must confirm no internal governance restriction prohibits the director from moving these amounts. |
| All directors' info (BVN, NIN, ID) | At Tier 2, we screened the signing director. At Tier 3, every director is a risk vector. A company may have a clean "face" director while a sanctioned individual holds a background directorship. All must be screened against OFAC, UN, EU, and NFIU watchlists. |
| UBO Declaration (shareholders >25%) | Beneficial ownership is the gold standard of AML. We need to know who ultimately benefits from the money flows — not just who signed the incorporation papers. Required by NFIU beneficial ownership regulations and CBN AML/CFT framework for high-value accounts. |
| Source of funds declaration | At EDD level, we must understand where the business's money originates. Prevents legitimate-looking import companies from being used as vehicles for layering illicit funds. |

---

## Item 2: KYB Upgrade Path — Add Proactive Self-Upgrade from Profile

### Gap
Upgrade is only triggered reactively when a user hits a transaction limit. Business owners planning a large payment want to upgrade before they attempt a transaction — hitting a wall mid-payment is poor UX.

### Both trigger paths must exist
1. **Proactive:** Profile → "Verification & Limits" section → "Upgrade Verification" CTA (always visible)
2. **Reactive:** Transaction blocked → upgrade CTA shown inline → transaction preserved in context

### New screen to add
- **Screen 7a:** "Verification & Limits" — shows current tier badge, transaction limits, next tier requirements, upgrade button. Accessible from profile at any time.

---

## Item 3: AML — Structuring Detection (The Missing Layer)

### Gap
Current AML only covers tier-limit structuring ("flag if transactions cluster just below tier limits"). This misses the classic money laundering pattern: keeping individual transactions below AML reportable thresholds while the aggregate is suspicious.

### Four specific monitoring rules to add

**Rule 1 — Aggregate threshold monitoring:**
Flag if a single account's transactions sum to more than $10,000 within any rolling 5-business-day window, where each individual transaction was below $10,000.

**Rule 2 — Velocity monitoring:**
Flag if 3 or more transactions are initiated from the same account within any 24-hour period, regardless of individual amounts.

**Rule 3 — Just-below-threshold pattern:**
Flag if a user sends 3 or more transactions in a rolling 30-day period where each transaction amount is within 5% of the same threshold (e.g., always $2,850–$2,999 — just below the $3,000 Tier 1 single-transaction limit). Legitimate businesses do not consistently hit the same ceiling.

**Rule 4 — Multi-beneficiary dispersion:**
Flag if payments go to 3 or more different beneficiaries in one day from the same account. Legitimate SME importers typically pay a small number of regular suppliers — rapid dispersion to many new payees is unusual.

**What happens when flagged:**
Transaction held in Manual Review (Screen 21). Compliance team reviews within 2–4 business hours. If confirmed suspicious → STR filed with NFIU within 24 hours.

---

## Item 4: Fee Margin Analysis

### Cost stack (with LianLian as primary China partner)
| Layer | Rate |
|---|---|
| Providus Bank FX spread | 0.5–0.8% |
| Airwallex USD transmission | 0.3–0.5% |
| LianLian China payout | ~$5–12 flat (unconfirmed — TBC via commercial engagement) |
| **Total cost estimate** | **~0.8–1.3% + $5–12 flat** |

### Margin table at 1.5% + $15 flat (no cap) — decided model
| Transaction | Revenue | Cost (1.3% + $12) | Margin | Margin % |
|---|---|---|---|---|
| $3,000 | $45 + $15 = **$60** | $39 + $12 = **$51** | **$9** | 17.6% |
| $5,000 | $75 + $15 = **$90** | $65 + $12 = **$77** | **$13** | 14.4% |
| $10,000 | $150 + $15 = **$165** | $130 + $12 = **$142** | **$23** | 13.9% |
| $30,000 | $450 + $15 = **$465** | $390 + $12 = **$402** | **$63** | 13.5% |
| $100,000 | $1,500 + $15 = **$1,515** | $1,300 + $12 = **$1,312** | **$203** | 13.4% |
| $200,000 | $3,000 + $15 = **$3,015** | $2,600 + $12 = **$2,612** | **$403** | 13.4% |
| $500,000 | $7,500 + $15 = **$7,515** | $6,500 + $12 = **$6,512** | **$1,003** | 13.4% |

### Why previous models had problems
- Old model ($2,500 cap + $10 flat): Loss above $192K. Thin at small transactions.
- Previous cost stack error (before LianLian was restored): Assumed no flat cost from CNAPS. Incorrect.

### Decided fee model
- **1.5% FX conversion + $15 flat transaction fee**
- **No percentage cap**
- **Minimum fee: $5**
- **EXPLICIT CAVEAT:** This fee is set without knowledge of whether Airwallex or LianLian have their own per-transaction fee caps. Once commercial agreements are signed and partner caps (if any) are confirmed, Borderless will review and may reduce its fee or introduce a customer-facing cap, passing those savings on. This is the best-estimate baseline only.

---

## Item 5: USD Wallet Infrastructure — FBO Pooled Model

### Answer: No per-user USD virtual account needed for v1 outbound-only.

### FBO (For Benefit Of) Pooled Model
- Borderless holds a **single pooled USD account** at Airwallex's US banking partner
- Each customer's USD balance is tracked in **Borderless's internal ledger** — not a separate bank account per user
- From the bank's perspective: one account, one aggregate balance
- From the user's perspective: a USD wallet showing their individual balance

### Why individual USD virtual accounts are not required for v1
Individual USD virtual accounts (with unique US routing/account numbers) are only needed when users need to **receive USD from third parties** — that is the v2 inbound use case (IMTO territory). For v1 outbound, users fund NGN, convert to USD, spend from the pool. No external party sends USD directly to each user.

### Wallet infrastructure summary
| Wallet | Infrastructure | Per-user account? |
|---|---|---|
| NGN wallet | Anchor-issued virtual NGN account per user (NIBSS-mapped) | **Yes** — each user gets a unique NGN virtual account number for bank transfer funding |
| USD wallet | Borderless internal ledger entry backed by Borderless's pooled FBO USD account at Airwallex's US banking partner | **No** — ledger balance only; no individual US bank account per user |

---

## Item 6: Settlement Relationship — Parallel Direct Relationships (Not Nested)

### The correct structure
Borderless has **two separate, parallel, direct API relationships**:

**Relationship A — Borderless ↔ Airwallex:**
Borderless is a direct Airwallex client. Holds a USD FBO pool account. Uses Airwallex API to transfer USD to LianLian's receiving account.

**Relationship B — Borderless ↔ LianLian Global:**
Borderless is a direct LianLian LGPS client. LianLian designed LGPS specifically for PSPs and licensed institutions to integrate directly via API. Borderless has its own LianLian partner account.

**These are parallel, not nested.** Airwallex does NOT manage the LianLian relationship on Borderless's behalf.

### How a single payment uses both
1. Borderless calls **LianLian API** → creates payment order → LianLian returns `transaction_id` + their USD receiving account details
2. Borderless calls **Airwallex API** → wires USD from Borderless's pool to LianLian's receiving account
3. LianLian matches incoming USD to the `transaction_id`, converts to CNY, executes CNAPS transfer to supplier

### Why Borderless raises disputes directly with LianLian
Borderless is a direct LianLian client under its own commercial agreement. Airwallex's role ends when USD leaves Borderless's pool. All delivery obligation sits with LianLian.

---

## Item 7: Webhook Flow — Specific Events, Timing, and User-Facing Status

### Full technical webhook chain

**T=0: Payment submitted**
- Borderless validates (KYB, invoice, AML) → calls LianLian API → calls Airwallex API
- Internal status: `IN_PROGRESS` | User sees: "Payment In Progress"

**Airwallex webhook events → Borderless**
| Event | Meaning | Borderless action |
|---|---|---|
| `transfer.created` | Airwallex received the instruction | Log only |
| `transfer.submitted` | Submitted to Airwallex's banking partner | Log only |
| `transfer.processing` | In transit to LianLian's USD account | Log only |
| `transfer.settled` | USD arrived at LianLian's receiving account | Log; await LianLian webhook |
| `transfer.failed` | Airwallex could not deliver USD | Reverse user wallet debit; mark "Failed"; push notification |

**LianLian webhook events → Borderless**
| Event | Meaning | Borderless action |
|---|---|---|
| `payout.received` | LianLian received and matched the USD | Log only |
| `payout.processing` | CNAPS transfer initiated to supplier's bank | Log only |
| `payout.delivered` | CNAPS confirmed delivery to supplier | **Mark "Completed"; store CNAPS reference; push notification + email** |
| `payout.failed` | CNAPS delivery failed | Raise dispute with LianLian; notify user "Payment failed — investigating" |

**User-facing status transitions only**
| What triggers it | User sees |
|---|---|
| Payment submitted (T=0) | "Payment In Progress" |
| LianLian `payout.delivered` webhook | "Payment Delivered" ✓ |
| Airwallex `transfer.failed` | "Payment Failed" |
| LianLian `payout.failed` | "Payment Failed — Investigating" |
| Mid-flight refund confirmed | "Refunded to your USD wallet" |

**Design principle:** All intermediate webhook events (Airwallex created/submitted/processing, LianLian received/processing) are logged internally but cause NO user-facing status change. The user sees only "In Progress" until there is a definitive outcome. This prevents confusion from status flickers.

**Typical timelines:**
- Best case (Chinese business hours, clean invoice, no flags): 2–6 hours end to end
- Typical: same business day or next business day
- Failed + refunded: 2–5 business days

---

## Files to Update When Approved
- `/Users/user/Documents/my-react-app/CAPSTONE_CONTEXT.md` — all seven items
- `/Users/user/Documents/my-react-app/SESSION_HISTORY.md` — Session 8
- `/Users/user/Documents/my-react-app/RESOURCES.md` — new sources from this session

## Open Items Remaining After Execution
1. **48-hour regulatory directive response** — only remaining open question for Compliance Summary
2. **LianLian's actual per-transaction fee** — must be confirmed via direct commercial engagement
