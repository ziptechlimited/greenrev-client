"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, User, MapPin, Calendar, Settings, Camera, Check, X } from "lucide-react";
import { mockProfile } from "@/data/mechanicMockData";
import { motion, AnimatePresence } from "framer-motion";

const MECHANIC_NAV = [
  { name: "Overview", href: "/mechanic/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/mechanic/profile", icon: User },
  { name: "Location", href: "/mechanic/location", icon: MapPin },
  { name: "Availability", href: "/mechanic/availability", icon: Calendar },
  { name: "Settings", href: "/mechanic/settings", icon: Settings },
];

export default function MechanicProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile({ ...profile, specialties: [...profile.specialties, newSpecialty.trim()] });
      setNewSpecialty("");
      setHasChanges(true);
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    setProfile({
      ...profile,
      specialties: profile.specialties.filter((s) => s !== specialtyToRemove),
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setHasChanges(false);
  };

  return (
    <DashboardLayout navItems={MECHANIC_NAV} role="mechanic" title="Expert Portal">
      <div className="space-y-8 relative pb-24">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">My Profile</h1>
          <p className="text-subtle text-sm">Update your public expert profile.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/10">
                  <User className="w-16 h-16 text-white/40" />
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center">
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-xs text-white">Change</span>
                  </div>
                </button>
              </div>
              <h3 className="text-xl font-medium text-white mb-1">{profile.name}</h3>
              <p className="text-accent text-sm">Expert Mechanic</p>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Hourly Rate ($)</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={profile.hourlyRate}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-white block mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center gap-1 bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm"
                    >
                      {specialty}
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="hover:text-red-400 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSpecialty()}
                    placeholder="Add a specialty..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    onClick={handleAddSpecialty}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

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
                  onClick={() => {
                    setProfile(mockProfile);
                    setHasChanges(false);
                  }}
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
