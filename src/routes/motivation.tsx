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
    initials: "DG",
    role: "Ultra-endurance athlete, retired Navy SEAL",
    theme: "light" as const,
    intro:
      "Goggins built himself out of nothing: 300 pounds and broken, to Hell Week three times and 4,030 pull-ups in 17 hours. His whole method is doing the thing you least want to do, on purpose, every day.",
    facts: [
      ["297 lb → 191 lb", "in under three months"],
      ["3×", "Navy SEAL Hell Week"],
      ["4,030", "pull-ups in 17 hours"],
      ["100+ miles", "ultra races on broken feet"],
    ],
    rules: [
      "The 40% rule — when your mind says stop, you have 60% left.",
      "Callus the mind: seek the task you are avoiding and start there.",
      "Keep an accountability mirror — write your excuses on it and stare at them.",
      "Motivation is temporary. Drive is built by repetition.",
    ],
  },
  "Khabib Nurmagomedov": {
    icon: Mountain,
    initials: "KN",
    role: "Undefeated 29-0 UFC lightweight champion",
    theme: "dark" as const,
    intro:
      "Khabib trained in the mountains of Dagestan, wrestled a bear cub as a boy and retired without a single loss. His edge was never talent — it was relentless preparation and total discipline.",
    facts: [
      ["29–0", "professional record"],
      ["Dagestan", "mountain training camps"],
      ["UFC 229", "biggest PPV in history"],
      ["Retired", "undefeated, on his word"],
    ],
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
        const light = p.theme === "light";
        return (
          <section
            key={author}
            className={
              light
                ? "bg-surface-light text-surface-light-foreground"
                : "border-y border-border bg-background"
            }
          >
            <div className="mx-auto max-w-6xl px-4 py-20">
              <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
                <div
                  className={`relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-sm border p-6 ${
                    light ? "border-surface-light-border bg-white" : "border-border bg-card"
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center font-display text-[9rem] font-bold leading-none text-gold/25"
                  >
                    {p.initials}
                  </span>
                  <div className="relative">
                    <p.icon className="h-7 w-7 text-gold" />
                    <h2 className="mt-4 text-2xl">{author}</h2>
                    <p className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                      {p.role}
                    </p>
                  </div>
                </div>

                <div>
                  <p
                    className={`max-w-3xl text-lg ${light ? "text-surface-light-muted" : "text-muted-foreground"}`}
                  >
                    {p.intro}
                  </p>

                  <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {p.facts.map(([value, label]) => (
                      <div
                        key={label}
                        className={`rounded-sm border p-4 ${
                          light ? "border-surface-light-border bg-white" : "border-border bg-card"
                        }`}
                      >
                        <dt className="font-display text-xl text-gold">{value}</dt>
                        <dd
                          className={`mt-1 text-xs uppercase tracking-widest ${
                            light ? "text-surface-light-muted" : "text-muted-foreground"
                          }`}
                        >
                          {label}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      {list.map((q) => (
                        <figure
                          key={q.id}
                          className={`rounded-sm border p-6 ${
                            light ? "border-surface-light-border bg-white" : "border-border bg-card"
                          }`}
                        >
                          <blockquote className="text-lg leading-snug">"{q.text}"</blockquote>
                          {q.context && (
                            <figcaption
                              className={`mt-3 text-xs uppercase tracking-widest ${
                                light ? "text-surface-light-muted" : "text-muted-foreground"
                              }`}
                            >
                              {q.context}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                    <ul
                      className={`space-y-4 rounded-sm border border-gold/40 p-8 ${
                        light ? "bg-white" : "bg-card"
                      }`}
                    >
                      <li className="font-display text-xs uppercase tracking-[0.3em] text-gold">
                        Principles to train by
                      </li>
                      {p.rules.map((r) => (
                        <li
                          key={r}
                          className={`border-t pt-4 ${
                            light ? "border-surface-light-border" : "border-border"
                          }`}
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
