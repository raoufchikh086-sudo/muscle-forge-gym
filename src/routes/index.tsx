import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Dumbbell, Home as HomeIcon, Activity, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-gym.jpg";
import calisthenicsImg from "@/assets/calisthenics.jpg";
import { listPrograms, listQuotes } from "@/lib/public-content.functions";
import { programImage, programImageAlt } from "@/lib/program-images";
import { useT } from "@/lib/i18n/language-provider";

const programsQuery = queryOptions({ queryKey: ["programs"], queryFn: () => listPrograms() });
const quotesQuery = queryOptions({ queryKey: ["quotes"], queryFn: () => listQuotes() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IRONCODE — Build Muscle in the Gym or at Home" },
      {
        name: "description",
        content:
          "Bodybuilding and calisthenics programs for the gym, home machines or pure bodyweight, with normal and premium coaching, a gear shop and daily motivation.",
      },
      { property: "og:title", content: "IRONCODE — Build Muscle in the Gym or at Home" },
      {
        property: "og:description",
        content:
          "Programs, coaching, gear and motivation for bodybuilding and calisthenics — anywhere you train.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(programsQuery),
      context.queryClient.ensureQueryData(quotesQuery),
    ]);
  },
  component: Index,
});

const paths = [
  {
    icon: Dumbbell,
    title: "In the gym",
    text: "Barbells, racks and machines. Push/pull/legs, strength cycles and shred protocols.",
    env: "gym",
  },
  {
    icon: HomeIcon,
    title: "At home with machines",
    text: "Dumbbells, a bench, a rack or a multi-station. Full programs built around what you own.",
    env: "home_equipment",
  },
  {
    icon: Activity,
    title: "Calisthenics, no equipment",
    text: "Bodyweight only. Push-ups to muscle-ups, squats to pistols, planks to front levers.",
    env: "calisthenics",
  },
] as const;

function Index() {
  const { data: programs } = useSuspenseQuery(programsQuery);
  const { data: quotes } = useSuspenseQuery(quotesQuery);
  const featured = programs.slice(0, 3);
  const strip = quotes.filter((q) => q.featured).slice(0, 3);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Athlete lifting a loaded barbell in a dark gym"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-24">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-gold">
            Bodybuilding · Calisthenics
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[0.95] md:text-7xl">
            Your body is the <span className="text-gold">only machine</span> you can't replace
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Train in the gym, in your garage or in your living room. With machines or with nothing
            at all. IRONCODE gives you the program, the coach and the gear.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/programs"
              className="inline-flex h-12 items-center gap-2 rounded-sm bg-gold px-6 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
            >
              Start training <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/coaching"
              className="inline-flex h-12 items-center rounded-sm border border-gold px-6 font-display text-sm uppercase tracking-widest text-gold hover:bg-gold/10"
            >
              Get a coach
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl md:text-4xl">Where do you train?</h2>
        <div className="mt-2 h-px w-24 gold-rule" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {paths.map((p) => (
            <Link
              key={p.env}
              to="/programs"
              search={{ env: p.env }}
              className="group rounded-sm border border-border bg-card p-8 transition-colors hover:border-gold"
            >
              <p.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-6 text-xl">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-gold">
                See programs <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl">Featured programs</h2>
              <div className="mt-2 h-px w-24 gold-rule" />
            </div>
            <Link
              to="/programs"
              className="hidden font-display text-xs uppercase tracking-widest text-gold md:inline"
            >
              All programs
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/programs/$slug"
                params={{ slug: p.slug }}
                className="group overflow-hidden rounded-sm border border-border bg-background transition-colors hover:border-gold"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <span className="absolute bottom-3 start-4 font-display text-[10px] uppercase tracking-[0.3em] text-gold">
                    {p.level} · {p.goal}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
                  <p className="mt-5 text-xs text-muted-foreground">
                    {p.weeks} weeks · {p.days_per_week} days/week
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        <img
          src={calisthenicsImg}
          alt="Athlete performing a muscle-up on an outdoor bar at sunrise"
          width={1280}
          height={960}
          loading="lazy"
          className="rounded-sm border border-border object-cover"
        />
        <div>
          <h2 className="text-3xl md:text-4xl">No gym? No excuse.</h2>
          <div className="mt-2 h-px w-24 gold-rule" />
          <p className="mt-6 text-muted-foreground">
            Bodyweight training built the strongest athletes on the street long before machines
            existed. Our calisthenics tracks take you from your first clean push-up to muscle-ups,
            front levers and handstands — with progressions for every level.
          </p>
          <Link
            to="/programs"
            search={{ env: "calisthenics" }}
            className="mt-8 inline-flex h-12 items-center rounded-sm border border-gold px-6 font-display text-sm uppercase tracking-widest text-gold hover:bg-gold/10"
          >
            Bodyweight programs
          </Link>
        </div>
      </section>

      <section className="bg-surface-light text-surface-light-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.4em] text-gold-soft">
              Video technique library
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl">See every rep before you do it</h2>
            <p className="mt-6 text-surface-light-muted">
              Squats, deadlifts, presses, pull-ups, muscle-ups, pistols and levers — each movement
              comes with a video demonstration and the three cues that actually change your form.
            </p>
            <Link
              to="/technique"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-gold px-6 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
            >
              Watch training videos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Barbell back squat", "Pull-up", "Dumbbell bench press", "Muscle-up"].map((n) => (
              <Link
                key={n}
                to="/technique"
                className="flex aspect-video items-end rounded-sm border border-surface-light-border bg-white p-4 transition-colors hover:border-gold"
              >
                <span className="font-display text-sm uppercase tracking-widest">{n}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card">

        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-3xl md:text-4xl">Words that carry the weight</h2>
          <div className="mt-2 h-px w-24 gold-rule" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {strip.map((q) => (
              <figure key={q.id} className="rounded-sm border border-border bg-background p-6">
                <blockquote className="text-lg leading-snug">"{q.text}"</blockquote>
                <figcaption className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-gold">
                  {q.author}
                </figcaption>
              </figure>
            ))}
          </div>
          <Link
            to="/motivation"
            className="mt-10 inline-flex h-12 items-center rounded-sm bg-gold px-6 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
          >
            Goggins & Khabib wall
          </Link>
        </div>
      </section>
    </div>
  );
}
