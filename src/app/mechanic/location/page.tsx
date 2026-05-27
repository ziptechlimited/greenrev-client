"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, User, MapPin, Calendar, Settings, Navigation, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MECHANIC_NAV = [
  { name: "Overview", href: "/mechanic/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/mechanic/profile", icon: User },
  { name: "Location", href: "/mechanic/location", icon: MapPin },
  { name: "Availability", href: "/mechanic/availability", icon: Calendar },
  { name: "Settings", href: "/mechanic/settings", icon: Settings },
];

export default function MechanicLocationPage() {
  const [hasChanges, setHasChanges] = useState(false);
  const [location, setLocation] = useState({
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    radius: "25",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
  };

  return (
    <DashboardLayout navItems={MECHANIC_NAV} role="mechanic" title="Expert Portal">
      <div className="space-y-8 relative pb-24">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Service Location</h1>
          <p className="text-subtle text-sm">Set your active service area and garage location.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-[400px] lg:h-auto min-h-[400px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Navigation className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm">Map Integration (Google Maps API)</p>
            </div>
            {/* Fake Map UI */}
            <div className="absolute inset-0 bg-[#1e1e1e]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/20 rounded-full border border-accent/50 animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-8 h-8 text-accent fill-accent" />
              </div>
              <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg"><Navigation className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="text-white text-sm font-medium">Service Area</p>
                  <p className="text-subtle text-xs">{location.radius} mile radius from {location.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-medium text-white mb-4">Address Details</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Street Address</label>
              <input
                type="text"
                name="address"
                value={location.address}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">City</label>
                <input
                  type="text"
                  name="city"
                  value={location.city}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">State</label>
                  <input
                    type="text"
                    name="state"
                    value={location.state}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={location.zip}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            <hr className="border-white/10 my-6" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-white block mb-2">Service Radius (Miles)</label>
              <select
                name="radius"
                value={location.radius}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="10">10 Miles</option>
                <option value="25">25 Miles</option>
                <option value="50">50 Miles</option>
                <option value="100">100 Miles</option>
                <option value="any">Anywhere</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="bg-black/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
              <span className="text-white text-sm font-medium px-4">Unsaved changes</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setHasChanges(false)}
                  className="px-6 py-2 rounded-xl text-white/60 hover:text-white transition-colors text-sm font-medium"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent/90 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
