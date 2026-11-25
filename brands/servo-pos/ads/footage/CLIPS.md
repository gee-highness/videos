# Servo POS: shot scripts

One script per clip. Read [`PLAN.md`](./PLAN.md) first (data, environment, capture method, compliance). Routes are under `servo-pos.vercel.app` in production and `localhost:3000` locally (record locally).

**Conventions**
- `t` = seconds into the clip when the beat starts. Every clip ends with a 2 s end card and the "Demo data" chip is on throughout.
- **Caption** = on-screen line (max 7 words, plain, warm, no hype). **VO** is optional.
- "Tap X" = glide the cursor to X, then click. Quoted UI text is what the app shows today; if a label differs when recording, fix the script, not the app.
- Profiles: **Phone** 390x844 full-bleed, **Tablet** 810x1080 on the canvas, **Desktop** 1280x720 on the canvas (never crop).
- Clock: fixed to a lunch time (`FAKE_NOW`), state: freshly reset, dressed, ticked demo ("Servo Demo Kitchen", slug `servo-demo`).
- Tag on the end card: `?ref=wa-status`, plus the clip id when the owner wants per-clip stats (`wa-<id>`), consistent with `docs/POSTING_PLAN.md` section 6.

---

# Series G: the guest app (`/customer-menu/servo-demo/...`)

## G01 Scan the QR, open the menu (F01) 22 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Show a table tent with the QR (still frame from the share page, M12) | QR on a table | Scan the table QR |
| 4 | Open the signed link `/menu?shop_id=...&table_id=...&sig=...` | Menu loads, table shown | No app to download |
| 9 | (Ordering rules on) show the location check passing | "On site" state or normal menu | Checks you are really there |
| 15 | Scroll the menu | Dishes with photos and prices in E | The full menu, live |
Watch-outs: the on-site check needs location; use a test location inside the radius (Management > Ordering Rules). Show the rule only if it reads clearly.

## G02 Browse and order (F02) 30 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/menu` | Categories, dishes | Pick what you fancy |
| 4 | Tap a category chip | List narrows | |
| 8 | Open a dish | Photo, price, description | See it first |
| 11 | Add a note ("No onion please") | Note saved | Tell the kitchen |
| 15 | Add to cart, add a drink | Cart count | |
| 19 | Open the cart | Lines and total in E | Check your order |
| 23 | Choose dine-in at a table, place the order | Confirmation, order number | Sent to the kitchen |
Watch-outs: this order is the same one used in S02 to S05 and G04; keep the order id for the cuts.

## G03 Pay: cash or card (F03) 25 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | On the order page, choose how to pay | Pay options | Pay your way |
| 5 | Choose cash | "Pay at the till" note | Cash at the till |
| 10 | (Test-key tenant only) choose card | Hosted checkout page of the restaurant's gateway | Card, paid straight to the restaurant |
| 18 | Return to `/payment/success` | Success page | Done |
Watch-outs: card beat only with a test key; never show real card numbers; if no test key, skip the card beat and use the "How card payment works" panel from the till (S04). Do not say Servo holds the money.

## G04 Track the order live (F04) 28 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/track/<orderId>` after ordering | Status, "ready in about N minutes" | Know when it's ready |
| 6 | Split screen cut: kitchen marks the order ready (S05) | | The kitchen taps ready |
| 14 | Track page updates | Ready state, buzz and banner | It tells you |
| 20 | Tap "Tell me when it's ready" | Permission prompt or confirmation | Even with the page closed |
Watch-outs: web push needs VAPID and a real device; on the headless run show the page buzz and title change only.

## G05 Rate your meal (F05) 22 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Track page after ready | Rating prompt | How was it? |
| 4 | Tap 5 stars | Thank-you and Google review invite | Happy? Tell Google |
| 12 | Second take: 2 stars | Private feedback box | Not happy? Tell the manager |
| 18 | Cut to the manager's Feedback tab (M09) | The private note | The manager sees it first |
Watch-outs: use the demo only; do not show real review links.

## G06 Rewards card and vouchers (F06) 30 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Tap "My rewards" | `/rewards` | A card in your pocket |
| 4 | Create a card: name, phone `7600 0001`, PIN | Card created | Your name, phone, PIN |
| 12 | Show points and progress to the next reward | Progress bar | Earn on every order |
| 18 | Claim a reward | A 6-character voucher code | Claim a voucher |
| 25 | Cut to the till redeeming the code (M09) | Name and last 3 digits shown | Staff check it is you |
Watch-outs: demo PIN 2468 and demo phones only.

## G07 The usual and order again (F07) 20 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/menu` as a signed-in member | "The usual?" with top dishes | Your usual, one tap |
| 6 | Tap it | Dishes in the cart | |
| 12 | Open the cart | Today's prices | Always today's price |

## G08 The restaurant's own app (F08) 35 s, Phone then iPhone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Menu page install prompt "Add this restaurant to your phone" | Prompt | Their own app |
| 6 | Android: install (real phone recording) | Icon on home screen with the restaurant logo | Their icon, their colours |
| 16 | iPhone: `/install-ios` or the Share steps | Steps | iPhone: Share, Add to Home Screen |
| 24 | Open from the icon | Opens the restaurant's menu full screen | Opens like a real app |
Watch-outs: Standard and up only; the Android prompt must be filmed on a real phone.

## G09 Branded home and pages (F09) 30 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/home` | Welcome banner, open now, quick buttons | Their own home screen |
| 7 | Scroll featured dishes and photos | Sections | |
| 13 | Open "Our story" `/page/our-story` | Page | Their story |
| 18 | Open Allergens and Find us | Pages | Allergens and directions |
| 25 | Open What's on | Specials and events | What's on today |

## G10 Book a table (F10) 30 s, Phone (add-on tenant)
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/book` | Date and party size | Book a table |
| 6 | Choose a date, party of 4, a time | Available slots only | Only real free times |
| 14 | Enter name and phone, confirm | Confirmation, link `/booking/<token>` | Booked |
| 21 | Open the link, tap cancel or change | Manage page | Change your mind? One tap |
| 26 | Full slot: join the waitlist | `/waitlist/<token>` | Full? Join the waitlist |
Watch-outs: show only when the audience asked about bookings (posting plan); say it is an add-on.

## G11 Discover and share (F11) 22 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/discover` | Restaurants list | Find a restaurant |
| 8 | Open a restaurant's `/share` page | Share card, QR | Share it with friends |
| 15 | Open `/app-gallery` | Six app looks | Six looks to start from |

---

# Series S: staff at the till

## S01 Sign in by role (P01, P10) 22 s, Desktop
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/demo` | Four role buttons | Try it, no sign-up |
| 5 | Tap Manager | Dashboard loads | Manager |
| 10 | Back, tap Cashier | Till | Cashier |
| 15 | Back, Kitchen then Waiter quick cuts | Screens | Kitchen, waiter |
Watch-outs: the only clip that shows the sign-in loader; warm it first locally. Public demo credentials only.

## S02 Take a dine-in order (P02) 30 s, Tablet
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/pos/cashier` | Menu grid, "Current Order" | Fast, simple till |
| 4 | Tap "Select Table", choose table 4 | Table set | Pick the table |
| 8 | Tap a category, then sort by popularity | Re-ordered grid | Best sellers first |
| 12 | Add 2 dishes and a drink | Lines and subtotal | Tap to add |
| 18 | Add the note "No onion please" | Note on the line | Notes for the kitchen |
| 23 | "Clear Cart" then rebuild one item | Cart clears | Fix mistakes fast |
| 27 | Send the order | Order placed | Sent to the kitchen |

## S03 Take cash, tip and rewards (P03) 28 s, Tablet
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open the unpaid order, tap pay | Payment modal | Take payment |
| 4 | Choose Cash, enter the amount tendered | Change shown | Change worked out |
| 11 | Enter the guest's phone `7600 0001` | Rewards linked | Points added |
| 16 | "Record tip" 10 | Tip saved (not in the bill) | Record the tip |
| 22 | Confirm | Receipt view | Paid |
Watch-outs: tips are cash only and are not part of revenue or VAT; say nothing about card tips.

## S04 Card payment and split the bill (P03) 28 s, Tablet
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open the payment modal, choose "Card / Online" | QR or link panel | Card, online |
| 6 | Tap "How card payment works" | Explanation | Paid to the restaurant |
| 12 | Tap "Split the bill", set 3 people | Each share to the cent | Split the bill |
| 20 | Show the leftover-cents rule | Last people take any leftover cents | Fair to the cent |
Watch-outs: the till still records one payment; do not call it split payments. Card beat needs a test key.

## S05 Kitchen screen (P04) 28 s, Desktop
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/pos/kitchen` | Columns PENDING STOCK, PREPARING, READY with timers | See every ticket |
| 5 | Tap to start items on the new ticket | Moves to PREPARING | Start cooking |
| 11 | Mark items done | Progress | Tick as you go |
| 17 | "Mark All Items Complete" | Moves to READY | All done |
| 22 | Show an "Awaiting stock" ticket and "Check stock again" | Stock warning | It tells you if stock is short |

## S06 Waiter serves (P05) 22 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/pos/server` | Ready orders list | Ready to serve |
| 5 | Note the Urgent and Large Orders chips | Chips | Urgent first |
| 10 | Tap serve on one | Order leaves the list | Served |
Watch-outs: the demo must have READY orders (mark two preparing orders ready after the tick), or the view says "No Orders Ready".

## S07 Edit, cancel, refund and return (P06) 28 s, Tablet
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open an order, edit a line | Edit dialog | Change an order |
| 7 | Cancel another | Confirmation | Cancel if needed |
| 12 | Refund dialog: reason, confirm | Toast "Refund recorded" | Refunds with a reason |
| 19 | Return dialog (retail tenant): reason "Faulty" | Toast "Return recorded" | Returns too |
| 25 | Cut to the Activity Log (M13) | Entries for each action | Everything is logged |

## S08 Clock in at the kiosk (P07) 22 s, Tablet
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/pos/clock-in` | "Search for your name" | Staff clock in here |
| 5 | Type the demo name, select | Employee found | Find your name |
| 10 | Clock in | Confirmation with time | Clocked in |
| 16 | Cut to Timesheets (M05) | Hours recorded | Hours tracked for you |

## S09 Retail: scan, variants, batches, import (P08, O14) 35 s, Tablet (retail demo tenant)
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open the till, tap Scan barcode | "Scan barcode" modal | Scan to sell |
| 6 | Scan a test barcode (typed) | Product added | |
| 11 | Pick a size or colour variant | Variant choice | Sizes and colours |
| 17 | Management > Inventory: show a batch with expiry | Batch and date | Track expiry |
| 24 | Management > Import Products: upload a CSV | Preview and import | Import from a CSV |
Watch-outs: needs the retail tenant in the seed; the camera scanner is not filmable headless, type the code.

## S10 Receipts and printer (P09) 22 s, Tablet
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | After payment, open the receipt | Customer receipt | A proper receipt |
| 7 | Open Printer settings | Printer options | Connect your printer |
| 14 | Print the QR codes from Share Card (M12) | Table tent preview | Print your table QR |
Watch-outs: the OS print dialog is not recorded; show the in-app preview. No offline claims.

---

# Series M: owner and manager (Desktop)

## M01 Live analytics (O01) 28 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/pos/management/analytics` | Sales today, orders, average ticket | Know your day |
| 7 | Show best sellers and trend | Charts | Best sellers |
| 14 | Change the period | Numbers update | Any period |
| 21 | Open `/pos/dashboard` | Manager dashboard | Your home screen |
Watch-outs: demo numbers only, labelled.

## M02 Reports (O02) 26 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/reports` | Report types | Sales reports |
| 6 | Run the financial report for the week | "Report Generated" and results | Run it in a tap |
| 14 | Filter by employee | Filtered numbers | Per person |
| 20 | Export or print | Download or preview | Share with your accountant |

## M03 Menu management (O03) 28 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Foods | Menu list | Your menu |
| 5 | Add a dish: name, price, category, photo | Form | Add a dish |
| 15 | Save and show it on the guest menu | Appears | Live for guests |
| 21 | Open Food Categories, reorder one | Categories | Organise it |

## M04 Stock, suppliers, purchase orders (O04) 35 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Inventory Products with a low-stock item | Reorder level flag | Know what's low |
| 7 | Import Products from a CSV | Preview | Add many at once |
| 14 | Suppliers list | Supplier | Your suppliers |
| 19 | New Purchase Order from the low item | PO lines | Order stock |
| 28 | Receive the order | Stock goes up | Stock updates itself |

## M05 People: staff, shifts, timesheets, payroll (O05) 35 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Employees: add one with a role | Role list | Staff and roles |
| 8 | Shifts: schedule a shift | Roster | Roster in minutes |
| 16 | Timesheets | Clock-in hours | Hours, no guessing |
| 24 | Payroll (Multi-branch) | Period summary | Payroll |
Watch-outs: Payroll is Multi-branch only; say so on screen or skip.

## M06 Tables, stores, ordering rules (O06) 28 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Tables: add table 12 | Layout | Your floor |
| 8 | Stores: show the store location | Store | Your locations |
| 14 | Ordering Rules: switch on, set the radius | Radius and "trusted guests" | Scan to order, on site |
| 22 | Show the QR for a table | Signed QR | One QR per table |

## M07 Your own app: look and brand (O07) 30 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Management > Your customer app | Builder with phone preview | Design your own app |
| 5 | Tap each of the six looks | Preview changes | Six looks |
| 13 | Change the colours; show the readability check | Contrast message | Readable colours |
| 20 | Brand: name, tagline, logo, icon | Preview updates | Your name and logo |
| 26 | Save | Toast | Live for guests |
Watch-outs: Standard and up only (not Starter).

## M08 Your own app: home, tabs, pages (O07) 30 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Tabs: reorder and rename | Tab bar updates | Your tabs |
| 8 | Home: add sections (featured dishes, hours, reviews) | Sections stack | Build your home |
| 17 | Pages: add an FAQ and a custom page | Pages list | Add your pages |
| 25 | Open the result on the guest app | The finished home | Live on their phone |

## M09 Rewards, feedback, posts (O08) 32 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Customer Rewards > Settings | Programme name, points word | Your own rewards |
| 7 | Add a reward and a bonus-points day | Rule saved | Double points Tuesday |
| 15 | Posts tab: write a special | Post | Post a special |
| 21 | Feedback tab: a low rating | Private note and a way to follow up | Hear it first |
| 27 | Enter a voucher code | Redeemed once | Redeem a voucher |

## M10 Online bookings (O09) 30 s (add-on tenant)
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Online Bookings: today's floor | Tables and bookings | Today's tables |
| 7 | Booking rules | Rules | Your rules |
| 14 | Waitlist entry, offer a table | Waitlist | Waitlist |
| 21 | "Seat at table" | Booking seated | Seat them |
Watch-outs: bookings are an add-on (Standard +E 250, Multi-branch +E 300 per `docs/DEMO.md`); show only when asked, say add-on, read the live price first.

## M11 Know your guests (O10) 30 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Know Your Guests | Dashboard: new vs returning, repeat rate | Know your guests |
| 8 | Guest groups | Regulars, VIPs, 30 days away | Groups |
| 16 | New offer to a group with a voucher | Offer form | Send an offer |
| 24 | Show that only opted-in guests get it | Opt-in note | Only to guests who said yes |

## M12 Share card, QR, table tent (O11) 22 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Share Card and QR | Public link and QR | Your link and QR |
| 7 | Table tent preview | Printable tent | Print for every table |
| 14 | Copy the link | Toast | Share it anywhere |

## M13 Activity log (O12) 22 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Activity Log | Entries: cancelled, returned, discounted | Who did what |
| 8 | Filter by person | Filtered | Filter by staff |
| 15 | Open an entry | Details with time | Every change is recorded |

## M14 Refer a restaurant (O13) 20 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Refer a Restaurant | Your code (for example `SV-K7QM2`) | Your own code |
| 7 | Copy the link `/join?code=...` | Toast | Send it to a friend |
| 13 | Show the rule: 2 free months per approved referral | Rule text | Earn free months |
Watch-outs: read the rule on the page and `docs/POSTING_PLAN.md` section 5 first; code shown is demo.

---

# Series X: platform admin (Desktop, admin site)

## X01 Create a restaurant (X01) 30 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/admin/tenants`, tap Create Tenant | Form | Add a restaurant |
| 8 | Fill name, country, plan; leave "Count in the founding program" ticked | Form | Founding spot |
| 17 | Payments panel: save a test key, run "Test key" | Test result | Card payments, per restaurant |
| 25 | Save | Tenant appears | Ready in minutes |

## X02 Founding program, plans, add-ons (X02) 28 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open Founding Program | Spots board, free until dates | Track every spot |
| 9 | Copy status line | "X of 10 spots left" | One-tap status |
| 15 | Plans and Prices | Starter, Standard, Multi-branch | Plans in one place |
| 22 | Booking add-ons | Add-on prices | Add-ons |
Watch-outs: numbers are from the demo; the status line is the exact text for posts.

## X03 Analytics, reports, users, settings (X03) 24 s
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Platform analytics | Orders and restaurants | The whole platform |
| 8 | Reports | Report list | Reports |
| 14 | Users | Users and roles | Users |
| 19 | Settings | Settings | Settings |
Watch-outs: never show real admin credentials or real restaurants.

---

# L01 The landing page (L01) 28 s, Phone
| t | Action | On screen | Caption |
|---|---|---|---|
| 0 | Open `/` | Hero line, pricing | Run your restaurant from one screen |
| 7 | Scroll to pricing | Starter E350, Standard E750, Multi-branch E1,200 | Simple prices, in E |
| 14 | Tap the demo button | `/demo` | Try it free |
| 21 | Open `/join` | Join section | Send your name and email |
Watch-outs: offer text exactly as `docs/POSTING_PLAN.md` section 3; re-read live prices in Admin > Plans & Prices first.

---

# Series T: tours and cut-downs

## T01 The tour (2 x 30 s, for Status)
- **Part 1 "Guest to kitchen":** G02 (6 s) → G04 (5 s) → S02 (6 s) → S05 (6 s) → S06 (4 s) → end card.
- **Part 2 "Run the business":** M01 (6 s) → M04 (5 s) → M07 (7 s) → M09 (6 s) → end card.

## Cut-downs (15 s, loopable)
| ID | Headline | Built from |
|---|---|---|
| T02 | Scan, order, done | G01 + G02 |
| T03 | Till to kitchen in 30 seconds | S02 + S05 |
| T04 | Know when it's ready | G04 |
| T05 | Your restaurant, your own app | M07 + G08 |
| T06 | Never run out on Friday | M04 low-stock beat |
| T07 | Rewards you set | M09 + G06 |
| T08 | See your day at a glance | M01 |

---

# Retake and regression
- Each clip file stores the git SHA and capture date in a sidecar JSON. A clip is stale when a page it uses changes.
- After any UI change to a page in a clip, re-run that clip, extract a frame per second and review.
- Keep one failing-frame screenshot per run for diagnosing drift.
- Record the actual fake clock used (`FAKE_NOW`) in the sidecar so a re-run reproduces ticket ages.
