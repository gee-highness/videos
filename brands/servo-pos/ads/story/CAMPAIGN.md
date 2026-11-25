# Servo POS: "One busy evening" image sequence

A 10-slide carousel (1080x1080) that follows three orders, each arriving for a different reason, from the moment they are placed to the owner's live dashboard. Every screen is the real app (Servo Demo Kitchen, **demo data**), captured on desktop and mobile. Built for trust: the viewer watches the whole job get done, with no mock-ups.

Sits on top of `docs/POSTING_PLAN.md` (offer ladder, rules, tags). Post as one Facebook multi-photo post, or as an Instagram/WhatsApp Status sequence in this order.

| # | File | What it shows | Device |
|---|---|---|---|
| 1 | `s01-hook.png` | Three orders, three reasons, one kitchen | none |
| 2 | `s02-guest-phone.png` | Order 1: a guest orders ahead from her phone (menu, cart, "order received") | mobile |
| 3 | `s03-walkin-till.png` | Order 2: walk-in at the till, total with 15% VAT | desktop |
| 4 | `s04-till-pay.png` | Cash payment screen: quick amounts, split the bill, rewards number | desktop |
| 5 | `s05-table-3.png` | Order 3: Table 3 dine-in taken on a phone | mobile |
| 6 | `s06-receipt.png` | Receipt with kitchen number, VAT, payment method | mobile |
| 7 | `s07-kitchen.png` | All orders land on one kitchen screen, tagged by source | desktop |
| 8 | `s08-kitchen-progress.png` | New, Preparing, Ready to serve (kitchen and waiter) | mobile |
| 9 | `s09-owner.png` | Owner's live dashboard: active orders, kitchen load, tables, revenue | desktop |
| 10 | `s10-cta.png` | Try the demo, offer ladder, WhatsApp | none |

## Caption (Facebook)
> One busy evening. Three orders. Three different reasons. One kitchen.
>
> Swipe to watch them arrive: a guest ordering ahead from her phone, a walk-in paying at the till, and Table 3 sitting down to eat. Then the kitchen, the waiter and the owner's live dashboard. Every screen is the real Servo POS (demo restaurant, demo data).
>
> Want to try it yourself? Sign in as the cashier, kitchen, waiter or manager and place an order. No sign-up: servo-pos.vercel.app/demo
> First 5 restaurants: 6 months free. Restaurants 6 to 10: 3 months free.
>
> Rather chat? WhatsApp us: https://wa.me/26879342380

**Tag:** `fb-story01` (link in the first comment: `https://servo-pos.vercel.app/demo?ref=fb-story01`). **First comment question:** "Which of these three orders is busiest at your place?"

## Rules this follows
- Says "demo" on every slide; no real restaurant's data appears.
- No "fastest", "cheapest", "#1" or "works offline" claims.
- Card payments are not shown: the demo tenant is cash-only, so the slides don't imply card acceptance.
- Table QR ordering is not shown (table links are signed per table). The guest slide shows the restaurant's takeaway menu link instead.

## WhatsApp Status and Stories (1080x1920)
The same 10 slides, laid out tall, are in `images/status/` (`s01-hook.png` to `s10-cta.png`). WhatsApp covers about the top 170 px and bottom 200 px, so nothing important sits there. Post them as one Status each, in order; the first one says "Tap to watch them arrive". Rebuild with `NODE_PATH=$(npm root) node ads/story/make-status.js`.

## Rebuilding the images
Screens are in `raw/` (`d-` = desktop 1440x900, `m-` = mobile 390x844, taken from the live demo). Edit copy or layout in `make-story.js`, then:
```bash
NODE_PATH=$(npm root) node ads/story/make-story.js   # needs playwright-core and Chromium
```
To retake screens, sign in to `servo-pos.vercel.app/pos/login?demo=cashier` (also `kitchen`, `waiter`, `manager`) and repeat the order flow. The kitchen and dashboard shots need live orders, so run `seed_demo_tenant.py --reset` first (see `docs/DEMO.md`).

**Note:** capturing placed 4 real orders (#4045 to #4048) in the demo tenant, so today's demo revenue and kitchen queue include them until the next `--reset`.
