# Plan: The Bride, the DJ and the Missing Song (es03)

## 1. Who and why
- **Viewer:** Nigerian, Ghanaian, South African and diaspora Facebook users who watch wedding clips, love or hate "bridezilla" debates and have strong opinions on DJs and MCs. Phone, sound on or off, scrolling fast.
- **What they already believe:** the bride was wrong (or the DJ was) because that is what the clip's comments said.
- **What they leave with:** what the ritual is and why the moment matters, exactly what one outlet reported (and that it is one outlet, with no ending), that this has happened before with a happy ending, and a useful tip: tell your DJ your songs before the day.
- **Why now:** the report is dated 24 Nov 2026 and the clip is circulating; the ending is still unknown, so a fair, sourced version stands out from the pile-on.
- **Where:** Facebook Reel on the host's channel, 9:16, about 1:45. Landscape is not needed.

## 2. Title, hook and thumbnail
- Title (on-screen and caption): "The Bride, the DJ and the Missing Song".
- Hook (first 6 s, host full screen): "A bride stopped her own traditional wedding. Not over money. Not over family. Over one song."
- Thumbnail frame: the calabash cup in the spotlight (picture 01) with the words ONE SONG.
- Caption hook: "A bride stopped her own Igbo wedding over a song."

## 3. Facts we say (every line is in `research.md`)
| Line in the video | Source | Label |
|---|---|---|
| Igba nkwu: the bride takes palm wine and searches the crowd for her husband | Wikipedia (edited 25 Nov 2026); WePost Weddings (30 Sep 2026) | FACT |
| It usually takes a few minutes; guests distract her; the groom often hides; then the couple dance | WePost Weddings | FACT / CLAIM |
| A bride identified as Sugah asked the DJ for one particular song; he did not have it | GhPage, 24 Nov 2026 | FACT (one outlet) |
| He tried to download it, failed, played another song by the same artist; she said no | GhPage | FACT (one outlet) |
| She reportedly said the song had been on her mind since her single days; would go back to her father's house | GhPage | FACT (one outlet), "reportedly" in the video |
| Friends, family, in-laws, even the groom reportedly begged her to take another | GhPage ("reportedly", no named source) | UNVERIFIED, said as "reportedly" |
| Online, people are split | the user's Facebook links (unread) | confirm before posting |
| In 2024 another Igbo bride held back her wine until the DJ played "Obodo"; he did; she served | Legit.ng, 24 Dec 2024 | FACT |
| Wedding planners say tell the DJ your songs and ask if he can play them | vendor guides (The Knot, Naija Event Experts, Pulse) | CLAIM (advice) |
| The one report does not say how it ended | GhPage | FACT |

## 4. Structure and timing (about 1:45)
1. **Hook** (0:00): host full screen + the cup in the spotlight. Music: glam.
2. **The ritual** (0:08): top-down path from the cup to the hidden heart. Chime. Explains igba nkwu in three short shots.
3. **The standoff** (0:30): DJ booth with the failed download, the empty aisle with the waiting cup, the father's house at dusk, the GhPage headline. Music: sneaky; scratch on "She said no".
4. **The fair part** (1:00): host with an eyebrow, two speech bubbles, then the 2024 card on a calm record backdrop. Music: calm.
5. **The lesson** (1:25): phone playlist and notepad. Music: triumph.
6. **The ending** (1:33): the empty chair, then the host full screen for the question and sign-off. Music: calm.

## 5. Host moments (three)
- Shot 1: full screen, name label (first appearance), the hook.
- Shot 10: framed window, eyebrow pose, "Now, to be fair."
- Shot 14: full screen, the question and the sign-off.
Host clips are made with v_me (`node essay/host-vme.cjs es03 --v-only`) from the real voice files once they exist.

## 6. Look, sound, rules
- Style `london-glam` palette (ivory, champagne gold, plum, midnight navy) with our own flat illustrations (`illustrations/make.cjs`), no real faces, no clip of the viral video.
- Captions big, black boxes, inside the safe area; key subjects stay in the top 70% of the frame and the centre third.
- Music from the orchestra, bed about -20 LUFS, peaks under -1 dB, ducked under the voice. The user judges the sound.
- Tone: warm, dry, never mocking the bride. Both sides. No verdict.
- Posting: AI-generated host disclosed, Facebook AI label on, illustrations noted, link the sources in the first comment.

## 7. Risks
- One outlet, no named video source, authenticity unconfirmed: "reportedly" throughout.
- A private couple: no names beyond the nickname in the report, no venue, no groom details.
- The ending may appear any day: re-check GhPage and the posts on posting day; add a new LAST shot (not a middle one) if there is an update.

## 8. Checklist
- [x] Research v2 (`research.md`), script, illustrations, headline capture, silent draft
- [ ] Voices (user, Termux: `termux.sh`, 14 lines) -> `projects/es03/voice/`
- [ ] Host clips with the real voice (`host-vme.cjs es03 --v-only`)
- [ ] Final render `render es03 --vertical`, loudness and frame checks, send as a zip
- [ ] The user reads the Facebook/Instagram posts and confirms the "split" line
- [ ] Post with `post.md`
