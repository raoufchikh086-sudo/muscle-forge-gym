const files = import.meta.glob("../assets/programs/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const bySlug: Record<string, string> = {};

for (const [path, url] of Object.entries(files)) {
  const slug = path.split("/").pop()!.replace(/\.jpg$/, "");
  bySlug[slug] = url;
}

export const programFallbackImage = bySlug["fallback"] ?? "";

export function programImage(slug: string): string {
  return bySlug[slug] ?? programFallbackImage;
}

export function programImageAlt(title: string, environment: string): string {
  const scene =
    environment === "calisthenics"
      ? "athlete training with bodyweight only"
      : environment === "home_equipment"
        ? "athlete training at home with dumbbells and a rack"
        : "athlete lifting heavy in a gym";
  return `${title} program — ${scene}`;
}
