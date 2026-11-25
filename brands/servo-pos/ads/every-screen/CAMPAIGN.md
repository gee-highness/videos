# Servo POS: "One restaurant, every screen" (device story)

The same restaurant on a phone, a tablet, a laptop and a big screen, so an owner sees it works on what they already have.
Built from the **real 3D devices on the home page** showing the **live demo app** (Servo Demo Kitchen, demo data). Sits on top of `docs/POSTING_PLAN.md` (rules, offer ladder, tags).
**Audience:** restaurant owners who ask "do I need special hardware?" (they do not).

## The sequence (post in this order)
| # | Slide | What it shows |
|---|---|---|
| 1 | Your restaurant fits in every pocket, counter and wall | Hook: the back of the phone and the monitor |
| 2 | In your guests' hands | Phone: the restaurant's own app |
| 3 | On the counter | Tablet till |
| 4 | In the back office | Laptop dashboard |
| 5 | On the kitchen wall | Desktop kitchen display |
| 6 | Four screens. One restaurant. | All four together |
| 7 | Try it on your screen | Call to action |

Every slide exists in two sizes, same filenames:
- **Facebook feed (1080x1080):** `images/`, one multi-photo post in order, or one image per day.
- **WhatsApp Status and Stories (1080x1920):** `images/status/`, one Status per slide. WhatsApp covers about the top 170 px and bottom 200 px; nothing important sits there.
- **Videos:** Make with `ads/video/make-video.js` (see Rebuilding).

## Facebook caption (multi-photo post)
> Do you need special hardware to run a restaurant system? No. 📱📟💻🖥️
> Servo runs in the browser: a phone in your guests' hands, a tablet on the counter, a laptop in the back office, a big screen on the kitchen wall. Same restaurant, one system.
>
> Every screen is the real Servo POS (demo restaurant, demo data).
>
> Which screen do you already have at your restaurant? Tell us below 👇
>
> Rather chat? WhatsApp us: https://wa.me/26879342380

**Tag:** `fb-screens01`. **First comment** (the link goes here, not in the caption):
> Try it on your own screen, no sign-up: https://servo-pos.vercel.app/demo?ref=fb-screens01
> The home page lets you switch between phone, tablet, laptop and desktop: https://servo-pos.vercel.app/?ref=fb-screens01

## WhatsApp Status caption (add to the first Status)
> 📱💻🖥️ No special hardware: phone, tablet, laptop or a big screen. See Servo on all four. Real app, demo data. Which screen do you already have?

## Rules this follows
- Every slide says "demo data"; no real restaurant's data appears.
- No "fastest", "cheapest", "#1" or "works offline". Card payments and online table bookings are not promised.
- The times and order numbers in the story are the demo restaurant's, not a customer's.

## Rebuilding
Screens come from `ads/devices/` (`capture.js` photographs the home page's devices, `trim.py` crops them, `make-stories.js` composes the posts):
```bash
NODE_PATH=$(npm root) node ads/devices/capture.js http://localhost:3000   # needs the app running with the demo seeded
python3 ads/devices/trim.py
NODE_PATH=$(npm root) node ads/devices/make-stories.js every-screen
node ads/video/make-video.js ads/every-screen/images ads/every-screen/video/every-screen-facebook.mp4
node ads/video/make-video.js ads/every-screen/images/status ads/every-screen/video/every-screen-whatsapp.mp4 --seconds 2.6 --first 3 --last 4
```
