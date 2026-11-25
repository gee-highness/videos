# Servo POS: real-app footage plan

Goal: a library of **real screen-recorded clips** (no mock-ups) that shows **everything Servo offers**, for WhatsApp Status first (the rule in `CLAUDE.md`: posts are WhatsApp-only unless the owner says otherwise), re-cut for Facebook when asked.

This is the "real screen recording of a live order" idea from `ads/video/PLAN.md` Batch D, extended to the whole product. It sits next to, and does not replace, the 3D device-story posts (`ads/devices/WORKFLOW.md`).

Companion file: [`CLIPS.md`](./CLIPS.md), the shot-by-shot script for every clip. Nothing here changes app code.

**Read first, always:** `CLAUDE.md`, `docs/POSTING_PLAN.md` (offer ladder in section 3, banned claims, tracking tags), `docs/FACEBOOK_PROMPTS.md` (captions and hooks), `ads/devices/WORKFLOW.md` (local stack, data, pitfalls). This plan only adds what is specific to screen recordings.

Format: **vertical 1080x1920, 20 to 30 s per clip** (WhatsApp Status caps at about 30 s and files should stay under ~15 MB), burned-in captions, no music (needs a licensed track from the owner; do not fetch one).

---

## 1. Everything Servo offers (the checklist the library must cover)

Built from `src/app` routes, `src/components/pos`, `docs/*.md` and `README.md`. A feature counts as covered when a clip in `CLIPS.md` shows it working. Section 9 maps features to clips.

### Guests (customer app at `/customer-menu/<domain>`, demo tenant `servo-demo`)
| # | Offer | Where |
|---|---|---|
| F01 | Scan a table or takeaway QR and open the menu; signed QR links, on-site checks and trusted guests (when ordering rules are on) | `/menu`, Management > Ordering Rules |
| F02 | Browse the menu, open a dish, add notes, build a cart, order dine-in or takeaway | `/menu` |
| F03 | Pay: cash at the till, or card online through the restaurant's own gateway account; split-the-bill helper | `/payment/success`, `/payment/cancel`, payment modal |
| F04 | Track the order live: "ready in about N minutes", buzz and beep when ready, optional web push | `/track/<orderId>` |
| F05 | Rate the order (1 to 5 stars); 4 and 5 stars invite a Google review, 1 to 3 go privately to the manager | track page |
| F06 | Rewards card (name, phone, 4 to 6 digit PIN), points, vouchers, recent orders | `/rewards` |
| F07 | "The usual" and order again for signed-in members | top of `/menu` |
| F08 | The restaurant's **own installable app**: name, logo, colours, icon (Standard and up) | install prompt, `/install-ios` |
| F09 | Branded home screen and pages: Our story, Gallery, Find us, FAQ, Reviews, What's on, Allergens, custom pages | `/home`, `/page/<slug>` |
| F10 | Book a table, manage a booking by link, waitlist (add-on) | `/book`, `/booking/<token>`, `/waitlist/<token>` |
| F11 | Public share card and discover page; the six app looks | `/share`, `/discover`, `/app-gallery` |

### Staff (POS at `/pos`, four roles: manager, cashier, kitchen, waiter)
| # | Offer | Where |
|---|---|---|
| P01 | One-tap demo sign-in per role | `/demo`, `/pos/login?demo=<role>` |
| P02 | Cashier: menu grid, category filter, sort by name, popularity or price, select a table or "No Table", item notes (for example "No onion please"), cart, subtotal, clear cart | `/pos/cashier` |
| P03 | Take payment: cash with tendered amount and change, card or online with the "How card payment works" panel, split the bill, record a cash tip, add the guest's phone for rewards | payment modal |
| P04 | Kitchen screen: Pending stock, Preparing, Ready; start items, mark done, "Mark All Items Complete", stock check | `/pos/kitchen` |
| P05 | Waiter view: ready orders, urgent and large orders, serve | `/pos/server` |
| P06 | Edit an order, cancel, refund and return with a reason | order dialogs |
| P07 | Clock in and out at the kiosk | `/pos/clock-in`, `/pos/kiosk` |
| P08 | Retail: barcode scan, product add, variants, batches and expiry, returns | cashier |
| P09 | Thermal receipt printing and printer settings | Printer settings |
| P10 | Dashboard (cashier and manager home) | `/pos/dashboard` |

### Owner and manager (Management at `/pos/management`)
| # | Offer | Where |
|---|---|---|
| O01 | Live analytics and best sellers | `/analytics` |
| O02 | Financial and other reports | `/reports` |
| O03 | Menu: Foods and Food Categories with photos and prices | Menu section |
| O04 | Supply chain: Inventory Products and Categories, **Import Products (CSV)**, Suppliers, **Purchase Orders**, stock recipes | Supply Chain |
| O05 | People: Employees, Shifts, Timesheets, **Payroll** (Multi-branch) | People |
| O06 | Customers, **Tables**, Stores, **Ordering Rules** | Customers and Tables, System Settings |
| O07 | **Your customer app** builder: six looks, colours with readability checks, brand, tabs, 18 home sections, pages | `/app-builder` |
| O08 | **Customer Rewards** designer: programme name, own word for points, bonus days, up to 12 rewards; Feedback and Posts tabs | `/loyalty` |
| O09 | **Online Bookings**: today's floor, rules, waitlist, seat at table (add-on) | `/bookings` |
| O10 | **Know Your Guests**: dashboard, guest groups, offers (opt-in only) | `/growth` |
| O11 | **Share Card and QR**: public link, QR, table tent | `/share` |
| O12 | **Activity Log**: who cancelled, returned, discounted or changed what | `/audit` |
| O13 | **Refer a Restaurant**: your code, 2 free months per approved referral | `/referrals` |
| O14 | Catalogue import for retail | `/catalog-import` |

### Platform admin (separate admin site, `NEXT_PUBLIC_APP_TYPE=admin`)
| # | Offer | Where |
|---|---|---|
| X01 | Tenants: create a restaurant, payments setup with a test key, country | `/admin/tenants` |
| X02 | Founding Program tracker, Plans and Prices, Booking add-ons | `/admin/program`, `/admin/plans`, `/admin/booking-addons` |
| X03 | Platform analytics, reports, users, settings | `/admin/analytics`, `/admin/reports`, `/admin/users`, `/admin/settings` |

### Public site
| # | Offer | Where |
|---|---|---|
| L01 | Landing page, live demo (no sign-up), Join page, app gallery | `/`, `/demo`, `/join`, `/app-gallery` |

**Not to film or not to promise**
- **Siswati** is not built; do not show a language switch.
- **Offline:** the posting rules ban "works offline". The till cannot even be opened while offline. Do not record offline beats for public posts (internal support footage only).
- **Card payments** only on a tenant with a test key; never imply money is held by Servo (each restaurant is paid into its own account).
- **Gift cards, split payments across methods, card tips:** not built.
- **Starter** has the plain menu page only: never show the app builder or the customer app as a Starter feature. Film M07, F08, F09 on a **Standard** tenant.
- **Online table bookings** are an add-on; show only when the audience asked about bookings (posting plan section 3).

---

## 2. Data and accounts

Use the existing machinery (do not reinvent): `servo-api/scripts/seed_demo_tenant.py --reset`, then **always** `dress_demo_look.py` (real photos, warm design, logo, tagline), then `demo_tick.py --daily --now ...` at simulated lunch times. All of it is "demo data" and is labelled as such on screen.

| Need | How |
|---|---|
| Tenant | "Servo Demo Kitchen" (`servo-demo`), Standard plan features on, bookings add-on on for M09 and F10 only |
| Roles | demo manager, cashier, kitchen and waiter logins from `src/lib/marketing.ts`; `/pos/login?demo=<role>` pre-fills the **public** demo credentials, which is fine to show |
| Orders | ticks at 12:30, 12:40, 12:50, 13:00, 13:10, 13:20, 13:30, 13:38 so the screens look like a busy lunch; mark two preparing orders `ready` so the waiter view is not empty |
| Rewards | three members, phone 7600 0001 to 0003, PIN 2468 (demo seed) |
| Bookings | 2 tables free, 3 bookings today, one waitlist entry |
| Retail | a second demo tenant of business type retail with 30 products, barcodes, one variant group, one batch with expiry (add to the seed if missing) |
| Stock and people | suppliers, one low-stock item, shifts and a payroll period (demo seed already has staff, stock, suppliers) |
| Admin | platform admin demo login on the admin build, 6 demo tenants in the Founding Program |

**Cleanliness rules:** run the seed with `--reset` and `dress_demo_look.py` before every capture day; never capture from production (its demo sign-in is slow and shows "Waking the demo up").

---

## 3. Environment (follows `ads/devices/WORKFLOW.md`)

1. Mongo on `27117` (database `servo_showcase`), then the API on `8000`.
2. Web with `NEXT_PUBLIC_DEMO_URL=http://localhost:3000 npm run dev` (essential).
3. Admin: second dev server with `NEXT_PUBLIC_APP_TYPE=admin` on another port.
4. Warm every route once with `curl` (first compile is 5 to 25 s and times captures out).
5. Do not edit app source during a run. Check `curl localhost:8000/api/health` before each run. Kill processes by pid, never `pkill -f`.
6. Max 2 to 3 captures in parallel on a 4-core box; sequential is safest.

| Clip type | Needs |
|---|---|
| Everything on the till, kitchen, waiter, management, guest app | local stack |
| **Photos, logo, banner shown** | `dress_demo_look.py` after the reset (copies public photos read-only) |
| **Card payment** (F03, P03) | a tenant with a **DeltaCrypt test key** in the Payments panel; otherwise show cash and the "How card payment works" panel, never a fake success |
| **Web push alert** (F04) | needs VAPID keys and a real browser; record on a real phone, or skip and show the buzz and banner |
| **Installing the app** (F08) | the Android install prompt does not fire in headless Chromium: film on a real phone, or use the iPhone steps page `/install-ios` |
| **Emails** | none are sent from the demo; do not show email delivery |

---

## 4. Capture method

Tools on the box: Playwright with Chromium (do not reinstall), ffmpeg, the existing `ads/video/make-video.js` for slideshows (not used here).

### Device profiles
| Clip | Profile | Canvas |
|---|---|---|
| Guest app (F), waiter | phone 390x844, DPR 3, touch | scaled to 1080 wide, full-bleed |
| Cashier | tablet portrait 810x1080, touch | on a branded 1080x1920 canvas: caption band top, screen centred, "Demo data" chip bottom |
| Kitchen, manager, admin | desktop 1280x720 | same canvas, screen centred, the full width kept (**never crop a device or screen**, a rule from `CLAUDE.md`) |
| iPhone steps | Playwright `iPhone 13` | full-bleed |

### Recording
- `recordVideo` at the profile's native size, then composed to 1080x1920 with ffmpeg (no scaling above 2x).
- Fixed clock: `ctx.clock.install({ time: <lunch time> })` using the same value as `FAKE_NOW`, so ticket ages read "20m" and not "-372m".
- Pre-signed-in sessions by `storageState`, so no "Signing in..." loader; the sign-in clip (S01) is the only one that shows it.
- Toast popups ("Item added", "Report Generated") are hidden by the existing capture CSS; keep them hidden except where a toast is the point.
- The "Aa" accessibility button and install prompts are hidden except in clips that are about them.

### Overlays drawn into the page so they are in the video
1. **Tap cursor**: 28 px translucent circle gliding to each target (20 steps) with a ripple on click.
2. **Caption bar** in the top band: white bold, ember `#D9480F` pill, max 7 words, 200 ms fade. Captions come from `docs/FACEBOOK_PROMPTS.md` prompts 2 and 3; plain English, warm, no hype.
3. **"Demo data"** chip bottom-left in every clip with seeded content.
4. **End card (2 s):** Servo mark, one call to action, link with a tracking tag: `servo-pos.vercel.app/demo?ref=<tag>`. Use `wa-status` for Status posts, and `fb-pNN` only for Facebook posts.

### Pacing
- One action every 1.5 to 2.5 s; hold each result 1 s.
- Type 60 to 90 ms per key; tap, do not hover.
- No spinners on screen over 1 s (cut them); wait on selectors, never long sleeps.
- 20 to 30 s per clip. Tour clips are 2 x 30 s.

### Post-production (ffmpeg)
1. Trim to markers; compose onto the canvas; burn captions if not drawn in-page.
2. Encode: `-c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -r 30 -movflags +faststart`.
3. Check with `ffprobe` (h264, yuv420p, faststart, 1080x1920) and keep each file under ~15 MB.
4. **Extract a frame every second and look at all of them** before shipping (a `CLAUDE.md` rule), plus a poster frame.

### Naming
`ads/footage/out/<id>-<slug>.mp4` and `<id>-<slug>.jpg` poster. Raw recordings and `out/` are git-ignored scratch; commit scripts, captions and contact sheets; send the finished files to the owner as zips plus a preview sheet.

---

## 5. Automation outline (to build after approval)

```
ads/footage/
  harness.js      launch context per profile, FAKE_NOW clock, overlays, caption(), tap(), type(), mark()
  clips/G02-order.js ... one file per clip: exports { id, profile, run(page, h) }
  render.js       ffmpeg compose, burn captions, encode, poster, contact sheet
  run.sh          sequential runner, health check, route warm-up (extends ads/devices/capture-all.sh)
```
Selectors use visible text and `aria-label` (the strings the app renders), so a rename fails loudly.

---

## 6. Compliance (every clip)

- "Demo data" on screen for all seeded content; never present the demo restaurant as a real customer.
- Offer wording, prices and free months come **verbatim** from `docs/POSTING_PLAN.md` section 3 and `src/lib/marketing.ts`. Banned: "fastest", "cheapest", "#1", "works offline".
- Never show a real restaurant's data without its written OK. Never invent testimonials or numbers; numbers shown are the demo's and are labelled.
- Do not show payment keys, the Payments panel secrets, real phone numbers, or the admin credentials. Rewards PINs shown (2468) are demo-only.
- Mention the internet requirement truthfully if a post touches on connectivity.
- One idea, one call to action per clip, one tagged link.

---

## 7. Library (what you get)

| Series | Clips | Audience |
|---|---|---|
| **G: Guest app** | G01 to G11 | diners, and owners seeing what their guests get |
| **S: Staff at the till** | S01 to S10 | owners and managers deciding on Servo |
| **M: Owner and manager** | M01 to M14 | the main recruitment series |
| **X: Platform** | X01 to X03 | partners and the owner's own use |
| **L: Landing** | L01 | everyone |
| **T: Tour and cut-downs** | T01 (2 x 30 s), T02 to T08 (15 s cut-downs) | everywhere |

Total: **47 masters**. First batch (recruitment): **S02, S03, S05, G02, G04, M01, M07, T01**.

---

## 8. Schedule

| Day | Work |
|---|---|
| 1 | Reset and dress the demo, build harness and render pipeline; shoot S02 as the pilot; review every frame |
| 2 | Till and kitchen: S02 to S07, G02, G04, G05 |
| 3 | Management: M01 to M06, M11, M12 |
| 4 | Customer app and growth: G08 to G10, M07 to M10, G06, G07 |
| 5 | Retail tenant (S08, S09), platform (X01 to X03), landing (L01), tours |
| 6 | QA, re-shoots, contact sheets, zips, `ads/README.md` update |

Any change to a screen used in a clip re-runs that clip.

---

## 9. Coverage map

| Feature | Clips | Feature | Clips |
|---|---|---|---|
| F01 | G01 | O01 | M01 |
| F02 | G02 | O02 | M02 |
| F03 | G03, S04 | O03 | M03 |
| F04 | G04 | O04 | M04 |
| F05 | G05 | O05 | M05 |
| F06 | G06 | O06 | M06 |
| F07 | G07 | O07 | M07, M08 |
| F08 | G08 | O08 | M09 |
| F09 | G09 | O09 | M10 |
| F10 | G10 | O10 | M11 |
| F11 | G11, L01 | O11 | M12 |
| P01 | S01 | O12 | M13 |
| P02 | S02 | O13 | M14 |
| P03 | S03, S04 | O14 | S09 |
| P04 | S05 | X01 | X01 |
| P05 | S06 | X02 | X02 |
| P06 | S07 | X03 | X03 |
| P07 | S08 | L01 | L01 |
| P08 | S09 | P09 | S10 |
| P10 | S01, M01 | | |

(Beats for each clip are in `CLIPS.md`.)

---

## 10. QA checklist (every master)

- [ ] Frame every second reviewed: no loader, welcome modal, empty state, console, dev banner, cut-off screen, overlapping text.
- [ ] "Demo data" chip visible; no real data; no banned claim; offer text matches `POSTING_PLAN.md` section 3.
- [ ] Captions at most 7 words, readable at phone size outdoors.
- [ ] One call to action, tagged link.
- [ ] 20 to 30 s, h264, yuv420p, faststart, under ~15 MB, 1080x1920.
- [ ] A re-run reproduces the same clip.
