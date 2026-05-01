"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ServicesGrid() {
  return (
    <section className="py-20 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[#C8A27A]/40 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[800px] relative z-10">
        
        {/* The Showroom - Large Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 relative group overflow-hidden rounded-[32px] border border-white/10"
        >
          <Image 
            src="/images/home/showroom.png" 
            alt="The Showroom" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          <div className="absolute bottom-12 left-12 right-12 space-y-6">
            <h2 className="text-6xl font-display text-white tracking-tight">The Showroom</h2>
            <p className="text-white/60 text-xl max-w-md font-light leading-relaxed">
              A curated collection of world-class machines, meticulously selected for the discerning collector.
            </p>
            <Link 
              href="/inventory" 
              className="inline-flex items-center gap-2 text-white text-xs uppercase tracking-[0.3em] font-bold hover:text-accent transition-colors"
            >
              ENTER GALLERY <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Right Column - Two Stacked Cards */}
        <div className="flex flex-col gap-6 h-full">
          
          {/* Parts & Performance */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative group overflow-hidden rounded-[32px] border border-white/10"
          >
            <Image 
              src="/images/home/parts.png" 
              alt="Parts & Performance" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            
            <div className="absolute top-12 left-12 right-12 space-y-4">
              <h3 className="text-accent text-sm font-bold uppercase tracking-[0.3em]">PARTS & PERFORMANCE</h3>
              <p className="text-white/80 text-lg font-light leading-relaxed">
                Enhance your machine with highest-grade components and bespoke accessories.
              </p>
            </div>
          </motion.div>

          {/* Expert Care */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative group overflow-hidden rounded-[32px] border border-white/10 cursor-pointer"
          >
            <Link href="/experts">
              <Image 
                src="/images/home/expert.png" 
                alt="Expert Care" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              
              <div className="absolute bottom-12 left-12 right-12 space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2 group-hover:text-accent transition-colors">
                  EXPERT CARE <ArrowUpRight className="w-4 h-4" />
                </h3>
                <p className="text-white/80 text-lg font-light leading-relaxed">
                  Access our elite network of certified mechanics and specialized service centers.
                </p>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
