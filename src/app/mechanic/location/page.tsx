"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, User, MapPin, Calendar, Settings, Navigation, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/apiClient";

const MECHANIC_NAV = [
  { name: "Overview", href: "/mechanic/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/mechanic/profile", icon: User },
  { name: "Location", href: "/mechanic/location", icon: MapPin },
  { name: "Availability", href: "/mechanic/availability", icon: Calendar },
  { name: "Settings", href: "/mechanic/settings", icon: Settings },
];

export default function MechanicLocationPage() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalLocation, setOriginalLocation] = useState({
    address: "",
    city: "",
    state: "", // Using state as country or we can map it
    country: "US", // Default country
    lat: 0,
    lng: 0,
    radius: "25",
  });
  const [location, setLocation] = useState(originalLocation);

  useEffect(() => {
    async function loadLocation() {
      try {
        const res = await apiRequest<{ profile: any }>("/api/v1/mechanic/profile");
        if (res.success && res.data && res.data.profile) {
          const p = {
            address: res.data.profile.address || "",
            city: res.data.profile.city || "",
            state: "",
            country: res.data.profile.country || "US",
            lat: res.data.profile.lat || 0,
            lng: res.data.profile.lng || 0,
            radius: "25",
          };
          setLocation(p);
          setOriginalLocation(p);
        }
      } catch (err) {
        console.error("Failed to load location", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLocation();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await apiRequest("/api/v1/mechanic/location", {
        method: "PATCH",
        body: JSON.stringify({
          address: location.address,
          city: location.city,
          country: location.country, // Just mapping for now
          // Could use a geocoding API here, but we will mock lat/lng
          lat: location.lat || (37.7749 + (Math.random() - 0.5) * 0.1),
          lng: location.lng || (-122.4194 + (Math.random() - 0.5) * 0.1),
        }),
      });
      if (res.success) {
        setOriginalLocation(location);
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Failed to save location", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout navItems={MECHANIC_NAV} role="mechanic" title="Expert Portal">
      <div className="space-y-8 relative pb-24">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Service Location</h1>
          <p className="text-subtle text-sm">Set your active service area and garage location.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
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
                  <label className="text-sm font-medium text-white">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={location.country}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">State/Region</label>
                  <input
                    type="text"
                    name="state"
                    value={location.state}
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
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                {hasChanges && (
                  <button
                    onClick={() => {
                      setLocation(originalLocation);
                      setHasChanges(false);
                    }}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl text-white/60 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Discard
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Location
                </button>
              </div>

            </div>
          </div>
          </>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}
