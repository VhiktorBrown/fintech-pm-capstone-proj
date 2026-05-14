# Borderless — Retrospective

**Version 1.0 | May 2026**

---

## What Is Not Working

The honest answer is that the MVP has three real gaps, and I want to name them clearly rather than bury them.

The biggest one is the KYB activation window. Our first success metric targets 50 percent of approved businesses completing their first payment within 7 days of KYB approval. But in practice, Smile ID, the CAC API, and sanctions screening all have edge cases that push accounts into manual review, which means a 24 to 48 hour wait before the user can transact at all. That is a third of the activation window consumed before the user even opens their wallet. The product works. It just activates slower than the metric demands, and we need to close that gap by improving automated pass rates before we can honestly claim this metric as achievable.

The second gap is that LianLian's per-transaction fee is still an estimate. Every pricing decision in this product — the 1.5 percent FX fee, the $15 flat fee, the entire margin table — is built on a $5 to $12 estimate for LianLian's fee. That estimate came from market research, not a signed commercial agreement. If the actual fee is higher than $12, the product loses money on small Tier 1 transactions. We cannot launch with this unresolved. It is the single largest financial risk in the product right now.

The third gap is that only the business owner can transact. Role-based permissions are deferred to v2. In practice, any SME with more than one person in the business will run into this quickly. The owner cannot always be the one initiating payments. This is the right scope decision for MVP, but it is a genuine usability constraint that will surface the moment a Tier 3 importer tries to delegate to their operations person.

---

## Next Sprint Priorities

If the product continues, these are the three things that matter, and the order matters.

First: Sign the LianLian commercial agreement and get the actual fee structure on paper.

This is not a product sprint. It is a commercial sprint. But it has to happen before anything else because every pricing assumption in the product is sitting on an estimate. The fee model, the margin table, the competitive comparison against informal agents — all of it changes the moment LianLian gives us their real number. Until we have a signed agreement, we are building on a guess.

Second: Improve the KYB automated pass rate to close the 24 to 48 hour review window.

The Time to First Payment metric is the clearest indicator of product-market fit. Every hour we can eliminate from the KYB window — through better CAC API integration, smarter document upload guidance, or improved Smile ID edge case handling — directly improves activation. This is also the biggest differentiation opportunity against the informal agent, where there is no onboarding at all. If the formal product is slower to start than the informal one, we lose users in the first 48 hours before they ever send a payment.

Third: Build role-based permissions for finance managers.

This is the first feature that converts a business owner from someone who occasionally uses Borderless into a company that runs all their import payments through it. Once a finance manager is set up and processing payments within defined limits, the switching cost from Borderless goes up significantly. The business owner stops being a bottleneck. This is the feature that drives retention, not just activation.

---

## Where AI Fell Short

Ten specific errors were caught and logged during the build. Four are worth naming here because they each show a different failure mode.

The first was an architecture error. During the research phase, AI stated that Airwallex could handle the full China payout leg — converting USD to CNY and delivering via CNAPS to the supplier — which would have made LianLian Global unnecessary. The cost model was revised to remove LianLian's fee entirely based on this. The problem is that Airwallex holds a Third-Party Online Payment Licence in China, which covers domestic Chinese digital payments only. It does not hold a SAFE Cross-Border Business Licence, which is the specific authorisation required for a foreign entity to receive USD, convert to CNY, and pay via CNAPS. On top of that, Airwallex's CNY transfer product requires the business to have a Chinese-registered entity or a Chinese national UBO — neither of which a Nigerian importer has. The error was caught with one question: "Don't they need a SAFE cross-border business licence for that?" LianLian was restored as the mandatory primary partner and the cost model was corrected. The lesson is that product marketing ("pay Chinese suppliers") and regulatory eligibility are two different things, and AI read the first without checking the second.

The second was a licensing direction error. Early in the build, IMTO (International Money Transfer Operator) was presented as the relevant licence for Borderless and as the licence type we should look to partner under. IMTO authorises inbound transfers only — foreign currency coming into Nigeria. Borderless is entirely outbound. Using IMTO as the stated licence for an outbound product would have been an immediately visible error to any practitioner on a panel. The correct framework for outbound payments required a completely different set of licences across four partners.

The third was a compliance gap. The initial AML framework had one structuring rule: flag transactions clustering just below tier limits. This catches people gaming our tier limits but completely misses the classic smurfing pattern, where launderers keep individual transactions below regulatory reporting thresholds ($10,000 in our case) while the aggregate is suspicious. Four additional rules were added after the question: "Do we check if multiple transactions under the reportable threshold have been initiated?" AI had built AML as a checklist of individual checks rather than a pattern recognition system that looks across transactions over time.

The fourth was a licensing category error. The compliance section initially cited PSSP as the licence Borderless would eventually pursue for the wallet and virtual account function. The CBN's 2020 circular is explicit: PSSP holders are prohibited from holding customer funds or issuing e-money. A PSSP doing this is in direct regulatory violation. The correct licence for wallet issuance is an MMO (Mobile Money Operator) at N2 billion capital. This was caught when the user pushed to research exactly which CBN category covers virtual account issuance for wallet funding.

---

## The Compliance Risk I Did Not See Coming

The risk I did not see coming was how far the PSSP licence falls short of what Borderless actually needs.

When the compliance section started, the working assumption was that Borderless would apply for a PSSP licence — the Payment Solution Service Provider under the CBN's Payment Solution Services category — and that this would eventually cover both the payment processing function and the wallet function. The month 12 to 18 own-licence goal was framed around this.

That assumption was wrong in a significant way. The CBN's December 2020 circular is specific: PSSP holders are prohibited from holding customer funds or issuing e-money and wallets. A PSSP that holds customer balances is not operating in a grey area. It is in direct regulatory violation. The wallet function requires either an MMO (Mobile Money Operator) licence at N2 billion capital plus N2 billion refundable escrow, or a licensed deposit-taking institution like a Microfinance Bank. Anchor's MFB licence is what makes the naira wallet legal under our current structure.

What this means for the independence roadmap is significant. The path to Borderless operating its own wallet infrastructure independently does not go through a PSSP. It goes through an MMO application, which is ten times more capital-intensive. PSSP covers the payment processing and aggregation layer, which is meaningful, but it does not touch the wallet. So the "Month 12 to 18 own licence" milestone I had in mind would only give us a PSSP. To get true wallet independence, we are looking at an MMO, which requires N4 billion in total capital and regulatory escrow before we even apply.

The practical consequence is that the partnership with Anchor is not just an MVP convenience. It is the structure we will need for far longer than planned unless we raise significant capital specifically to pursue an MMO licence. That is not a problem that started during the build — it is a constraint that was always there. But I only saw it clearly when I was forced to explain specifically which licence covers what Borderless actually does.
