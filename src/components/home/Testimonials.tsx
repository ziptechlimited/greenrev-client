"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const testimonials = [
  {
    quote: "GreenRev Motors secured the exact G63 AMG specification I've been chasing for months. Flawless execution. Discretion paramount.",
    author: "M. Abubakar",
    location: "Abuja",
  },
  {
    quote: "The delivery experience is unparalleled. The car arrived at my estate perfectly tuned and in pristine condition.",
    author: "J. Stirling",
    location: "Geneva",
  },
  {
    quote: "More than a mere transaction. It’s an initiation into an exclusive, global circle of automotive purists.",
    author: "E. Rothschild",
    location: "London",
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth horizontal scroll based on page scroll
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  
  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <h2 className="text-accent text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-semibold">The Inner Circle</h2>
        <h3 className="text-4xl md:text-6xl font-display text-black tracking-tight leading-tight">Client <br className="hidden md:block" />Testimonials.</h3>
      </div>
      
      <div className="w-full relative cursor-grab active:cursor-grabbing">
        <motion.div style={{ x: x1 }} className="flex gap-8 md:gap-12 px-6 md:px-12 w-max">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="group relative w-[85vw] md:w-[600px] shrink-0 p-10 md:p-14 bg-white border border-black/[0.08] hover:border-black/20 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-sm flex flex-col justify-between overflow-hidden"
            >
              {/* Giant Decorative Quote Mark */}
              <div className="absolute top-4 right-8 text-[8rem] md:text-[10rem] font-display text-black/[0.03] leading-none group-hover:text-black/[0.05] transition-colors duration-500 select-none pointer-events-none">
                "
              </div>
              
              <p className="relative z-10 text-xl md:text-3xl text-neutral-800 font-light leading-relaxed mb-16 md:mb-24">
                {t.quote}
              </p>
              
              <div className="relative z-10 flex items-center gap-6 mt-auto">
                <div className="w-12 h-[1px] bg-accent transition-all duration-500 group-hover:w-20" />
                <div>
                  <div className="text-black text-sm tracking-widest uppercase font-semibold">{t.author}</div>
                  <div className="text-neutral-500 text-xs tracking-wider uppercase mt-1">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
