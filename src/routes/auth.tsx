import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

const searchSchema = z.object({
  redirect: z.string().startsWith("/").optional().catch(undefined),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign In or Create Account — IRONCODE" },
      {
        name: "description",
        content: "Sign in to track your body stats, manage coaching and message your coach.",
      },
      { property: "og:title", content: "Sign In — IRONCODE" },
      { property: "og:description", content: "Access your training profile and coaching chat." },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const dest = search.redirect ?? "/profile";

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: dest, replace: true });
  }, [loading, isAuthenticated, dest, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Welcome back");
      } else {
        const { data, error } = await supabase.auth.signUp({
          ...parsed.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim().slice(0, 100) },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account");
          return;
        }
        toast.success("Account created");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: dest, replace: true });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20">
      <h1 className="text-4xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
      <div className="mt-2 h-px w-24 gold-rule" />
      <p className="mt-6 text-sm text-muted-foreground">
        Track your stats, keep your programs and talk to your coach.
      </p>

      <button
        onClick={google}
        className="mt-8 h-12 rounded-sm border border-border font-display text-sm uppercase tracking-widest hover:border-gold hover:text-gold"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="font-display text-xs uppercase tracking-widest">
              Name
            </label>
            <input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={100}
              className="mt-2 h-12 w-full rounded-sm border border-border bg-card px-4 outline-none focus:border-gold"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="font-display text-xs uppercase tracking-widest">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className="mt-2 h-12 w-full rounded-sm border border-border bg-card px-4 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label htmlFor="password" className="font-display text-xs uppercase tracking-widest">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={72}
            className="mt-2 h-12 w-full rounded-sm border border-border bg-card px-4 outline-none focus:border-gold"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-sm bg-gold font-display text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-sm text-muted-foreground hover:text-gold"
      >
        {mode === "signin" ? "No account? Create one" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
