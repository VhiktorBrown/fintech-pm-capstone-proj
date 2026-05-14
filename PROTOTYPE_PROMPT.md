# Borderless — Prototype Build Brief

> Feed this document to an AI builder (Lovable, v0, Claude, Bolt, etc.) to generate a full end-to-end prototype of Borderless. Every screen, flow, compliance gate, and design decision is specified below. Build it completely — do not simplify or defer screens.

---

## 1. What Is Borderless

**Borderless** is a B2B cross-border payment web application for Nigerian SME business owners who import goods from China. It replaces the informal agent model (Nigerians with Chinese bank accounts) with a fully regulated, transparent, digital alternative.

**Primary user:** The business owner — the individual who registers the company and moves money. Not a finance manager, not an accountant.

**The core pain:** Informal agents charge 3–5% FX spread plus ₦100–200 in flat fees, require physical bank visits, and take 2–3 days. Borderless charges 1.5% FX + $15 flat, is fully digital, and delivers same day to next business day.

**MVP scope:** Outbound payments only — Nigerian businesses paying Chinese suppliers. China corridor only (other corridors shown as "Coming Soon").

**How money moves:**
1. User transfers NGN into their Borderless NGN wallet (via NIBSS bank transfer to an Anchor-issued virtual account)
2. User converts NGN → USD on Borderless (Providus Bank executes the FX purchase via Nigeria's official FX market)
3. User's USD balance sits in their Borderless USD wallet (a ledger entry backed by a pooled FBO account at Airwallex)
4. User initiates a payment to a Chinese supplier — Borderless sends USD to LianLian Global, who converts to CNY and pays via CNAPS (China's domestic payment rail)
5. Supplier receives CNY as a domestic Chinese bank transfer. No SWIFT. No incoming wire fee.

**Fees:** 1.5% FX conversion fee (charged at convert step) + $15 flat transaction fee (charged at send step). Minimum fee: $5. No cap.

---

## 2. Design System

### 2.1 Color Tokens

```
--color-bg-primary:     #0A1628   /* deep navy — sidebar, navbar */
--color-bg-secondary:   #1B3A6B   /* medium navy — hover states, active nav */
--color-bg-surface:     #F8F9FC   /* near white — main content background */
--color-bg-card:        #FFFFFF   /* pure white — cards, modals */
--color-bg-subtle:      #EEF2F9   /* light blue-grey — table rows alt, input bg */

--color-accent-gold:    #D4AF37   /* gold — primary CTA buttons, tier badge, key accents */
--color-accent-gold-hover: #B8961F /* gold hover */
--color-accent-gold-light: #FBF4DC /* gold tint — success banners, highlight bg */

--color-text-primary:   #1A2033   /* near black — body text on light surfaces */
--color-text-secondary: #5C667A   /* grey — supporting text, labels */
--color-text-inverse:   #FFFFFF   /* white — text on dark navy backgrounds */
--color-text-gold:      #D4AF37   /* gold — text on dark backgrounds */

--color-status-success: #059669   /* green — Delivered, Approved, Verified */
--color-status-warning: #D97706   /* amber — Pending, Under Review, Indicative */
--color-status-error:   #DC2626   /* red — Failed, Rejected, Blocked */
--color-status-info:    #2563EB   /* blue — informational banners (Form M notice) */

--color-border:         #E2E8F0   /* light border — card edges, input borders */
--color-border-focus:   #D4AF37   /* gold — focused input border */
```

### 2.2 Typography

**Font stack:** Import from Google Fonts:
- `Syne` — weights 600, 700, 800 (headings, brand name, section titles)
- `Inter` — weights 400, 500, 600 (body, labels, inputs, table data)

```
Display (hero numbers, wallet balances):  Syne 800, 36–48px
H1 (page titles):                         Syne 700, 28px
H2 (section headings):                    Syne 600, 20px
H3 (card titles, modal headers):          Syne 600, 16px
Body / default:                           Inter 400, 14px
Body emphasis:                            Inter 600, 14px
Label / caption:                          Inter 500, 12px
Micro / helper text:                      Inter 400, 11px, color-text-secondary

Currency amounts (large):                 Syne 700, use tabular figures
Currency amounts (inline):                Inter 600, tabular figures
```

### 2.3 Spacing Scale

Use an 8px base grid. Common tokens:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### 2.4 Border Radius

```
--radius-sm:   6px    (inputs, small buttons)
--radius-md:   10px   (cards, dropdowns)
--radius-lg:   16px   (modals, large cards)
--radius-full: 9999px (badges, pills, avatar)
```

### 2.5 Shadows

```
--shadow-card:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
--shadow-modal:  0 20px 60px rgba(0,0,0,0.18)
--shadow-raised: 0 4px 12px rgba(0,0,0,0.10)
```

### 2.6 Component Definitions

**Primary Button (Gold)**
```
Background: #D4AF37
Text: #0A1628 (dark navy on gold)
Font: Inter 600, 14px
Padding: 10px 20px
Border-radius: 8px
Hover: background #B8961F
Disabled: opacity 0.4, cursor not-allowed
```

**Secondary Button (Outlined)**
```
Background: transparent
Border: 1.5px solid #D4AF37
Text: #D4AF37 (gold text)
Font: Inter 600, 14px
Padding: 10px 20px
Border-radius: 8px
Hover: background rgba(212,175,55,0.08)
```

**Ghost Button (on dark backgrounds)**
```
Background: rgba(255,255,255,0.08)
Text: #FFFFFF
Border: 1px solid rgba(255,255,255,0.15)
Hover: background rgba(255,255,255,0.14)
```

**Input Field**
```
Background: #FFFFFF
Border: 1.5px solid #E2E8F0
Border-radius: 8px
Padding: 10px 14px
Font: Inter 400, 14px, color #1A2033
Placeholder: color #9CA3AF
Focus: border-color #D4AF37, box-shadow: 0 0 0 3px rgba(212,175,55,0.15)
Error: border-color #DC2626, show error message below in red Inter 12px
```

**Select / Dropdown**
Same styling as Input. Custom arrow icon in gold (#D4AF37).

**Status Badge / Pill**
```
Delivered:       bg #DCFCE7, text #065F46, dot #059669
In Progress:     bg #FEF3C7, text #92400E, dot #D97706
Under Review:    bg #FEF3C7, text #92400E, dot #D97706
Failed:          bg #FEE2E2, text #7F1D1D, dot #DC2626
Refunded:        bg #EEF2F9, text #3B4A6B, dot #5C667A
Font: Inter 600 11px
Padding: 3px 8px, border-radius: 9999px
```

**KYB Tier Badge**
```
Tier 1 — Starter:  bg #FBF4DC, text #92400E, border 1px solid #D4AF37
Tier 2 — Growth:   bg #D4AF37, text #0A1628 (solid gold fill)
Tier 3 — Business: bg #0A1628, text #D4AF37 (navy with gold text)
Font: Syne 600, 11px
Padding: 4px 10px, border-radius: 9999px
```

**Verified Supplier Badge**
```
Icon: checkmark
Background: #DCFCE7
Text: "Verified Supplier", Inter 600 11px, color #065F46
Border: 1px solid #059669
```

**Warning Banner (Form M / Informational)**
```
Background: #EFF6FF
Border-left: 4px solid #2563EB
Icon: info circle, blue
Text: Inter 400, 14px, #1E40AF
Padding: 12px 16px
Border-radius: 0 8px 8px 0
```

**Error/Blocked Banner**
```
Background: #FEF2F2
Border-left: 4px solid #DC2626
Icon: x-circle, red
Text: Inter 400, 14px, #7F1D1D
```

**Compliance Gate Overlay** (for Tier Limit, Manual Review)
```
Full-screen overlay: bg rgba(10,22,40,0.85) backdrop-blur 4px
Center card: bg white, border-radius 16px, max-width 480px, padding 40px
```

---

## 3. Navigation Structure

### 3.1 Sidebar (Desktop — shown when authenticated)

```
Width: 240px (fixed)
Background: #0A1628 (deep navy)
Padding: 24px 0

TOP SECTION:
  [Logo] Borderless   — Syne 700, 22px, color #FFFFFF
  Tagline: "Pay China, Simply"  — Inter 400, 11px, color rgba(255,255,255,0.5)

  KYB Tier Badge (just below logo):
  Example: [ Tier 1 — Starter ] — always visible, clickable → Verification & Limits

NAV ITEMS (with icons, 44px tall each, padding 0 12px):
  Dashboard           (home icon)
  Send Money          (arrow-right icon)
  Convert             (arrows-exchange icon)
  Transactions        (list icon)
  Beneficiaries       (users icon)
  Profile             (user-circle icon)

Active state:
  Background: #1B3A6B, left border 3px solid #D4AF37, text #FFFFFF
Inactive state:
  Text: rgba(255,255,255,0.6)
  Hover: background rgba(255,255,255,0.06), text #FFFFFF

BOTTOM SECTION (pinned to bottom):
  Support             (help-circle icon)
  Log Out             (logout icon, text color rgba(255,255,255,0.5))
```

### 3.2 Mobile Navigation

On viewports < 768px: sidebar collapses. Top bar with hamburger (☰) on left, "Borderless" logo center, profile avatar right. Hamburger opens full-height drawer with the same nav items.

### 3.3 Top Bar (Content Area)

```
Height: 64px
Background: #FFFFFF
Border-bottom: 1px solid #E2E8F0
Left: Page title (Syne 600, 18px)
Right: User avatar + business name, notification bell icon
```

---

## 4. Screen Inventory

Build all 24 screens as navigable routes/views. Use mock/hardcoded data for all dynamic values.

---

### SCREEN 1 — Sign Up

**Route:** `/signup`
**Layout:** Split screen — left half navy (#0A1628), right half white form

**Left panel (navy):**
- Borderless logo (Syne 800, 36px, white)
- Tagline: "Send money to China. Transparently." (Syne 600, 22px, white)
- Sub-copy: "Built for Nigerian businesses. Cheaper than your agent. Faster than SWIFT." (Inter 400, 16px, rgba(255,255,255,0.7))
- A simple trust stat row at bottom: "1.5% FX fee • Same-day delivery • Fully regulated"

**Right panel (form):**
- Heading: "Create your account" (Syne 700, 28px)
- Sub: "For registered Nigerian businesses only." (Inter 400, 14px, secondary)

Fields:
1. Business Name (text input)
2. Business Email (email input)
3. Phone Number (tel input, with +234 prefix selector)
4. Password (password input with show/hide toggle)
5. Confirm Password

- Primary button: "Create Account →"
- Below: "Already have an account? Sign in" (link)
- Terms copy at bottom: "By creating an account, you agree to our Terms of Service and Privacy Policy."

---

### SCREEN 2 — KYB Tier 1: Business Verification

**Route:** `/onboarding/business`
**Layout:** Centered card, max-width 560px, on #F8F9FC background

**Progress indicator at top:**
```
[●]─────[○]─────[○]─────[○]
Business  Documents  Director  Review
```

Heading: "Tell us about your business" (Syne 700, 24px)
Sub: "We need to verify your business before you can send money." (Inter 400, 14px)

Fields:
1. CAC Registration Number — label: "RC or BN Number" — placeholder: "e.g. RC1234567 or BN1234567" — helper: "Find this on your Certificate of Incorporation or Business Name certificate"
2. Business Type — select: "Limited Liability Company / Business Name / Partnership"

Below the form: an inline verification note with a blue info icon:
"We verify your CAC number instantly against the Companies and Allied Matters Act registry. No physical document needed at this step."

CTA: "Continue →" (primary gold button, full width)

---

### SCREEN 3 — KYB Tier 1: Document Upload

**Route:** `/onboarding/documents`
**Progress:** Step 2 of 4 active

Heading: "Upload your business document" (Syne 700, 24px)

Upload card for: "Certificate of Incorporation or Business Name Certificate"
```
Dashed border card, center-aligned:
  Upload icon (cloud-upload)
  "Drag and drop your document here" (Inter 500, 14px)
  "or browse files" (gold link)
  Accepted: PDF, JPG, PNG. Max 10MB.
```

After upload: file chip shows filename + size + remove (×) icon. File chip has green checkmark icon when uploaded.

Info banner:
"Your document is encrypted and stored securely. We only use it to verify your business registration."

CTA: "Continue →"

---

### SCREEN 4 — KYB Tier 1: Director Verification

**Route:** `/onboarding/director`
**Progress:** Step 3 of 4 active

Heading: "Verify your identity" (Syne 700, 24px)
Sub: "As the business owner, we need to verify who you are." (Inter 400, 14px)

Fields:
1. Bank Verification Number (BVN) — 11 digits — helper: "Your BVN is linked to your Nigerian bank account"
2. National Identification Number (NIN) — 11 digits
3. Government ID Type — select: "International Passport / National ID Card / Driver's Licence"
4. Upload Government ID — same upload card style as Screen 3

**Live Selfie section:**
Card with camera icon, heading "Take a live selfie" (H3)
Sub: "We'll use this to confirm you're the person in the ID document."
Button: "Open Camera" (secondary gold outlined button)
After capture: shows circular thumbnail of captured selfie with "Retake" option

Privacy note at bottom:
"Your BVN and NIN are verified through Smile ID and stored in Nigeria in compliance with the Nigeria Data Protection Act and CNII Order 2024. They are never shared with international partners."

CTA: "Submit for Review →" (primary gold, full width)

---

### SCREEN 5 — KYB Under Review

**Route:** `/onboarding/review`
**Layout:** Full-screen centered, no sidebar yet (pre-onboarding)

Illustration: a simple circular icon with a clock/hourglass in gold on a navy background circle

Heading: "We're reviewing your application" (Syne 700, 28px, centered)
Sub: "This usually takes 24–48 hours. We'll email you at **bukky@example.com** as soon as it's done." (Inter 400, 16px, centered)

What to expect card (white, border, rounded):
- ✓ Document check (green)
- ⏳ Identity verification (amber, "In progress")
- ○ Account activation (grey, "Pending")

Info: "Need help? Contact support@borderless.ng"

Light gold CTA at bottom: "Back to Home" (ghost button)

---

### SCREEN 6A — KYB Approved

**Route:** `/onboarding/approved`
**Layout:** Full-screen centered, celebration state

Large checkmark animation (gold circle, white checkmark)

Heading: "You're verified!" (Syne 800, 36px)
Sub: "Your Tier 1 account is ready. You can now fund your wallet and start sending money to China." (Inter 400, 16px)

Limits summary card:
```
┌──────────────────────────────────────┐
│  Tier 1 — Starter                    │
│  Single transaction:  up to $3,000   │
│  Monthly total:       up to $5,000   │
│  Want higher limits? Upgrade anytime │
└──────────────────────────────────────┘
```

CTA: "Go to Dashboard →" (primary gold, full width)

---

### SCREEN 6B — KYB Rejected

**Route:** `/onboarding/rejected`
**Layout:** Full-screen centered

Large × icon (red circle, white ×)

Heading: "We couldn't verify your account" (Syne 700, 28px)

Reason card (red-tinted):
"The name on your Certificate of Incorporation does not match the name registered under your CAC number. Please re-upload the correct document."

What to fix:
- [ ] Re-upload your Certificate of Incorporation (CTA: "Re-upload Document")
- If the issue persists, contact support@borderless.ng

CTA: "Fix and Resubmit" (primary gold)
Secondary: "Contact Support" (outlined)

---

### SCREEN 7 — Dashboard

**Route:** `/dashboard`
**Layout:** Sidebar + content area

**Content area — top section: Wallet Cards**

Two cards side by side (on desktop; stack on mobile):

```
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  NGN Wallet                 │   │  USD Wallet                 │
│  ₦ 50,000,000.00            │   │  $ 32,450.00                │
│  Inter 400 12px: "Available"│   │  Inter 400 12px: "Available"│
│                             │   │                             │
│  [Fund Wallet]              │   │  [Convert NGN]              │
│  ghost button               │   │  ghost button               │
└─────────────────────────────┘   └─────────────────────────────┘
```

Card styling:
- NGN card: background #0A1628 (dark navy), text white, gold accent on "NGN Wallet" label
- USD card: background #1B3A6B (medium navy), text white, gold accent on "USD Wallet" label
- Balance number: Syne 800, 36px, white
- Button: ghost white style

**Primary action button (below wallet cards, full width):**
Large gold CTA: "→ Send Money to China" (Syne 600, 16px)

**Quick action row (3 icons, below CTA):**
[Fund Wallet] [Convert] [Transaction History]
Each: 48px icon button, navy bg on light surface, label below in Inter 500 12px

**Recent Transactions section:**
Heading: "Recent transactions" (Syne 600, 16px)
Table (no outer border, row dividers only):

| | Supplier / Label | Amount (USD) | Status | Date |
|---|---|---|---|---|
| Arrow-right icon | Zhen Trading Co. | -$5,200.00 | Delivered ✓ | 10 May 2026 |
| Arrows-exchange | Convert NGN→USD | +$10,000.00 | Complete | 9 May 2026 |
| Arrow-right | Guangzhou Textiles Ltd. | -$15,000.00 | In Progress | 9 May 2026 |
| Arrow-right | Shenzhen Electronics | -$3,000.00 | Failed | 8 May 2026 |

Each row is clickable → Transaction Detail (Screen 24).

"View all transactions →" gold link at bottom of section.

---

### SCREEN 7A — Verification & Limits (Profile Section)

**Route:** `/profile/verification`
**Layout:** Sidebar + content area

Heading: "Verification & Limits"

Current tier card:
```
┌──────────────────────────────────────────┐
│  [ Tier 1 — Starter ]  ←badge            │
│  Your verified account level             │
│                                          │
│  Transaction limit:  $3,000 per payment  │
│  Monthly limit:      $5,000              │
│                                          │
│  Documents verified:                     │
│  ✓  CAC Registration                    │
│  ✓  Certificate of Incorporation         │
│  ✓  Director BVN + NIN                  │
│  ✓  Live Selfie                          │
└──────────────────────────────────────────┘
```

**Upgrade to Tier 2 — Growth** section:
Card with header: "Upgrade for higher limits" (Syne 600, 16px)
Sub: "Tier 2 unlocks up to $50,000 per transaction and $100,000/month."

Documents required checklist:
- ○ Certificate of Incorporation (you have this ✓ — already submitted)
- ○ CAC Status Report (current directors list)
- ○ Tax Identification Number (TIN)
- ○ Utility bill (business address)
- ○ Proforma Invoice will be required per transaction

CTA: "Upgrade to Tier 2 →" (primary gold)

---

### SCREEN 8 — Fund Wallet

**Route:** `/wallet/fund`
**Layout:** Sidebar + centered content card, max-width 520px

Heading: "Fund your NGN wallet"

Your dedicated account card:
```
┌──────────────────────────────────────────┐
│  Transfer NGN to this account            │
│                                          │
│  Bank:            Providus Bank          │
│  Account Name:    Borderless / [BizName] │
│  Account Number:  1234567890             │
│                                          │
│  [Copy account number]  gold link        │
│  [Copy all details]     secondary        │
└──────────────────────────────────────────┘
```

Info banner: "Transfer from any Nigerian bank. Your NGN wallet is credited instantly via NIBSS."

Note: "This account number is unique to your Borderless account. Do not share it with anyone else."

Amount to fund (optional field): "Enter expected amount" — purely informational, not required.

"Your wallet balance will update automatically once the transfer is received."

---

### SCREEN 9 — NGN Funds Arrived (Notification State)

This is a toast/notification that appears on the dashboard when NGN arrives:

**Toast (top-right, slide in from right):**
```
┌──────────────────────────────────────────┐
│  ✓  ₦5,000,000 received                  │
│     Your NGN wallet has been credited.   │
│     Ready to convert?  [Convert Now →]   │
└──────────────────────────────────────────┘
```
Background: #0A1628 (navy), text white, checkmark gold. Auto-dismisses after 8 seconds.

---

### SCREEN 10 — Convert: NGN → USD

**Route:** `/convert`
**Layout:** Sidebar + centered card, max-width 480px

Heading: "Convert NGN to USD"
Sub: "Your USD balance is what you'll use to pay Chinese suppliers."

Conversion card:
```
FROM:
  NGN Wallet balance: ₦50,000,000
  [         ₦ 5,000,000.00        ] ← input, large, tabular figures

RATE (live):
  1 USD = ₦ 1,560.00
  Rate from Nigeria's official FX market via Providus Bank
  [Refresh rate ↻]  Inter 400, 12px, gold

FEE:
  FX conversion fee (1.5%): $48.08 USD
  ────────────────────────────────────
TO:
  You receive:  $ 3,157.96 USD
  (displayed large, Syne 700, 28px, gold)
```

Summary line below: "₦5,000,000 → $3,157.96 USD"

CTA: "Convert Now →" (primary gold, full width)
Secondary: "Cancel" (ghost)

Disclaimer below button (Inter 400, 11px, secondary color):
"Rate is locked at the moment you confirm. The displayed rate is sourced from the NAFEM official FX market via Providus Bank."

---

### SCREEN 11 — Conversion Complete

**Route:** `/convert/success`
**Layout:** Sidebar + centered card

Checkmark (gold circle, white ✓)

Heading: "Conversion complete" (Syne 700, 24px)

Summary card:
```
You converted:   ₦5,000,000.00 NGN
You received:    $3,157.96 USD
Rate locked:     1 USD = ₦1,560.00
Fee paid:        $48.08 (1.5%)
Time:            Today, 2:34 PM
```

Updated balance pill: "USD Wallet: $35,607.96" (gold bg, navy text)

CTAs:
- "Send Money to Supplier →" (primary gold)
- "Back to Dashboard" (ghost)

---

### SCREEN 12 — Send Money: Step 1 — Supplier & Purpose

**Route:** `/send/step-1`
**Layout:** Sidebar + centered content, max-width 640px

**Step indicator (horizontal, top of content area):**
```
[● Supplier & Purpose] ──── [○ Amount & Rate] ──── [○ Review & Send]
```
Active step: navy circle with white number, gold underline. Completed steps: gold filled circle with checkmark. Inactive: grey outlined circle.

Heading: "Who are you paying?" (Syne 700, 22px)

**Corridor indicator (not a step — just context):**
Small pill at top: "Paying to: 🇨🇳 China via CNAPS" (non-interactive, Inter 500 12px, navy bg, white text)

**Supplier section:**
Label: "Select a supplier" (Inter 600, 14px)

If saved suppliers exist — show dropdown/select list:
```
[ Zhen Trading Co. ● Verified ▾ ]
```
"+ Add new supplier" link in gold below

If "Add new supplier" selected — expand inline form:
- Supplier Legal Name (as registered in China) — text input
- Chinese Business Registration Number (18 digits) — text input — helper: "Used to verify the business via China's registry" — after entry, show verification state:
  - Checking state: "Verifying supplier..." with spinner
  - Pass: "✓ Verified Supplier" green badge inline
  - Fail: amber warning banner: "We couldn't verify this supplier registration number. You can continue, but this payment will be held for manual review before release."
- Bank Name — text input
- Bank Account Number — text input
- CNAPS Code — text input — helper: "6-digit code — ask your supplier"
- Business Address in China — text area

---

**Payment Reason:**
Label: "What is this payment for?" (Inter 600, 14px)
Dropdown options:
- Importation of goods
- Service payment
- Professional fees or consultancy
- Intellectual property or licensing
- Other (requires text description in a visible input below)

If "Importation of goods" selected: queue Form M awareness for Screen 14 (Step 3). No UI change at this point.

---

**Invoice Upload:**
Label: "Upload Proforma Invoice" (Inter 600, 14px)

Upload zone (same dashed card style as Screen 3):
"Drag and drop your Proforma Invoice here or browse"
Accepted: PDF, JPG, PNG. Max 10MB.

After upload — show AI scan running:
```
⏳ Scanning invoice...  (spinner + Inter 400 12px)
```

**Invoice scan pass state:**
```
✓ Invoice verified                            (green)
  Supplier name matches: Zhen Trading Co.
  Amount detected: $5,200.00
  Payment reason auto-confirmed: Importation of goods
```

**Invoice scan failure states (inline, replaces upload zone):**

*Name mismatch:*
```
Error banner (red):
  ✗ Invoice rejected
  "The supplier name on the invoice ('Zhen Trade') does not match
   the registered beneficiary name ('Zhen Trading Co.'). Please
   re-upload an invoice with the exact registered business name."
  [Re-upload Invoice] — red outlined button
```

*Amount inconsistency:*
```
  "The invoice amount ($6,200) does not match the amount you entered
   ($5,200). Please upload the correct invoice."
```

*Missing HS codes (warning, not block):*
```
  "Your invoice does not contain HS (Harmonised System) product codes.
   This may cause delays at Chinese customs. We recommend re-uploading
   an invoice with HS codes."
  [Re-upload] or [Continue anyway →] links
```

CTA at bottom: "Continue →" (primary gold, full width) — disabled until supplier selected, payment reason chosen, and invoice passes scan.

---

### SCREEN 13 — Send Money: Step 2 — Amount & Rate

**Route:** `/send/step-2`
**Layout:** Sidebar + centered content, max-width 560px

Step indicator: Step 2 active.

Heading: "How much are you sending?" (Syne 700, 22px)

**Amount input:**
Label: "Amount in USD"
Input: large, tabular figures — prefix: "$"
Below input: "USD Wallet balance: **$35,607.96**"

If amount entered exceeds wallet balance:
```
Input turns red, error below:
"Insufficient USD balance. You have $35,607.96 available.
 [Convert more NGN →] " ← gold link back to Convert screen
```

If amount entered exceeds Tier 1 limit ($3,000 single transaction):
→ **Immediately replace Step 2 content with Screen 19 (Tier Limit Exceeded) — the transaction amount is preserved and passed to the upgrade flow.**

---

**FX Summary card (appears live as user types):**
```
┌──────────────────────────────────────────┐
│  You send:        $5,000.00 USD          │
│  Transaction fee: $15.00 (flat)          │
│  Total deducted:  $5,015.00 from wallet  │
│  ─────────────────────────────────────── │
│  Exchange rate:   1 USD = 7.24 CNY ⓘ   │
│  Supplier receives (est.): ¥ 36,200 CNY │
│                                          │
│  ⚠ Indicative rate. The final CNY        │
│    amount is set by our China payout     │
│    partner (LianLian Global) at time of  │
│    processing. Rates are typically       │
│    within ±0.5% of the displayed rate.  │
└──────────────────────────────────────────┘
```

Delivery estimate:
"Estimated delivery: Same business day (within Chinese banking hours)"
Inter 400 12px, secondary color, calendar icon

CTA: "Continue →" (primary gold, full width) — enabled only when a valid amount is entered.

---

### SCREEN 14 — Send Money: Step 3 — Review & Send

**Route:** `/send/step-3`
**Layout:** Sidebar + centered content, max-width 560px

Step indicator: Step 3 active.

Heading: "Review your payment" (Syne 700, 22px)
Sub: "Check everything carefully before confirming. Payments cannot be recalled once processed." (Inter 400, 13px, secondary — amber icon)

**Summary card (white, border, rounded, padding 24px):**
```
SENDING TO:
  Zhen Trading Co.                    [Verified Supplier ✓]
  Bank of China — Account: 6217 XXXX XXXX
  CNAPS Code: 102100099996
  Business Reg: 91310000XXXXXXXXXX

PAYMENT DETAILS:
  Amount:            $5,000.00 USD
  Transaction fee:   $15.00
  Total from wallet: $5,015.00 USD
  Purpose:           Importation of goods

EXCHANGE (INDICATIVE):
  Rate:              1 USD = 7.24 CNY
  Supplier receives: ≈ ¥36,200 CNY
  * Final CNY set by LianLian at processing

DELIVERY:
  Method:  CNAPS domestic transfer (China)
  Est. time: Same business day
```

**Form M Awareness Banner (shown only if payment reason = "Importation of goods"):**
```
ℹ️  Form M Notice
"This payment is for imported goods. If you are formally
importing goods into Nigeria, you may be required to file
a Form M with your commercial bank. Your Borderless
payment receipt can be used as supporting documentation.
Borderless does not file Form M on your behalf."
```
Banner: blue info style (#EFF6FF, left border #2563EB)

**Confirm button:**
"Confirm & Send Payment" (primary gold, full width, large — 52px height)
Below: "By confirming, you authorise Borderless to debit $5,015.00 from your USD wallet."

Cancel link (Inter 400, 13px, secondary color): "Cancel and go back"

---

### SCREEN 15 — Payment In Progress / Tracking Timeline

**Route:** `/transactions/[id]` (also the initial state after submission)
**Layout:** Sidebar + centered content, max-width 560px

**Status header:**
Large animated icon: pulsing amber clock / hourglass (subtle CSS pulse animation — no flashy animation)
Heading: "Your payment is on its way" (Syne 700, 24px)

Reference: `REF: BDL-2026-00842` (Inter 600, 13px, secondary color) with copy icon

**Payment summary strip:**
`$5,000 USD → Zhen Trading Co. → ≈ ¥36,200 CNY`
Inter 500, 15px, centered

---

**Tracking Timeline:**

```
● Payment submitted           ✓   Today, 2:41 PM
  Your payment is confirmed and funds are secured.

● Processing your payment     ✓   Today, 2:41 PM
  Your payment is being processed. This usually takes 2–6 hours.

● In transit                  ⏳  In progress
  Your payment is on its way to your supplier.

○ Delivered to supplier        —  Est. today
  Payment confirmed in your supplier's account.
```

Timeline node styling:
- Completed: green filled circle ✓
- In progress: amber filled circle with pulse animation
- Pending: grey outlined circle
- Connector lines between nodes

---

**Status badge (below timeline):**
[ In Progress — Amber pill ]

"We'll notify you by email and push notification when your payment is delivered."

**Support link:** "Something wrong? Contact support →" (ghost small button)

---

**Success state (when `payout.delivered` webhook fires — show this variant):**
Replace pulsing icon with gold ✓ circle (static)
Heading: "Payment delivered" (Syne 700, 24px)
Sub: "Zhen Trading Co. has received your payment."

All timeline nodes: green ✓
Status badge: [ Delivered — green pill ]

CNAPS Reference shown:
```
CNAPS Reference: 202605100284XXXXXXXX
[Copy reference]
```
"Share this reference with your supplier if they need to trace the payment."

CTAs:
- "View Transaction Receipt" (primary gold)
- "Send Another Payment" (outlined)

---

**Failed state:**

If `transfer.failed` (Airwallex failure — funds never left Borderless):
Icon: red × circle
Heading: "Payment failed"
Sub: "We couldn't process this payment. Your $5,015.00 has been returned to your USD wallet."
Status badge: [ Failed — red pill ]
CTA: "Retry Payment →"

If `payout.failed` (LianLian failure — funds reached China but CNAPS failed):
Icon: amber ⚠
Heading: "Delivery failed — we're on it"
Sub: "The payment reached our China network but could not be delivered to the supplier's account. We've raised a dispute and your funds will be returned within 2–5 business days."
Status badge: [ Failed — Investigating — amber pill ]
"Your USD will be returned to your wallet once the dispute is resolved."

---

### SCREEN 19 — Tier Limit Exceeded (Compliance Gate)

**Route:** Overlay — appears in-context within `/send/step-2`
**Layout:** Full-screen overlay with centered card (480px wide)

Background: rgba(10,22,40,0.85) with blur

Card (white, border-radius 16px, padding 40px):

Icon: lock icon in amber circle

Heading: "You've reached your Tier 1 limit" (Syne 700, 22px)

Body:
"Your Tier 1 account allows a maximum of **$3,000 per transaction** and **$5,000 per month**. Your payment of **$5,200** exceeds this limit."

Current limits table:
```
Tier 1 — Starter
  Per transaction:  $3,000   [You need: $5,200]  ✗ Exceeds limit
  Monthly total:    $5,000
```

Upgrade card:
Heading: "Upgrade to Tier 2 — Growth" (Inter 600, 14px, gold)
"Tier 2 unlocks up to **$50,000 per transaction** and **$100,000/month**."
Documents required:
- ○ CAC Status Report (current directors)
- ○ Tax Identification Number (TIN)
- ○ Utility bill (business address)
- ○ Proforma Invoice (required per transaction from Tier 2)

Note: "Your payment details are saved. Once verified, you'll be returned to complete this payment."

CTAs:
- "Upgrade Now →" (primary gold, full width) → launches Screen 22 (KYB Upgrade Flow) with transaction context saved
- "Cancel payment" (ghost, smaller)

---

### SCREEN 20 — Invoice Rejected (Compliance Gate)

This screen is **inline within Step 1** — not a separate overlay. See Screen 12 for the inline error state display. The upload zone is replaced with the error banner and re-upload button. The user cannot proceed to Step 2 until the invoice passes the scan.

---

### SCREEN 21 — Manual Review Hold (Compliance Gate)

**Route:** Replaces `/send/step-3` after submission if AML flag is triggered
**Layout:** Sidebar + centered content, max-width 560px

Icon: hourglass in amber circle

Heading: "Your payment is under review" (Syne 700, 22px)

Body:
"We've flagged this payment for a routine compliance check. This typically takes **2–4 business hours**. You don't need to do anything — we'll email you when it's cleared."

Reference: `REF: BDL-2026-00842`

What's happening:
```
✓  Payment submitted
⏳  Compliance review in progress   ← highlighted amber
○  Payment released to processing
○  Delivered to supplier
```

"Questions? Contact our compliance team: compliance@borderless.ng or +234 XXX XXXX"

CTA: "Back to Dashboard" (outlined)

Note banner at bottom (blue info):
"No funds have left your account yet. Your USD wallet has been debited. If the review finds an issue, your funds will be returned immediately."

---

### SCREEN 22 — KYB Upgrade Flow

**Route:** `/profile/upgrade`
**Layout:** Sidebar + centered card, max-width 560px

**Progress indicator:**
```
[● Documents] ──── [○ Review] ──── [○ Approved]
```

Heading: "Upgrade to Tier 2 — Growth" (Syne 700, 24px)

If triggered from a blocked transaction, show context banner:
"Your payment of **$5,200 to Zhen Trading Co.** is saved. Complete your upgrade to release it."

Document upload sections (one per required document):

**1. CAC Status Report**
Label + upload zone (same style as Screen 3)
Helper: "Download from the CAC portal. Shows current directors."

**2. Tax Identification Number (TIN)**
Text input (12 digits)
Helper: "Find this on your FIRS certificate or tax clearance letter"

**3. Utility Bill**
Upload zone. Helper: "Must show your registered business address. Issued within 3 months."

CTA: "Submit for Tier 2 Review →" (primary gold, full width)

Approval note: "Tier 2 review takes 24–48 hours. We'll email you when approved."

---

### SCREEN 23 — Transaction History

**Route:** `/transactions`
**Layout:** Sidebar + full-width content area

Heading: "Transactions"

**Filter bar:**
- Status: All / Delivered / In Progress / Under Review / Failed (pill tabs)
- Date range: date picker
- Search: supplier name or reference number

**Transaction table:**

Columns: Type icon | Supplier / Label | Amount | Status | Date | Action

```
→  Zhen Trading Co.         $5,200.00   [Delivered ✓]     10 May 2026  [View]
⇄  Convert NGN→USD         +$10,000.00  [Complete]        09 May 2026  [View]
→  Guangzhou Textiles Ltd.  $15,000.00  [In Progress ⏳]   09 May 2026  [View]
→  Shenzhen Electronics      $3,000.00  [Failed ✗]        08 May 2026  [View]
→  Zhen Trading Co.          $8,500.00  [Under Review]    07 May 2026  [View]
```

Row height: 56px. Alternate row background: #F8F9FC. Each row clickable.
Amount colors: outgoing payments in dark navy; converts in secondary color; failed in red.

Pagination at bottom.

---

### SCREEN 24 — Transaction Detail

**Route:** `/transactions/[id]`
**Layout:** Sidebar + centered content, max-width 640px

Back link: "← Transactions" (Inter 500, 13px, gold)

Heading: "Transaction Details" (Syne 700, 24px)
Status badge (large): [ Delivered — green pill ] or relevant status

---

**SECTION 1 — Summary**
```
Amount sent:         $5,200.00 USD
Total deducted:      $5,215.00 USD (incl. $15 fee)
Supplier received:   ¥37,648 CNY (actual, post-processing)
Exchange rate used:  1 USD = 7.24 CNY
```

---

**SECTION 2 — Recipient**
```
Supplier:            Zhen Trading Co.
Bank:                Bank of China
Account:             6217 XXXX XXXX
CNAPS Code:          102100099996
Business Reg:        91310000XXXXXXXXXX [Verified Supplier ✓]
```

---

**SECTION 3 — Compliance & Verification**
```
Payment purpose:     Importation of goods
Proforma Invoice:    inv_202605_zhen.pdf   [View]
Invoice scan:        ✓ Passed — supplier name, amount, HS codes verified
AML check:           ✓ Passed
KYB tier at time:    Tier 1 — Starter
```

---

**SECTION 4 — Audit Trail (Timeline)**
```
10 May 2026, 2:41 PM   Payment submitted
10 May 2026, 2:41 PM   $5,215.00 debited from your USD wallet
10 May 2026, 4:05 PM   ✓ Payment delivered to supplier
```

If failed (mid-flight):
```
10 May 2026, 2:41 PM   Payment submitted
10 May 2026, 2:41 PM   $5,215.00 debited from your USD wallet
10 May 2026, 4:10 PM   Delivery failed — dispute raised on your behalf
10 May 2026, [+3 days]  Funds returned to your USD wallet
```

---

**SECTION 5 — References**
```
Borderless reference:  BDL-2026-00842        [Copy]
CNAPS reference:       202605100284XXXXXXXX  [Copy]
```

"Share the CNAPS reference with your supplier if they need to trace this payment at their Chinese bank."

*Note: CNAPS reference is populated only after delivery confirmation (`payout.delivered`). It does not appear while the transaction is In Progress.*

---

CTA (if Delivered):
"Download Receipt" (outlined gold button, PDF icon)

---

## 5. Interaction Specifications

### 5.1 Send Money — Step Indicator Behavior
- Step number in circle: 1, 2, 3
- Active: #0A1628 fill, white text, gold underline, label in Syne 600
- Completed: #D4AF37 fill, white checkmark, label in Inter 500
- Inactive: #E2E8F0 fill, #5C667A text, label in Inter 400
- Clicking a completed step navigates back to it (data preserved)
- Cannot skip forward to an incomplete step

### 5.2 Wallet Balance Guard
On Screen 13 (Amount input), check in real time:
- If `amount > usdWalletBalance`: show red input state + "Insufficient USD balance" + "Convert more NGN →" link
- If `amount + $15 fee > usdWalletBalance`: same error (total deduction must be within balance)
- If `amount > tierSingleLimit`: transition to Screen 19 (Tier Limit Exceeded), preserve amount

### 5.3 Invoice AI Scan States
Show these states after file upload on Screen 12:
1. **Scanning** — spinner, "Scanning invoice..."
2. **Pass** — green banner, detected values
3. **Fail: Name mismatch** — red banner, reason, re-upload button
4. **Fail: Amount mismatch** — red banner, amounts compared
5. **Warning: No HS codes** — amber banner, can continue

### 5.4 Supplier Qichacha Verification
On Screen 12 when 18-digit reg number is entered:
1. On blur or after 18th digit: "Verifying..." spinner
2. Pass: "✓ Verified Supplier" green inline badge
3. Fail: amber warning banner ("payment will go to manual review")
4. Neither state blocks progression — fail state just adds a warning

### 5.5 Transaction Context Preservation
When Screen 19 (Tier Limit) interrupts Step 2:
- Save to session state: supplier ID, invoice reference, payment reason, entered amount
- When KYB upgrade (Screen 22) completes and is approved: auto-navigate back to Step 2 with all data pre-filled
- Show confirmation banner on Step 2: "Upgrade complete. Your payment details are ready to confirm."

### 5.6 Form M Banner Logic
- Trigger: payment reason = "Importation of goods" on Screen 12 Step 1
- Displayed: Screen 14 Step 3 Review, as a non-blocking info banner
- Not displayed for any other payment reason
- Cannot be dismissed (it is regulatory notice, not a UI nuisance)

### 5.7 Empty States

**Dashboard — no transactions yet:**
```
Illustration: simple icon of a transfer arrow
"No transactions yet"
"Fund your wallet and make your first payment to a Chinese supplier."
[Fund Wallet]  [Send Money]
```

**Beneficiaries — no saved suppliers:**
```
"No saved suppliers yet"
"Add your first supplier when making a payment."
[Send Money →]
```

---

## 6. Copy Tone Guidelines

**Voice:** Warm, confident, competent. Like a trusted senior colleague who knows finance. Not a bank, not a startup trying to be cool — a reliable business tool that treats the user like an intelligent professional.

**Do:**
- "Your money is on its way"
- "We've got this"
- "You're all set"
- "We'll let you know the moment it's delivered"
- "This payment is for imported goods. You may need to file a Form M with your bank."

**Don't:**
- "Transaction initiated" (too cold/robotic)
- "Invalid input" (too generic)
- "Oops!" (too casual for a product moving millions)
- Passive voice: "A payment has been submitted" → use "You've submitted a payment"

**Number formatting:**
- Always use comma separators: $5,200.00 not $5200
- NGN: ₦50,000,000.00 (no spaces)
- CNY: ¥36,200 (CNY equivalent, no decimal needed for large amounts)
- USD: always 2 decimal places

**Status labels:**
- Delivered (not "Completed" or "Success")
- In Progress (not "Pending" or "Processing")
- Under Review (not "Flagged" or "Held")
- Failed (straightforward — don't soften it, but explain it)
- Refunded (not "Reversed")

---

## 7. Compliance Requirements Checklist

These elements are **non-negotiable** — every one must be present in the prototype:

- [ ] KYB tier badge always visible in sidebar (all authenticated screens)
- [ ] Tier Limit Exceeded screen (Screen 19) with upgrade CTA and preserved transaction context
- [ ] Invoice rejected state (Screen 20 / inline Screen 12) with reason displayed
- [ ] Manual Review Hold screen (Screen 21) triggered by AML flag
- [ ] KYB Upgrade Flow (Screen 22) reachable both from sidebar badge (proactive) and tier limit block (reactive)
- [ ] Supplier Qichacha verification inline on Screen 12 (18-digit Business Registration)
- [ ] Form M awareness banner on Screen 14 (non-blocking, informational, regulatory)
- [ ] Indicative CNY disclaimer on Screen 13 (rate set by LianLian at processing, not locked by Borderless)
- [ ] Transaction Detail (Screen 24) must include: invoice reference, AML check result, supplier verification status, CNAPS reference, full timestamped audit trail
- [ ] KYB approval/rejection states (Screens 6A and 6B) with rejection reason displayed
- [ ] Privacy note on Screen 4: BVN/NIN stored in Nigeria, not shared with international partners
- [ ] Fee disclosure on Screen 13: fee shown clearly before user confirms (FCCPC requirement)

---

## 8. Mock Data to Use

**Logged-in user:** Bukola Adeyemi — Adeyemi Imports Ltd — Tier 1 — Starter
**NGN Wallet:** ₦50,000,000.00
**USD Wallet:** $32,450.00
**Business email:** bukola@adeyemiimports.ng

**Saved supplier:**
- Name: Zhen Trading Co.
- Bank: Bank of China
- Account: 6217 8823 4421 0055
- CNAPS: 102100099996
- Business Reg: 9131000074985631XA
- Status: Verified Supplier ✓

**Second supplier (unverified):**
- Name: Guangzhou Textiles Ltd.
- Business Reg: (invalid — shows unverified warning)

**Sample transactions:**
1. Zhen Trading Co. — $5,200.00 — Delivered — 10 May 2026 — REF: BDL-2026-00842
2. Convert NGN→USD — $10,000.00 — Complete — 9 May 2026
3. Guangzhou Textiles Ltd. — $15,000.00 — In Progress — 9 May 2026 — REF: BDL-2026-00841
4. Shenzhen Electronics — $3,000.00 — Failed — 8 May 2026 — REF: BDL-2026-00838
5. Zhen Trading Co. — $8,500.00 — Under Review — 7 May 2026 — REF: BDL-2026-00831

**Live FX rates (use fixed mock values):**
- NGN/USD: 1 USD = ₦1,560.00
- USD/CNY: 1 USD = 7.24 CNY (with indicative disclaimer always shown)

---

## 9. Technical Notes for the Builder

- **Framework:** React (preferred) or any modern component framework
- **Routing:** Implement as a multi-route SPA. All routes navigable.
- **State:** Use React context or Zustand to share wallet balances, user tier, and in-progress transaction across screens
- **No real API calls needed** — all data is hardcoded mock data as specified in Section 8
- **Fonts:** Import Syne and Inter from Google Fonts
- **Icons:** Use Lucide React or Heroicons (consistent icon set throughout)
- **Responsive breakpoints:**
  - Desktop: ≥ 1024px — sidebar visible, full layout
  - Tablet: 768–1023px — sidebar collapses to icon-only strip (48px wide)
  - Mobile: < 768px — full hamburger drawer, stacked layout
- **Animations:** Keep subtle. Only use:
  - Slide-in for step transitions (left/right lateral)
  - Fade for overlays and toasts
  - Pulse for "In Progress" status indicator only
  - No bounces, no confetti, no heavy motion
- **Accessibility:** All interactive elements must have visible focus states (gold ring: `box-shadow: 0 0 0 3px rgba(212,175,55,0.35)`)
