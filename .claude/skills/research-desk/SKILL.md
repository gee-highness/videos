---
name: research-desk
description: Research a true story (news, pop culture, reality TV, business, history) before it becomes a video script - find every fact and quote, check it across sources, label each as fact, claim or unverified, and correct the user's draft. Use whenever a video is about real people or real events, or the user asks to "research", "fact-check" or "get every bit of information" for a script.
---

# Research desk

Every essay about real people or events starts here, and nothing goes into a script that is not in the project's `research.md`.

## Method
1. **Search wide first** (WebSearch, extended mode for anything recent): the event itself, each person's background, the timeline (premiere and air dates, episode titles), each quote, the reaction, what happened next. Send several searches at once.
2. **Read the pages** with the web-fetch agent: give it the URLs and the exact list of facts and quotes you need, and ask it to mark claims. Some sites refuse automated reads (Prime Timer gave HTTP 405); find a syndicated copy (NewsBreak, Yahoo, MSN) instead of retrying.
3. **Write `projects/<id>/research.md`** with three labels:
   - **FACT**: reported as fact by a reliable source (Wikipedia for dates and titles, trade press, the broadcaster).
   - **CLAIM**: something a person said (on the show, in a post, in an interview). Always quoted as their words, with who said it.
   - **UNVERIFIED**: one weak source (a forum, an unsourced aggregator, a video title). Leave it out, or say "reportedly".
   End with a source list (one line per URL, with a short key like `[TK]`) and a **corrections** section listing what was wrong in the user's draft and why.
4. **Correct, don't copy:** the user's draft is a starting point. Change anything the sources contradict, remove anything with no source, and tell the user what changed.

## Rules for real people
- Insults and accusations made by one person about another are said on air to be their words, not facts, and the other person's denial goes right after.
- Crude words go on screen with an asterisk; the narrator never says them.
- No clips from the show, no photos of the people, no AI images of real faces: places, rooms, objects and silhouettes tell the story.
- Numbers (money, views, ages) only as the source gives them; when sources disagree, say the safer one ("fifty", "millions").

## Lessons
- 2026-11-25 RHOLDN (es01): the user's draft had the £500k claim backwards, a "truce" that never happened, and quotes with no source ("lackey", "ride-or-die"). Three rounds of searches plus two fetch agents found the real versions. Always budget for that.
