"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, Activity, ShoppingBag, ShieldCheck, TrendingUp } from "lucide-react";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users & Customers", href: "/admin/users", icon: Users },
  { name: "Vendors", href: "/admin/vendors", icon: ShoppingBag },
  { name: "Mechanics", href: "/admin/mechanics", icon: ShieldCheck },
  { name: "Products", href: "/admin/products", icon: TrendingUp },
  { name: "Analytics", href: "/admin/analytics", icon: Activity },
];

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" title="Admin Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Platform Analytics</h1>
          <p className="text-subtle text-sm">Detailed ecosystem performance metrics.</p>
        </header>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
            <p className="text-subtle">Advanced analytics charts pending implementation.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
