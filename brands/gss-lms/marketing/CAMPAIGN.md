# GSS-LMS launch campaign: "See it for yourself"

Written 23 Nov 2026. Same method as the Servo and Venda Khona plans (one idea per post, a tagged link, honest claims, numbers from the console, not likes), pointed at one goal.

## 1. The goal: people open the demo

Schools buy what they trust. So the campaign has **one call to action for everyone**: *open the live demo*. It is a whole school with made-up data, free, no sign-up, and every picture in the campaign is a **real screen from that demo**, so what people see in a post is what they find when they tap.

**Who we talk to, in this order of influence:**
| Group | What they care about | What we show (real screen) | Demo opens as |
|---|---|---|---|
| **School leaders** (principals, owners, bursars) | Fees collected, results, timetables, exams, reports | Dashboard, fees, early-help list, timetable, exams, reports, classes | Principal (administrator) |
| **Teachers** | Less paperwork: register, marks, planning, tests | Phone register, gradebook, lesson plans, question bank, dashboard | Teacher |
| **Parents and guardians** | How is my child doing, fees, homework, forms | Guardian dashboard, Pay now, forms and meetings, homework | Guardian |
| **Learners** | Homework, exams, marks | Learner dashboard, this week, exam slip, grades | Learner |
| **Everyone** | "Can I trust it? Can I try it?" | Role picker, "one school, four people" | The role picker |

**Learners are under 18.** We never target them directly or with paid ads. Their slides go out on the school's and teachers' channels and in the parent group, and are written so a parent or teacher can forward them.

## 2. Message

**One line:** *One school system for the principal, the teacher, the parent and the learner. See it for yourself: the demo is free, with no sign-up.*

**Proof we really have (use these, in this wording):**
- A live demo anyone can open, as a principal, teacher, parent or learner (say "demo data").
- A 30-day free trial for a school, no payment.
- Prices on the website: Starter SZL 4,000, Standard SZL 5,000, Premium SZL 6,000 a month, plus a one-time SZL 5,000 setup.
- A referral reward that exists in the billing system: a school that refers another school gets **20% off its monthly fee for each referred school that pays**, up to 60%, for 12 months each.
- Resellers (people who bring schools) earn a commission set in the console.

**Never say:** "works offline" (say "works on weak connections; pages you opened before still open"), "fastest", "cheapest", "#1", any number of schools or users, or any testimonial, until it is true and in writing. Never show a real school's data. Do not promise email or WhatsApp notices from the platform until those services are connected (see section 8).

## 3. The pieces (all made, in `marketing/out/`)

| Piece | What | Files |
|---|---|---|
| **Pictures** | 5 sets, 28 slides, each in square (feed) and tall (WhatsApp Status, Reels): `leaders` 7 + CTA, `teachers` 5 + CTA, `parents` 4 + CTA, `learners` 4 + CTA, `everyone` 3 + CTA | `out/<set>/<id>-1x1.png`, `-9x16.png` |
| **Videos** | One slideshow per set, with a slow push-in, about 25 to 30 s, in both sizes, no sound (people watch muted) | `out/video/<set>-9x16.mp4`, `-1x1.mp4` |
| **QR codes** | One per audience, opens the demo as that role | `qr/<set>.png` (already on every CTA slide) |
| **Captions and links** | Facebook caption, first comment link and WhatsApp Status text for every slide, tags already set | `captions.md` |
| **Tracking** | The console counts **demo opens**, messages, sign-ups and paying schools per tag | Console → Growth → Campaign |

Tags: `fb-<slide>` (Facebook), `wa-<slide>` (WhatsApp Status), `qr-<set>` (QR), plus the ones you add: `wa-dm` (your direct messages), `grp-<name>` (a group), `flyer`, `ref-<name>`, `fb-ad01`. Link format: `https://gss-lms.vercel.app/demo?src=<tag>&role=<admin|teacher|guardian|learner>`.

To remake anything after the app changes: `node marketing/capture.mjs` (real screens from a running demo), `node marketing/compose.mjs`, `node marketing/make-videos.mjs`, `node marketing/captions.mjs`.

## 4. Channels and rhythm (4 weeks, then a weekly loop)

| Channel | Rhythm | Notes |
|---|---|---|
| **Facebook page** | 5 posts a week, rotating the five audiences | Picture or video; link in the first comment |
| **WhatsApp Status** | 1 a day (the day's post, tall version) | Ask contacts to forward |
| **WhatsApp direct messages** | 10 a day, Mon to Fri, to principals, owners and bursars | Personal, one at a time, never bulk, stop at "no" (scripts in section 6) |
| **Teacher channels** | Share the teacher set in teachers' WhatsApp groups and ask one teacher per school to try the demo | Teachers are the quiet decision-makers |
| **Parent channels** | Offer schools a ready-to-forward parent post | Parents asking "does our school have this?" is the best lead |
| **Facebook groups** | Max 2 posts a week in education groups that allow promotion | Read each group's rules first |
| **In person** | 3 half-days: show the demo on your phone to a principal, leave a card with the QR | Principals trust a person in front of them |
| **Partners** | Ask in week 1: school stationery and uniform suppliers, church school boards, teachers' associations, accountants who serve schools, ICT trainers | A mention or a share |
| **Resellers** | Give interested people a code in the console (Growth → Resellers) | They earn commission on schools they bring |
| **Paid boost (optional, week 2 only)** | Boost your best school-leaders video to adults 25 to 60 in Eswatini, small test budget | Skip if organic works; never target under-18s |

## 5. Calendar

Timing: the school year is ending and next year is being planned (registration, fees, timetables), so leaders are thinking about *how to run 2027*. Check the Ministry's 2027 calendar and the term dates your target schools actually use, and move weeks to match. Times: post 06:30 to 07:30, 15:00 to 16:30, 20:30 to 21:45; avoid school hours for teachers.

| Week | Theme | Posts (tag) |
|---|---|---|
| **0: prep** (before posting) | Everything in section 8 | Reload the demo, test every link on a phone, set up the Facebook page and WhatsApp Business |
| **1: "Look inside"** | Leaders and the role picker | Mon `ev1` (pick a role), Tue `sl1`, Wed `sl2`, Thu `sl3` video, Sat `ev2` |
| **2: "For teachers"** | Teachers, then parents ask | Mon `tc1`, Tue `tc2`, Wed `tc4`, Thu teachers video, Sat `pa1` |
| **3: "For parents"** | Parents and learners (through schools) | Mon `pa2`, Tue `pa3`, Wed `lr1`, Thu parents video, Sat `lr2` |
| **4: "Make it happen"** | Leaders again, with the trial and prices | Mon `sl4`, Tue `sl5`, Wed `sl6`, Thu leaders video, Sat `ev3`, plus a "30-day free trial" post |
| **Loop** | Repeat the best two audiences by tag | Re-post the top slides with a new first line |

## 6. Direct message scripts (WhatsApp, to a principal, owner or bursar)

Send one at a time, from a number with a profile photo and a business name. Never add anyone to a group.

**First message**
> Good [morning], [Name]. I'm [Your name] from GSS-LMS, a school system built for schools in Eswatini: registers, marks, fees, timetables and parent communication in one place. I'd like you to see it for yourself: there is a free demo, a whole school with made-up data, no sign-up. As a principal: [link with src=wa-dm&role=admin]. Would you like me to show you in person, 10 minutes?

**If they open it but go quiet (after 3 days)**
> Hi [Name], did you get a look at the demo? Many principals start with the fees screen and the early-help list. If you tell me what takes most of your office's time, I'll show you that part.

**If they say "we already use something"**
> Understood. Is it handling fees, the timetable and parent communication in one place, or are some of those still in books and WhatsApp? The demo takes a few minutes, and the trial is free for 30 days.

**If they ask about price**
> Starter is SZL 4,000 a month, Standard SZL 5,000, Premium SZL 6,000, plus a one-time SZL 5,000 setup. The first 30 days are free with no payment, so you can try it with your own classes first.

**To a teacher (share, don't pitch):**
> Look at this: you take the register on your phone and it tells the parents. Demo, no sign-up: [link with src=wa-dm&role=teacher]. If you like it, show your principal.

**Stop** at the first "no thanks". Keep a note of who said what.

## 7. Tracking and review

| Funnel step | 4-week target | Where you see it |
|---|---|---|
| People reached | as many as the page gets | Facebook Insights |
| **Demo opens** | **150 to 400** | Console → Growth → Campaign (by tag) |
| Messages / requests | 20 to 40 | Console → Growth → Leads |
| Schools that start a trial | **5 to 10** | Console → Schools (source shown) |
| Schools that pay | 2 to 4 | Console → Growth → Revenue |
| Referrals / reseller leads | 2 | Console → Growth → Resellers |

These are targets, not predictions. If demo opens are under 50 after two weeks, change the first line and the picture before posting more. If many open the demo but nobody messages, the demo is working and the follow-up is the gap: send the second DM and offer a visit.

**Every Monday, 20 minutes:** open Growth → Campaign; sort by demo opens; do more of the top two audiences and drop the bottom one. Compare opens with messages per tag.

## 8. Before launch day (readiness)

**Done (checked):** the website and demo are live; every campaign link counts a demo open per tag; sign-up tells the truth (it shows the password link if email is off, and flags a new school's web address for you to switch on); installers are marked "coming soon"; privacy and terms pages exist (draft: have them checked).

**You must do before the first post (these are not optional):**
1. **Reload the live demo's data** (console → the demo school → Reload demo data). The pictures show a full school. The live demo currently shows the older, smaller sample. If a post shows classes and exams and the demo does not, trust is lost.
2. **Click through the demo as all four roles on your phone**, using the campaign links, once the data is reloaded.
3. **Check the console every morning** (Growth) for new schools needing their web address switched on, and for new messages. Until `VERCEL_API_TOKEN` is set, each new school's address must be added by hand in the Vercel project's Domains; the sign-up page tells the school you will contact them. Reply the same day.
4. **Set up the Facebook page and WhatsApp Business** (name, logo, description, link, hours).
5. **Have the privacy and terms pages checked** by an adviser and add your registered name and address.

**Not connected yet (do not promise these):** emails (trial and ticket emails, receipts), WhatsApp messages to parents, push alerts, card payments, Google/Microsoft sign-in. The system works without them; the posts must not say otherwise. Desktop and phone installers are not published yet: say "install from your browser" until they are.

## 9. Risks

| Risk | What to do |
|---|---|
| The demo is slow or down on launch day | Test an hour before; keep the WhatsApp reply "we are looking at it, try again in an hour" |
| Someone signs up and cannot open their address | Check Growth each morning; reply the same day |
| A post gets a complaint about data | The demo contains made-up data only; point to the privacy notice |
| Someone asks for a testimonial or school count | Say "we are starting with a founding group of schools", never a number |
| Learners contacted directly | Never. Reach them through schools |
