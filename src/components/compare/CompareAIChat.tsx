"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarEntry } from "@/components/shared/InventoryCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  const processText = (text: string) => {
    // Handle bold text
    const boldParts = text.split(/(\*\*.*?\*\*)/g);

    return boldParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`bold-${i}`} className="text-accent font-bold bg-accent/5 px-1 rounded-sm">
            {part.substring(2, part.length - 2)}
          </strong>
        );
      }
      return <React.Fragment key={`text-${i}`}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (!line.trim() && i > 0) return <div key={i} className="h-2" />;
        if (!line.trim()) return null;

        const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
        const cleanLine = isBullet ? line.trim().substring(2) : line;
        const renderedLine = processText(cleanLine);

        if (isBullet) {
          return (
            <div key={i} className="flex gap-3 items-start pl-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(199,164,61,0.6)]" />
              <div className="flex-1 leading-relaxed">
                {renderedLine}
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="leading-relaxed">
            {renderedLine}
          </div>
        );
      })}
    </div>
  );
}

export default function CompareAIChat({ compareItems }: { compareItems: CarEntry[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isMinimized) setIsMinimized(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
          compareData: compareItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from chat API");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === "data: [DONE]") continue;

            if (trimmedLine.startsWith("data: ")) {
              try {
                const jsonStr = trimmedLine.replace("data: ", "");
                const data = JSON.parse(jsonStr);
                const content = data.choices?.[0]?.delta?.content || "";

                if (content) {
                  assistantContent += content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: assistantContent }
                        : msg,
                    ),
                  );
                }
              } catch (e) {
                console.error("Error parsing SSE chunk:", e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "error"),
        {
          id: "error",
          role: "assistant",
          content: "I apologize, but I encountered an error connecting to the concierge service. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ height: isMinimized ? 80 : undefined }}
      className={cn(
        "w-full flex flex-col bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300",
        !isMinimized && "h-[500px] md:h-[600px]"
      )}
    >
      <div 
        className="p-4 border-b border-white/5 flex items-center justify-between bg-black/60 cursor-pointer hover:bg-black/80 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-display text-white">Compare Concierge</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">AI Expert Advice</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMessages([]);
            }}
            className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            className="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            <motion.div
              animate={{ rotate: isMinimized ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar min-h-0">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Sparkles className="w-8 h-8 text-accent mb-4" />
              <p className="text-white font-display text-xl mb-2">Ask about these machines</p>
              <p className="text-sm text-subtle max-w-[250px]">
                I can analyze their specs and help you decide which one suits your needs.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  m.role === "user" ? "bg-white/10" : "bg-accent/20 text-accent"
                )}>
                  {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] break-words",
                  m.role === "user" 
                    ? "bg-accent text-black font-medium rounded-tr-none" 
                    : "bg-white/5 text-white/90 rounded-tl-none whitespace-pre-wrap overflow-x-auto custom-scrollbar"
                )}>
                  {m.role === "assistant" ? <MarkdownRenderer content={m.content} /> : m.content}
                </div>
              </motion.div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 text-white/40 text-sm">
                Analyzing specifications...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. Which one is better for city driving?"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 bg-accent text-black rounded-full flex items-center justify-center hover:bg-accent/80 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
