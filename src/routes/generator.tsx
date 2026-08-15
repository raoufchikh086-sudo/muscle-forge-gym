import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, Wand2 } from "lucide-react";
import {
  equipmentOptions,
  generatePlan,
  trainingGoals,
  type EquipmentKey,
  type GeneratedPlan,
  type TrainingGoal,
} from "@/lib/program-generator";
import { levels, type Level } from "@/lib/technique-videos";

export const Route = createFileRoute("/generator")({
  head: () => ({
    meta: [
      { title: "Free Workout Plan Generator — Gym or Home | IRONCODE" },
      {
        name: "description",
        content:
          "Pick your level, your equipment and your goal and get a personalised weekly training schedule in seconds — gym, home or bodyweight only.",
      },
      { property: "og:title", content: "Free Workout Plan Generator" },
      {
        property: "og:description",
        content: "Personalised weekly training schedules for bulking, cutting or general fitness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeneratorPage,
});

const levelChoices = levels.filter((l) => l.value !== "all") as { value: Level; label: string }[];

function GeneratorPage() {
  const [level, setLevel] = useState<Level>("beginner");
  const [equipment, setEquipment] = useState<EquipmentKey>("none");
  const [goal, setGoal] = useState<TrainingGoal>("fitness");
  const [days, setDays] = useState(4);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">
            Built for you in seconds
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Program generator</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Tell us what you have and what you want. You get a full weekly schedule with sets, reps
            and rest — whether you train in a full gym or on a kitchen floor with nothing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <div className="rounded-sm border border-border bg-card p-6">
            <Field label="Your level">
              <div className="flex flex-wrap gap-2">
                {levelChoices.map((l) => (
                  <Chip key={l.value} active={level === l.value} onClick={() => setLevel(l.value)}>
                    {l.label}
                  </Chip>
                ))}
              </div>
            </Field>

            <Field label="Equipment you have">
              <div className="grid gap-2">
                {equipmentOptions.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setEquipment(e.value)}
                    className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left transition-colors ${
                      equipment === e.value
                        ? "border-gold bg-gold/10"
                        : "border-border hover:border-gold/60"
                    }`}
                  >
                    <span className="font-display text-sm uppercase tracking-widest">{e.label}</span>
                    <span className="text-xs text-muted-foreground">{e.hint}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Your goal">
              <div className="grid gap-2">
                {trainingGoals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`rounded-sm border px-4 py-3 text-left transition-colors ${
                      goal === g.value ? "border-gold bg-gold/10" : "border-border hover:border-gold/60"
                    }`}
                  >
                    <span className="font-display text-sm uppercase tracking-widest">{g.label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{g.blurb}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`Days per week — ${days}`}>
              <input
                type="range"
                min={3}
                max={6}
                step={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
                aria-label="Days per week"
              />
            </Field>

            <button
              onClick={() => setPlan(generatePlan({ level, equipment, goal, daysPerWeek: days }))}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-gold font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Wand2 className="h-4 w-4" /> Build my week
            </button>
          </div>

          <div>
            {!plan ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-sm border border-dashed border-border p-12 text-center">
                <Dumbbell className="h-10 w-10 text-gold" />
                <p className="mt-4 max-w-sm text-muted-foreground">
                  Your personalised week will appear here. Nothing to sign up for — build as many
                  variations as you like.
                </p>
              </div>
            ) : (
              <div>
                <div className="rounded-sm border border-gold/40 bg-card p-6">
                  <h2 className="text-2xl">{plan.title}</h2>
                  <p className="mt-2 text-muted-foreground">{plan.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {plan.notes.map((n) => (
                      <li key={n} className="flex gap-2">
                        <span className="text-gold">—</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {plan.days.map((d) => (
                    <article key={d.day} className="rounded-sm border border-border bg-card p-5">
                      <p className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                        {d.day}
                      </p>
                      <h3 className="mt-1 text-xl">{d.focus}</h3>
                      <ul className="mt-4 divide-y divide-border">
                        {d.exercises.map((e, i) => (
                          <li key={`${e.name}-${i}`} className="flex items-center justify-between py-2">
                            <span className="text-sm">{e.name}</span>
                            <span className="font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                              {e.sets} × {e.reps} · {e.rest}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="mb-3 font-display text-xs uppercase tracking-widest text-gold">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 rounded-sm border px-4 font-display text-xs uppercase tracking-widest transition-colors ${
        active
          ? "border-gold bg-gold text-primary-foreground"
          : "border-border text-muted-foreground hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}
