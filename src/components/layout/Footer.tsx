"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { name: "Inventory", href: "/shop" },
  { name: "Concierge", href: "#" },
  { name: "Services", href: "#" },
  { name: "About", href: "#" },
];

const SOCIAL_LINKS = [
  { name: "Instagram", href: "#" },
  { name: "X (Twitter)", href: "#" },
  { name: "LinkedIn", href: "#" },
];

const LEGAL_LINKS = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Cookie Policy", href: "#" },
];

// Magnetic Link Component for Awwwards-style hover effects
const MagneticLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block"
    >
      <Link
        href={href}
        className="group flex items-center gap-2 text-subtle hover:text-white transition-colors py-1"
      >
        <span className="text-sm md:text-base font-medium">{children}</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out" />
      </Link>
    </motion.div>
  );
};

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Parallax the huge background text slightly upwards
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

  return (
    <footer
      ref={containerRef}
      className="relative bg-[#020202] text-white overflow-hidden pt-32 pb-10 flex flex-col justify-between min-h-screen"
    >
      {/* 
        -------------------------------------------
        TOP REGION: Architectural Grid Layout
        -------------------------------------------
      */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
        {/* Brand & Mission Statement */}
        <div className="lg:col-span-5 space-y-8 pr-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-display text-accent tracking-wide">
              GreenRev Motors
            </h3>
            <div className="h-[1px] w-12 bg-accent/50" />
          </div>
          <p className="text-subtle max-w-sm text-sm md:text-base leading-relaxed font-light">
            Curated performance machines for those who move differently. Elevate
            your automotive experience with our exclusive concierge service and
            unmatched global network.
          </p>
        </div>

        {/* Links Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
          {/* Navigation */}
          <div className="flex flex-col space-y-6">
            <span className="text-xs tracking-[0.2em] uppercase text-white/30 font-semibold border-b border-white/10 pb-4">
              Menu
            </span>
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => (
                <MagneticLink key={link.name} href={link.href}>
                  {link.name}
                </MagneticLink>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col space-y-6">
            <span className="text-xs tracking-[0.2em] uppercase text-white/30 font-semibold border-b border-white/10 pb-4">
              Socials
            </span>
            <div className="flex flex-col space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <MagneticLink key={link.name} href={link.href}>
                  {link.name}
                </MagneticLink>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-6 col-span-2 md:col-span-1 border-t md:border-t-0 border-white/10 pt-8 md:pt-0">
            <span className="text-xs tracking-[0.2em] uppercase text-white/30 font-semibold border-b border-transparent md:border-white/10 pb-4">
              Legal
            </span>
            <div className="flex flex-col space-y-3">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-subtle hover:text-white transition-colors text-sm py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 
        -------------------------------------------
        CENTER REGION: Massive Typography CTA
        -------------------------------------------
      */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center flex-1 mt-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="group cursor-pointer relative flex flex-col items-center justify-center"
        >
          <a href="/contact" className="block text-center">
            <h2 className="text-[16vw] md:text-[14vw] leading-[0.85] font-display font-black text-white tracking-tighter hover:text-accent transition-colors duration-700 select-none">
              GreenRev Motors.
            </h2>
            {/* Interactive underline expansion */}
            <motion.div className="h-[2px] bg-accent w-0 group-hover:w-full transition-all duration-700 ease-out mx-auto mt-6 md:mt-10" />
          </a>
        </motion.div>
      </div>

      {/* 
        -------------------------------------------
        BACKGROUND PARALLAX
        -------------------------------------------
      */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none opacity-[0.02] overflow-hidden leading-none z-0 mix-blend-screen"
      >
        <span className="text-[28vw] font-display font-black whitespace-nowrap translate-y-[28%] select-none">
          GREENREV MOTORS
        </span>
      </motion.div>

      {/* 
        -------------------------------------------
        BOTTOM REGION: Minimalist Copyright Bar
        -------------------------------------------
      */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-white/40 tracking-[0.25em] uppercase">
        <p>
          © {new Date().getFullYear()} GreenRev Motors. All rights reserved.
        </p>
        <p className="mt-6 md:mt-0 flex items-center gap-2">
          Designed for Excellence{" "}
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </p>
      </div>
    </footer>
  );
}
