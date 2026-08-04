import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProduct } from "@/lib/public-content.functions";
import { formatPrice, useCart } from "@/hooks/use-cart";

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

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  if (!product) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link to="/shop" className="font-display text-xs uppercase tracking-widest text-gold">
        ← Shop
      </Link>
      <span className="mt-6 block font-display text-[10px] uppercase tracking-[0.3em] text-gold">
        {product.category}
      </span>
      <h1 className="mt-3 text-4xl md:text-5xl">{product.name}</h1>
      <div className="mt-2 h-px w-24 gold-rule" />
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{product.description}</p>

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
  );
}
