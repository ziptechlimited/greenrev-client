"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, SlidersHorizontal, Search } from "lucide-react";
import inventoryData from "@/data/inventory.json";
import InventoryCard from "@/components/shared/InventoryCard";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const [activeMake, setActiveMake] = useState<string>("All");
  const [activeColor, setActiveColor] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const makes = useMemo(() => {
    const allMakes = inventoryData.map((car) => car.make);
    return ["All", ...Array.from(new Set(allMakes))];
  }, []);

  const colors = useMemo(() => {
    const allColors = inventoryData.map((car) => car.color.name);
    return ["All", ...Array.from(new Set(allColors))];
  }, []);

  const filteredCars = useMemo(() => {
    return inventoryData.filter((car) => {
      const matchesMake = activeMake === "All" || car.make === activeMake;
      const matchesColor = activeColor === "All" || car.color.name === activeColor;
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.make.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMake && matchesColor && matchesSearch;
    });
  }, [activeMake, activeColor, searchQuery]);

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display text-white mb-4"
            >
              The Showroom.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-subtle max-w-md"
            >
              Explore our full inventory of world-class performance machines. Filter by manufacturer, color or search by model.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search machines..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all w-full md:w-64"
                />
             </div>
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-full text-white"
             >
                <SlidersHorizontal className="w-5 h-5" />
             </button>
          </motion.div>
        </div>

        <div className="flex gap-12">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-10">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Manufacturers</h4>
                <div className="flex flex-col gap-2">
                  {makes.map((make) => (
                    <button
                      key={make}
                      onClick={() => setActiveMake(make)}
                      className={cn(
                        "text-left px-4 py-2 rounded-xl text-sm transition-all duration-300",
                        activeMake === make 
                          ? "bg-accent/10 text-accent border border-accent/20" 
                          : "text-subtle hover:text-white hover:bg-white/5"
                      )}
                    >
                      {make}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Colors</h4>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((colorName) => {
                    const carWithThisColor = inventoryData.find(c => c.color.name === colorName);
                    const hexCode = colorName === "All" ? "conic-gradient(from 0deg, red, yellow, green, blue, purple, red)" : carWithThisColor?.color.hex;
                    
                    return (
                      <button
                        key={colorName}
                        onClick={() => setActiveColor(colorName)}
                        title={colorName}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-300 relative group",
                          activeColor === colorName 
                            ? "border-accent scale-110 shadow-[0_0_10px_rgba(199,164,61,0.5)]" 
                            : "border-white/10 hover:border-white/30"
                        )}
                        style={{ background: hexCode }}
                      >
                        {activeColor === colorName && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Filters</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-white/20 transition-colors">
                    <span className="text-sm text-subtle group-hover:text-white transition-colors">Price Range</span>
                    <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-white/20 transition-colors">
                    <span className="text-sm text-subtle group-hover:text-white transition-colors">Year</span>
                    <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="bg-gradient-to-br from-accent/20 to-transparent p-6 rounded-3xl border border-accent/10">
                   <p className="text-xs text-accent font-bold tracking-widest uppercase mb-2">Concierge</p>
                   <p className="text-sm text-white mb-4 leading-relaxed">Can't find what you're looking for?</p>
                   <button className="text-[10px] font-bold tracking-widest uppercase text-white py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Request Vehicle</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <AnimatePresence mode="popLayout">
                  {filteredCars.map((car) => (
                    <motion.div
                      key={car.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <InventoryCard car={car} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Filter className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-2xl text-white mb-2 font-display">No machines found.</h3>
                <p className="text-subtle mb-8 max-w-xs">Adjust your filters or search query to find your perfect match.</p>
                <button 
                  onClick={() => { setActiveMake("All"); setSearchQuery(""); }}
                  className="text-accent underline underline-offset-8 uppercase tracking-widest text-[10px] font-bold hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-background border-l border-white/10 z-[101] p-8 lg:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-display text-white">Filters.</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-12 overflow-y-auto max-h-[calc(100vh-150px)] pr-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Manufacturers</h4>
                  <div className="flex flex-wrap gap-2">
                    {makes.map((make) => (
                      <button
                        key={make}
                        onClick={() => { setActiveMake(make); setIsFilterOpen(false); }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs transition-all duration-300",
                          activeMake === make 
                            ? "bg-accent/10 text-accent border border-accent/20" 
                            : "text-subtle hover:text-white bg-white/5 border border-transparent"
                        )}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Colors</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {colors.map((colorName) => {
                      const carWithThisColor = inventoryData.find(c => c.color.name === colorName);
                      const hexCode = colorName === "All" ? "conic-gradient(from 0deg, red, yellow, green, blue, purple, red)" : carWithThisColor?.color.hex;
                      
                      return (
                        <button
                          key={`mobile-${colorName}`}
                          onClick={() => { setActiveColor(colorName); setIsFilterOpen(false); }}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all duration-300 relative",
                            activeColor === colorName ? "border-accent scale-110 shadow-[0_0_10px_rgba(199,164,61,0.5)]" : "border-white/10"
                          )}
                          style={{ background: hexCode }}
                        />
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => { setActiveMake("All"); setActiveColor("All"); setSearchQuery(""); setIsFilterOpen(false); }}
                  className="w-full py-4 text-xs font-bold tracking-widest uppercase border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Layout (Already defined) */}
    </main>
  );
}
