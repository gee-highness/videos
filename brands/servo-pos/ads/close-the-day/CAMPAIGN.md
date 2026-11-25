# Servo POS: "Closing the day" (device story)

What happens after the doors close: sales, best sellers, stock, supplier orders, rosters and wages, all from the owner's laptop and phone.
Built from the **real 3D devices on the home page** showing the **live demo app** (Servo Demo Kitchen, demo data). Sits on top of `docs/POSTING_PLAN.md` (rules, offer ladder, tags).
**Audience:** restaurant owners and managers who do the paperwork at night.

## The sequence (post in this order)
| # | Slide | What it shows |
|---|---|---|
| 1 | Doors closed. Now what? | Hook: the live dashboard on a laptop and a phone |
| 2 | How did we do today? | Sales report |
| 3 | What sold best? | Best sellers and busy hours |
| 4 | What is running low? | Stock with low-stock flags |
| 5 | Order it from the supplier | Purchase orders |
| 6 | Who worked when? | Shifts and timesheets |
| 7 | Wages, without the spreadsheet | Payroll |
| 8 | Close the day in minutes | Call to action: the owner view on the live demo |

Every slide exists in two sizes, same filenames:
- **Facebook feed (1080x1080):** `images/`, one multi-photo post in order, or one image per day.
- **WhatsApp Status and Stories (1080x1920):** `images/status/`, one Status per slide. WhatsApp covers about the top 170 px and bottom 200 px; nothing important sits there.
- **Videos:** `video/close-the-day-facebook.mp4` (1080x1080) and `video/close-the-day-whatsapp.mp4` (1080x1920, under 30 s).

## Facebook caption (multi-photo post)
> Doors closed. Now what? 🧾
> Counting up, working out what to order, checking who worked when, wages. Here is the same evening, done from the owner's laptop and phone: sales, best sellers, low stock, supplier orders, rosters and payroll.
>
> Every screen is the real Servo POS (demo restaurant, demo data).
>
> What is the one job you wish you could skip at the end of the day? Tell us below 👇
>
> Rather chat? WhatsApp us: https://wa.me/26879342380

**Tag:** `fb-close01`. **First comment** (the link goes here, not in the caption):
> Open the owner view on the live demo, no sign-up: https://servo-pos.vercel.app/demo?ref=fb-close01
> First 5 restaurants get 6 months free, restaurants 6 to 10 get 3 months free: https://servo-pos.vercel.app/join?ref=fb-close01

## WhatsApp Status caption (add to the first Status)
> 🧾 Closing the day without the headache: sales, stock, orders, rosters and wages in 8 screens. Real app, demo data. What is the one job you would skip?

## Rules this follows
- Every slide says "demo data"; no real restaurant's data appears.
- No "fastest", "cheapest", "#1" or "works offline". Card payments and online table bookings are not promised.
- The times and order numbers in the story are the demo restaurant's, not a customer's.

## Rebuilding
Screens come from `ads/devices/` (`capture.js` photographs the home page's devices, `trim.py` crops them, `make-stories.js` composes the posts):
```bash
NODE_PATH=$(npm root) node ads/devices/capture.js http://localhost:3000   # needs the app running with the demo seeded
python3 ads/devices/trim.py
NODE_PATH=$(npm root) node ads/devices/make-stories.js close-the-day
node ads/video/make-video.js ads/close-the-day/images ads/close-the-day/video/close-the-day-facebook.mp4
node ads/video/make-video.js ads/close-the-day/images/status ads/close-the-day/video/close-the-day-whatsapp.mp4 --seconds 2.6 --first 3 --last 4
```
