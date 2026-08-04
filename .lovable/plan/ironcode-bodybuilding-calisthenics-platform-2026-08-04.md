# IRONCODE — Bodybuilding & Calisthenics Platform

A dark, gold-accented training platform: workouts for gym and home (with or without equipment), two coaching tiers, a shop for gear and machines, member profiles, a chat with coaches, and a motivation wall featuring David Goggins and Khabib Nurmagomedov.

## Look and feel

Charcoal (#111111) and warm dark brown (#1E1B16) surfaces, gold (#C9A227) accents, off-white (#F5F1E8) text. Bold condensed display headings, clean body type, grain/texture on hero imagery, restrained motion (fade-and-rise on scroll). No purple gradients, no generic stock look.

## Pages

1. **Home** — full-bleed hero (training image + gold headline), quick paths: Gym / Home with equipment / Home bodyweight, featured programs, coaching teaser, shop teaser, motivation strip.
2. **Programs** — filterable library: split by Gym, Home + machines, Calisthenics (no equipment), plus level (beginner/intermediate/advanced) and goal (mass, strength, cut, endurance). Program detail shows week-by-week sessions, exercises, sets/reps, rest, and technique notes.
3. **Coaching** — two tiers side by side:
   - **Normal Coach** — program library access, monthly check-in, group chat.
   - **Premium Coach** — fully custom plan, nutrition, weekly video review, priority 1-on-1 chat.
   Both purchasable via real checkout.
4. **Shop** — categories: machines, free weights, calisthenics bars/rings, accessories, supplements. Product grid, product detail, cart, real checkout.
5. **Motivation** — quote wall with dedicated David Goggins and Khabib Nurmagomedov sections (portrait-style generated artwork, signature quotes, mindset principles, a "carry the boats" callout).
6. **Profile** — personal information: name, photo, age, height, weight, goal, experience level; body-stat history and progress log; orders and active coaching plan.
7. **Chat** — real-time messaging between a member and coaches; coaches see their client threads.
8. **Auth** — sign up / sign in with email+password and Google.

## Backend (Lovable Cloud)

Enabled with accounts, database, and storage.

Tables (all with row-level security and grants):
- `profiles` — user info, avatar, stats, goal, level; auto-created on signup
- `user_roles` — separate role table (`member`, `coach`, `admin`) with a `has_role` function; no roles on profiles
- `body_stats` — dated weight/measurements per user
- `programs`, `program_days`, `exercises` — training content, public read
- `products` — shop catalog, public read
- `orders`, `order_items` — purchases, owner-scoped
- `subscriptions` — coaching tier per user
- `conversations`, `messages` — member/coach chat, participant-scoped, realtime
- `quotes` — motivation content, public read

Programs, products, and quotes are seeded with real content in the migration so the site is full on first load.

## Payments

Stripe via Lovable's built-in payments (Pro plan required). Digital coaching subscriptions plus physical shop items means Stripe with tax calculation and collection at checkout; you handle registration and filing. Products for both coaching tiers and shop items are created in Stripe, checkout runs server-side, and a webhook records orders and activates subscriptions.

Note: physical gear needs real fulfilment/shipping on your side — if you want inventory and shipping handled for you, Shopify would be the better fit for the shop and we can switch that part later.

## Technical notes

- TanStack Start routes; public pages SSR with per-page SEO metadata; profile, chat, orders under the authenticated layout.
- Data access through `createServerFn` (authenticated middleware for user data, publishable client for public catalog reads).
- Chat uses Supabase realtime subscriptions on `messages`.
- Checkout and Stripe webhook implemented as server routes under `/api/public/` with signature verification.
- Hero, coach, and athlete imagery generated to match the gold/charcoal direction; product images generated per category.

## Build order

1. Enable Cloud, design tokens + layout shell, Home
2. Programs library + detail (gym / home / calisthenics)
3. Auth, profile with personal info and progress
4. Motivation page (Goggins, Khabib)
5. Chat with coaches
6. Shop + coaching tiers
7. Enable Stripe, create products, checkout + webhook
