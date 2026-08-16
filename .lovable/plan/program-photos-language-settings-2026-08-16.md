# Program photos + language settings

Two additions: bold training photos on every program, and a language switcher in the site settings.

## 1. Program photos

Each program gets its own cinematic training photo in the IRONCODE look — charcoal gym or outdoor calisthenics scenes, hard side light, gold rim highlights, no text baked in.

- Generate one image per program, matched to its environment (gym / home with machines / bodyweight) and goal (mass, strength, cut, endurance).
- Program cards on `/programs` and the featured block on the home page show the photo as a 16:9 header with a dark gradient so the title and level chip stay readable — the poster feel comes from the overlay, not from text inside the image.
- Program detail pages (`/programs/$slug`) get a full-width hero using the same photo with the title, weeks and days-per-week over it.
- Images are mapped by program slug in a small `src/lib/program-images.ts` module, with a neutral fallback so a new program never renders a broken card.
- Every image carries descriptive alt text and lazy loading below the fold.

## 2. Language settings

A settings entry in the header (globe icon, plus a row in the mobile menu) opens a language picker.

- Languages: English, Arabic and French.
- Arabic switches the page to right-to-left layout; the header, footer, cards and filters mirror correctly.
- The choice is remembered in the browser, so returning visitors keep their language.
- Scope for this pass: interface text — navigation, buttons, section headings, filter labels, form labels, footer. Program, product and recipe content stays in English for now (it comes from the database and needs translated rows later).

## Technical notes

- A lightweight in-app i18n layer: `src/lib/i18n/` with `en.ts`, `ar.ts`, `fr.ts` dictionaries and a `LanguageProvider` + `useT()` hook mounted in `src/routes/__root.tsx` alongside `CartProvider`.
- Language and `dir` are applied on the `<html>` element after hydration to avoid an SSR mismatch; default is English.
- Existing UI strings across header, footer, home, programs, generator, nutrition, shop, coaching and plans move into the dictionaries via the `t()` helper. Untranslated keys fall back to English.
- No database or schema changes.
