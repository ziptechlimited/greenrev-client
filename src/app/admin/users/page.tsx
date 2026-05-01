"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Activity } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users & Vendors", href: "/admin/users", icon: Users },
  { name: "System Logs", href: "/admin/logs", icon: Activity },
];

export default function AdminUsersPage() {
  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" title="Admin Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">User Management</h1>
          <p className="text-subtle text-sm">View and manage customers, vendors, and mechanics.</p>
        </header>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <p className="text-subtle">User list interface pending implementation.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
