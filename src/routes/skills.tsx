import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Play } from "lucide-react";
import { skillPaths, type SkillPath } from "@/lib/skill-tree";
import { techniqueEmbedUrl } from "@/lib/technique-videos";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Calisthenics Skill Tree — Muscle-up, Handstand, Front Lever | IRONCODE" },
      {
        name: "description",
        content:
          "Step-by-step progressions for the pull-up, muscle-up, handstand, front lever, pistol squat and human flag, with targets for every stage.",
      },
      { property: "og:title", content: "Calisthenics Skill Tree" },
      {
        property: "og:description",
        content: "Interactive progression paths to master the biggest calisthenics skills.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const [active, setActive] = useState<SkillPath>(skillPaths[0]!);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const key = (s: string) => `${active.slug}:${s}`;
  const completed = active.steps.filter((s) => done[key(s.name)]).length;
  const pct = Math.round((completed / active.steps.length) * 100);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">
            Progression · Not luck
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Calisthenics skill tree</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Every skill is a ladder. Pick your goal, tick off each stage when you hit the target, and
            the next one unlocks itself.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-wrap gap-2">
          {skillPaths.map((s) => (
            <button
              key={s.slug}
              onClick={() => setActive(s)}
              className={`h-11 rounded-sm border px-5 font-display text-xs uppercase tracking-widest transition-colors ${
                active.slug === s.slug
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-gold hover:text-gold"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="rounded-sm border border-gold/40 bg-card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl">{active.name}</h2>
                <span className="rounded-sm bg-gold/15 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-gold">
                  {active.difficulty}
                </span>
                <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                  {active.timeframe}
                </span>
              </div>
              <p className="mt-3 text-muted-foreground">{active.tagline}</p>
              <p className="mt-4 font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                Prerequisites: {active.prerequisites.join(" · ")}
              </p>

              <div className="mt-5">
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 font-display text-[11px] uppercase tracking-widest text-gold">
                  {completed} / {active.steps.length} stages cleared
                </p>
              </div>
            </div>

            <ol className="mt-8 relative border-l border-border pl-8">
              {active.steps.map((s, i) => {
                const isDone = !!done[key(s.name)];
                return (
                  <li key={s.name} className="relative pb-8 last:pb-0">
                    <button
                      onClick={() => setDone((d) => ({ ...d, [key(s.name)]: !isDone }))}
                      aria-label={`Mark ${s.name} as ${isDone ? "not done" : "done"}`}
                      className="absolute -left-[41px] top-0 rounded-full bg-background"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-6 w-6 text-gold" />
                      ) : (
                        <Circle className="h-6 w-6 text-border" />
                      )}
                    </button>
                    <p className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                      Stage {i + 1} · target {s.target}
                    </p>
                    <h3 className={`mt-1 text-xl ${isDone ? "text-muted-foreground line-through" : ""}`}>
                      {s.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div>
            <div className="overflow-hidden rounded-sm border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <Play className="h-4 w-4 text-gold" />
                <span className="font-display text-xs uppercase tracking-widest">
                  {active.name} — video guide
                </span>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  key={active.slug}
                  className="h-full w-full"
                  src={techniqueEmbedUrl(active.videoQuery)}
                  title={`${active.name} progression video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
