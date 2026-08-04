import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Flame, Mountain } from "lucide-react";
import { listQuotes } from "@/lib/public-content.functions";

const quotesQuery = queryOptions({ queryKey: ["quotes"], queryFn: () => listQuotes() });

export const Route = createFileRoute("/motivation")({
  head: () => ({
    meta: [
      { title: "Motivation — David Goggins & Khabib Nurmagomedov | IRONCODE" },
      {
        name: "description",
        content:
          "A wall of hard-earned words from David Goggins and Khabib Nurmagomedov, plus the mindset principles behind them.",
      },
      { property: "og:title", content: "Motivation — Goggins & Khabib" },
      {
        property: "og:description",
        content: "Discipline over motivation. Quotes and principles to carry into every session.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(quotesQuery),
  component: MotivationPage,
});

const principles = {
  "David Goggins": {
    icon: Flame,
    role: "Ultra-endurance athlete, retired Navy SEAL",
    intro:
      "Goggins built himself out of nothing: 300 pounds and broken, to Hell Week three times and 4,030 pull-ups in 17 hours. His whole method is doing the thing you least want to do, on purpose, every day.",
    rules: [
      "The 40% rule — when your mind says stop, you have 60% left.",
      "Callus the mind: seek the task you are avoiding and start there.",
      "Keep an accountability mirror — write your excuses on it and stare at them.",
      "Motivation is temporary. Drive is built by repetition.",
    ],
  },
  "Khabib Nurmagomedov": {
    icon: Mountain,
    role: "Undefeated 29-0 UFC lightweight champion",
    intro:
      "Khabib trained in the mountains of Dagestan, wrestled a bear cub as a boy and retired without a single loss. His edge was never talent — it was relentless preparation and total discipline.",
    rules: [
      "Out-prepare everyone: the fight is decided in the camp, not the cage.",
      "Pressure without pause — keep coming forward until they break.",
      "Stay humble in victory. Respect your family, your coach and your opponent.",
      "Discipline beats motivation, and consistency beats intensity.",
    ],
  },
} as const;

function MotivationPage() {
  const { data: quotes } = useSuspenseQuery(quotesQuery);

  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">
            Carry the boats
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl">
            When your body quits, your <span className="text-gold">mind</span> keeps lifting
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            Two men, two completely different worlds, one identical message: comfort is the enemy
            and discipline is the only thing you truly own.
          </p>
        </div>
      </section>

      {(Object.keys(principles) as (keyof typeof principles)[]).map((author) => {
        const p = principles[author];
        const list = quotes.filter((q) => q.author === author);
        return (
          <section key={author} className="border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-20">
              <div className="flex items-center gap-4">
                <p.icon className="h-8 w-8 text-gold" />
                <div>
                  <h2 className="text-3xl md:text-4xl">{author}</h2>
                  <p className="font-display text-[11px] uppercase tracking-[0.3em] text-gold">
                    {p.role}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-muted-foreground">{p.intro}</p>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  {list.map((q) => (
                    <figure key={q.id} className="rounded-sm border border-border bg-card p-6">
                      <blockquote className="text-lg leading-snug">"{q.text}"</blockquote>
                      {q.context && (
                        <figcaption className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                          {q.context}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
                <ul className="space-y-4 rounded-sm border border-gold/40 bg-card p-8">
                  <li className="font-display text-xs uppercase tracking-[0.3em] text-gold">
                    Principles to train by
                  </li>
                  {p.rules.map((r) => (
                    <li key={r} className="border-t border-border pt-4 text-foreground">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl">More iron wisdom</h2>
        <div className="mt-2 h-px w-24 gold-rule" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {quotes
            .filter((q) => !(q.author in principles))
            .map((q) => (
              <figure key={q.id} className="rounded-sm border border-border bg-card p-6">
                <blockquote className="text-lg leading-snug">"{q.text}"</blockquote>
                <figcaption className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-gold">
                  {q.author}
                </figcaption>
              </figure>
            ))}
        </div>
      </section>
    </div>
  );
}
