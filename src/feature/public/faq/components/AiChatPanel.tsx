"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, LoaderCircle, Send, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useLanguage } from "@/src/providers";
import AiChatMessage from "./AiChatMessage";
import AiSuggestedQuestions from "./AiSuggestedQuestions";
import type { ChatMessage } from "../types/faq.types";

export default function AiChatPanel({ onClose }: { onClose: () => void }) {
  const { t, locale } = useLanguage(); const c = t.faq.ai;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const thread = useRef<HTMLDivElement>(null);
  useEffect(() => () => { const request = controller.current; controller.current = null; request?.abort(); }, []);
  useEffect(() => { if (thread.current) thread.current.scrollTop = thread.current.scrollHeight; }, [messages, busy]);

  async function send(question: string) {
    const content = question.trim();
    if (!content || content.length > 800 || controller.current) return;
    const request = new AbortController(); controller.current = request;
    const history = [...messages, { id: crypto.randomUUID(), role: "user" as const, content }];
    setMessages(history); setInput(""); setBusy(true); setError(false);
    const timeout = window.setTimeout(() => request.abort(), 30000);
    try {
      const response = await fetch("/api/faq-chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: request.signal, body: JSON.stringify({ locale, messages: history.slice(-12).map(({ role, content }) => ({ role, content })) }) });
      if (!response.ok) throw new Error("Chat unavailable");
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("answer" in result) || typeof result.answer !== "string" || !result.answer.trim()) throw new Error("Invalid answer");
      const answer = result.answer.slice(0, 12000);
      if (controller.current === request) setMessages(previous => [...previous, { id: crypto.randomUUID(), role: "assistant", content: answer }]);
    } catch {
      if (controller.current === request) setError(true);
    } finally {
      window.clearTimeout(timeout);
      if (controller.current === request) { controller.current = null; setBusy(false); }
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void send(input); }
  return <section id="faq-ai-panel" aria-labelledby="faq-ai-title" className="overflow-hidden rounded-[28px] border border-accent/35 bg-surface shadow-[0_25px_60px_-35px_rgba(0,0,0,0.5)]"><header className="flex items-center gap-3 border-b border-border bg-primary p-5 text-primary-foreground"><Bot className="size-6 text-accent" aria-hidden="true" /><h2 id="faq-ai-title" className="flex-1 font-serif text-xl">{c.assistant}</h2><Button variant="ghost" size="icon" onClick={onClose} aria-label={c.close} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><X className="size-4" aria-hidden="true" /></Button></header><div ref={thread} role="log" aria-label={c.conversation} aria-live="polite" aria-relevant="additions text" className="max-h-96 space-y-5 overflow-y-auto overscroll-contain p-5"><AiChatMessage message={{ id: "welcome", role: "assistant", content: c.welcome }} />{messages.map(message => <AiChatMessage key={message.id} message={message} />)}{busy && <p role="status" className="flex items-center gap-2 text-xs text-secondary"><LoaderCircle className="size-4 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true" />{c.thinking}</p>}</div>{!messages.length && <div className="px-5 pb-5"><AiSuggestedQuestions onSelect={question => void send(question)} disabled={busy} /></div>}{error && <p role="alert" className="mx-5 mb-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs leading-6 text-destructive">{c.error}</p>}<form onSubmit={submit} className="border-t border-border p-5"><Label htmlFor="faq-ai-input" className="text-xs">{c.inputLabel}</Label><div className="mt-3 flex gap-2"><Input id="faq-ai-input" value={input} onChange={e => setInput(e.target.value)} maxLength={800} autoComplete="off" placeholder={c.placeholder} disabled={busy} className="min-w-0 flex-1 rounded-xl" /><Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label={c.send} className="size-11 shrink-0 rounded-xl"><Send className="size-4" aria-hidden="true" /></Button></div><p className="mt-3 text-[10px] leading-5 text-secondary">{c.note}</p></form></section>;
}
