"use client";

import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";

export default function MobileAppCTA() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex items-center justify-center">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute -left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              The App
            </span>
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-widest text-white leading-tight mb-6">
              Take the Showroom <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                With You.
              </span>
            </h2>
            <p className="text-subtle text-base md:text-lg max-w-md font-light mb-10 leading-relaxed">
              Experience the world's most exclusive inventory in your pocket. 
              Real-time updates, secure verifications, and instant concierge access.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#"
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md transition-all duration-300"
              >
                <Apple className="w-8 h-8 text-white" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">Download on the</span>
                  <span className="text-sm font-semibold text-white">App Store</span>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#"
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md transition-all duration-300"
              >
                <Play className="w-8 h-8 text-white fill-white" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">GET IT ON</span>
                  <span className="text-sm font-semibold text-white">Google Play</span>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Visual Mockup representation */}
        <div className="relative h-[500px] w-full flex items-center justify-center lg:justify-end perspective-[1000px]">
          <motion.div
            initial={{ opacity: 0, rotateY: 15, x: 50 }}
            whileInView={{ opacity: 1, rotateY: -15, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[280px] h-[580px] bg-black rounded-[40px] border-4 border-[#222] shadow-2xl overflow-hidden group"
          >
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-3xl z-20" />
            
            {/* Screen Content Mockup */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black flex flex-col p-6 pt-12">
              <div className="w-full flex justify-between items-center mb-8">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="w-20 h-2 rounded-full bg-white/10" />
              </div>
              <div className="w-full h-48 rounded-2xl bg-white/5 border border-white/10 mb-4 relative overflow-hidden group-hover:border-accent/30 transition-colors duration-500">
                <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              </div>
              <div className="w-3/4 h-6 rounded bg-white/10 mb-2" />
              <div className="w-1/2 h-4 rounded bg-white/5 mb-8" />
              
              <div className="w-full flex gap-3">
                <div className="w-full h-12 rounded-xl bg-accent/20 border border-accent/30" />
                <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
              </div>
            </div>
            
            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
