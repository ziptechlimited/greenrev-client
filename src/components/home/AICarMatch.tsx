"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronRight,
  Info,
  Zap,
  Gauge,
  Activity,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import inventoryData from "@/data/inventory.json";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Interactive Car Tech Badge Component
function CarTechBadge({ name }: { name: string }) {
  const car = useMemo(() => 
    inventoryData.find(c => c.name.toLowerCase() === name.toLowerCase()),
    [name]
  );

  if (!car) return <span className="text-accent underline decoration-accent/30 decoration-dashed underline-offset-4">{name}</span>;

  return (
    <span className="relative group/badge inline-block mx-1">
      <span className="text-accent font-bold cursor-help border-b-2 border-accent/20 hover:border-accent transition-all duration-300">
        {car.name}
      </span>
      
      {/* Floating Hover Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-5 bg-black/95 backdrop-blur-2xl border border-accent/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(199,164,61,0.2)] z-[60] pointer-events-none group-hover/badge:pointer-events-auto transition-all duration-300 opacity-0"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-accent uppercase">{car.make}</span>
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">{car.year}</span>
          </div>
          
          <h4 className="text-xl font-display text-white tracking-tight">{car.name}</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[8px] text-white/40 font-black uppercase tracking-widest">
                <Zap className="w-2 h-2 text-accent" /> HP
              </div>
              <div className="text-sm font-bold text-white tracking-widest">{car.specs.horsepower}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[8px] text-white/40 font-black uppercase tracking-widest">
                <Timer className="w-2 h-2 text-accent" /> 0-100
              </div>
              <div className="text-sm font-bold text-white tracking-widest">{car.specs["0_100"]}s</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[8px] text-white/40 font-black uppercase tracking-widest">
                <Gauge className="w-2 h-2 text-accent" /> TOP
              </div>
              <div className="text-sm font-bold text-white tracking-widest">{car.specs.topSpeed}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[8px] text-white/40 font-black uppercase tracking-widest">
                <Activity className="w-2 h-2 text-accent" /> PRICE
              </div>
              <div className="text-sm font-bold text-accent tracking-tighter">{car.price}</div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/10">
            <button className="w-full py-2 bg-accent/10 border border-accent/20 rounded-xl text-[9px] font-black text-accent uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all">
              View Detailed Telemetry
            </button>
          </div>
        </div>
      </motion.div>
    </span>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  
  // Extract all car names for highlighting
  const carNames = inventoryData.map(c => c.name);
  
  const processText = (text: string) => {
    // First handle bold text
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${i}`} className="text-accent font-bold bg-accent/5 px-1 rounded-sm">
            {part.substring(2, part.length - 2)}
          </strong>
        );
      }
      
      // For non-bold text, check for car names
      let segment = part;
      const elements: React.ReactNode[] = [];
      let key = 0;
      
      // Simple name matching (could be improved with regex)
      while (segment.length > 0) {
        let foundMatch = false;
        for (const name of carNames) {
          const index = segment.toLowerCase().indexOf(name.toLowerCase());
          if (index !== -1) {
            // Add text before match
            if (index > 0) elements.push(segment.substring(0, index));
            // Add badge
            elements.push(<CarTechBadge key={`car-${key++}`} name={segment.substring(index, index + name.length)} />);
            // Update segment
            segment = segment.substring(index + name.length);
            foundMatch = true;
            break;
          }
        }
        if (!foundMatch) {
          elements.push(segment);
          break;
        }
      }
      
      return <React.Fragment key={`seg-${i}`}>{elements}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (!line.trim() && i > 0) return <div key={i} className="h-2" />;
        if (!line.trim()) return null;
        
        const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;
        
        const renderedLine = processText(cleanLine);

        if (isBullet) {
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 items-start pl-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(199,164,61,0.6)]" />
              <div className="flex-1 text-white/90 leading-relaxed font-light">{renderedLine}</div>
            </motion.div>
          );
        }

        return <div key={i} className="text-white/90 leading-relaxed font-light">{renderedLine}</div>;
      })}
    </div>
  );
}

export default function AICarMatch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const quickPrompts = [
    "Best performance machine under ₦500M?",
    "Which car has the highest top speed?",
    "Compare Phantom Obsidian and Valkyrie Ascendant.",
    "Fastest 0-100 km/h time?",
  ];

  const handleSendMessage = async (e: React.FormEvent | string) => {
    const text = typeof e === "string" ? e : input;
    if (typeof e !== "string") e.preventDefault();
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: "assistant", content: "" }]);

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
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg
                  ));
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
      setMessages(prev => [...prev.filter(m => m.id !== "error"), { 
        id: "error", 
        role: "assistant", 
        content: error.message || "I apologize, but I encountered an error connecting to the concierge service. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="concierge" className="py-32 px-6 md:px-12 bg-black relative overflow-hidden selection:bg-accent selection:text-black">
      {/* Immersive Background System */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-accent/5 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-accent/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-stretch">
          {/* Left Side: Technical Briefing */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-accent/5 border border-accent/20 rounded-full text-accent text-[10px] uppercase font-bold tracking-[0.2em] backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Online & Ready
              </div>
              
              <div className="space-y-4">
                <h2 className="text-6xl md:text-7xl font-display text-white leading-[0.9] tracking-tighter">
                  INTELLIGENT<br />
                  <span className="text-secondary opacity-50 block mt-2 tracking-widest uppercase text-sm font-black">Your Personal Finder</span>
                  <span className="text-accent underline decoration-accent/20 underline-offset-[10px]">CONCIERGE.</span>
                </h2>
                <div className="w-20 h-1 bg-accent shadow-[0_0_20px_rgba(199,164,61,0.5)]" />
              </div>
              
              <p className="text-subtle text-lg leading-relaxed font-light opacity-80">
                Finding the perfect car shouldn&apos;t be a chore. Tell our AI assistant what you need, 
                and we&apos;ll match you with the ideal machine from our exclusive collection.
              </p>

              <div className="pt-8 space-y-6">
                <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase font-bold tracking-[0.3em]">
                  <div className="h-px flex-1 bg-white/10" />
                  Sample Requests
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {quickPrompts.map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => handleSendMessage(prompt)}
                      className="group flex items-center justify-between px-6 py-5 bg-white/[0.02] hover:bg-accent/5 border border-white/5 hover:border-accent/30 rounded-3xl text-xs text-subtle hover:text-white transition-all duration-500 text-left backdrop-blur-3xl overflow-hidden relative"
                    >
                      <span className="pr-4 relative z-10">{prompt}</span>
                      <div className="w-8 h-8 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all duration-500 relative z-10">
                        <ChevronRight className="w-4 h-4 group-hover:text-black" />
                      </div>
                      {/* Hover Scanline */}
                      <motion.div 
                        className="absolute inset-0 bg-accent/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: The Digital Cockpit */}
          <div className="lg:w-2/3 w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative group z-10 transition-all duration-700 ease-[0.16, 1, 0.3, 1]",
                isExpanded ? "h-[850px]" : "h-[700px]"
              )}
            >
              {/* Cockpit Frame Decor */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-white/20 via-white/5 to-accent/20 rounded-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
              
              <div className={cn(
                "relative h-full bg-[#050505]/90 backdrop-blur-3xl rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/[0.08] flex flex-col transition-all duration-700",
                isExpanded ? "scale-[1.01]" : "scale-100"
              )}>
                {/* Header: Diagnostic Hub */}
                <div className="p-10 border-b border-white/[0.05] flex items-center justify-between bg-black/40 relative flex-shrink-0">
                  <div className="absolute bottom-0 left-0 h-[1px] bg-accent/20 w-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent/80 w-1/4 shadow-[0_0_15px_rgba(199,164,61,0.8)]"
                      animate={{ x: ['-200%', '400%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent/20 flex items-center justify-center shadow-[0_0_50px_rgba(199,164,61,0.15)] relative z-10 overflow-hidden ring-1 ring-white/10">
                        <Bot className="text-black w-10 h-10" />
                        <motion.div 
                          className="absolute inset-0 bg-white/30"
                          animate={{ opacity: [0, 0.2, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-[4px] border-black z-20 shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-accent/10 border border-accent/20 px-3 py-1 rounded-md text-accent font-black tracking-widest">Secure Link</span>
                        <span className="text-[10px] text-white/30 font-black tracking-widest">Verified Session</span>
                      </div>
                      <h3 className="text-3xl font-display text-white tracking-widest flex items-center gap-3">
                        CONCIERGE
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setMessages([])}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/[0.05] rounded-2xl text-subtle hover:text-white transition-all border border-white/[0.05] hover:border-white/10"
                      title="Clear Cache"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="w-12 h-12 hidden md:flex items-center justify-center hover:bg-black rounded-2xl text-subtle hover:text-white transition-all border border-white/[0.05] hover:border-white/10"
                    >
                      {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Main Chat Interface */}
                <div 
                  ref={scrollRef}
                  data-lenis-prevent
                  className="flex-grow min-h-0 overflow-y-auto px-10 py-12 space-y-12 scroll-smooth custom-scrollbar"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex flex-col items-center justify-center h-full text-center space-y-8"
                      >
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full border border-accent/10 flex items-center justify-center">
                            <Bot className="w-16 h-16 text-accent opacity-20" />
                          </div>
                          <motion.div 
                            className="absolute -inset-8 border border-accent/5 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.div 
                            className="absolute -inset-4 border-2 border-accent/20 rounded-full border-t-transparent"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                        <div className="space-y-3">
                          <p className="text-white font-display text-2xl tracking-[0.3em] opacity-40">Ready to help</p>
                          <p className="text-subtle text-xs max-w-sm font-light opacity-30 leading-relaxed tracking-[0.1em]">Share your preferences or ask about a specific car to start finding your match.</p>
                        </div>
                      </motion.div>
                    ) : (
                      messages.map((m, idx) => (
                        <motion.div
                          key={m.id}
                          layout
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            "flex gap-8 group/msg",
                            m.role === "user" ? "ml-auto flex-row-reverse max-w-[80%]" : "mr-auto max-w-[90%]"
                          )}
                        >
                          {/* Avatar */}
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all duration-700 relative",
                            m.role === "user" 
                              ? "bg-white/[0.03] border-white/[0.08] group-hover/msg:border-white/20" 
                              : "bg-accent/10 border-accent/20 group-hover/msg:border-accent/50 group-hover/msg:shadow-[0_0_20px_rgba(199,164,61,0.15)]"
                          )}>
                            {m.role === "user" ? (
                              <User className="w-6 h-6 text-white/30" />
                            ) : (
                              <Sparkles className="w-6 h-6 text-accent" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div className="space-y-3 flex-1">
                            <div className={cn(
                              "flex items-center gap-4 mb-2 px-1 opacity-40",
                              m.role === "user" ? "flex-row-reverse" : ""
                            )}>
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                {m.role === "user" ? "YOU" : "CONCIERGE"}
                              </span>
                              <div className="h-px w-10 bg-white/10" />
                              <span className="text-[10px] font-black tracking-[0.3em]">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>
                            
                            <div className={cn(
                              "relative p-8 rounded-[32px] transition-all duration-700 overflow-hidden ring-1",
                              m.role === "user" 
                                ? "bg-accent text-black font-bold ring-accent/20 shadow-[0_20px_40px_rgba(199,164,61,0.15)] rounded-tr-none" 
                                : "bg-white/[0.02] text-subtle ring-white/[0.05] border border-white/[0.05] rounded-tl-none group-hover/msg:bg-white/[0.04] group-hover/msg:ring-white/[0.08]"
                            )}>
                              {/* Cockpit corner deco */}
                              {m.role === "assistant" && (
                                <>
                                  <div className="absolute top-0 right-0 w-8 h-8 opacity-20">
                                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-accent rounded-tr-sm" />
                                  </div>
                                  <div className="absolute bottom-0 left-0 w-8 h-8 opacity-20">
                                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-accent rounded-bl-sm" />
                                  </div>
                                </>
                              )}
                              
                              <div className="relative z-10 text-[16px] leading-[1.7] tracking-tight">
                                {m.role === "assistant" ? <MarkdownRenderer content={m.content} /> : m.content}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>

                  {/* Loading State */}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-8 mr-auto items-start max-w-[90%]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(199,164,61,0.1)]">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                      </div>
                      <div className="space-y-5 py-2">
                        <div className="flex items-center gap-4 px-1">
                          <span className="text-[10px] font-black tracking-[0.4em] text-accent animate-pulse">Finding the best matches for you...</span>
                        </div>
                        <div className="h-1.5 w-64 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-accent shadow-[0_0_15px_rgba(199,164,61,0.8)]"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer: Input Command Center */}
                <div className="p-10 pt-0 flex-shrink-0">
                  <div className="relative group/input">
                    <form 
                      onSubmit={handleSendMessage}
                      className="relative z-10 flex items-center gap-6 p-3 bg-black/80 backdrop-blur-3xl border border-white/[0.08] rounded-[40px] shadow-2xl focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-accent/10 focus-within:outline-none transition-all duration-700 overflow-hidden"
                    >
                      {/* Technical scanner line for input */}
                      <motion.div 
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent/30"
                        animate={{ opacity: [0.3, 0.7, 0.3], x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      
                      <div className="pl-6 text-accent/60 flex items-center gap-3">
                        <ChevronRight className="w-6 h-6" />
                        <div className="w-[1px] h-8 bg-white/10" />
                      </div>
                      
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What are you looking for?"
                        className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-white text-base placeholder:text-white/10 tracking-[0.2em] font-black h-16"
                        spellCheck={false}
                      />
                      
                      <div className="flex items-center gap-4 pr-2">
                        <button
                          type="submit"
                          disabled={isLoading || !input.trim()}
                          className="w-16 h-16 bg-accent hover:bg-accent/80 disabled:opacity-20 disabled:hover:bg-accent text-black rounded-3xl flex items-center justify-center transition-all shadow-[0_0_30px_rgba(199,164,61,0.25)] hover:shadow-[0_0_50px_rgba(199,164,61,0.4)] hover:scale-105 active:scale-95"
                        >
                          {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
                        </button>
                      </div>
                    </form>
                    
                    {/* Glowing underglow for form */}
                    <div className="absolute -inset-4 bg-accent/5 rounded-[60px] blur-3xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
