import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type Program = Database["public"]["Tables"]["programs"]["Row"];
export type ProgramDay = Database["public"]["Tables"]["program_days"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Quote = Database["public"]["Tables"]["quotes"]["Row"];

export type ProgramExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  note?: string;
};

export const listPrograms = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("programs")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProgram = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: program } = await supabase
      .from("programs")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!program) return null;
    const { data: days } = await supabase
      .from("program_days")
      .select("*")
      .eq("program_id", program.id)
      .order("day_number", { ascending: true });
    return { program, days: days ?? [] };
  });

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select("*")
    .order("price_cents", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { data: product } = await publicClient()
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    return product ?? null;
  });

export const listQuotes = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("quotes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});
