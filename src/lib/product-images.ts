const files = import.meta.glob("../assets/products/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const bySlug: Record<string, string[]> = {};

for (const [path, url] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const file = path.split("/").pop()!.replace(/\.jpg$/, "");
  const slug = file.replace(/-\d+$/, "");
  (bySlug[slug] ??= []).push(url);
}

export function productImages(slug: string): string[] {
  return bySlug[slug] ?? [];
}
