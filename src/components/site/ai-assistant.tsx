import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { askAssistant } from "@/lib/assistant.functions";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Build me a 4-day home plan",
  "How do I get my first pull-up?",
  "What should I eat to gain muscle?",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setLoading(true);
    try {
      const res = await askAssistant({ data: { messages: next.slice(-12) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open training assistant"}
        className="fixed bottom-5 right-5 z-[90] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[90] flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-sm border border-gold/40 bg-card shadow-2xl">
          <header className="border-b border-border px-5 py-4">
            <p className="flex items-center gap-2 font-display text-sm uppercase tracking-widest text-gold">
              <Sparkles className="h-4 w-4" /> IRONCODE assistant
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Programs, technique, nutrition — ask anything.
            </p>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="w-full rounded-sm border border-border px-3 py-2 text-left text-sm text-muted-foreground hover:border-gold hover:text-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-sm px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-gold text-primary-foreground"
                      : "border border-border bg-background text-foreground"
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {loading && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Thinking…</p>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(draft);
            }}
            className="flex gap-2 border-t border-border p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              placeholder="Ask the assistant…"
              aria-label="Ask the assistant"
              className="h-10 flex-1 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading || !draft.trim()}
              aria-label="Send"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-gold text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
