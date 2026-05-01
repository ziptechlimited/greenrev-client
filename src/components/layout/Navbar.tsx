"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handbag, Menu, X, User as UserIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import Image from "next/image";

const tabs = [
  { name: "Home", href: "/" },
  { name: "Showroom", href: "/shop" },
  { name: "Parts", href: "/parts" },
  { name: "Experts", href: "/experts" },
  { name: "About", href: "/about" },
  { name: "Compare", href: "/compare" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll visibility logic: Hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Don't hide if we're near the top
    if (latest < 100) {
      setIsHidden(false);
      return;
    }
    if (latest > previous) {
      // Scrolling down
      setIsHidden(true);
    } else {
      // Scrolling up
      setIsHidden(false);
    }
  });

  // Hide navbar on auth and dashboard routes
  const isDashboardOrAuth = 
    pathname.startsWith("/vendor") || 
    pathname.startsWith("/mechanic") || 
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isDashboardOrAuth) {
    return null;
  }

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth awwwards-style ease
        className="fixed top-0 inset-x-0 z-[100] pointer-events-none"
      >
        <div className="w-full p-4 md:p-8 flex justify-between items-center pointer-events-auto">
          {/* Left side: Brand / Logo */}
          <div className="flex flex-1 justify-start">
            <Link
              href="/"
              className="w-10 h-10 md:w-12 md:h-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shadow-xl overflow-hidden p-2 hover:bg-white/10 transition-colors"
            >
              <Image
                src="/logo.jpg"
                alt="GreenRev Motors Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain mix-blend-screen"
              />
            </Link>
          </div>

          {/* Middle side: Desktop Navigation Tabs */}
          <div className="hidden md:flex justify-center flex-shrink-0">
            <div className="flex items-center gap-2 p-1.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
              {tabs.map((tab) => {
                const isActive =
                  pathname === tab.href ||
                  (tab.href !== "/" && pathname.startsWith(tab.href));

                return (
                  <NavItem key={tab.name} tab={tab} isActive={isActive} />
                );
              })}
            </div>
          </div>

          {/* Right side: Shopping Cart & Auth & Mobile Menu Toggle */}
          <div className="flex flex-1 justify-end items-center gap-3">
            <Link
              href="/login"
              className="relative p-3 md:p-3.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <UserIcon className="w-5 h-5 text-white group-hover:text-accent transition-colors" />
            </Link>
            
            <CartButton />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden relative p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center shadow-2xl hover:bg-white/10 transition-all"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

// ─── Desktop Nav Item ──────────────────────────────────────────────────────────
function NavItem({
  tab,
  isActive,
}: {
  tab: typeof tabs[number];
  isActive: boolean;
}) {
  const { compareItems } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href={tab.href}
      className={cn(
        "px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group",
        isActive
          ? "text-accent"
          : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      <span className="relative z-10">{tab.name}</span>
      {tab.name === "Compare" && mounted && compareItems.length > 0 && (
        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-white/10 text-white rounded-full border border-white/20 relative z-10">
          {compareItems.length}
        </span>
      )}

      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl z-0 shadow-[0_0_15px_rgba(199,164,61,0.1)]"
        />
      )}
    </Link>
  );
}

// ─── Cart Button ───────────────────────────────────────────────────────────────
function CartButton() {
  const { cartCount, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-3 md:p-3.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <Handbag className="w-5 h-5 text-white group-hover:text-accent transition-colors" />

      <AnimatePresence>
        {mounted && cartCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#111] shadow-[0_0_10px_rgba(199,164,61,0.5)]"
          >
            {cartCount}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Mobile Menu ───────────────────────────────────────────────────────────────
function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const { compareItems } = useCompare();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-3xl p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <Link
              href="/"
              onClick={onClose}
              className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shadow-xl p-2"
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain mix-blend-screen"
              />
            </Link>

            <button
              onClick={onClose}
              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex flex-col justify-center items-center gap-6 mt-10">
            {tabs.map((tab, i) => {
              const isActive =
                pathname === tab.href ||
                (tab.href !== "/" && pathname.startsWith(tab.href));

              return (
                <motion.div
                  key={tab.name}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={tab.href}
                    onClick={onClose}
                    className={cn(
                      "text-4xl sm:text-5xl font-display font-light tracking-tight transition-colors flex items-center",
                      isActive ? "text-accent" : "text-white/70 hover:text-white"
                    )}
                  >
                    {tab.name}
                    {tab.name === "Compare" && compareItems.length > 0 && (
                      <span className="ml-3 inline-flex items-center justify-center w-6 h-6 text-sm font-bold bg-accent text-black rounded-full">
                        {compareItems.length}
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer of Mobile Menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4 text-white/30 text-xs font-light uppercase tracking-[0.2em] mb-4"
          >
            <p>GreenRev Motors © {new Date().getFullYear()}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
