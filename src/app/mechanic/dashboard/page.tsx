"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, User, MapPin, Calendar, Settings, Star, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const MECHANIC_NAV = [
  { name: "Overview", href: "/mechanic/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/mechanic/profile", icon: User },
  { name: "Location", href: "/mechanic/location", icon: MapPin },
  { name: "Availability", href: "/mechanic/availability", icon: Calendar },
  { name: "Settings", href: "/mechanic/settings", icon: Settings },
];

export default function MechanicDashboardPage() {
  const stats = [
    { label: "Total Bookings", value: "48", trend: "+4", positive: true },
    { label: "Profile Rating", value: "4.9", trend: "0", positive: true },
    { label: "Upcoming Appointments", value: "5", trend: "This Week", positive: true },
    { label: "Service Hours", value: "120", trend: "+12", positive: true },
  ];

  return (
    <DashboardLayout navItems={MECHANIC_NAV} role="mechanic" title="Expert Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Expert Overview</h1>
          <p className="text-subtle text-sm">Manage your service requests, schedule, and profile visibility.</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl"
            >
              <p className="text-subtle text-xs font-bold uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-display text-white">{stat.value}</span>
                <span className={`text-xs font-medium ${stat.positive ? "text-accent" : "text-white/40"}`}>
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[300px]">
             <h2 className="text-white font-medium flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-accent" />
              Upcoming Schedule
            </h2>
            <div className="h-full flex items-center justify-center">
                <p className="text-subtle text-sm">No upcoming appointments scheduled.</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[300px]">
             <h2 className="text-white font-medium flex items-center gap-2 mb-6">
              <Star className="w-4 h-4 text-accent" />
              Recent Reviews
            </h2>
            <div className="h-full flex items-center justify-center">
                <p className="text-subtle text-sm">No recent reviews.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
