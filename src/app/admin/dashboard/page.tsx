"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, ShoppingBag, ShieldCheck, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users & Vendors", href: "/admin/users", icon: Users },
  { name: "System Logs", href: "/admin/logs", icon: Activity },
];

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "$4.2M", trend: "+12.5%", positive: true },
    { label: "Active Vendors", value: "142", trend: "+5", positive: true },
    { label: "Pending Approvals", value: "18", trend: "Action Req.", positive: false },
    { label: "System Uptime", value: "99.9%", trend: "Stable", positive: true },
  ];

  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" title="Admin Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">System Overview</h1>
          <p className="text-subtle text-sm">Monitor platform health and marketplace activity.</p>
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
                <span className={`text-xs font-medium ${stat.positive ? "text-accent" : "text-orange-400"}`}>
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Marketplace Volume
              </h2>
              <select className="bg-transparent text-subtle text-xs border border-white/10 rounded-lg px-3 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              <p className="text-subtle text-sm">Chart Integration Pending</p>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-medium flex items-center gap-2 mb-6">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Action Items
            </h2>
            <div className="space-y-4">
              {[
                { type: "Vendor", msg: "New vendor 'Apex Auto' pending review", time: "10m ago" },
                { type: "System", msg: "Database CPU spike detected", time: "1h ago" },
                { type: "Listing", msg: "Flagged vehicle listing #A92", time: "3h ago" },
                { type: "Mechanic", msg: "5 new mechanic applications", time: "5h ago" },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.type === 'System' ? 'bg-orange-400' : 'bg-accent'}`} />
                  <div>
                    <p className="text-sm text-white/80">{alert.msg}</p>
                    <p className="text-[10px] text-white/40 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
