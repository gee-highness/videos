# "Imagine your favourite restaurant on Servo": the post (ready to publish)

One idea, one picture, one ask. Image: `images/p01-imagine.png`. The follow-up poll image is `images/p02-poll.png` (post it 24 hours later, see `CAMPAIGN.md`).
Tag every link `?ref=fb-ask01`. WhatsApp line (add to every caption): **"Rather chat? WhatsApp us: https://wa.me/26879342380"**

## Facebook caption (main post)

> Picture your favourite restaurant. The one where you always order the same thing. 🍽️
>
> Now imagine it had its own app. You could:
> 📱 order ahead from your phone and skip the queue
> 🧾 watch your order being made, no more "is it ready yet?"
> ⭐ earn rewards every time you eat there
> 🪑 get a table, or join the waitlist, without calling
>
> We build Servo POS for restaurants in Eswatini, and we want to build the things *you* would actually use.
>
> 👇 Tell us two things in the comments:
> 1️⃣ Which restaurant would you love to see this at?
> 2️⃣ What is the ONE thing you would want its app to do?
>
> We read every comment. We may tell the restaurant people are asking (never your name).
>
> Rather chat? WhatsApp us: https://wa.me/26879342380

**First comment (the link goes here, not in the caption):**
> Want to see what a restaurant's app looks like? Try the live demo, no sign-up: https://servo-pos.vercel.app/demo?ref=fb-ask01
> (Demo restaurant, demo data. Nothing here is a real order.)

**Reply script for the first hour** (answer every comment; a question back doubles the thread):
- Names a restaurant: "Great choice! What do you usually order there? And what would you want its app to do first?"
- Names a feature: "Noted! Would you use that every visit, or only on special occasions?"
- Asks "is this a real app?": "Yes, it is real and running. Open the demo link in the first comment and place an order yourself."
- Asks about a feature we do not have: "Good idea, I have added it to our list." (never promise a date; table bookings are *coming soon*, say exactly that)
- Skeptical ("my restaurant will never do this"): "Fair! What would make them say yes? Slow service, cost, staff training?"

## Poll follow-up (post 24 hours later, image `p02-poll.png`)

> Your favourite restaurant has its own app. What do you use FIRST?
> 1 Order ahead and skip the queue
> 2 Track my order live
> 3 Earn points and rewards
> 4 Book a table or join the waitlist
> 5 See the full menu with pictures
> 6 Something else (tell us!)
>
> Comment a number. Two if you can't choose. We will share the results on Friday. 📊
>
> Rather chat? WhatsApp us: https://wa.me/26879342380

## WhatsApp Status / Stories images (1080x1920)
`images/status/p01-imagine.png` (the "Imagine" post) and `images/status/p02-poll.png` (the poll). Pair each with the short text below as the Status caption. Rebuild with `NODE_PATH=$(npm root) node ads/ask/make-status.js`.

## WhatsApp Status / group version (short)

> 🍽️ Quick question. Picture your favourite restaurant with its own app: order ahead, track your order, earn rewards.
> Which restaurant would you love to see it at? And what is the ONE thing it should do?
> Reply here, I read every message. 🙏

## Facebook group version (no link, groups throttle links)

> Foodies of Mbabane/Manzini: if your favourite restaurant had its own app, what is the ONE thing you would want it to do? Order ahead? Rewards? Tracking your order? Tell me the restaurant too. I am collecting ideas for a project and I read every reply.

## Alt text for the image
"A phone and a tablet showing a restaurant app, with the words: Imagine your favourite restaurant on this. Order ahead, watch your order being made, earn rewards every visit."

## Rules this follows
- Says it is a demo wherever screens appear; no real restaurant's data.
- No "fastest", "cheapest", "#1", "works offline". Card payments and bookings are not promised (bookings are coming soon).
- Asks for a restaurant name and a wish, never a phone number or any private detail in public comments.
