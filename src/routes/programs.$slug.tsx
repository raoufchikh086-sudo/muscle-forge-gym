import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProgram, type ProgramExercise } from "@/lib/public-content.functions";

const programQuery = (slug: string) =>
  queryOptions({
    queryKey: ["program", slug],
    queryFn: () => getProgram({ data: { slug } }),
  });

export const Route = createFileRoute("/programs/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(programQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Program not found — IRONCODE" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.program.title} — ${loaderData.program.weeks} Week Program | IRONCODE`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.program.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.program.summary },
      ],
    };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl">This program didn't load</h1>
      <Link to="/programs" className="mt-6 inline-block text-gold">
        Back to programs
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl">Program not found</h1>
      <Link to="/programs" className="mt-6 inline-block text-gold">
        Back to programs
      </Link>
    </div>
  ),
  component: ProgramDetail,
});

function ProgramDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(programQuery(slug));
  if (!data) return null;
  const { program, days } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Link to="/programs" className="font-display text-xs uppercase tracking-widest text-gold">
        ← All programs
      </Link>
      <h1 className="mt-6 text-4xl md:text-5xl">{program.title}</h1>
      <div className="mt-2 h-px w-24 gold-rule" />
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{program.summary}</p>

      <dl className="mt-10 grid grid-cols-2 gap-4 rounded-sm border border-border bg-card p-6 md:grid-cols-5">
        {[
          ["Level", program.level],
          ["Goal", program.goal],
          ["Weeks", String(program.weeks)],
          ["Days / week", String(program.days_per_week)],
          ["Equipment", program.equipment ?? "None"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">{k}</dt>
            <dd className="mt-1 text-sm capitalize text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-14 text-2xl">The weekly split</h2>
      <div className="mt-2 h-px w-16 gold-rule" />

      {days.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          Detailed sessions for this program are being finalised. Message a coach in the chat and
          they'll send you the current week.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {days.map((day) => {
          const exercises = (day.exercises as unknown as ProgramExercise[]) ?? [];
          return (
            <section key={day.id} className="rounded-sm border border-border bg-card">
              <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-6 py-4">
                <h3 className="text-xl">
                  Day {day.day_number} — {day.title}
                </h3>
                <span className="font-display text-[11px] uppercase tracking-[0.3em] text-gold">
                  {day.focus}
                </span>
              </header>
              <div className="divide-y divide-border">
                {exercises.map((ex) => (
                  <div
                    key={ex.name}
                    className="grid gap-2 px-6 py-4 md:grid-cols-[2fr_repeat(3,minmax(0,0.6fr))] md:items-center"
                  >
                    <div>
                      <p className="font-medium text-foreground">{ex.name}</p>
                      {ex.note && <p className="text-xs text-muted-foreground">{ex.note}</p>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-gold">Sets </span>
                      {ex.sets}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-gold">Reps </span>
                      {ex.reps}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-gold">Rest </span>
                      {ex.rest}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-14 rounded-sm border border-gold/40 bg-card p-8">
        <h2 className="text-2xl">Want this program adapted to you?</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A premium coach rewrites the sets, loads and nutrition around your body, schedule and
          equipment, then reviews your form every week.
        </p>
        <Link
          to="/coaching"
          className="mt-6 inline-flex h-12 items-center rounded-sm bg-gold px-6 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
        >
          See coaching
        </Link>
      </div>
    </div>
  );
}
