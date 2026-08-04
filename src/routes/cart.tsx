import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — IRONCODE" },
      { name: "description", content: "Review your gear and coaching before checking out." },
      { property: "og:title", content: "Your Cart — IRONCODE" },
      { property: "og:description", content: "Review your gear and coaching before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, totalCents, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function checkout() {
    if (!isAuthenticated) {
      toast.error("Sign in to check out");
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error(data.error ?? "Checkout is not available yet.");
    } catch {
      toast.error("Could not start checkout. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-muted-foreground">Nothing gets stronger sitting in a browser tab.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex h-12 items-center rounded-sm bg-gold px-6 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
          >
            Browse gear
          </Link>
          <Link
            to="/coaching"
            className="inline-flex h-12 items-center rounded-sm border border-gold px-6 font-display text-sm uppercase tracking-widest text-gold"
          >
            See coaching
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl">Cart</h1>
      <div className="mt-2 h-px w-24 gold-rule" />

      <div className="mt-10 divide-y divide-border rounded-sm border border-border bg-card">
        {lines.map((l) => (
          <div key={l.slug} className="flex flex-wrap items-center gap-4 p-6">
            <div className="min-w-48 flex-1">
              <p className="font-display text-lg">{l.name}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {l.kind === "coaching" ? "Monthly coaching" : "Equipment"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(l.slug, l.quantity - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border hover:border-gold"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center">{l.quantity}</span>
              <button
                onClick={() => setQuantity(l.slug, l.quantity + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border hover:border-gold"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="w-28 text-right font-display text-lg">
              {formatPrice(l.priceCents * l.quantity)}
            </span>
            <button
              onClick={() => remove(l.slug)}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${l.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={clear}
          className="font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-display text-3xl">{formatPrice(totalCents)}</p>
        </div>
      </div>

      <button
        onClick={checkout}
        disabled={busy}
        className="mt-6 h-14 w-full rounded-sm bg-gold font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Starting checkout…" : "Checkout"}
      </button>
      {!isAuthenticated && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          You'll need an account to check out.{" "}
          <Link to="/auth" className="text-gold">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
