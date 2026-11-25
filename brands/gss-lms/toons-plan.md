# GSS-LMS cartoon shorts: "Cartoon High"

Written 23 Nov 2026. Kit: `scripts/toons/` (copied from servo-pos, which copies venda-khona). How to make one: section 7. Skill: `.claude/skills/cartoon-studio/` (read its lessons and feedback first).

## 1. Who we are talking to

| Who | Role in the sale | What keeps them up at night (Eswatini) | What they need to see |
|---|---|---|---|
| **Principal, owner, school board** | **Decides and pays** (E4,000 to E6,000 a month: mostly private, mission and church secondary schools; public primary is free, so fee jokes are aimed at schools that charge fees) | Not knowing what is going on today; report week; Ministry returns; fee arrears; parents phoning | One screen for the whole school |
| **Bursar** | Strong voice on anything about money | Deposit slips on WhatsApp with no name; January fees rush; "I paid, check again" | Proof of payment matched to a child, receipt done |
| **Deputy / academic head** | Owns timetable and exams | The timetable built on a whiteboard over the holidays; clashes found on day one | Timetable in one click, clashes refused |
| **Registrar / admin office** | Owns admissions and re-registration | Paper application forms; Form 1 intake queues; who is coming back next year | Online applications (Standard and up), re-registration |
| **Teachers** | Quiet decision-makers: if they hate it, it dies | Registers, marking, report-week mark sheets, "where is your homework" | Less paper; the phone register; marks typed once |
| **Parents and guardians** (often gogo) | Ask "does our school have this?" — the best lead | "How was school? Fine."; letters that live in the school bag; fees | Their child's marks, attendance, homework and notices on their phone |
| **Learners** (under 18) | Users, never targeted directly | Timetable, homework, marks | Shared by schools, teachers and parents only; no paid ads to them |

**One message:** *Your whole school. One system. See it for yourself: open the live demo as the person you are.*
Every short ends on the demo **as that role** (`/demo?role=...&src=...`), because trust comes from tapping around a real school, not from an advert.

## 2. The world and the cast (recurring, so people follow them)

**Cartoon High**, a fee-paying secondary school somewhere in Eswatini (Form 1 to Form 5). Nobody real, no real school.

| Character | Look (kit) | Voice | Personality |
|---|---|---|---|
| **Mrs Nkosi**, principal | `principal` (head wrap, blazer, glasses) | Ava | Calm, dry, has seen everything |
| **Mr Dube**, Maths teacher | `dube` (glasses, moustache) | Andrew | Tired, loyal, sarcastic under his breath |
| **Sipho**, Form 3 | `learner` (uniform and tie) | Ana (child) | Creative excuses, never malicious |
| **Gogo**, Sipho's grandmother | `gogo` | Leah (South African English) | Sharp; the real boss of the family |
| **Mr Shongwe**, bursar | `bursar` (suit) | Luke (South African English) | Precise, suffering, polite |
| **Ms Zwane**, registrar | `registrar` | Ava | Has read every handwriting there is |
| **Mr Mamba**, deputy (timetable) | `acm` (cap, blazer) | Luke | Proud of his whiteboard |
| **Nomsa**, School News anchor | news desk | Emma | Tries to smile through the news |
| Narrator | – | Ryan | Calm while everything falls apart |

Voices: Ryan and Emma as the user chose for every brand; Leah and Luke (en-ZA) add a Southern African sound for the school's own people; Ana is a child voice for Sipho. If the user prefers, swap Leah/Luke for Ava/Andrew in `voices`.

## 3. The ten shorts (posting order: buyers first, then the people who push buyers)

Each is 15 to 25 s: the hook in the first line, a local detail, the punchline, one product fact said like a person, the callback, the end card with the role. Every product line has a truth note (where to see it in the demo).

| # | Title | For | Hook → button | Real feature (truth note) | Demo as |
|---|---|---|---|---|---|
| GS01 | Blessed Tuesday | Principal | "How many learners are absent today?" → the staff group answers with a *Blessed Tuesday* flower picture → "Twelve absent. And Tuesday is blessed." | Teachers take the register on a phone; the principal's dashboard shows today's attendance and which registers are missing (admin dashboard, teacher register) | admin |
| GS02 | Report week | Principal + teachers | "Report week. The staff room has not seen the sun since Tuesday." → English marks on a flash drive "in Manzini" → "So what do we do this week?" "Go home." | Marks are entered during the term; report cards are made from the marks already there (gradebook, reports) | admin |
| GS03 | From: Mom | Bursar | "School fees. From: Mom." → 600 learners, all have a mom → "Whichever mom it was. Thank you." | Parent uploads proof under their own child; bursar checks once; receipt (guardian Pay now, admin fees) | finance-manager |
| GS04 | One whiteboard | Deputy | Three weeks and one whiteboard → Mr Dube teaching Form 2 and Form 4 in the same lab → "I'm a good teacher. I'm not two teachers." | Timetable in one click with teachers, rooms and classes checked; a clashing move is refused (admin timetable) | academic-manager |
| GS05 | Date of birth: Yes | Registrar | Paper form: "Surname: Form One" → "Date of birth: Yes." → "An actual date. I could cry." | Online applications (Standard plan and up) land in one list to accept (admin applications) | registrar-manager |
| GS06 | The other bag | Teachers | "Where is your homework?" "In my other bag." "It's a very big bag." → "Handed in at 11:59 p.m. I respect it." | Homework handed in on the phone with the time it arrived (learner homework, teacher submissions) | teacher |
| GS07 | Stuff | Parents | "How was school?" "Fine." "What did you learn?" "Stuff." → "Science test on Friday." "...Fine." | Guardians see marks, attendance, homework and tests (guardian dashboard) | guardian |
| GS08 | The letter | Parents + principal | "Why didn't you tell me about sports day?" "I gave you the letter." "When?" (a banana-flavoured letter comes out of the bag) "...Now." | School notices appear in the parent's app (guardian announcements) | guardian |
| GS09 | 1998 | Learners (shared by parents and schools) | "Mama, what do I have first period?" "I finished school in 1998." → "In 1998 it was also Maths." | Learners see their own timetable, homework and marks (learner dashboard) | learner |
| GS10 | School News | Everyone (trust) | Nomsa: a teacher found a pen that works; it isn't his. Callbacks to the other bag and the letter. → "There is a whole demo school online. You can walk right in." | The demo itself: pick a role, look around, nothing to sign up for | role picker |

## 4. Rules (on top of the skill's writing rules)

- Claims only from the table above. Online applications and messages: **Standard plan and up**. Never promise email, WhatsApp or push notices from the platform, card payments, installers, "works offline", numbers of schools, testimonials.
- Every demo screen says **demo data**. End card: "Cartoon school. The demo is real, with made-up data. Nothing to sign up for."
- Jokes are on the situation, never on a learner, a parent or a teacher as a group. Children are never the butt of a cruel joke; Sipho is clever, not stupid.
- No politics, monarchy, religion as a joke, real schools, real people, exam-council or Ministry jokes, load shedding. Place names only as places (Manzini, Mbabane).
- siSwati lines only after a native speaker checks them (none in this batch).

## 5. Posting (with the picture campaign in `marketing/CAMPAIGN.md`)

| Week | Shorts | Why |
|---|---|---|
| 1 | GS01, GS02, GS10 | Principals are planning 2027 now (end of the school year) |
| 2 | GS03, GS04 | Bursars before the January fees rush; deputies build the 2027 timetable over the holidays |
| 3 | GS06, GS07, GS08 | Teachers and parents; ask parents to forward to the school |
| 4 | GS05, GS09 | Form 1 intake and re-registration; learners through parents |
| January | GS03 again, GS05 again | Fees and admissions season |

Where: WhatsApp Status (720p copy, 2 to 4 MB), Facebook Reels (the main stage in Eswatini), TikTok and YouTube Shorts second. Captions always on: most people watch muted.
Links: `https://gss-lms.vercel.app/demo?src=<tag>&role=<role>`, tags `toon-gs01-fb`, `toon-gs01-wa`, ...; results in console → Growth → Campaign (demo opens per tag and role). Log them in the skill's `feedback.md` and make more of what works.

## 6. Captions (post text)

See `docs/toons/captions.md`.

## 7. How to make one

1. Voices: `node scripts/toons/voice.cjs gs01` (or the batch `scripts/toons/termux-gss.sh`), paste into Termux, send the zip; files go to `scripts/toons/voice/<id>/01.mp3...`; check none is 0 bytes.
2. Check: `node scripts/toons/engine.cjs gs01 --stills 2,6,10,...` and look at every still.
3. Render: `node scripts/toons/engine.cjs gs01` → `toons/out/gs01.mp4`, `-720.mp4`, `-sheet.jpg`. Look at the sheet; measure the sound (`ffmpeg -af volumedetect`); never claim to have listened.
