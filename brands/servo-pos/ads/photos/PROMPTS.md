# Photo prompts for an image generator (clean base photos for Servo posts)

Why: the first photo set (StreetEats mock-ups) had its text baked into the pictures: wrong brand, prices in R, "No cash needed", "FREE / no monthly fees", "secure payments", and invented phone screens. Baked text cannot be edited, and some claims break `docs/POSTING_PLAN.md` (cash works; card payments only once connected; the offer is free months, not free forever). So: ask the generator for the PHOTO ONLY, then `ads/photo-posts.js` adds the real name, real screens and honest copy.

Always add to every prompt: "No text, no logos, no signs with writing, no prices, no QR codes with readable content, blank phone screens (or dark), photorealistic, natural light, square 1:1, subject left or centre so text can sit on the right and bottom."

Scenes (Eswatini setting: Mbabane/Manzini market stalls, kota shops, small restaurants; people of the region; no real brands):
1. A smiling woman in an apron at a food stall counter tapping a tablet on a stand, trays of braaied chicken, pap and relish in front, warm afternoon light.
2. A guest holding a phone over a small table stand (blank card), a waiter in the background carrying a plate, small restaurant interior.
3. A kitchen pass with two cooks and a wall-mounted screen (screen dark or blurred), plates lined up, steam, busy lunchtime.
4. A kota/takeaway shop owner counting the day's takings at a till with a phone beside it, evening light.
5. A man and a woman at a restaurant back office laptop looking at a chart (screen blurred), stock boxes behind.
6. A waiter in a clean apron serving two plates to a family at an outdoor table, phone on the table.
7. A market stall owner taking a phone payment from a customer, hands and phones only, shallow depth of field.

After generating: put the file in `ads/photos/raw/`, add a post to `POSTS` in `ads/photo-posts.js` (headline, crop, one Servo screen, 1 to 2 chips), run it, view the PNG. Keep the "Illustrative photo" label while photos are AI-made; never present one as a real customer.

## Re-lettered mock-ups (`ads/photo_retext.py`, output `ads/photos/edited/`)
The owner liked the StreetEats mock-ups, so `photo_retext.py` keeps the picture and swaps the wrong words: the old lettering is inpainted out of the paint banners and chalkboards, then the new words are drawn in the same brush font (`ads/fonts/Caveat_Brush.ttf`, `Kalam.ttf`), tilted, softened and grained. Name = Servo POS, E not R, offer exactly as `src/lib/marketing.ts`, own app = Standard and Multi-branch, no "free forever / no fees / no cash needed / secure payments". Clean results so far: 09 and 10 (Good food is just a scan away). 01, 08, 11 and 16 are in `JOBS` but still leave visible patches (rectangles where text sat on translucent paint or bare photo, hands over phone screens): do not post them until fixed. Old `edit-photos.js` overlays were visibly pasted-on; superseded. Best long-term fix: ask the image generator for the same scenes WITHOUT any lettering or screens, then use banners drawn in the same style on top.
