# Shop product photos + training videos

## Photos in the shop

Every product gets its own image, shown on the shop grid cards and large on the product detail page.

- Add an `image_url` column to the products table and fill it for each seeded product.
- Generate one photo per product in the charcoal/gold studio look (rack, cable station, barbell + bumper plates, dumbbells, rings, parallettes, pull-up bar, belt, chalk, shaker/supplements) so the catalogue looks like one shoot, not stock.
- Shop grid: image on top of each card (4:3, hover zoom), price and Add button below.
- Product detail: full-width hero image beside the name, price and Add to cart block.
- Fallback: any product without a photo shows a gold monogram tile instead of a broken image.

## Training videos

- Home page: a short looping training clip behind/next to the hero, muted and autoplaying, with the existing hero image as its poster so nothing flashes on load.
- Program detail pages: a technique clip at the top of the program (gym, home-equipment, and calisthenics each get their own clip matched to the training style), with poster image and standard play controls.
- Videos are generated 1080p, a few seconds, no sound, and served from CDN asset storage so the repo stays light.

## Technical notes

- Migration adds `image_url text` to `public.products` and updates the seeded rows; public read policy already covers it.
- Generated images and videos are uploaded as CDN assets (`.asset.json` pointers) and referenced by URL.
- Video elements use `muted`, `playsInline`, `preload="none"` with `poster`, so mobile does not download the clip until needed.
- `og:image` on the shop product route is set to the product's absolute image URL.
