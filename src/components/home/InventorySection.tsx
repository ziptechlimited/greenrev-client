"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import inventoryData from "@/data/inventory.json";
import InventoryCard from "@/components/shared/InventoryCard";

export default function InventorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const headerY = useTransform(smoothProgress, [0, 0.2], [100, 0]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-background min-h-screen relative z-30">
      <motion.div 
        style={{ y: headerY, opacity: headerOpacity }}
        className="max-w-7xl mx-auto mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <h2 className="text-accent text-sm tracking-[0.3em] uppercase mb-4">Our Collection</h2>
          <h3 className="text-5xl md:text-7xl font-display text-white">Curated Machines.</h3>
        </div>
        <p className="text-subtle max-w-sm text-sm tracking-wide leading-relaxed">
          Each vehicle is hand-selected. Inspected for flaws, tuned for dominance. Explore our limited inventory.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {inventoryData.slice(0, 3).map((car) => (
          <InventoryCard key={car.id} car={car} />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex justify-center"
      >
        <Link 
          href="/shop"
          className="group relative px-12 py-5 bg-transparent overflow-hidden rounded-full border border-white/10 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(199,164,61,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 text-white font-display tracking-widest uppercase text-xs flex items-center gap-3">
            View All Machines
            <ArrowUpRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}


