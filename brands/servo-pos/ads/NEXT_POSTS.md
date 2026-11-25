# Next posts: pictures and videos that bring attention to Servo POS

**To continue this work, say "continue new posts".** Claude reads this file first (see `CLAUDE.md`), picks the next unchecked batch, builds it with the workflow in `ads/devices/WORKFLOW.md`, and ticks it off here.

Captions and hooks: use the prompts in `docs/FACEBOOK_PROMPTS.md`.

Sits on top of `docs/POSTING_PLAN.md` (offer ladder, rules, tags, channels). Everything already made is listed in `ads/README.md`. Last built: device stories `lunch-rush`, `close-the-day`, `every-screen` (images + 6 videos), plus launch/ask/story sets in the warm palette.

## 0. Goal and what "attention" means here
Goal: fill the 10 founding spots (see POSTING_PLAN section 1). Attention is measured in the order that matters: **join emails > WhatsApp chats started > link clicks > video 3-second holds > reach**. A post that gets reach but no clicks is a failed post; change the message, not the volume.

What the first batch taught us (use it):
- Most people watch **muted** and scroll fast: the first frame must carry the whole hook, copy must be on screen, no audio needed.
- WhatsApp Status is the cheapest channel we own and is tall (1080x1920, max 30 s). Facebook feed is square (1080x1080) and rewards video.
- Devices must be whole (never cropped), colours warm and varied (`ads/theme.js`), "demo data" always visible.
- Real app screens beat illustrations. The demo restaurant must look real: run `dress_demo_look.py` after every reset.

## 1. Audience and angles (unchanged, see POSTING_PLAN sections 2 and 4)
Owners and managers in Mbabane, Manzini, Matsapha, Ezulwini, Nhlangano, Siteki, Piggs Peak. Pains: cash going missing, stock-outs, not knowing what sells, rosters and wages, slow till, software cost, "will my staff manage it". Pillars A to H. Every post: one idea, one call to action, one tagged link, "demo data" when it is the demo, no "fastest/cheapest/#1/works offline".

## 2. Content formats (reusable templates, build once, fill many times)
| Format | Spec | How it is made | Use for |
|---|---|---|---|
| **Device story** (6-10 slides) | 1080x1080 + 1080x1920 images, 20-25 s video each | `capture-all.sh` -> `make-stories.js` -> `make-video.js` | a whole day/week/flow in the restaurant |
| **One-screen hero** (single image) | 1080x1080 / 1080x1350 | one device shot + big headline (new template in `make-stories.js`, `kind: "hero"`) | one feature, one number, one pain |
| **Before / after split** | 1080x1080 | left: paper/old way (illustrated card), right: Servo screen | pain-and-fix posts |
| **Numbers card** | 1080x1080 | HTML card with 1-3 big figures from the demo reports (label "demo data") | "know your numbers" posts |
| **Screen-recording clip** (10-20 s) | 1080x1920 + 1080x1080 | Playwright `recordVideo` of the local demo (tap, order, ticket appears) + captions via ffmpeg `drawtext` | the "see it work" proof, highest trust |
| **Carousel** (5-10 slides) | 1080x1080 | same slides as device story, posted as one album | Facebook/Instagram saves and shares |
| **Quote / proof card** | 1080x1080 | photo + quote, **only with written permission** | spotlight (blocked until 2 real restaurants) |
| **Poster / table-tent PDF** | A5/A4 PDF | HTML -> PDF with the demo QR | in-person visits, restaurant windows |
| **Looping teaser** | 6 s, 1080x1080, silent | 4 poses of one device (`make-video.js --loop`, needs the flag, see section 5) | ads creative, website hero |

## 3. The batches (work top to bottom; tick when built AND reviewed)

### Batch 1: "One screen, one reason" (10 single-image heroes + 3 clips) [ ] (part A done: heroes 1,2,3,5,6,7 as WhatsApp-only in `ads/one-screen`; remaining: QR, rewards, bookings, own-app, clips)
Fast, cheap, high volume: one device, one headline.
1. Till: "Cash, card, split bill. Done in four taps." (cashier tablet)
2. Kitchen screen: "No more shouting orders across the kitchen." (desktop)
3. Guest phone: "Your guests order from their own phone. No app store." (menu)
4. Table QR: "A QR on the table. The order lands in the kitchen." (QR poster + phone)
5. Stock: "Never run out of chicken on a Friday." (laptop, low-stock flags)
6. Reports: "How did we do today? Open your phone." (phone reports)
7. Payroll: "Wages without the spreadsheet." (laptop)
8. Rewards: "Points your guests actually come back for." (guest rewards screen)
9. Bookings (only add-on wording per POSTING_PLAN): "Tables booked online, no phone tag."
10. Own app: "Your name. Your colours. Your app." (warm menu, three looks side by side)
Clips (screen recordings, 15 s each): till to kitchen ticket; guest orders on phone; owner reads the day on phone.
Tags: `fb-h01`..`fb-h10`, `fb-hc1`..`fb-hc3`.

### Batch 2: "Pain and fix" before/after cards (8) [x] (WhatsApp-only, `ads/pain-fix`, made by `ads/cards.js`)
Paper pad vs till; shouting vs kitchen screen; end-of-day counting vs one report; stock notebook vs low-stock flag; WhatsApp orders vs QR orders; hand-written roster vs shifts; calculator wages vs payroll; "we think chicken sells" vs best-seller chart. Each card: one problem line, one fix line, "Try the demo" button. Tags `fb-b01`..`fb-b08`.

### Batch 3: "Your own app" gallery (6 + 2 videos) [x] (WhatsApp-only: 8 slides + 1 video in `ads/app-gallery`, `gallery.js`; install-on-phone clip still needs record-clip.js)
The app builder is the strongest differentiator. Show six looks (street, classic, fresh, night, ...) of the same restaurant by switching the design in the demo (`dress_demo_look.py` has the palette hooks), install-on-phone sequence, "publish in a minute" screen recording. Tag `fb-a01`..`fb-a06`. Standard and up only: never promise the app on Starter.

### Batch 4: Owner tips series (8 numbers cards) [x] (WhatsApp-only, text tip cards in `ads/owner-tips`, made by `ads/tips.js`)
Useful first, salesy never: 3 numbers to know every night; how to price a menu (food cost 30-35%); busiest hour = staff hour; best seller vs most profitable; table-QR poster tips; payday-Friday prep; festive-season stock list; what to ask a POS vendor. Each ends with one soft line and the demo link. Tags `fb-t01`..`fb-t08`.

### Batch 5: Answers (objection cards, 8) [x] (WhatsApp-only, `ads/answers`, made by `ads/answers.js`)
Does it work when the internet drops? (read POSTING_PLAN rule: never claim offline), Is my data safe, Can my staff learn it in a day, Can I switch from my current till, What does it cost (the offer ladder, exact), Do I need new hardware (no: phone, tablet, laptop), Do guests need to install anything (no), Who do I call (WhatsApp +268 7934 2380). Tags `fb-g01`..`fb-g08`.

### Batch 6: Seasonal and local hooks (calendar-driven, 6) [ ]
Payday Friday rush; school holidays; festive season; Reed Dance/Incwala weekend traffic (check cultural wording with a local first); month-end stock-take; Black Friday-style "founding spot" countdown. Build 2 weeks before each date. Tags `fb-s`... (spotlight uses `fb-sp`, keep them distinct).

### Batch 7: Proof (blocked) [ ]
Start only when `ads/spotlight/CAMPAIGN.md` trigger is met (2 restaurants taking real orders, written permission). Then: logo + photo + quote card, "N orders in week one" number card, 30 s testimonial from phone video (add captions, trim, brand end card), before/after of their app. Never invent testimonials or numbers.

### Batch 8: Advertising creative and website [ ]
6 s loops (per role), 15 s cut-downs of each device story (hook + 2 best slides + CTA) for paid boosts, 1.91:1 link-preview images, WhatsApp Business catalogue images, poster/table-tent PDFs with the demo QR, `/join` hero video. Paid boost test: 1 post, E100-E200, owners in 20 km radius, objective = messages; compare cost per WhatsApp chat.

## 4. Weekly production rhythm (so we always have a week in hand)
| Day | Work |
|---|---|
| Mon | 20-minute review of last week's numbers (POSTING_PLAN section 7); pick this week's batch items |
| Tue | Re-seed + dress + tick the local demo, recapture only the screens the week needs, crop-check |
| Wed | Compose slides, review every PNG, fix copy |
| Thu | Build videos, check frames, write captions + tags (copy into the batch's `CAMPAIGN.md`) |
| Fri | Schedule the next week's posts; send files to the owner; commit and merge |

Per post checklist: hook readable in the first 2 seconds muted; copy has one idea and one call to action; "demo data" visible; offer text matches the ladder exactly; no banned claims; no device cropped; contrast OK on all six palettes; file named `<batch>-NN-topic.png`; caption + tag + best time written; link tagged.

## 5. Tooling to build (small, do before the batch that needs it)
- [x] `kind: "hero"` slide in `make-stories.js` (`one-screen` story, `--status-only` flag; WhatsApp-only).
- [ ] `ads/devices/record-clip.js`: Playwright `recordVideo` of a scripted flow on the local demo (needs warmed routes, `FAKE_NOW`, `FIT`), converts to 1080x1920 + 1080x1080 with ffmpeg, burns captions from a JSON file.
- [ ] `ads/video/make-video.js --loop` (last frame fades to first) and `--captions captions.json`.
- [~] `ads/cards.js` (before/after done; numbers cards still to do): HTML card generator for numbers cards and before/after splits using `ads/theme.js` palettes (reads figures from the demo API so numbers are real demo numbers).
- [ ] Design switcher in `dress_demo_look.py` (`--design street|classic|fresh|night`) for the "six looks" gallery.
- [ ] `ads/poster.js`: HTML -> PDF poster with the demo QR (`qrcode` package).
- [ ] Optional: licensed music bed (ask the owner for a track; never fetch one).

## 6. Calendar proposal (weeks after the launch campaign; adapt to the numbers)
| Week | Facebook (5-6 posts) | WhatsApp Status (daily) |
|---|---|---|
| 1 | Batch 1 heroes 1-5, clip 1 | the same posts, tall versions |
| 2 | Batch 1 heroes 6-10, clips 2-3 | + owner-tips card |
| 3 | Batch 3 own-app gallery (6) + install clip | app gallery slides |
| 4 | Batch 2 before/after (4) + Batch 4 tips (2) | before/after in tall |
| 5 | Batch 5 answers (6) | answers, one per day |
| 6 | Batch 6 seasonal + Batch 4 tips | seasonal |
| 7+ | Batch 7 proof once unlocked; repeat best performers with new copy | repeat winners |
Rule: after 2 weeks the numbers overrule this calendar. Repeat what produced join emails, drop what did not.

## 7. Definition of done (per batch)
Images and videos built from clean local captures; every file viewed; crop check passes; captions, tags and times written in `ads/<batch>/CAMPAIGN.md`; `ads/README.md` table updated; committed, pushed, merged to main; files sent to the owner (zips + preview sheets, not 100 separate cards); this file's boxes ticked; owner told what is pending (production demo secrets, any permissions needed).

## 8. Known issues to mention each time
- CI checks fail at start-up on every PR (jobs never get a runner): needs GitHub Actions/billing settings. Merging has been done with this known.
- Production demo needs its secrets and `DEMO_REFRESH=on` plus the weekly reset; a reset there needs `dress_demo_look.py` pointed at that database.
- Local stack processes die when the container restarts: restart mongod (port 27117), the API (`servo-api/.venv/bin/python run.py`), and the web server with `NEXT_PUBLIC_DEMO_URL=http://localhost:3000`; see WORKFLOW.md section 1.

## 9. Offer numbers (fixed 22 Oct 2026)
The live site (`src/lib/marketing.ts`) says **first 5 restaurants: 6 months free; restaurants 6 to 10: 3 months free**. Older text said 3 and 4 to 10; everything in `ads/` and `docs/` was changed to match and affected images/videos rebuilt. Not rebuilt (baked or scripts need their raw captures): `ads/launch/images`, `ads/launch/interim`, `ads/ask/images`, `ads/story/images`, `ads/spotlight`: re-check those before reposting. Always read `src/lib/marketing.ts` before writing offer text.
