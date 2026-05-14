# Borderless — Architecture Note

**Version 1.0 | May 2026**

---

## How Money Moves Through Borderless

Borderless uses a hub-and-spoke model built on local payment rails at both ends. The reason this matters is that local rails are faster, cheaper, and invisible to the end user. No SWIFT wire appears on the supplier's side. No incoming wire fee. What the Chinese supplier sees is a domestic bank transfer, because from CNAPS's perspective, that is exactly what it is.

Here is how the money actually moves, from the moment a business owner confirms a payment to the moment the supplier's account is credited.

**Step 1: Naira inflow via NIBSS**
The user transfers naira from their Nigerian bank account into their Borderless virtual NGN account. This account is issued by Anchor, our Nigerian BaaS partner, and is mapped to the NIBSS (Nigeria Inter-Bank Settlement System) domestic clearing network. The funds arrive in near real time.

**Step 2: NGN to USD conversion via NAFEM**
When the user converts naira to USD, Borderless instructs Providus Bank, our CBN-authorized FX dealer, to purchase USD on the NAFEM (Nigeria Autonomous Foreign Exchange Market). Providus deducts their spread and credits Borderless's USD nostro account held at Providus inside Nigeria. No money crosses a border at this step. The USD exists as a balance inside Nigeria.

**Step 3: USD pool funding via SWIFT (treasury sweep)**
Separately from individual user transactions, Borderless runs periodic treasury sweeps. Providus Bank wires USD from Borderless's nostro to Borderless's pre-funded pool at Airwallex using a SWIFT MT103 international wire. Airwallex holds the USD pool and is our US MSB-licensed partner for cross-border USD transmission. Individual user transactions are fulfilled from this pool, which is why same-day delivery is possible without triggering a real-time international wire for each payment.

**Step 4: USD to LianLian via two parallel API calls**
When a user confirms a payment, Borderless makes two API calls simultaneously. The first goes to LianLian Global, our SAFE-licensed China payout partner, to create a payment order and retrieve their USD receiving account. The second goes to Airwallex to wire USD from Borderless's pool to LianLian's receiving account. These are two independent commercial relationships. Airwallex does not manage LianLian on our behalf.

**Step 5: CNY delivery via CNAPS**
LianLian matches the incoming USD to the payment order, converts to CNY at the onshore rate, and initiates a CNAPS (China National Advanced Payment System) transfer to the supplier's bank account. To the supplier's bank, this looks like a domestic Chinese transfer. No SWIFT. No incoming wire fee.

**The full rail stack:**

| Rail | Jurisdiction | Used For |
|---|---|---|
| NIBSS | Nigeria | NGN inflows from user's bank |
| NAFEM | Nigeria | NGN to USD FX purchase |
| SWIFT MT103 | International | Treasury sweep: Providus nostro to Airwallex pool |
| Airwallex API | International | USD transmission from pool to LianLian |
| CNAPS | China | Local CNY delivery to supplier |

---

## Float and FX Exposure

My hypothesis is that FX exposure in Borderless splits cleanly across two parties, and the design of the product reflects that split deliberately.

**Borderless absorbs the NGN to USD conversion risk.** When a user confirms a conversion, we commit a rate to them. Providus Bank then executes on NAFEM within seconds. The window between commitment and execution is short enough that rate moves are basis-point level under normal conditions. Our 1.5 percent fee spread is the buffer that covers this. We are not formally hedging this at MVP. The spread is the hedge.

**LianLian absorbs the USD to CNY conversion risk.** When LianLian accepts a payment instruction, they lock the CNY rate and execute the conversion. Managing CNY exposure is their core competency as a SAFE-licensed entity. Their fee covers this. We are not involved in CNY risk management at any stage, and we should not try to be. This is a deliberate partner design decision, not an oversight.

**Borderless absorbs the idle USD pool risk.** Our pre-funded pool at Airwallex sits as USD between treasury sweeps and payment instructions. If USD weakens against CNY during that window, each payment buys marginally fewer CNY. We manage this through pool right-sizing: we maintain roughly 3 to 5 days of expected payment volume in the pool, not weeks. This limits exposure without creating payment delays. At MVP, there is no formal hedging of the pool. At scale, we would introduce FX forward contracts to lock future CNY rates for the pool, but that is a post-MVP treasury function.

**LianLian absorbs the settlement float risk.** From the moment USD arrives in LianLian's receiving account to the moment CNY is delivered to the supplier's bank, the funds are on LianLian's books. Their Supplier Payments Guarantee is the contractual backstop. If delivery fails, they are responsible for the refund. This is not an informal arrangement. It is a commercial product they have launched specifically for this kind of cross-border B2B payment.

---

## What Happens When a Transaction Fails

There are two failure modes that matter, and they have different causes and different resolution paths.

**Failure Mode 1: Airwallex cannot deliver USD to LianLian**

This happens before any money reaches China. Airwallex sends a transfer.failed webhook to Borderless. When this happens, the USD debit on the user's wallet is immediately reversed. The user receives a push notification and email saying their payment could not be sent and the funds are back in their wallet. From the user's perspective, the experience is: they confirmed a payment, something went wrong on the backend, and their money came back to them. They can choose to retry.

No funds are in transit. No dispute is needed. The failure is clean.

**Failure Mode 2: LianLian receives the USD but the CNAPS delivery fails**

This is the harder scenario. USD has left Borderless's Airwallex pool and arrived at LianLian's receiving account. LianLian attempts the CNAPS transfer and it fails because the supplier's bank rejected it, the account is closed, or a compliance check at the Chinese bank end blocked it.

LianLian sends a payout.failed webhook to Borderless. Borderless immediately raises a dispute with LianLian under the commercial SLA. LianLian's Supplier Payments Guarantee applies: they commit to refunding the USD equivalent back to Borderless's receiving account. Once the refund lands, Borderless credits the user's USD wallet and sends a notification: "Your payment could not be delivered. Your funds have been returned to your USD wallet." The typical resolution window is 2 to 5 business days depending on the nature of the failure.

From the user's perspective: they confirmed a payment, it went into "In Progress," they received a notification that something went wrong, and within a few business days their money came back. They do not need to contact LianLian. They do not need to chase a refund. Borderless handles the dispute and the user just waits for the resolution notification.

The user's audit trail in the Transaction Detail screen records the full event: the failure timestamp, the dispute reference, and the refund confirmation. This is the record that protects both the user and Borderless if the supplier or any regulator asks what happened to the money.
