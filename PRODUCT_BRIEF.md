# Borderless — Product Brief

**Version 1.0 | May 2026**

---

## The Problem and Who Has It

There is a specific person I want you to picture. He runs a Lagos-based business that imports goods from China. He might be bringing in electronics, fabrics, hair extensions, furniture, or industrial parts. The order is confirmed. His Chinese supplier is waiting to be paid. And here is what happens next.

He goes to the bank. He transfers naira to a Nigerian agent he knows personally, someone who has a bank account in China. That agent then pays his supplier from their Chinese account. The FX rate for this transaction is not fixed anywhere. It is negotiated each time, and the agent charges a spread above market, somewhere between 3 and 5 percent, plus a flat fee of $100 to $200 depending on the size of the transfer. Even with all of this, the money still takes 2 to 3 days to arrive.

This works. But only barely, and only for some people.

The reason it works at all is trust. This importer has been doing business with this agent for years. That relationship did not happen overnight. A business owner who is new to importing, or whose import volume is growing faster than their personal network, does not have access to the same pipeline. They either pay more, wait longer, or use the formal banking system, where a SWIFT transfer to China costs $40 or more per transaction, takes 3 to 5 days, and requires paperwork that most SMEs find painful to navigate.

There is no good formal product solving this for Nigerian SME importers paying Chinese suppliers. The informal agent market exists precisely because the formal options are too slow, too expensive, or too complicated. But the informal model has real problems. The FX rate is opaque. There is no audit trail. There is no recourse if something goes wrong. And as a business grows, operating through an unregulated agent becomes a liability, not just a convenience.

The person who has this problem is the business owner, not the finance manager. They are the ones making the call, negotiating the rate, and walking into the bank. They do not have a treasury function. They are the treasury function.

---

## The Core Hypothesis

For Borderless to work, three things must be true at the same time.

**The informal agent market is large enough and frustrated enough to switch.** We know the informal market exists because the formal one failed. We know it is large because a single importer I spoke to during research moves hundreds of millions of naira through this channel regularly. The question is whether there are enough businesses at various scales, from the hair vendor moving a few million naira to the industrial importer moving hundreds of millions, who are willing to trade the familiarity of their current agent for something better. I believe they are, but only if we make the switch feel obviously worth it, not just marginally better.

**Transparency and compliance can substitute for personal trust.** The agent relationship works because of trust built over years. Borderless cannot replicate that relationship, but it can replace what trust actually delivers: certainty that the money arrives, certainty about the rate, and certainty about the timeline. A real-time audit trail on every transaction, a published FX fee instead of a negotiated one, and a payment guarantee from our China payout partner give the user something more reliable than personal trust, even if it feels less personal. As businesses scale and face scrutiny from accountants, auditors, or regulators, the informal model becomes a liability. Compliance becomes the value proposition, not just a feature.

**The economics hold.** We have to be meaningfully cheaper than the informal agent, not marginally cheaper. At 1.5 percent plus a $15 flat transaction fee, we are 70 to 82 percent cheaper than the informal agent across every transaction size we target. That gap is wide enough to be a real reason to switch. But this hypothesis is partially unconfirmed: LianLian Global's actual per-transaction payout fee has not been negotiated yet. If that fee is significantly higher than our estimate of $5 to $12 per transaction, our margin compresses and our pricing advantage narrows. Confirming LianLian's commercial terms is the first thing we do before building anything.

---

## How We Know It Is Working

**Metric 1: Time to First Payment (Activation)**

This measures how quickly a KYB-approved business makes their first outbound payment. Target: 50 percent of approved businesses complete their first payment within 7 days of KYB approval.

This metric tells us whether the product is actually useful in practice, not just in sign-ups. A business that completes KYB but never sends a payment has not been activated. If this number is low, it means either the onboarding flow has too much friction, or the value proposition is not landing. It is also the metric most directly tied to whether users are replacing their informal agent workflow with Borderless, which is the behaviour change we are trying to drive.

**Metric 2: Monthly Payment Volume (Transaction Volume)**

This is the total USD equivalent of outbound payments processed through Borderless in a calendar month. Milestones: $250,000 in month 3, $1 million in month 6, $5 million in month 12.

This is the primary measure of product-market fit. Growing MPV means businesses are not just trying Borderless, they are replacing a meaningful portion of their import payment activity with it. Stagnant MPV despite growing sign-ups means the product is not trusted enough for regular use.

**Metric 3: KYB Tier Upgrade Rate (Activation Quality)**

This measures the percentage of Tier 1 users who upgrade to Tier 2 within 30 days of their first successful payment. Target: 40 percent.

A Tier 1 account has a single-transaction limit of $3,000. A business owner doing any serious import activity will hit that ceiling quickly. If they upgrade, they are telling us the product is valuable enough to invest more trust in. If they do not upgrade, they are either one-time users or they bounced back to their agent after the first transaction. This metric separates casual users from committed ones.

**Metric 4: Automated AML Clearance Rate (Compliance)**

This measures the percentage of transactions that pass automated AML checks without requiring manual review. Target: at least 92 percent auto-cleared.

This metric exists for two reasons. First, it tells us our AML ruleset is well-calibrated. If it drops significantly below 92 percent, we are either flagging too many legitimate transactions (which creates delays that push users back to agents) or the transaction mix is shifting toward higher-risk patterns that we need to investigate. Second, it is a direct input into our operational cost structure. Every manual review takes compliance team time. At scale, a high auto-clearance rate is what makes the business operationally viable.

**Metric 5: Net Revenue per Transaction (Financial Health)**

This tracks the actual margin Borderless earns per completed transaction after paying all partner fees. Target: minimum $20 net margin per transaction across the portfolio.

This metric becomes relevant the moment LianLian's commercial terms are confirmed. Until then, we are working off estimates. Once confirmed, this metric tells us whether the product is economically sustainable at current pricing. If the net margin falls below our target, we either renegotiate partner fees, adjust pricing, or both. A product with strong activation and volume metrics but a collapsing net margin per transaction is not a business, it is a subsidy.

---

*This brief is the internal document that guides every product decision that follows. If a feature, a partnership, or a compliance decision cannot be traced back to one of these hypotheses or metrics, it does not belong in v1.*
