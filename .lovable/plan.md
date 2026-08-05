# Product photo galleries in the shop

Each of the 15 shop products gets its own set of photos, shown as a clean gallery: one large main image with a row of small thumbnails underneath on the product page, and a single lead photo on the shop grid cards.

## What you'll see

**Shop grid** — every product card gains a photo at the top (4:3 crop, gold hover treatment consistent with the current cards). Category label, name, price and the Add button stay where they are.

**Product page** — a two-column layout on desktop:

```text
+---------------------------+   Category
|                           |   PRODUCT NAME
|        main photo         |   ----------------
|                           |   description
+---------------------------+   price · stock
| [t1] [t2] [t3]            |   [ Add to cart ]
+---------------------------+
```

Clicking a thumbnail swaps the main photo. The active thumbnail carries a gold border. On mobile the gallery stacks above the product details. Photos have proper alt text ("Power Rack Pro — front view") for SEO and screen readers.

## The photos

Three generated photos per product, all in the same charcoal-and-gold studio look so the shop reads as one catalogue:

1. Full product, straight-on hero shot
2. Angled or detail shot (knurling, welds, strap texture, label)
3. In-context shot (in a gym setting or in use)

That's 45 images total, generated at 1024x768 and saved as JPGs.

## Technical notes

- Migration: add an `images text[]` column to `public.products` (nullable, default `'{}'`). Public read policy already covers it; no new grants needed.
- Images are generated into `src/assets/products/<slug>-1.jpg` etc., then externalised to the CDN with `lovable-assets` so the repo stays light. The resulting `.asset.json` URLs are what gets written into the `images` column via the insert tool.
- `src/lib/public-content.functions.ts` needs no change — it already selects `*`, so `images` flows through once the column exists. The generated `types.ts` picks the column up after the migration.
- `src/routes/shop.index.tsx`: render `product.images?.[0]` in each card, with a neutral placeholder block when the array is empty.
- `src/routes/shop.$slug.tsx`: new `ProductGallery` component (local to the route file or `src/components/shop/product-gallery.tsx`) holding the selected index in `useState`; main image `loading="eager"`, thumbnails `loading="lazy"`.
- Add the first image as `og:image` / `twitter:image` in the product route's `head()` using the absolute CDN URL.

## Build order

1. Migration for the `images` column
2. Generate the 45 photos, upload to CDN
3. Write the image URLs into the products table
4. Gallery component + product page layout
5. Shop grid card images
