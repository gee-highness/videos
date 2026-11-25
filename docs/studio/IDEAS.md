# Video plans: Venda Khona and Servo POS

Written 17 Nov 2026 from the research in `MARKET.md`. Everything follows the humour and truth rules in the skill (`.claude/skills/cartoon-studio/references/writing.md`). Status of each item lives in the table at the end of this file.

## 1. The channel idea
One cartoon world, **"Small Business News"**, where every small business in Southern Africa has the same bad day: Nomsa reads it as breaking news, deadpan, then the good news. Two "sponsors" live in that world: **Venda Khona** (sellers, green) and **Servo** (restaurants, purple). Recurring characters make people come back: Thandi (cakes), Mr Gama (repairs, and the goat), Zanele (braids), Mr Zwane (spaza and the exercise book), Chef Musa and Lindiwe (Musa's Grill), Nomsa (the anchor), and **the goat**, who appears in the background of other episodes as an easter egg.

**YouTube channel:** "Small Business News" (working name). Shorts daily, a compilation every two weeks, one explainer a month. The same files go to Facebook Reels, TikTok and WhatsApp Status.

## 2. Formats
| Format | Length | Shape | Use |
|---|---|---|---|
| **Episode** | 45 to 70 s | Hook, escalate, news desk, the app, any device, callback, end card | Facebook Reels, YouTube Shorts, WhatsApp (90 s Status) |
| **Cut-down** | 14 to 18 s | The funniest lines of an episode plus the end card (`cutdowns.cjs`) | WhatsApp Status, TikTok, repeat posts |
| **Original short** | 12 to 18 s | 2 to 4 lines: a joke and one product fact, end card | Daily posting |
| **Compilation** | 8 to 10 min, landscape | 8 episodes with title cards (`compile.cjs`) | YouTube long-form, watch hours |
| **Explainer** | 2 to 4 min | Nomsa explains one thing step by step ("How to open your shop in 3 minutes") | YouTube, Facebook, sales follow-up |
| **Poster** | still | Best frame plus headline and QR | WhatsApp, Facebook, print |

## 3. Art styles per series (`lib.js` STYLES)
- **Ink** (default): the main episodes.
- **Chalk**: explainers and "Kasi Business School" tips (a teacher at a blackboard).
- **Neon**: night-time stories (2 AM orders, the late shift, Friday night rush), festive season.
- **Cut paper**: stokvel and family stories, heritage month, gentle and warm.
- **Hand-painted sign**: township and street-business series ("Sign of the Times"), bold and loud, very local.
New styles to build next (in the skill's style list): comic halftone, watercolour wash, linocut/woodcut, pixel art for a gaming-style series, blueprint for "how it works".

## 4. Series catalogue (ideas to draw from)
**A. Small Business News** (episodes; 16 made). Next ideas: VK "The deposit" (customer pays a deposit by voice note promise), VK "The cousin discount" (every customer is a cousin), VK "Delivery to 'next to the church'", SV "The birthday party of 40 who all ordered separately", SV "The power is fine but the waiter is not", SV "Payday Friday" (the rush on the 25th).

**B. Customer Bingo** (15 s originals): one recognisable customer type each: the "Hi" sender, the 7-minute voice note, the "last price?" negotiator, the "send more pictures" collector, the "I'll pay month-end" promiser, the 6 AM Sunday "are you open?". Each ends with the app feature that answers them.

**C. Nomsa's Forecast** (15 s, neon or ink): a weather report for business. "Today: a lunch rush at twelve, with a strong chance of chips." "Month-end: heavy spending in the afternoon, clearing by Tuesday."

**D. Ask Gogo** (30 s, cut paper): a wise grandmother answers business questions with proverbs and then points at the app. (Proverb lines checked by a native speaker before use.)

**E. Kasi Business School** (60 s to 3 min, chalk): one useful lesson per video, no hard sell: pricing a cake, writing a good product photo caption, why a kitchen screen beats shouting, three numbers every restaurant should know. The product appears as the tool, not the topic.

**F. The Goat** (15 s, any style): the goat's own adventures. He opens a grass shop, leaves a review, is the delivery address. A mascot people share.

**G. Before / After** (15 s, split screen): left the chaos, right the app. "Order slip vs kitchen screen", "Exercise book vs reports", "WhatsApp group vs shop app".

**H. Country specials** (only once each app serves that country; see `MARKET.md` section 7): the same jokes with local prices and places: pula in Gaborone, N$ in Windhoek, kwacha in Lusaka, meticais in Maputo (Portuguese voices), maloti in Maseru, rand in Soweto.

**I. Seasonal** : month-end (25th), long January, Black Friday, festive season orders, Umhlanga week, Heritage Day braai rush (Servo), Valentine's cakes (Venda Khona).

## 5. Batch 3: 24 original 15-second shorts (scripts ready; voices in `scripts/toons/termux-batch3.sh`)
Voices: N Ryan (narrator), A Emma (Nomsa), M Andrew (men), L Ava (women). Each ends on the short end line.

### Venda Khona (green; end line: "Your own shop app. Free. Venda Khona.")
| # | Title | Style | Lines | Picture |
|---|---|---|---|---|
| VKS01 | The seven-minute voice note | ink | N: He asked one question. She replied with a seven-minute voice note. / M: I just wanted to know if you have size nine. / N: In her shop app, sizes, prices and pictures are all there. He just taps. | A voice-note bar that keeps growing off the screen; him falling asleep; then the app with sizes |
| VKS02 | Customer is typing | ink | N: Customer is typing. / N: Still typing. / M: Hi. / N: With her own shop app, the answer was already there. Prices, pictures, an order button. | The "typing…" dots grow, a clock spins, one tiny "Hi" arrives |
| VKS03 | Last price | signpaint | M: Is this your last price? / L: It's my only price. / N: Put your prices in your own shop app. Fewer debates, more orders. | Market stall, bold sign-writer price board |
| VKS04 | Send more pictures | ink | M: Send more pictures. / N: She sent twelve. He wanted thirteen. / N: In her shop app, every picture and price waits in one place. Customers look as long as they like. | Photos flying out of her phone like cards |
| VKS05 | Month-end | cutout | M: I'll pay month-end. / L: Which month? / N: Orders in her shop app show who ordered what, and when. | Calendar pages flipping, the customer getting older |
| VKS06 | Are you open? | neon | M: Are you open? / N: Sunday. Six in the morning. / N: Her hours are in her shop app. Her phone gets to sleep in. | Her phone in pyjamas with a sleep mask |
| VKS07 | The uncle | ink | N: She posted her new cakes on her status. Her uncle saw it. / M: Nice. Bring one on Sunday. / N: In her shop app, customers follow her shop and see new posts. And they pay. | The uncle with a fork, waiting |
| VKS08 | The fridge code | ink | N: Mr Gama fixes fridges. So he puts his code on every fridge he fixes. / M: Next time it breaks, they scan the fridge. / N: One scan, and his shop is on their phone. | A QR sticker on a fridge door; the customer scanning the fridge |
| VKS09 | The nephew returns | ink | M: Auntie, I made you a website. / L: I have an app. I made it while the rice was cooking. / N: Opening a shop on Venda Khona takes minutes. And it's free. | The nephew with a laptop; Thandi stirring a pot, holding her phone |
| VKS10 | The goat opens a shop | signpaint | A: Breaking news. The goat has opened a shop. / A: He sells grass. Prices in the app. No fees, no commission. / N: If the goat can do it... | The goat behind a counter with a sign-painted "GRASS" board |
| VKS11 | Peace in the chair | cutout | L: Ten o'clock? / N: Not any more. Clients pick a time in her app, and she confirms with one tap. / L: My chair is finally at peace. | Zanele's chair with a tiny halo |
| VKS12 | Where are you exactly? | ink | L: Where are you exactly? / M: Look at the map in my app. The goat is no longer involved. / N: A map, his hours and a code to scan. In his own shop app. | The goat shrugging in the background |

### Servo (purple; end line: "Servo. Try the live demo.")
| # | Title | Style | Lines | Picture |
|---|---|---|---|---|
| SVS01 | Who wrote this? | ink | M: Who wrote this order? / L: You did, Chef. / N: With Servo, orders go from the till to a kitchen screen. Typed, not guessed. | Musa squinting at his own handwriting |
| SVS02 | Seven ways | ink | L: Table four wants to split the bill. Seven ways. / M: Seven? / N: Servo splits the bill at the till in a few taps. | Seven hands holding seven cards |
| SVS03 | Taxi | signpaint | M: Why are you late? / L: Taxi. / N: Servo's clock-in screen records the hours. The taxi stories continue. | A comically long taxi queue sign |
| SVS04 | Do I get points? | cutout | L: Do I get points? / M: You get my respect. / N: On the Standard plan and up, guests collect points in your own restaurant app. You set the rewards. | A points card with five stamps |
| SVS05 | Seventeen tomatoes | chalk | N: Friday. Ten minutes to closing. Time to count the stock. / M: Seventeen tomatoes. One is pretending to be an onion. / N: Servo keeps your stock levels and flags what's running low. | A suspicious tomato in a line of onions |
| SVS06 | The angry table | ink | L: Two kotas for... which table? / M: The one that's angry. / N: With Servo, every order carries its table number from the till to the kitchen. | One table glowing red with steam |
| SVS07 | Not your feelings | ink | N: Which dish sells the most? / M: The chicken. Definitely the chicken. Or the chips. / N: Servo shows your best sellers. Not your feelings. | Musa's thought bubble arguing with itself |
| SVS08 | Stop shouting | neon | M: Table three! Two burgers! / L: Chef. They can see the screen. / N: The kitchen screen shows every order, so the kitchen can stop shouting. | Musa with a megaphone; a calm screen |
| SVS09 | Four seconds | ink | N: Lindiwe has nine tables and two hands. / N: So guests scan the code on the table, pick, and send. / L: I sat down. For four seconds. | Lindiwe in a chair, timer over her head |
| SVS10 | Nomsa's forecast | neon | A: Today's forecast: a lunch rush at twelve, with a strong chance of chips. / A: Servo owners are advised to check their stock screen at ten. | Nomsa in front of a weather map made of chips |
| SVS11 | Ten spots | ink | A: Ten founding spots. The first five restaurants get six months free. / A: Restaurants six to ten get three months free. After the first ten, a short free period may apply. | Ten chairs, five lit (offer wording as in POSTING_PLAN section 3) |
| SVS12 | Not checking | cutout | M: I'm on holiday. I'm not checking sales. / N: He checked sales. / M: Fine. It's busy. Another drink, please. | The beach, the phone peeking out of the sand |

Truth notes: split the bill (Servo clip S04), clock-in and timesheets (S08, M05), points set by the owner on Standard and up (M09), stock levels, receiving and low-stock flags (M04), best sellers (M01), table numbers on kitchen tickets (S02, S05), table QR ordering (G01 to G03). Venda Khona: listings with photos and prices, order button, follow and posts (A06, B12), hours and map (B06, A05), bookings confirmed in one tap (B10), opening a shop in minutes and choosing a look (B01, S03, S04).

## 6. Next long-form for YouTube
1. **"Small Business News, Season 1"**: VK01 to VK08 (about 8 min) and SV01 to SV08 (about 8 min) as two landscape compilations with title cards (`compile.cjs`). Ready to make from existing files.
2. **"How to open your shop app in three minutes"** (explainer, chalk, 3 min): Nomsa walks through it with real screens (use the real-footage pipeline in `scripts/footage/`).
3. **"Three numbers every restaurant owner should know"** (Kasi Business School, chalk, 3 min).
4. **"The goat: a documentary"** (2 min, all of the goat's scenes, nature-documentary narration): pure entertainment, builds the channel.

## 7. Four-week posting rhythm (both brands)
- **Daily:** one short (cut-down or original), alternating brands, WhatsApp Status plus Facebook Reels plus TikTok plus YouTube Shorts.
- **Twice a week:** a full episode on Facebook and YouTube.
- **Every second week:** a compilation on YouTube; a poster on WhatsApp.
- **Best times** (from the Servo posting plan): 06:30 to 07:30, 15:00 to 16:30, 20:30 to 21:45, Sunday 17:00 to 19:00. Avoid restaurant rush hours for Servo posts.
- Track every post's link tag (`vk-n04`, `sv-s01`, ...) and write results into the skill's `feedback.md`; after two weeks, make more of what worked.

## 8. Status
| Item | State |
|---|---|
| 16 episodes (VK01 to VK08, SV01 to SV08) | Done |
| 16 cut-downs (15 s) | Done 17 Nov 2026 (`cuts.json`, `cutdowns.cjs`) |
| Style samples: VK01 neon, VK05 hand-painted sign, SV03 chalk, SV07 cut paper (full episodes and 15 s) | Done 17 Nov 2026 |
| 24 original shorts (section 5) | Scripts and voice script ready; waiting for the voice zip |
| Season 1 compilations | Done 17 Nov 2026: "The Shops" (8 min 18 s) and "The Restaurants" (7 min 48 s), landscape, with thumbnails |
| Country specials | Waiting until the apps serve those countries |
