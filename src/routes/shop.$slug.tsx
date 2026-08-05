import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct } from "@/lib/public-content.functions";
import { formatPrice, useCart } from "@/hooks/use-cart";
import { productImages } from "@/lib/product-images";

const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }) });

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — IRONCODE" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — IRONCODE Shop`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl">This product didn't load</h1>
      <Link to="/shop" className="mt-6 inline-block text-gold">
        Back to shop
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl">Product not found</h1>
      <Link to="/shop" className="mt-6 inline-block text-gold">
        Back to shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div>
      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <img
          src={images[active]}
          alt={`${name} — photo ${active + 1}`}
          width={1024}
          height={768}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${name}`}
              className={`overflow-hidden rounded-sm border transition-colors ${
                i === active ? "border-gold" : "border-border hover:border-gold/60"
              }`}
            >
              <img
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                loading="lazy"
                width={1024}
                height={768}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  if (!product) return null;

  const images = productImages(product.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Link to="/shop" className="font-display text-xs uppercase tracking-widest text-gold">
        ← Shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div>
          <span className="block font-display text-[10px] uppercase tracking-[0.3em] text-gold">
            {product.category}
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-2 h-px w-24 gold-rule" />
          <p className="mt-6 text-lg text-muted-foreground">{product.description}</p>

          <div className="mt-10 flex flex-wrap items-center gap-6 rounded-sm border border-border bg-card p-6">
            <span className="font-display text-3xl">
              {formatPrice(product.price_cents, product.currency)}
            </span>
            <span className="text-sm text-muted-foreground">
              {product.in_stock ? "In stock — ships in 3-5 days" : "Currently out of stock"}
            </span>
            <button
              disabled={!product.in_stock}
              onClick={() => {
                add({
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.price_cents,
                  kind: "product",
                });
                toast.success(`${product.name} added to cart`);
              }}
              className="ml-auto rounded-sm bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
