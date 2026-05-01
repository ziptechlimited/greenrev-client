"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  role: UserRole;
  title: string;
}

export default function DashboardLayout({ children, navItems, role, title }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user || user.role !== role) {
    // Optionally redirect if unauthenticated or wrong role, for now just show a message.
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display text-white mb-4">Access Denied</h1>
        <p className="text-subtle mb-8">You do not have the required permissions to view this portal.</p>
        <Link href="/login" className="px-8 py-4 border border-white/20 text-white rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-black transition-colors">
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#050505] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-8 flex items-center justify-between">
          <div>
            <Link href="/" className="text-xl font-display text-white">GreenRev</Link>
            <p className="text-accent text-[8px] font-bold uppercase tracking-widest mt-1">{title}</p>
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 py-4 border-b border-white/5 mb-4">
          <p className="text-white text-sm font-medium">{user.name}</p>
          <p className="text-white/40 text-xs">{user.email}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : ""}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#050505]">
          <div>
            <span className="text-lg font-display text-white">GreenRev</span>
            <span className="text-accent text-[8px] font-bold uppercase tracking-widest ml-2">{title}</span>
          </div>
          <button className="text-white/60 hover:text-white" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
