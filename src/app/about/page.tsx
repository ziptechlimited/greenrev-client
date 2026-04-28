"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown, Globe2, Shield, Gem, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroVideoY = useTransform(smoothProgress, [0, 0.4], ["0%", "30%"]);
  const heroTextOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 0.2], ["0%", "50%"]);

  return (
    <main
      ref={containerRef}
      className="relative bg-background text-white selection:bg-accent selection:text-black"
    >
      {/* 1. HERO SECTION */}
      <section className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center">
        {/* Parallax Video Container */}
        <motion.div
          style={{ y: heroVideoY }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover filter brightness-[0.4]"
          >
            <source src="/Sarkin Mota Autos.mp4" type="video/mp4" />
          </video>
          {/* Subtle gradient overlay to blend into the next section */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
        </motion.div>

        {/* Audio Toggle Button */}
        <div className="absolute top-32 right-6 md:top-40 md:right-12 z-50">
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="relative z-20 text-center px-6 mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-accent text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-6 block font-bold drop-shadow-md">
              The Standard of Excellence
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight mb-8 drop-shadow-2xl">
              GreenRev Motors
            </h1>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-subtle font-light leading-relaxed">
              Curating the world’s most coveted performance{" "}
              <br className="hidden md:block" /> and luxury machines for those
              who move differently.
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
        >
          <span className="text-[9px] uppercase tracking-widest text-subtle font-bold">
            Discover
          </span>
          <div className="w-px h-16 bg-white/10 relative overflow-hidden">
            <motion.div
              animate={{ y: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-accent origin-top"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. THE PHILOSOPHY SECTION (Sticky Scroll) */}
      <section className="relative z-20 bg-background pt-32 h-[300vh]">
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden px-6">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="relative z-10 space-y-8 lg:col-span-5 pl-4 lg:pl-0">
                <motion.h2
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-6xl font-display leading-tight"
                >
                  A Legacy of <br />
                  <span className="text-accent italic">
                    Uncompromising
                  </span>{" "}
                  Standards.
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="space-y-6 text-subtle text-lg font-light leading-relaxed max-w-lg"
                >
                  <p>
                    GreenRev Motors was not founded simply to move vehicles. It
                    was established to elevate the entire automotive acquisition
                    experience. We believe that true luxury is not just found in
                    the leather or the horsepower, but in the seamless,
                    transparent, and intensely personal journey of finding your
                    perfect machine.
                  </p>
                  <p>
                    Every vehicle in our showroom has been subjected to a
                    rigorous certification process. If a car does not meet our
                    exact standard of mechanical perfection and aesthetic
                    brilliance, it does not earn the GreenRev Motors badge.
                  </p>
                </motion.div>
              </div>

              {/* Dynamic Image Swapper Container */}
              <div className="relative h-[60vh] md:h-[80vh] w-full rounded-[40px] overflow-hidden border border-white/10 lg:col-span-7">
                <StickyImageSwapper scrollY={smoothProgress} />
                <div className="absolute inset-0 border border-white/5 rounded-[40px] pointer-events-none z-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS SECTION */}
      <section className="relative z-20 bg-black py-32 px-6 border-y border-white/5 overflow-hidden">
        {/* Glow behind the pillars */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-accent text-[10px] tracking-[0.3em] uppercase mb-4 block font-bold">
              The GreenRev Motors Difference
            </span>
            <h2 className="text-4xl md:text-6xl font-display">Our Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PillarCard
              icon={<Globe2 />}
              title="Global Sourcing"
              description="We possess an extensive global network, allowing us to locate extremely rare and highly sought-after specifications from anywhere in the world."
              delay={0}
            />
            <PillarCard
              icon={<Shield />}
              title="Absolute Provenance"
              description="Transparency is paramount. Every vehicle is delivered with a complete, verified history and a bulletproof mechanical warranty."
              delay={0.2}
            />
            <PillarCard
              icon={<Gem />}
              title="White-Glove Service"
              description="From your first inquiry to the moment the keys are placed in your hand, your dedicated Concierge handles every logistical detail."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION */}
      <section className="relative z-20 bg-background py-48 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto space-y-10"
        >
          <h2 className="text-5xl md:text-7xl font-display">
            Experience <br /> the{" "}
            <span className="text-accent italic">Difference</span>.
          </h2>
          <p className="text-xl text-subtle font-light">
            Your next automotive masterpiece awaits in our showroom. Let us
            assist you in acquiring exactly what you desire.
          </p>
          <div className="pt-8">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-10 py-5 bg-accent text-black font-bold uppercase tracking-widest text-[11px] rounded-full transition-transform hover:scale-105 shadow-[0_0_40px_rgba(199,164,61,0.2)] hover:shadow-[0_0_60px_rgba(199,164,61,0.4)]"
            >
              Enter the Showroom
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function PillarCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/[0.02] border border-white/5 p-12 rounded-[40px] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group"
    >
      <div className="w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-8 text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-display text-white mb-4 group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-subtle leading-relaxed font-light">{description}</p>
    </motion.div>
  );
}

// Custom component to handle the crossfading of images based on scroll
function StickyImageSwapper({ scrollY }: { scrollY: any }) {
  // We use the global scrollYProgress (0 to 1)
  // Philosophy section roughly occupies page scroll 0.25 to 0.7

  // Image 1 opacity: 1 -> 0
  const opacity1 = useTransform(scrollY, [0.3, 0.45], [1, 0]);

  // Image 2 opacity: 0 -> 1 -> 0
  const opacity2 = useTransform(scrollY, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);

  // Image 3 opacity: 0 -> 1
  const opacity3 = useTransform(scrollY, [0.55, 0.6], [0, 1]);

  return (
    <>
      {/* Image 1: Engine/Detail */}
      <motion.img
        style={{ opacity: opacity1 }}
        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200"
        alt="SarkinMota Detail"
        className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 hover:grayscale-0 transition-all duration-[2s] z-10"
      />

      {/* Image 2: Interior */}
      <motion.img
        style={{ opacity: opacity2 }}
        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200"
        alt="SarkinMota Interior"
        className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 hover:grayscale-0 transition-all duration-[2s] z-20"
      />

      {/* Image 3: Exterior High Performance */}
      <motion.img
        style={{ opacity: opacity3 }}
        src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200"
        alt="SarkinMota Exterior"
        className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 hover:grayscale-0 transition-all duration-[2s] z-30"
      />
    </>
  );
}
