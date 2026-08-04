import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Chat With Your Coach — IRONCODE" },
      {
        name: "description",
        content: "Message the IRONCODE coaching team about your training, form and nutrition.",
      },
      { property: "og:title", content: "Chat With Your Coach — IRONCODE" },
      { property: "og:description", content: "Direct line to the coaching team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversation = useQuery({
    queryKey: ["conversation", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("member_id", user!.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
      const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({ member_id: user!.id, topic: "Coaching" })
        .select()
        .single();
      if (createError) throw createError;
      return created;
    },
  });

  const conversationId = conversation.data?.id;

  const messages = useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !conversationId || !user) return;
    if (body.length > 2000) {
      toast.error("Message is too long");
      return;
    }
    setSending(true);
    const { error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: user.id, body });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft("");
    qc.invalidateQueries({ queryKey: ["messages", conversationId] });
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-10">
      <div>
        <h1 className="text-3xl">Coach chat</h1>
        <div className="mt-2 h-px w-24 gold-rule" />
        <p className="mt-4 text-sm text-muted-foreground">
          Ask about form, substitutions, nutrition or how a session felt. Premium members get a
          reply within 24 hours.
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto rounded-sm border border-border bg-card p-6">
        {(messages.data ?? []).length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No messages yet. Say what you're training this week.
          </p>
        )}
        {(messages.data ?? []).map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[80%] rounded-sm px-4 py-3 text-sm ${
                  mine
                    ? "bg-gold text-primary-foreground"
                    : "border border-border bg-background text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest opacity-70">
                  {mine ? "You" : "Coach"} ·{" "}
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          placeholder="Type your message…"
          aria-label="Message"
          className="h-12 flex-1 rounded-sm border border-border bg-card px-4 outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-gold text-primary-foreground disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
