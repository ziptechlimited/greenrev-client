"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Mail, Search, Filter, ArrowRight } from "lucide-react";
import expertsData from "@/data/experts.json";

interface Expert {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  specialization: string[];
  phone: string;
  email: string;
  image: string;
}

interface ExpertListProps {
  onSelectExpert: (expert: Expert) => void;
  selectedExpertId?: string;
}

export default function ExpertList({ onSelectExpert, selectedExpertId }: ExpertListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredExperts = expertsData.filter((expert) => {
    const matchesSearch = 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === "All" || expert.city === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const cities = ["All", ...Array.from(new Set(expertsData.map(e => e.city)))];

  return (
    <div className="flex flex-col h-full bg-[#080808] border-r border-white/10 overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-8 space-y-6 border-b border-white/5">
        <h2 className="text-3xl font-display text-white">Locations</h2>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
          <input 
            type="text"
            placeholder="Search city, expert, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 transition-all placeholder:text-white/20"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveFilter(city)}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all ${
                activeFilter === city 
                  ? "bg-accent text-black" 
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Experts Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence mode="popLayout">
          {filteredExperts.map((expert, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              key={expert.id}
              onClick={() => onSelectExpert(expert as any)}
              className={`group relative overflow-hidden rounded-[24px] border transition-all cursor-pointer ${
                selectedExpertId === expert.id 
                  ? "bg-white/[0.05] border-accent" 
                  : "bg-white/[0.02] border-white/10 hover:border-white/30"
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-display text-white group-hover:text-accent transition-colors">
                      {expert.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <MapPin className="w-3 h-3" />
                      {expert.city}, {expert.country}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    selectedExpertId === expert.id ? "bg-accent text-black" : "bg-white/5 text-white/40"
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {expert.specialization.slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-1 bg-white/5 rounded-md text-[8px] uppercase tracking-tighter text-white/60">
                      {s}
                    </span>
                  ))}
                  {expert.specialization.length > 2 && (
                    <span className="px-2 py-1 bg-white/5 rounded-md text-[8px] uppercase tracking-tighter text-white/40">
                      +{expert.specialization.length - 2} More
                    </span>
                  )}
                </div>

                {selectedExpertId === expert.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="pt-4 mt-4 border-t border-white/10 space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <Phone className="w-4 h-4 text-accent" />
                      {expert.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <Mail className="w-4 h-4 text-accent" />
                      {expert.email}
                    </div>
                    <button className="w-full py-3 bg-accent text-black font-black uppercase tracking-widest text-[10px] rounded-xl mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Book Appointment
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredExperts.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-white/40 text-sm font-light">No locations found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
