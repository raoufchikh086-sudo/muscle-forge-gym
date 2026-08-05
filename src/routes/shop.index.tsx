import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listProducts } from "@/lib/public-content.functions";
import { formatPrice, useCart } from "@/hooks/use-cart";

const productsQuery = queryOptions({ queryKey: ["products"], queryFn: () => listProducts() });

const categories = [
  { value: "all", label: "Everything" },
  { value: "machines", label: "Machines" },
  { value: "weights", label: "Free weights" },
  { value: "calisthenics", label: "Calisthenics" },
  { value: "accessories", label: "Accessories" },
  { value: "supplements", label: "Supplements" },
];

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Machines, Weights & Calisthenics Gear | IRONCODE" },
      {
        name: "description",
        content:
          "Racks, cable stations, barbells, bumper plates, rings, parallettes, belts and supplements for bodybuilding and calisthenics.",
      },
      { property: "og:title", content: "Shop — Machines, Weights & Calisthenics Gear" },
      {
        property: "og:description",
        content: "Kit out your gym or your garage with gear built for real training.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ShopPage,
});

function ShopPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [category, setCategory] = useState("all");
  const { add } = useCart();

  const filtered =
    category === "all" ? products : products.filter((p) => p.category === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl md:text-5xl">Shop</h1>
      <div className="mt-2 h-px w-24 gold-rule" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Equipment that survives real training — from full machines to a chalk block.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded-sm border px-4 py-2 font-display text-xs uppercase tracking-widest transition-colors ${
              category === c.value
                ? "border-gold bg-gold text-primary-foreground"
                : "border-border text-muted-foreground hover:border-gold hover:text-gold"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const images = productImages(p.slug);
          return (
          <article
            key={p.id}
            className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-gold"
          >
            <Link
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="block aspect-[4/3] overflow-hidden bg-muted"
            >
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : null}
            </Link>
            <div className="flex flex-1 flex-col p-6">
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
              {p.category}
            </span>
            <h2 className="mt-3 text-xl">
              <Link to="/shop/$slug" params={{ slug: p.slug }} className="hover:text-gold">
                {p.name}
              </Link>
            </h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-display text-2xl text-foreground">
                {formatPrice(p.price_cents, p.currency)}
              </span>
              <button
                onClick={() => {
                  add({
                    slug: p.slug,
                    name: p.name,
                    priceCents: p.price_cents,
                    kind: "product",
                  });
                  toast.success(`${p.name} added to cart`);
                }}
                className="rounded-sm bg-gold px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
