"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Wrench, Phone, Mail, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  experts: Expert[];
}

export default function ExpertList({ onSelectExpert, selectedExpertId, experts }: ExpertListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("All");

  const filteredExperts = experts.filter((expert) => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          expert.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All" || expert.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const cities = ["All", ...Array.from(new Set(experts.map(e => e.city)))];

  return (
    <div className="h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col relative z-20 shadow-2xl">
      {/* Header & Filters */}
      <div className="p-6 space-y-6 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div>
            <h2 className="text-2xl font-display text-white mb-2">Global Network</h2>
            <p className="text-subtle text-sm">Find certified GreenRev mechanics near you.</p>
        </div>

        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                    type="text" 
                    placeholder="Search by name or location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-accent focus:bg-white/10 transition-all placeholder:text-white/30"
                />
            </div>

            {/* City Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-edges">
                {cities.map((city) => (
                    <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
                            selectedCity === city 
                                ? "bg-white text-black" 
                                : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                        }`}
                    >
                        {city}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Experts Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence>
          {filteredExperts.map((expert, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              key={expert.id}
              onClick={() => onSelectExpert(expert)}
              className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${
                selectedExpertId === expert.id
                  ? "bg-white/[0.04] border-accent/50 shadow-[0_0_30px_rgba(206,255,0,0.1)]"
                  : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="p-5 flex gap-5">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/5">
                  <Image 
                    src={expert.image} 
                    alt={expert.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-white font-medium truncate mb-1 group-hover:text-accent transition-colors">
                        {expert.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-subtle text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{expert.city}, {expert.country}</span>
                    </div>
                  </div>

                  {/* Specializations Preview */}
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <div className="flex gap-1 overflow-hidden">
                        {expert.specialization.slice(0, 2).map((spec, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {spec}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Select Indicator */}
                <div className="flex items-center justify-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedExpertId === expert.id 
                            ? "bg-accent text-black" 
                            : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                    }`}>
                        <ChevronRight className={`w-4 h-4 ${selectedExpertId === expert.id ? "rotate-90" : "group-hover:translate-x-0.5 transition-transform"}`} />
                    </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedExpertId === expert.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 px-5 py-4 bg-black/20"
                  >
                    <p className="text-sm text-subtle mb-4 leading-relaxed">{expert.address}</p>
                    <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-colors text-xs font-medium">
                            <Phone className="w-3.5 h-3.5" /> Call
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black py-2.5 rounded-xl transition-colors text-xs font-medium">
                            <Mail className="w-3.5 h-3.5" /> Message
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredExperts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <X className="w-5 h-5 text-white/40" />
            </div>
            <p className="text-subtle text-sm">No experts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
