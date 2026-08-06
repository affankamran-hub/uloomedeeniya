import { useEffect, useRef, useState } from "react";
import { MessageCircleQuestion, RotateCcw, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import logo from "@/assets/logo.jpeg.asset.json";
import { askAssistant } from "@/lib/assistant.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Assalamu alaikum. I can explain how this website works — grades, subjects, approval, quizzes, messages and class timings.\n\nالسلام علیکم! ویب سائٹ کے بارے میں کوئی بھی سوال پوچھیے۔",
};

export function AiHelper() {
  const { user } = useAuth();
  const ask = useServerFn(askAssistant);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!user) {
      setMessages([GREETING]);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("ai_messages")
        .select("role, content")
        .order("created_at", { ascending: true });
      if (!active) return;
      const saved = (data ?? []) as ChatMessage[];
      setMessages(saved.length ? [GREETING, ...saved] : [GREETING]);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (open && !busy) textareaRef.current?.focus();
  }, [open, busy, messages.length]);

  const persist = async (rows: ChatMessage[]) => {
    if (!user) return;
    await supabase.from("ai_messages").insert(rows.map((r) => ({ ...r, user_id: user.id })));
  };

  const send = async (_message: unknown, event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const result = await ask({
        data: { messages: nextMessages.slice(1).slice(-20) },
      });
      const reply: ChatMessage = { role: "assistant", content: result.text };
      setMessages([...nextMessages, reply]);
      await persist([{ role: "user", content: text }, reply]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The helper could not answer right now.");
      setMessages(messages);
      setInput(text);
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    setMessages([GREETING]);
    if (user) await supabase.from("ai_messages").delete().eq("user_id", user.id);
  };

  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        size="icon"
        variant="gold"
        className="fixed bottom-5 end-5 z-50 size-14 rounded-full shadow-lg"
        aria-label="Open the website helper"
      >
        {open ? <X className="size-5" /> : <MessageCircleQuestion className="size-6" />}
      </Button>

      {open && (
        <div className="fixed bottom-24 end-5 z-50 flex h-[28rem] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <header className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
            <img src={logo.url} alt="" className="size-8 rounded-full ring-1 ring-gold/60" />
            <div className="leading-tight">
              <p className="text-sm font-medium text-foreground">Website helper</p>
              <p className="urdu text-xs text-muted-foreground">ویب سائٹ معاون</p>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="ms-auto"
              onClick={clear}
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <RotateCcw className="size-4" />
            </Button>
          </header>

          <Conversation className="flex-1">
            <ConversationContent className="gap-3 p-3">
              {messages.map((m, i) => (
                <Message from={m.role} key={i}>
                  <MessageContent
                    className={m.role === "assistant" ? "bg-transparent p-0 text-foreground" : undefined}
                  >
                    <MessageResponse>{m.content}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}
              {busy && <Shimmer className="px-1 text-sm">Thinking…</Shimmer>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput onSubmit={send}>
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the classes… / سوال لکھیے"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={busy ? "submitted" : "ready"} disabled={busy || !input.trim()} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}