import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
  notes: z.string().max(500),
});

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [goal, setGoal] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");

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
        .order("recorded_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile.data) {
      setFullName(profile.data.full_name ?? "");
      setGoal(profile.data.goal ?? "");
    }
  }, [profile.data]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim().slice(0, 100), goal: goal.trim().slice(0, 200) })
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
      body_fat_pct: bodyFat ? Number(bodyFat) : null,
      notes: notes.trim(),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your numbers");
      return;
    }
    const { error } = await supabase.from("body_stats").insert({
      user_id: user.id,
      weight_kg: parsed.data.weight_kg,
      body_fat_pct: parsed.data.body_fat_pct,
      notes: parsed.data.notes || null,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setWeight("");
    setBodyFat("");
    setNotes("");
    toast.success("Entry logged");
    qc.invalidateQueries({ queryKey: ["body_stats", user.id] });
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

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
          <label htmlFor="fullName" className="mt-6 block font-display text-xs uppercase tracking-widest">
            Full name
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={100}
            className="mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 outline-none focus:border-gold"
          />
          <label htmlFor="goal" className="mt-4 block font-display text-xs uppercase tracking-widest">
            Current goal
          </label>
          <input
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={200}
            placeholder="Build 5kg of lean mass by summer"
            className="mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 outline-none focus:border-gold"
          />
          <button className="mt-6 h-12 w-full rounded-sm bg-gold font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90">
            Save profile
          </button>
        </form>

        <form onSubmit={addStat} className="rounded-sm border border-border bg-card p-6">
          <h2 className="text-2xl">Log body stats</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block font-display text-xs uppercase tracking-widest">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 outline-none focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="bf" className="block font-display text-xs uppercase tracking-widest">
                Body fat %
              </label>
              <input
                id="bf"
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="mt-2 h-12 w-full rounded-sm border border-border bg-background px-4 outline-none focus:border-gold"
              />
            </div>
          </div>
          <label htmlFor="notes" className="mt-4 block font-display text-xs uppercase tracking-widest">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {(stats.data ?? []).map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="p-4">{new Date(s.recorded_at).toLocaleDateString()}</td>
                  <td className="p-4">{s.weight_kg} kg</td>
                  <td className="p-4">{s.body_fat_pct ? `${s.body_fat_pct}%` : "—"}</td>
                  <td className="p-4 text-muted-foreground">{s.notes ?? "—"}</td>
                </tr>
              ))}
              {(stats.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No entries yet — log your first weigh-in above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Link to="/chat" className="mt-8 inline-block font-display text-sm uppercase tracking-widest text-gold">
        Message your coach →
      </Link>
    </div>
  );
}
