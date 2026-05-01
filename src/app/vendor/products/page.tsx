"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Package, PlusCircle, User, Settings } from "lucide-react";

const VENDOR_NAV = [
  { name: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "My Products", href: "/vendor/products", icon: Package },
  { name: "Add Product", href: "/vendor/products/add", icon: PlusCircle },
  { name: "Profile", href: "/vendor/profile", icon: User },
  { name: "Settings", href: "/vendor/settings", icon: Settings },
];

export default function VendorProductsPage() {
  return (
    <DashboardLayout navItems={VENDOR_NAV} role="vendor" title="Vendor Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">My Products</h1>
          <p className="text-subtle text-sm">Manage your vehicle and parts inventory.</p>
        </header>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
            <p className="text-subtle">Product list interface pending implementation.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
