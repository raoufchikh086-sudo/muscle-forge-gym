import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  activityLevels,
  bodyFatNavy,
  macros,
  nutritionGoals,
  recipes,
  tdee,
  type ActivityKey,
  type GoalKey,
  type Sex,
} from "@/lib/nutrition";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "TDEE, Body Fat & Protein Calculator + Budget Meals | IRONCODE" },
      {
        name: "description",
        content:
          "Work out your daily calories, body fat percentage and protein target, then cook cheap high-protein meals for bulking or cutting.",
      },
      { property: "og:title", content: "Nutrition Calculators & Budget Muscle Meals" },
      {
        property: "og:description",
        content: "TDEE, body fat and macro calculators plus economical recipes for muscle gain or cutting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NutritionPage,
});

function NutritionPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(25);
  const [kg, setKg] = useState(75);
  const [cm, setCm] = useState(178);
  const [activity, setActivity] = useState<ActivityKey>("moderate");
  const [goal, setGoal] = useState<GoalKey>("bulk");
  const [waist, setWaist] = useState(84);
  const [neck, setNeck] = useState(38);
  const [hip, setHip] = useState(95);
  const [recipeFilter, setRecipeFilter] = useState<"all" | "bulk" | "cut">("all");

  const maintenance = useMemo(() => tdee(sex, kg, cm, age, activity), [sex, kg, cm, age, activity]);
  const target = useMemo(() => {
    const delta = nutritionGoals.find((g) => g.value === goal)!.delta;
    return maintenance * (1 + delta);
  }, [maintenance, goal]);
  const plan = useMemo(() => macros(target, kg, goal), [target, kg, goal]);
  const bf = useMemo(() => bodyFatNavy(sex, cm, waist, neck, hip), [sex, cm, waist, neck, hip]);

  const shown = recipes.filter(
    (r) => recipeFilter === "all" || r.goal === recipeFilter || r.goal === "both",
  );

  return (
    <div>
      <section className="bg-surface-light text-surface-light-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold-soft">
            Train hard · Eat right
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">Nutrition calculators</h1>
          <p className="mt-6 max-w-2xl text-surface-light-muted">
            Calories, body fat and protein — worked out properly with the Mifflin–St Jeor and US Navy
            formulas. Then cheap meals that actually hit the numbers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-sm border border-border bg-card p-6">
            <p className="font-display text-xs uppercase tracking-widest text-gold">You</p>
            <div className="mt-4 flex gap-2">
              {(["male", "female"] as Sex[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={`h-10 flex-1 rounded-sm border font-display text-xs uppercase tracking-widest ${
                    sex === s
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <Num label="Age" value={age} onChange={setAge} suffix="years" />
            <Num label="Weight" value={kg} onChange={setKg} suffix="kg" />
            <Num label="Height" value={cm} onChange={setCm} suffix="cm" />

            <p className="mt-6 font-display text-xs uppercase tracking-widest text-gold">Activity</p>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityKey)}
              className="mt-2 h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
              aria-label="Activity level"
            >
              {activityLevels.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>

            <p className="mt-6 font-display text-xs uppercase tracking-widest text-gold">Goal</p>
            <div className="mt-2 flex gap-2">
              {nutritionGoals.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`h-10 flex-1 rounded-sm border font-display text-[11px] uppercase tracking-widest ${
                    goal === g.value
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <p className="mt-8 font-display text-xs uppercase tracking-widest text-gold">
              Body fat (US Navy)
            </p>
            <Num label="Waist" value={waist} onChange={setWaist} suffix="cm" />
            <Num label="Neck" value={neck} onChange={setNeck} suffix="cm" />
            {sex === "female" && <Num label="Hips" value={hip} onChange={setHip} suffix="cm" />}
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Maintenance (TDEE)" value={`${Math.round(maintenance)} kcal`} />
              <Stat label="Your target" value={`${plan.calories} kcal`} highlight />
              <Stat
                label="Body fat"
                value={bf && bf > 0 ? `${bf.toFixed(1)} %` : "—"}
              />
            </div>

            <div className="rounded-sm border border-gold/40 bg-card p-6">
              <h2 className="text-2xl">Daily macros</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Macro label="Protein" grams={plan.protein} kcal={plan.protein * 4} total={plan.calories} />
                <Macro label="Carbs" grams={plan.carbs} kcal={plan.carbs * 4} total={plan.calories} />
                <Macro label="Fat" grams={plan.fat} kcal={plan.fat * 9} total={plan.calories} />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Protein is set at {(plan.protein / kg).toFixed(1)} g per kg of bodyweight — the range
                that protects muscle in a deficit and supports growth in a surplus.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl">Cheap high-protein meals</h2>
                <div className="flex gap-2">
                  {(["all", "bulk", "cut"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setRecipeFilter(f)}
                      className={`h-9 rounded-sm border px-4 font-display text-[11px] uppercase tracking-widest ${
                        recipeFilter === f
                          ? "border-gold bg-gold text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                      }`}
                    >
                      {f === "all" ? "All" : f === "bulk" ? "Muscle gain" : "Cutting"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {shown.map((r) => (
                  <article key={r.slug} className="rounded-sm border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl">{r.name}</h3>
                      <span className="whitespace-nowrap font-display text-[11px] uppercase tracking-widest text-gold">
                        {r.costPerServing}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                      {r.kcal} kcal · P {r.protein}g · C {r.carbs}g · F {r.fat}g
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                      {r.ingredients.map((i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-gold">·</span>
                          {i}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm">{r.steps}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="font-display text-[11px] uppercase tracking-widest text-muted-foreground">
        {label} ({suffix})
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
      />
    </label>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-sm border p-5 ${highlight ? "border-gold bg-gold/10" : "border-border bg-card"}`}
    >
      <p className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-gold">{value}</p>
    </div>
  );
}

function Macro({
  label,
  grams,
  kcal,
  total,
}: {
  label: string;
  grams: number;
  kcal: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((kcal / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xs uppercase tracking-widest">{label}</span>
        <span className="font-display text-2xl text-gold">{grams} g</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
        <div className="h-2 rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {kcal} kcal · {pct}%
      </p>
    </div>
  );
}
