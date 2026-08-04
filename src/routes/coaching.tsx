import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, useCart } from "@/hooks/use-cart";

export const COACHING_TIERS = [
  {
    slug: "coach-normal",
    name: "Normal Coach",
    priceCents: 4900,
    tagline: "Structure and accountability every month.",
    features: [
      "Full access to every IRONCODE program",
      "Program matched to your level, goal and equipment",
      "Monthly check-in and plan adjustment",
      "Group chat with the coaching team",
      "Technique library and warm-up protocols",
    ],
  },
  {
    slug: "coach-premium",
    name: "Premium Coach",
    priceCents: 14900,
    tagline: "A coach in your corner every single week.",
    features: [
      "Everything in Normal Coach",
      "Fully custom training plan rewritten for you",
      "Nutrition plan with calories and macros",
      "Weekly video form review with written feedback",
      "Priority 1-on-1 chat, answered within 24 hours",
      "Monthly progress audit with photos and measurements",
    ],
  },
] as const;

export const Route = createFileRoute("/coaching")({
  head: () => ({
    meta: [
      { title: "Coaching — Normal & Premium Coaches | IRONCODE" },
      {
        name: "description",
        content:
          "Choose a normal coach for structure and monthly check-ins, or a premium coach for a fully custom plan, nutrition and weekly form reviews.",
      },
      { property: "og:title", content: "Coaching — Normal & Premium Coaches" },
      {
        property: "og:description",
        content: "Two coaching tiers for bodybuilding and calisthenics, wherever you train.",
      },
    ],
  }),
  component: CoachingPage,
});

function CoachingPage() {
  const { add } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl md:text-5xl">Coaching</h1>
      <div className="mt-2 h-px w-24 gold-rule" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        A program tells you what to do. A coach makes sure you actually do it, and fixes it when
        your body, your schedule or your gym changes.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {COACHING_TIERS.map((tier, i) => (
          <section
            key={tier.slug}
            className={`flex flex-col rounded-sm border bg-card p-8 ${
              i === 1 ? "border-gold" : "border-border"
            }`}
          >
            {i === 1 && (
              <span className="mb-4 w-fit rounded-sm bg-gold px-3 py-1 font-display text-[10px] uppercase tracking-[0.3em] text-primary-foreground">
                Most results
              </span>
            )}
            <h2 className="text-2xl">{tier.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{tier.tagline}</p>
            <p className="mt-6 font-display text-4xl">
              {formatPrice(tier.priceCents)}
              <span className="font-sans text-sm text-muted-foreground"> / month</span>
            </p>
            <ul className="mt-8 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                add({
                  slug: tier.slug,
                  name: tier.name,
                  priceCents: tier.priceCents,
                  kind: "coaching",
                });
                toast.success(`${tier.name} added to cart`);
              }}
              className={`mt-8 h-12 rounded-sm font-display text-sm font-bold uppercase tracking-widest ${
                i === 1
                  ? "bg-gold text-primary-foreground hover:opacity-90"
                  : "border border-gold text-gold hover:bg-gold/10"
              }`}
            >
              Choose {tier.name}
            </button>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-sm border border-border bg-card p-8">
        <h2 className="text-2xl">Already coached?</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Open your chat to send your coach a video, ask about a substitution, or report how the
          last session felt.
        </p>
        <Link
          to="/chat"
          className="mt-6 inline-flex h-12 items-center rounded-sm border border-gold px-6 font-display text-sm uppercase tracking-widest text-gold hover:bg-gold/10"
        >
          Open chat
        </Link>
      </div>
    </div>
  );
}
