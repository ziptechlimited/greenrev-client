"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, User, MapPin, Calendar, Settings } from "lucide-react";

const MECHANIC_NAV = [
  { name: "Overview", href: "/mechanic/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/mechanic/profile", icon: User },
  { name: "Location", href: "/mechanic/location", icon: MapPin },
  { name: "Availability", href: "/mechanic/availability", icon: Calendar },
  { name: "Settings", href: "/mechanic/settings", icon: Settings },
];

export default function MechanicProfilePage() {
  return (
    <DashboardLayout navItems={MECHANIC_NAV} role="mechanic" title="Expert Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">My Profile</h1>
          <p className="text-subtle text-sm">Update your public expert profile.</p>
        </header>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
            <p className="text-subtle">Profile management interface pending implementation.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
