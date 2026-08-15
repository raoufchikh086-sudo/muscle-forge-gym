import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { homeAlternatives } from "@/lib/home-alternatives";

export const Route = createFileRoute("/home-gym")({
  head: () => ({
    meta: [
      { title: "Home Gym Alternatives — Train With Household Items | IRONCODE" },
      {
        name: "description",
        content:
          "Replace every piece of gym equipment with things you already own: backpacks for dumbbells, chairs for dips, towels for rows.",
      },
      { property: "og:title", content: "Home Gym Alternatives Guide" },
      {
        property: "og:description",
        content: "How to replace dumbbells, benches, cables and bars with household items.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeGymPage,
});

function HomeGymPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">
            No excuses · No membership
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Home gym alternatives</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            You do not need a rack to build a body. Every machine below has a free replacement
            sitting somewhere in your flat right now.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeAlternatives.map((a) => (
            <article
              key={a.slug}
              className="flex flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-gold"
            >
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                Instead of {a.equipment}
              </p>
              <h2 className="mt-2 text-xl">{a.household}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{a.how}</p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                    Load
                  </dt>
                  <dd>{a.loads}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                    Trains
                  </dt>
                  <dd>{a.trains}</dd>
                </div>
              </dl>
              {a.warning && (
                <p className="mt-auto flex gap-2 pt-5 text-xs text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />
                  {a.warning}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface-light py-14 text-surface-light-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl">Ready to make it a real program?</h2>
          <p className="mt-4 text-surface-light-muted">
            Feed your household setup into the generator and get a full week of training built
            around exactly what you own.
          </p>
          <a
            href="/generator"
            className="mt-6 inline-flex h-12 items-center rounded-sm bg-gold px-8 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
          >
            Build my plan
          </a>
        </div>
      </section>
    </div>
  );
}
