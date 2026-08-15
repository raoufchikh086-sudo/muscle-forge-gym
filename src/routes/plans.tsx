import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ExternalLink } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Training Plans, PDF Programs & Gear Picks | IRONCODE" },
      {
        name: "description",
        content:
          "Downloadable training programs for home, gym and calisthenics, our tested gear recommendations, and 1-on-1 online coaching.",
      },
      { property: "og:title", content: "Training Plans & Gear Picks" },
      {
        property: "og:description",
        content: "Ready-made PDF programs, recommended equipment and personal online coaching.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlansPage,
});

const digitalPlans = [
  {
    slug: "beginner-home-calisthenics",
    title: "Beginner home calisthenics — 12 weeks",
    blurb: "Zero equipment. From your first push-up to your first pull-up, week by week.",
    pages: 68,
    price: 1900,
  },
  {
    slug: "dumbbell-only-hypertrophy",
    title: "Dumbbell-only hypertrophy — 16 weeks",
    blurb: "One pair of adjustable dumbbells, four days a week, full upper/lower split.",
    pages: 82,
    price: 2400,
  },
  {
    slug: "gym-mass-blueprint",
    title: "Gym mass blueprint — 20 weeks",
    blurb: "Push/pull/legs periodised for size, with autoregulated top sets and deloads.",
    pages: 104,
    price: 2900,
  },
  {
    slug: "shred-protocol",
    title: "The shred protocol — 10 weeks",
    blurb: "Training, cardio and a full budget meal plan to strip fat without losing muscle.",
    pages: 74,
    price: 2200,
  },
  {
    slug: "street-skills",
    title: "Street skills — muscle-up & lever",
    blurb: "The complete progression system for the six biggest calisthenics skills.",
    pages: 90,
    price: 2600,
  },
  {
    slug: "bodyweight-conditioning",
    title: "30-day bodyweight conditioning",
    blurb: "Short, brutal daily sessions. Nothing but a floor and a timer.",
    pages: 44,
    price: 1400,
  },
];

const gearPicks = [
  {
    name: "Resistance band set",
    why: "The single highest-value purchase for a home gym — assists pull-ups and replaces cables.",
    range: "$20–40",
    tag: "Best value",
  },
  {
    name: "Doorway pull-up bar",
    why: "Unlocks the entire pulling side of training. Look for a wide, padded frame-mount model.",
    range: "$25–50",
    tag: "Essential",
  },
  {
    name: "Adjustable dumbbells",
    why: "Replaces a full rack. Buy once, 5–32 kg per hand, with a fast dial mechanism.",
    range: "$150–400",
    tag: "Long-term",
  },
  {
    name: "Gymnastic rings",
    why: "The most versatile piece in existence — rows, dips, levers and push-ups in one strap.",
    range: "$30–60",
    tag: "Skill work",
  },
  {
    name: "Weight vest",
    why: "The cleanest way to keep progressing bodyweight movements once reps get high.",
    range: "$40–90",
    tag: "Progression",
  },
  {
    name: "Whey or casein protein",
    why: "Only worth it if whole food falls short. Check for 20 g+ protein per 30 g serving.",
    range: "$25–50",
    tag: "Supplement",
  },
];

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function PlansPage() {
  const { add } = useCart();

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">
            Download · Train · Repeat
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Ready-made plans</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Complete PDF programs written by our coaches — every session, every set, every progression
            mapped out. Buy once, keep forever.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {digitalPlans.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-gold"
            >
              <FileText className="h-8 w-8 text-gold" />
              <h2 className="mt-5 text-xl">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-4 font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                {p.pages} pages · instant PDF download
              </p>
              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="font-display text-2xl text-gold">{money(p.price)}</span>
                <button
                  onClick={() =>
                    add({
                      id: p.slug,
                      name: p.title,
                      priceCents: p.price,
                      kind: "product",
                    })
                  }
                  className="h-10 rounded-sm bg-gold px-5 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface-light py-16 text-surface-light-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl">Gear we actually recommend</h2>
          <p className="mt-3 max-w-2xl text-surface-light-muted">
            Honest picks for building a home setup on any budget. We only list what our coaches use
            with real clients.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {gearPicks.map((g) => (
              <article
                key={g.name}
                className="rounded-sm border border-surface-light-border bg-background/5 p-6"
              >
                <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold-soft">
                  {g.tag}
                </span>
                <h3 className="mt-2 text-xl">{g.name}</h3>
                <p className="mt-2 text-sm text-surface-light-muted">{g.why}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-sm">{g.range}</span>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 font-display text-xs uppercase tracking-widest text-gold-soft"
                  >
                    See picks <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl">Want it written for you?</h2>
        <p className="mt-4 text-muted-foreground">
          Online personal coaching gives you a plan built around your body, your equipment and your
          schedule — with weekly video feedback from a real coach.
        </p>
        <Link
          to="/coaching"
          className="mt-6 inline-flex h-12 items-center rounded-sm bg-gold px-8 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
        >
          See coaching tiers
        </Link>
      </section>
    </div>
  );
}
