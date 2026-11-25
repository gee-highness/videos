# Servo POS: "The Friday lunch rush" (device story)

One busy lunch told across the whole restaurant: the till, the guests' phones, the kitchen, the waiter and the owner, each on the device they would really use.
Built from the **real 3D devices on the home page** showing the **live demo app** (Servo Demo Kitchen, demo data). Sits on top of `docs/POSTING_PLAN.md` (rules, offer ladder, tags).
**Audience:** restaurant owners and managers who dread the lunch rush (and anyone who has waited too long for food).

## The sequence (post in this order)
| # | Slide | What it shows |
|---|---|---|
| 1 | Friday. 12:30. Every table is full. | Hook: the kitchen screen, the till tablet and a guest's phone together |
| 2 | 12:05 The till is busy | Tablet till with dishes in the cart |
| 3 | 12:20 Guests order from their phones | The restaurant's own app on two phones |
| 4 | 12:35 The kitchen fills up | Kitchen display with live tickets |
| 5 | 12:50 Ready to serve | Waiter's phone: what is ready, with the table |
| 6 | 13:30 The owner checks in | Live dashboard on a laptop and a phone |
| 7 | Same restaurant. Four screens. | Kitchen screen, laptop, tablet and phone together |
| 8 | See it on your own screen | Call to action: the live demo and the founding offer |

Every slide exists in two sizes, same filenames:
- **Facebook feed (1080x1080):** `images/`, one multi-photo post in order, or one image per day.
- **WhatsApp Status and Stories (1080x1920):** `images/status/`, one Status per slide. WhatsApp covers about the top 170 px and bottom 200 px; nothing important sits there.
- **Videos:** `video/lunch-rush-facebook.mp4` (1080x1080) and `video/lunch-rush-whatsapp.mp4` (1080x1920, under 30 s so it plays as one Status).

## Facebook caption (multi-photo post)
> Friday. 12:30. Every table is full. 🍽️
> Here is how one restaurant keeps up: the till, the guests' own phones, a kitchen screen, the waiter's phone and the owner's dashboard. Same orders, four screens, nobody shouting across the kitchen.
>
> Swipe through the lunch rush. Every screen is the real Servo POS (demo restaurant, demo data).
>
> Which part of your lunch rush hurts most: the queue, the kitchen or the wrong orders? Tell us below 👇
>
> Rather chat? WhatsApp us: https://wa.me/26879342380

**Tag:** `fb-lunch01`. **First comment** (the link goes here, not in the caption):
> Try the same demo yourself, no sign-up: https://servo-pos.vercel.app/demo?ref=fb-lunch01
> First 5 restaurants get 6 months free, restaurants 6 to 10 get 3 months free: https://servo-pos.vercel.app/join?ref=fb-lunch01

## WhatsApp Status caption (add to the first Status)
> 🍽️ The Friday lunch rush, in 8 screens. Real app, demo data. Tell me which part of your lunch rush hurts most and I will show you how it looks on Servo.

## Rules this follows
- Every slide says "demo data"; no real restaurant's data appears.
- No "fastest", "cheapest", "#1" or "works offline". Card payments and online table bookings are not promised.
- The times and order numbers in the story are the demo restaurant's, not a customer's.

## Rebuilding
Screens come from `ads/devices/` (`capture.js` photographs the home page's devices, `trim.py` crops them, `make-stories.js` composes the posts):
```bash
NODE_PATH=$(npm root) node ads/devices/capture.js http://localhost:3000   # needs the app running with the demo seeded
python3 ads/devices/trim.py
NODE_PATH=$(npm root) node ads/devices/make-stories.js lunch-rush
node ads/video/make-video.js ads/lunch-rush/images ads/lunch-rush/video/lunch-rush-facebook.mp4
node ads/video/make-video.js ads/lunch-rush/images/status ads/lunch-rush/video/lunch-rush-whatsapp.mp4 --seconds 2.6 --first 3 --last 4
```
