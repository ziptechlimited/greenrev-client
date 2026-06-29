"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Shield, UserX, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { adminListUsers, adminUpdateUserRole, adminUpdateUserStatus, adminDeleteUser, AdminUser } from "@/lib/apiAdmin";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_NAV } from "@/lib/adminNav";

export default function AdminRolesPage() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListUsers({ limit: 100 });
      // Filter only admins for the RBAC page
      setAdmins(data.users.filter((u) => u.role === "admin"));
    } catch (err: any) {
      setError(err.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDemote = async (userId: string) => {
    if (!confirm(`Are you sure you want to demote this admin to a customer?`)) return;
    setActionLoading(userId);
    try {
      await adminUpdateUserRole(userId, "customer");
      setAdmins(admins.filter(u => u._id !== userId));
    } catch (err: any) {
      alert("Failed to demote admin: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: "active" | "suspended") => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setActionLoading(userId);
    try {
      await adminUpdateUserStatus(userId, newStatus);
      setAdmins(admins.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" title="Admin Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Role Management (RBAC)</h1>
          <p className="text-subtle text-sm">Manage internal staff roles and access permissions.</p>
        </header>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden relative">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase tracking-widest bg-white/[0.01]">
                    <th className="p-4 font-bold">Staff Member</th>
                    <th className="p-4 font-bold">Role Level</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-subtle">
                        No admins found.
                      </td>
                    </tr>
                  ) : (
                    admins.map((u, i) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={u._id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                              <Shield className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {u.name || "Unnamed Admin"}{" "}
                                {currentUser?.id === u._id && <span className="text-[10px] text-accent ml-2">(You)</span>}
                              </p>
                              <p className="text-subtle text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white/60 bg-white/5 px-3 py-1 rounded-full text-xs font-mono">
                            Super Admin
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                            u.status === "active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border-red-500/20 text-red-300"
                          )}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleStatusChange(u._id, u.status)}
                            disabled={actionLoading === u._id || currentUser?.id === u._id}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 text-white/60 hover:text-white"
                            title={u.status === "active" ? "Suspend Access" : "Restore Access"}
                          >
                            {actionLoading === u._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDemote(u._id)}
                            disabled={actionLoading === u._id || currentUser?.id === u._id}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 text-red-400"
                            title="Demote to Customer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
