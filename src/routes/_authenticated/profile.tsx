import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Goal = "mass" | "cut" | "strength" | "endurance";
type Level = "beginner" | "intermediate" | "advanced";

const GOALS: Goal[] = ["mass", "cut", "strength", "endurance"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile & Body Stats — IRONCODE" },
      {
        name: "description",
        content: "Update your personal details and log weight, body fat and key measurements.",
      },
      { property: "og:title", content: "Your Profile — IRONCODE" },
      { property: "og:description", content: "Personal details and body stat tracking." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const statSchema = z.object({
  weight_kg: z.number().min(20).max(400),
  body_fat_pct: z.number().min(1).max(70).nullable(),
  waist_cm: z.number().min(30).max(250).nullable(),
  arm_cm: z.number().min(15).max(100).nullable(),
  note: z.string().max(500),
});

const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v));

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState<Goal>("mass");
  const [experience, setExperience] = useState<Level>("beginner");

  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");
  const [arm, setArm] = useState("");
  const [note, setNote] = useState("");

  const profile = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const stats = useQuery({
    queryKey: ["body_stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("body_stats")
        .select("*")
        .order("logged_on", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const p = profile.data;
    if (!p) return;
    setDisplayName(p.display_name ?? "");
    setBio(p.bio ?? "");
    setAge(p.age ? String(p.age) : "");
    setHeight(p.height_cm ? String(p.height_cm) : "");
    if (p.goal) setGoal(p.goal);
    if (p.experience) setExperience(p.experience);
  }, [profile.data]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim().slice(0, 100) || null,
        bio: bio.trim().slice(0, 500) || null,
        age: age ? Math.min(100, Math.max(12, Number(age))) : null,
        height_cm: height ? Math.min(250, Math.max(100, Number(height))) : null,
        goal,
        experience,
      })
      .eq("id", user.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
  }

  async function addStat(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const parsed = statSchema.safeParse({
      weight_kg: Number(weight),
      body_fat_pct: numOrNull(bodyFat),
      waist_cm: numOrNull(waist),
      arm_cm: numOrNull(arm),
      note: note.trim(),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your numbers");
      return;
    }
    const { error } = await supabase.from("body_stats").insert({
      user_id: user.id,
      weight_kg: parsed.data.weight_kg,
      body_fat_pct: parsed.data.body_fat_pct,
      waist_cm: parsed.data.waist_cm,
      arm_cm: parsed.data.arm_cm,
      note: parsed.data.note || null,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setWeight("");
    setBodyFat("");
    setWaist("");
    setArm("");
    setNote("");
    toast.success("Entry logged");
    qc.invalidateQueries({ queryKey: ["body_stats", user.id] });
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const field =
    "mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 outline-none focus:border-gold";
  const label = "block font-display text-xs uppercase tracking-widest";

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Your profile</h1>
          <div className="mt-2 h-px w-24 gold-rule" />
        </div>
        <button
          onClick={signOut}
          className="font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive"
        >
          Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="rounded-sm border border-border bg-card p-6">
          <h2 className="text-2xl">Personal information</h2>
          <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>

          <label htmlFor="displayName" className={`${label} mt-6`}>
            Display name
          </label>
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            className={field}
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className={label}>
                Age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="height" className={label}>
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={field}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="goal" className={label}>
                Goal
              </label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className={field}
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="experience" className={label}>
                Experience
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value as Level)}
                className={field}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor="bio" className={`${label} mt-4`}>
            About you
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={3}
            className="mt-2 w-full rounded-sm border border-border bg-background p-4 outline-none focus:border-gold"
          />

          <button className="mt-6 h-12 w-full rounded-sm bg-gold font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90">
            Save profile
          </button>
        </form>

        <form onSubmit={addStat} className="rounded-sm border border-border bg-card p-6">
          <h2 className="text-2xl">Log body stats</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className={label}>
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="bf" className={label}>
                Body fat %
              </label>
              <input
                id="bf"
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="waist" className={label}>
                Waist (cm)
              </label>
              <input
                id="waist"
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="arm" className={label}>
                Arm (cm)
              </label>
              <input
                id="arm"
                type="number"
                step="0.1"
                value={arm}
                onChange={(e) => setArm(e.target.value)}
                className={field}
              />
            </div>
          </div>
          <label htmlFor="note" className={`${label} mt-4`}>
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            className="mt-2 w-full rounded-sm border border-border bg-background p-4 outline-none focus:border-gold"
          />
          <button className="mt-6 h-12 w-full rounded-sm border border-gold font-display text-sm uppercase tracking-widest text-gold hover:bg-gold/10">
            Add entry
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl">History</h2>
        <div className="mt-4 overflow-x-auto rounded-sm border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border font-display text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Body fat</th>
                <th className="p-4">Waist</th>
                <th className="p-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {(stats.data ?? []).map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="p-4">{new Date(s.logged_on).toLocaleDateString()}</td>
                  <td className="p-4">{s.weight_kg ? `${s.weight_kg} kg` : "—"}</td>
                  <td className="p-4">{s.body_fat_pct ? `${s.body_fat_pct}%` : "—"}</td>
                  <td className="p-4">{s.waist_cm ? `${s.waist_cm} cm` : "—"}</td>
                  <td className="p-4 text-muted-foreground">{s.note ?? "—"}</td>
                </tr>
              ))}
              {(stats.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No entries yet — log your first weigh-in above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        to="/chat"
        className="mt-8 inline-block font-display text-sm uppercase tracking-widest text-gold"
      >
        Message your coach →
      </Link>
    </div>
  );
}
