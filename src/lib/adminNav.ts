import {
  LayoutDashboard,
  Users,
  Wrench,
  Package,
  BarChart3,
  Calendar,
  ShieldCheck,
  Shield,
  Settings,
  MessageSquare,
  Radio,
  FileText,
  Star,
} from "lucide-react";

export const ADMIN_NAV = [
  // Phase 0 / Existing core
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Mechanics", href: "/admin/mechanics", icon: Wrench },
  { name: "Vendors", href: "/admin/vendors", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },

  // Batch 1: Operations & Financials
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { name: "Roles (RBAC)", href: "/admin/roles", icon: Shield },

  // Batch 2: Moderation & Engagement
  { name: "Support", href: "/admin/support", icon: MessageSquare },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
];
