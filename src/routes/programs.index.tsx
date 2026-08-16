import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPrograms } from "@/lib/public-content.functions";
import { programImage, programImageAlt } from "@/lib/program-images";
import { useT } from "@/lib/i18n/language-provider";

const programsQuery = queryOptions({ queryKey: ["programs"], queryFn: () => listPrograms() });

type Env = "all" | "gym" | "home_equipment" | "calisthenics";
type Level = "all" | "beginner" | "intermediate" | "advanced";
type Goal = "all" | "mass" | "strength" | "cut" | "endurance";

type Search = { env?: Env; level?: Level; goal?: Goal };

const envLabels: Record<Exclude<Env, "all">, string> = {
  gym: "Gym",
  home_equipment: "Home + machines",
  calisthenics: "Calisthenics",
};

export const Route = createFileRoute("/programs/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    env: (["gym", "home_equipment", "calisthenics"].includes(String(search["env"]))
      ? (search["env"] as Env)
      : "all") as Env,
    level: (["beginner", "intermediate", "advanced"].includes(String(search["level"]))
      ? (search["level"] as Level)
      : "all") as Level,
    goal: (["mass", "strength", "cut", "endurance"].includes(String(search["goal"]))
      ? (search["goal"] as Goal)
      : "all") as Goal,
  }),
  head: () => ({
    meta: [
      { title: "Training Programs — Gym, Home & Calisthenics | IRONCODE" },
      {
        name: "description",
        content:
          "Browse bodybuilding and calisthenics programs by where you train, your level and your goal: mass, strength, cutting or endurance.",
      },
      { property: "og:title", content: "Training Programs — Gym, Home & Calisthenics" },
      {
        property: "og:description",
        content: "Filter programs by environment, level and goal. Gym, home machines or bodyweight.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(programsQuery),
  component: ProgramsPage,
});

function FilterRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 font-display text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-sm border px-3 py-1.5 font-display text-xs uppercase tracking-widest transition-colors ${
            value === o.value
              ? "border-gold bg-gold text-primary-foreground"
              : "border-border text-muted-foreground hover:border-gold hover:text-gold"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ProgramsPage() {
  const { data: programs } = useSuspenseQuery(programsQuery);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const env = search.env ?? "all";
  const level = search.level ?? "all";
  const goal = search.goal ?? "all";

  const filtered = programs.filter(
    (p) =>
      (env === "all" || p.environment === env) &&
      (level === "all" || p.level === level) &&
      (goal === "all" || p.goal === goal),
  );

  const update = (patch: Search) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl md:text-5xl">Programs</h1>
      <div className="mt-2 h-px w-24 gold-rule" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Every program is written for a specific setup. Pick where you train, how experienced you
        are and what you actually want from the next few months.
      </p>

      <div className="mt-10 flex flex-col gap-4 rounded-sm border border-border bg-card p-6">
        <FilterRow
          label="Where"
          value={env}
          onChange={(env) => update({ env })}
          options={[
            { value: "all", label: "All" },
            { value: "gym", label: "Gym" },
            { value: "home_equipment", label: "Home + machines" },
            { value: "calisthenics", label: "No equipment" },
          ]}
        />
        <FilterRow
          label="Level"
          value={level}
          onChange={(level) => update({ level })}
          options={[
            { value: "all", label: "All" },
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
        />
        <FilterRow
          label="Goal"
          value={goal}
          onChange={(goal) => update({ goal })}
          options={[
            { value: "all", label: "All" },
            { value: "mass", label: "Mass" },
            { value: "strength", label: "Strength" },
            { value: "cut", label: "Cut" },
            { value: "endurance", label: "Endurance" },
          ]}
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to="/programs/$slug"
            params={{ slug: p.slug }}
            className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-gold"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={programImage(p.slug)}
                alt={programImageAlt(p.title, p.environment)}
                width={1280}
                height={720}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <span className="absolute bottom-3 start-4 font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                {envLabels[p.environment as Exclude<Env, "all">]}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl">{p.title}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.summary}</p>
              <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <div>
                  <dt className="text-gold">{t("programs.filterLevel")}</dt>
                  <dd className="capitalize">{p.level}</dd>
                </div>
                <div>
                  <dt className="text-gold">{t("programs.filterGoal")}</dt>
                  <dd className="capitalize">{p.goal}</dd>
                </div>
                <div>
                  <dt className="text-gold">{t("programs.length")}</dt>
                  <dd>
                    {p.weeks} {t("programs.weeks")}
                  </dd>
                </div>
              </dl>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">{t("programs.empty")}</p>
      )}
    </div>
  );
}
