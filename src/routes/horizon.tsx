import { createFileRoute } from "@tanstack/react-router";
import { Component as HorizonHero } from "@/components/ui/horizon-hero-section";

export const Route = createFileRoute("/horizon")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Horizon — IRONCODE Cinematic Intro" },
      {
        name: "description",
        content:
          "A cinematic 3D scroll experience: starfields, nebula and mountain parallax introducing the IRONCODE training universe.",
      },
      { property: "og:title", content: "Horizon — IRONCODE Cinematic Intro" },
      {
        property: "og:description",
        content: "Scroll through a 3D starfield and mountain horizon built for IRONCODE.",
      },
    ],
  }),
  component: HorizonHero,
});
