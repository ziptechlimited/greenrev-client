"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handbag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <TopBar currentPath={pathname} />
    </div>
  );
}

function TopBar({ currentPath }: { currentPath: string }) {
  const tabs = [
    { name: "Home", href: "/" },
    { name: "Showroom", href: "/shop" },
    { name: "Parts", href: "/parts" },
    { name: "About", href: "/about" },
    { name: "Compare", href: "/compare" },
  ];

  const { cartCount, setIsCartOpen } = useCart();
  const { compareItems } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center pointer-events-auto">
      {/* Left side: Brand / Logo */}
      <div className="flex flex-1 justify-start">
        <Link
          href="/"
          className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shadow-xl overflow-hidden p-2 hover:bg-white/10 transition-colors"
        >
          <img
            src="/logo.jpg"
            alt="GreenRev Motors Logo"
            className="w-full h-full object-contain mix-blend-screen"
          />
        </Link>
      </div>

      {/* Middle side: Navigation Tabs */}
      <div className="flex justify-center flex-shrink-0">
        <div className="flex items-center gap-1 md:gap-2 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {tabs.map((tab) => {
            const isActive =
              currentPath === tab.href ||
              (tab.href !== "/" && currentPath.startsWith(tab.href));

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 relative",
                  isActive
                    ? "text-accent"
                    : "text-subtle hover:text-white hover:bg-white/5",
                )}
              >
                {tab.name}
                {tab.name === "Compare" &&
                  mounted &&
                  compareItems.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-white/10 text-white rounded-full border border-white/20">
                      {compareItems.length}
                    </span>
                  )}

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(199,164,61,0.1)]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right side: Shopping Cart */}
      <div className="flex flex-1 justify-end">
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-3.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
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
      </div>
    </div>
  );
}
