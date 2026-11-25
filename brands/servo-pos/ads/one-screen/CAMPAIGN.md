# One screen, one reason (Batch 1, part A): WhatsApp Status only

Nine tall heroes (1080x1920) in `images/status/` + one 19 s status video `video/one-screen-whatsapp.mp4` (all nine in a row). Post one hero a day (9 days) as a Status, link tagged `wa-status`. All screens are demo data (label is on every image).

| File | Headline | Best time | Reply link |
|---|---|---|---|
| h01-till | Cash, card, split bill. Done in four taps. | Mon 15:30 | servo-pos.vercel.app/demo?ref=wa-status |
| h02-kitchen | No more shouting orders across the kitchen. | Tue 15:30 | same |
| h03-guest-phone | Guests order from their own phone. No app. | Wed 20:45 | same |
| h04-stock | Never run out of chicken on a Friday. | Thu 15:30 | same |
| h05-reports | How did we do today? Open your phone. | Fri 06:45 | same |
| h06-payroll | Wages without the spreadsheet. | Sun 18:00 | same |
| h07-table-qr | A QR on the table. The order lands in the kitchen. | Mon 15:30 | same |
| h08-rewards | Points your guests actually come back for. | Tue 15:30 | same |
| h09-own-app | Your name. Your colours. Your app. (Standard and Multi-branch only) | Wed 20:45 | same |

Status text (one line, pick per hero): "Demo restaurant, demo data. Try it, no sign-up: servo-pos.vercel.app/demo?ref=wa-status. First 5 restaurants: 6 months free."

## Still to build for Batch 1
Bookings hero (add-on wording, only for restaurants who ask) and the three screen-recording clips. h07 to h09 are flat phone screenshots of the real guest app (`shoot-guest.js`, `flat` slides); `capture.js` no longer works because the landing showcase draws native screens now (no framed demo), so new device renders need a new capture path. The QR on h07 points to the demo with `wa-status`. The rewards screen is the guest sign-in page (no demo guest account yet).
