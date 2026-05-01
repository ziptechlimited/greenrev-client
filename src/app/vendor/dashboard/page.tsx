"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Package, PlusCircle, User, Settings, TrendingUp, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const VENDOR_NAV = [
  { name: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "My Products", href: "/vendor/products", icon: Package },
  { name: "Add Product", href: "/vendor/products/add", icon: PlusCircle },
  { name: "Profile", href: "/vendor/profile", icon: User },
  { name: "Settings", href: "/vendor/settings", icon: Settings },
];

export default function VendorDashboardPage() {
  const stats = [
    { label: "Total Sales", value: "$124K", trend: "+8.2%", positive: true },
    { label: "Active Listings", value: "24", trend: "0", positive: true },
    { label: "Pending Orders", value: "12", trend: "-2", positive: false },
    { label: "Profile Views", value: "1,240", trend: "+15%", positive: true },
  ];

  return (
    <DashboardLayout navItems={VENDOR_NAV} role="vendor" title="Vendor Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Vendor Overview</h1>
          <p className="text-subtle text-sm">Manage your inventory, track sales, and monitor performance.</p>
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
              <TrendingUp className="w-4 h-4 text-accent" />
              Sales Performance
            </h2>
            <div className="h-full flex items-center justify-center">
                <p className="text-subtle text-sm">Sales Chart Rendering Pending</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[300px]">
             <h2 className="text-white font-medium flex items-center gap-2 mb-6">
              <DollarSign className="w-4 h-4 text-accent" />
              Recent Orders
            </h2>
            <div className="h-full flex items-center justify-center">
                <p className="text-subtle text-sm">No recent orders to display.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
