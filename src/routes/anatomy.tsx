import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { BodyMap } from "@/components/anatomy/body-map";
import {
  muscleRegions,
  organSystems,
  type AnatomySide,
  type MuscleRegion,
} from "@/lib/anatomy";

export const Route = createFileRoute("/anatomy")({
  head: () => ({
    meta: [
      { title: "Muscle & Body Anatomy Explorer | IRONCODE" },
      {
        name: "description",
        content:
          "Rotate the body, tap any muscle and see what it does, how to train it and which organ systems drive your performance.",
      },
      { property: "og:title", content: "Muscle & Body Anatomy Explorer" },
      {
        property: "og:description",
        content: "Interactive front and back anatomy map with training notes for every muscle group.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnatomyPage,
});

function AnatomyPage() {
  const [side, setSide] = useState<AnatomySide>("front");
  const [selected, setSelected] = useState<MuscleRegion | null>(
    muscleRegions.find((m) => m.id === "chest") ?? null,
  );

  function flip() {
    const next: AnatomySide = side === "front" ? "back" : "front";
    setSide(next);
    setSelected(muscleRegions.find((m) => m.side === next) ?? null);
  }

  const sideRegions = muscleRegions.filter((m) => m.side === side);

  return (
    <div>
      <section className="bg-surface-light text-surface-light-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold-soft">
            Know the machine
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Anatomy explorer</h1>
          <p className="mt-6 max-w-2xl text-surface-light-muted">
            Rotate the body, tap a muscle and learn exactly what it does, the movements that build
            it, and how the organs underneath keep the whole system running.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex rounded-sm border border-border p-1">
                {(["front", "back"] as AnatomySide[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSide(s);
                      setSelected(muscleRegions.find((m) => m.side === s) ?? null);
                    }}
                    className={`h-9 px-4 font-display text-xs uppercase tracking-widest transition-colors ${
                      side === s ? "bg-gold text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={flip}
                className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-gold"
              >
                <RotateCcw className="h-4 w-4" /> Rotate
              </button>
            </div>

            <div
              className="mt-6 h-[520px] [perspective:1200px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="h-full w-full transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: side === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div
                  className="h-full w-full"
                  style={{ transform: side === "back" ? "rotateY(180deg)" : undefined }}
                >
                  <BodyMap side={side} selected={selected} onSelect={setSelected} />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {sideRegions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`h-8 rounded-sm border px-3 font-display text-[10px] uppercase tracking-widest ${
                    selected?.id === m.id
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            {selected && (
              <div className="rounded-sm border border-gold/40 bg-card p-8">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                  {selected.latin}
                </p>
                <h2 className="mt-2 text-3xl">{selected.name}</h2>
                <p className="mt-4 text-muted-foreground">{selected.function}</p>

                <h3 className="mt-8 font-display text-xs uppercase tracking-widest text-gold">
                  Best exercises
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.bestExercises.map((e) => (
                    <li
                      key={e}
                      className="rounded-sm border border-border px-3 py-2 text-sm text-foreground"
                    >
                      {e}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-8 font-display text-xs uppercase tracking-widest text-gold">
                  Coaching note
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{selected.trainingNote}</p>
              </div>
            )}

            <h2 className="mt-12 text-2xl">Organs & systems that drive performance</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {organSystems.map((o) => (
                <article key={o.id} className="rounded-sm border border-border bg-card p-5">
                  <h3 className="text-lg">{o.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{o.role}</p>
                  <p className="mt-3 text-sm text-foreground">{o.training}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {o.markers.map((m) => (
                      <li
                        key={m}
                        className="rounded-sm bg-gold/10 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-gold"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
