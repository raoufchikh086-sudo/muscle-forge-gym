# Training videos, lighter sections, athlete imagery, AI assistant

Four additions to IRONCODE, using sensible defaults since the questions were skipped.

## 1. Exercise demo videos

- A `video_url` field on exercises plus a reusable `ExerciseVideo` player.
- Each exercise row in a program day gets a "Watch technique" button that opens a modal with an embedded demo clip (YouTube embeds of real, publicly available technique footage — real people, real form, no AI motion).
- A new **Technique Library** page (`/technique`) grouping demos by movement pattern: push, pull, legs, core, calisthenics. Filterable, with thumbnails.
- Home page gets one featured "How to train" video block.

## 2. White in the palette

Keeping the charcoal + gold identity but breaking it up:

- New `--surface-light` / `--surface-light-foreground` tokens (near-white #F7F5F0 with charcoal text).
- Alternating light sections: Technique Library intro, the coaching comparison block, and the shop category strip flip to light backgrounds with gold accents and charcoal type.
- Buttons and cards get white-on-dark variants so the dark pages feel less uniform.

## 3. Goggins & Khabib photos

Real press photos of both athletes are copyrighted — I can't add them without a licence, so instead:

- Their sections get bold editorial treatment: large monochrome-styled photographic portrait artwork already in the project, a documentary-style grain overlay, big typographic quote slabs, and career/mindset fact strips (Goggins: Navy SEAL, Badwater 135, 4,030 pull-ups; Khabib: 29-0, three-time UFC title defences, Dagestan wrestling roots).
- If you upload photos you own or have licensed, I'll swap them in — the layout is built to take real images directly.

## 4. Training assistant

- A floating gold assistant button on every page, opening a chat panel.
- Powered by Lovable AI (no API key needed), streaming replies, with an IRONCODE coach persona: knows the program library, equipment options, and the two coaching tiers.
- Suggested starter prompts: "Build me a home workout with no equipment", "Is my push day balanced?", "What should I eat post-workout".
- Clearly separated from the existing human coach chat, with a link across to it for real coaching.

## Technical notes

- Migration: add `video_url text` to program exercise data (stored in the existing `exercises` JSON on `program_days`) and a new `technique_videos` table (name, slug, pattern, equipment, youtube_id, description, level) with public read grants + RLS.
- Assistant runs through a `createServerFn` calling the Lovable AI gateway (`google/gemini-2.5-flash`), streaming to the client; rate-limit handling surfaced as friendly errors.
- Videos embedded via privacy-friendly `youtube-nocookie.com` iframes, lazy-loaded with a poster thumbnail so pages stay fast.
- New light tokens added to `src/styles.css`; no hardcoded colours in components.
- `/technique` gets its own SEO metadata and JSON-LD `VideoObject` entries.

## Build order

1. Design tokens for light sections + apply to existing pages
2. `technique_videos` table + seed real demo videos
3. Technique Library page + exercise video modal in program detail
4. Motivation page rebuild for Goggins and Khabib
5. AI assistant widget
