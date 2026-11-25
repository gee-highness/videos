# Ad campaigns

One folder per campaign. Every folder has a `CAMPAIGN.md` (goal, audience, calendar, captions, tags, rules) and an `images/` folder named `pNN-topic.png` (square 1080x1080).
Shared rules, offer ladder, tracking tags and the onboarding steps live in `docs/POSTING_PLAN.md`; do not repeat them, link to them.

| Folder | Goal | When | Status |
|---|---|---|---|
| `launch/` | Fill the 10 founding spots: awareness, demo, join | 15 to 28 Oct 2026 | Ready, 14 posts (recoloured to the warm palette) |
| `ask/` | Ask diners what their favourite restaurant's app should do: the "Imagine" post, a poll and a survey, to collect wishes and nominations | Run before or alongside `launch/` | Ready, plan + 2 posts |
| `story/` | Trust: one busy evening, three orders, start to finish (real app screens, 10 slides) | Any time after a demo `--reset` | Ready, 10 slides |
| `lunch-rush/` | Device story: one Friday lunch across till, guests' phones, kitchen, waiter and owner (real 3D devices, live demo) | Any time after a demo `--reset` | Images + videos |
| `close-the-day/` | Device story: sales, stock, supplier orders, rosters and payroll from the owner's laptop and phone | Any time | Images + videos |
| `every-screen/` | Device story: the same restaurant on phone, tablet, laptop and desktop | Any time | Images + videos |
| `one-screen/` | One-screen heroes (9, WhatsApp Status 1080x1920) + 27 s status video | Daily Status | Images + video |
| `pain-fix/` | Before/after cards (8, WhatsApp Status 1080x1920) + 24 s status video | Daily Status | Images + video |
| `app-gallery/` | The six app-builder looks (8 slides, WhatsApp Status 1080x1920) + 25 s status video | Daily Status | Images + video |
| `owner-tips/` | Owner tip cards (8, WhatsApp Status 1080x1920) + 26 s status video | Daily Status | Images + video |
| `photo-posts/` | Photo + real-screen posts (4, WhatsApp Status 1080x1920) + 14 s video; prompts for clean photos in `ads/photos/PROMPTS.md` | Daily Status | Images + video |
| `banners/` | Brush banners drawn on the owner's clean photos (6, 1080x1080) | Daily Status | Images |
| `answers/` | Objection-answer cards (8, WhatsApp Status 1080x1920) + status video | Daily Status | Images + video |
| `footage/` | Real screen-recorded clips of every Servo feature (guest app, till, kitchen, management, platform): plan and shot scripts | Any time after a demo `--reset` + `dress_demo_look.py` | Plan and scripts ready, 47 clips; nothing recorded yet |
| `spotlight/` | Social proof: real restaurants, real results, testimonials | From ~2 Nov, once 2+ restaurants have taken orders | Planned |

**What to make next:** `ads/NEXT_POSTS.md` is the plan for more pictures and videos (batches, tooling, calendar). Say "continue new posts" to start the next batch.

**Making device-story posts and videos:** follow `ads/devices/WORKFLOW.md` (local stack, `dress_demo_look.py`, capture, palettes, dynamic video style, pitfalls). `ads/devices/capture-all.sh` runs the captures; `ads/video/PLAN.md` lists further videos.

**New campaign checklist:** pick one goal and one audience; copy `spotlight/CAMPAIGN.md` as a template; give each post a tag (`fb-<short>NN`); keep claims within `docs/POSTING_PLAN.md` section 3 rules; run it only after the previous one has been reviewed (20-minute Monday review).
**Ideas queue (not planned yet):** referral push, "own app" gallery, seasonal (festive season, payday Friday), restaurant-owner tips series, paid boost test.
