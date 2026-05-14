# Borderless — Product Decisions Plan 3
# 48-Hour Regulatory Directive Response Plan

*Covers the last remaining open question from the Compliance Summary deliverable. Research-backed and specific to Borderless's partnership-model structure.*

---

## The Core Insight — Why the Partnership Model Changes Everything

A licensed entity (a bank, a PSP holder) receives CBN directives directly, responds to CBN directly, and is directly sanctionable.

Borderless at MVP is none of those things. It:
1. Receives CBN directives **indirectly** — through its licensed partners (Anchor, Providus Bank)
2. Responds **through its partners' compliance frameworks**, not its own CBN channel
3. Is **not directly sanctionable by CBN** for most cross-border payment directives — its partners are

This is both a vulnerability and a protection. The vulnerability: if Anchor or Providus Bank pause operations due to a CBN directive, Borderless's product pauses too — not by choice. The protection: the regulatory burden is borne by the licensed partners; Borderless's role is to implement what partners require of it.

A generic "we will pause operations and inform CBN" answer is wrong for Borderless — we have no CBN filing relationship. The correct answer describes Borderless's actual chain of action through its partners.

---

## Types of Directive That Could Affect Borderless

| Type | Description | Operational Impact |
|---|---|---|
| A | Restriction of outbound FX transfers | Highest — Providus Bank cannot execute NAFEM purchases; payment flow broken |
| B | Enhanced AML/KYB compliance requirements | High compliance impact; no immediate pause; compliance window of 30–90 days typically |
| C | Licensing requirement for fintechs operating through partners | Existential — Borderless must pause and expedite own licence application |
| D | Corridor-specific restriction | Operationally straightforward — configuration change to disable the affected corridor |

---

## The 48-Hour Response Plan

### Hours 0–4: Detection

**Primary channel:** Anchor and Providus Bank receive CBN directives directly. Partner contracts must include a clause requiring them to notify Borderless within 4 hours of any directive affecting the services they provide to Borderless. This clause must be in the contract before go-live — without it, Borderless learns from media, hours or days late.

**Secondary channel:** Borderless's compliance lead monitors cbn.gov.ng directly and subscribes to legal alert services (Mondaq Nigeria, Banwo & Ighodalo alerts).

**Immediate action:**
- Compliance lead reads the full directive text — not a summary
- Initial assessment: Does this apply to (a) licensed partners only, (b) unlicensed fintechs explicitly, or (c) both?
- Flag to legal counsel and senior leadership

---

### Hours 4–12: Assessment

**Partner consultation:**
- Emergency call with Anchor's and Providus Bank's compliance teams
- Objective: understand their interpretation and what they are doing in response
- Their interpretation is legally authoritative for our Nigerian operations — we follow it
- Notify Airwallex and LianLian if the directive has cross-border implications from their own regulators (FinCEN, SAFE)

**Legal counsel:**
- Nigerian fintech-specialist counsel reviews the full directive
- Key question: Is Borderless directly addressable, or only through its licensed partners?
- Determine compliance window: immediate action required, or 30/60/90-day deadline?

**Documentation:**
Every communication in this window is logged with timestamps — this is the compliance record demonstrating good faith.

---

### Hours 12–24: Decision and Immediate Action

Four possible outcomes, each with a defined response:

**Outcome A — Partner pauses operations:**
Borderless must pause the affected product feature immediately — no alternative exists without Anchor or Providus.
- Disable the affected flow (NGN conversion, payment submission, or both)
- User communication: within 2 hours of the pause decision

**Outcome B — Compliance window exists (30–90 days):**
Operations continue; compliance roadmap drafted within the 48-hour window.
- Identify which product features, processes, or partner arrangements need to change
- Set internal milestones aligned to the regulatory deadline

**Outcome C — Own licence required:**
Pause the unlicensed activity immediately; do not continue in a directly prohibited manner.
- Expedite PSP licence application (planned Month 12–18; now immediate priority)
- Engage CBN's fintech licensing team for potential exemption or grace period during application

**Outcome D — Corridor restriction:**
Disable the affected corridor in the product (configuration change).
- Notify all users with pending transactions
- Offer USD wallet balance refund if requested

---

### Hours 24–48: Communication, Documentation, Continuity

**User communication (mandatory if service interrupted):**
- Channel: in-app notification + email
- Content: what is affected, why (regulatory directive — honest without being alarming), what happens to in-flight transactions, expected timeline
- In-flight transaction handling: pre-flight reverts to USD wallet immediately; mid-flight → LianLian's Supplier Payments Guarantee commits to refund within 2–5 business days
- Tone: transparent and specific

**Internal compliance documentation:**
- Directive text
- Time of detection, by whom
- All partner communications (timestamped)
- Legal counsel's written opinion
- Decision made, who made it
- User communications sent (copy + timestamp)

**CBN acknowledgement (if directly addressable):**
If counsel confirms Borderless is directly addressed, write a formal acknowledgement to CBN within 48 hours stating: (1) directive received and reviewed, (2) compliance position under assessment, (3) full compliance plan to follow by [date]. This demonstrates responsiveness before full compliance is achieved.

**Partner coordination:**
Ensure all four partners (Anchor, Providus, Airwallex, LianLian) are informed of Borderless's operational status and any product changes. They must not learn of a Borderless-side pause through user complaints.

---

## Pre-Conditions Required BEFORE Any Directive Arrives

| Pre-condition | Why it Matters |
|---|---|
| Partner notification clause in all four contracts | Without it, Borderless is a late follower |
| In-app and email notification infrastructure | Cannot notify users within 2 hours without pre-built templates |
| Retainer with Nigerian fintech-specialist legal counsel | Cannot get a legal opinion in 4–8 hours without pre-briefed counsel |
| Documented product pause capability | Every feature needs a defined pause mechanism (corridor toggle, conversion disable, etc.) |
| Internal compliance log / incident tracking system | Good faith requires a timestamped record of all actions |
| CBN direct monitoring subscription | Backup channel if partner notification fails |

---

## 48-Hour Timeline Summary

| Window | Action | Owner |
|---|---|---|
| 0–4 hours | Detect directive; compliance lead reads full text; flag leadership | Compliance Lead |
| 4–12 hours | Emergency partner calls; legal counsel engaged; scope and compliance window determined | Compliance Lead + Legal + Partners |
| 12–24 hours | Decision made: pause vs. compliance roadmap | Senior Leadership + Compliance Lead |
| Within 2 hours of pause | Disable affected features; notify all affected users | Product + Engineering + Compliance |
| 24–48 hours | Complete documentation; draft CBN acknowledgement if needed; board brief; partner coordination | Compliance Lead + Legal + CEO |

---

## Panel Defense Points

**"You hold no licences — how can you respond to CBN?"**
We don't respond directly — our licensed partners do. That is the structural reality of the MVP model. We are honest about it. Our partner contracts include notification obligations that make us fast followers, and we are proactively pursuing our own PSP licence (Month 12–18) to remove this dependency.

**"What if the directive prohibits operating through licensed partners?"**
Immediate pause. Expedite own licence application. We do not continue operating in a directly prohibited manner. This scenario is the strongest argument for accelerating the PSP licence timeline — we acknowledge it openly.

**"What happens to users' money during a forced pause?"**
No funds are lost. Pre-flight transactions revert immediately. Mid-flight transactions are covered by LianLian's Supplier Payments Guarantee (2–5 business day refund). All users receive transparent in-app and email notification within 2 hours of the pause decision.

---

## Sources
- [CBN's New AML Rules Give Fintechs 90 Days — The Condia](https://thecondia.com/cbn-automated-aml-standards-fintech-banks-nigeria/)
- [How CBN's Policies Reshaped Nigerian Fintech in 2025 — Technext](https://technext24.com/2025/12/11/nigerian-fintech-cbn-2025-regulations/)
- [Regulatory Changes in Nigerian Banking 2024-2025 — Mondaq](https://www.mondaq.com/nigeria/fund-finance/1608274/an-overview-of-the-regulatory-changes-in-the-nigerian-banking-finance-sector-in-2024-and-outlook-for-2025)
- [CBN Orders Banks and Fintechs to Enable Dual Links — FinTech Magazine Africa](https://fintechmagazine.africa/2025/12/12/cbn-orders-banks-and-fintechs-to-enable-nibss-upsl-dual-links-by-january-2026/)
- [Fintech Laws and Regulations Nigeria 2025 — Global Legal Insights](https://www.globallegalinsights.com/practice-areas/fintech-laws-and-regulations/nigeria/)
