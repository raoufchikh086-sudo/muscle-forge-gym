import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import {
  techniqueCategories,
  techniqueVideos,
  type TechniqueCategory,
  type TechniqueVideo,
} from "@/lib/technique-videos";
import { ExerciseVideoModal } from "@/components/technique/exercise-video-modal";

export const Route = createFileRoute("/technique")({
  head: () => ({
    meta: [
      { title: "Technique Library — Exercise Videos | IRONCODE" },
      {
        name: "description",
        content:
          "Watch how every lift is done: barbell, dumbbell and calisthenics movements with video demonstrations and coaching cues.",
      },
      { property: "og:title", content: "Technique Library — Exercise Videos" },
      {
        property: "og:description",
        content: "Video demonstrations and cues for gym, home and bodyweight training.",
      },
    ],
  }),
  component: TechniquePage,
});

function TechniquePage() {
  const [filter, setFilter] = useState<TechniqueCategory | "all">("all");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [active, setActive] = useState<TechniqueVideo | null>(null);
  const list = techniqueVideos.filter(
    (v) =>
      (filter === "all" || v.category === filter) &&
      (muscle === "all" || v.muscleGroup === muscle) &&
      (level === "all" || v.level === level),
  );

  return (
    <div>
      <section className="bg-surface-light text-surface-light-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold-soft">
            Watch · Copy · Repeat
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Technique library</h1>
          <p className="mt-6 max-w-2xl text-surface-light-muted">
            Every rep you do wrong is a rep you'll have to fix later. Watch the movement, read the
            three cues that matter, then go and train it.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {techniqueCategories.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`h-10 rounded-sm border px-4 font-display text-xs uppercase tracking-widest transition-colors ${
                  filter === c.value
                    ? "border-gold bg-gold text-primary-foreground"
                    : "border-surface-light-border text-surface-light-muted hover:border-gold hover:text-gold-soft"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <button
              key={v.slug}
              onClick={() => setActive(v)}
              className="group rounded-sm border border-border bg-card p-6 text-left transition-colors hover:border-gold"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-primary-foreground">
                <Play className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl">{v.name}</h2>
              <p className="mt-1 font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                {v.muscles}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{v.cues[0]}</p>
              <span className="mt-5 inline-block font-display text-xs uppercase tracking-widest text-gold">
                Watch demonstration
              </span>
            </button>
          ))}
        </div>
      </section>

      {active && <ExerciseVideoModal video={active} onClose={() => setActive(null)} />}
    </div>
  );
}
