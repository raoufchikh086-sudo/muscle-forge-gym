import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .max(20),
});

const SYSTEM = `You are the IRONCODE assistant, a knowledgeable strength and physique coach for a bodybuilding and calisthenics platform.
You help with: choosing a program (gym, home with equipment, or bodyweight calisthenics), exercise technique, set/rep schemes, progressive overload, nutrition basics, and gear from the IRONCODE shop.
Style: direct, encouraging, no fluff. Keep answers under 150 words unless asked for detail. Use short lines or bullets.
Point users to the Technique library for form videos, /programs for training plans, /coaching for a human coach, and /shop for equipment.
You are not a doctor: for pain, injury or medical questions, tell them to see a professional.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Too many requests — give it a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted.");
      throw new Error(`Assistant failed: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content?.trim();
    return { reply: reply || "I didn't catch that — try asking again." };
  });
