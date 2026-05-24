"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, PlusCircle, User, Settings,
  ShoppingCart, Clock, CheckCircle2, XCircle, Loader2,
  ChevronDown, ChevronUp, Phone, Mail, MessageSquare, Car,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getVendorRequests, completeTransaction, updateRequestStatus, getVendorRequestCount } from "@/lib/apiAcquisition";
import type { AcquisitionRequest, AcquisitionStatus } from "@/types/acquisition";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<AcquisitionStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",     color: "text-yellow-400",  bg: "bg-yellow-400/10 border-yellow-400/20" },
  accepted:   { label: "Accepted",   color: "text-blue-400",    bg: "bg-blue-400/10 border-blue-400/20" },
  in_progress:{ label: "In Progress",color: "text-purple-400",  bg: "bg-purple-400/10 border-purple-400/20" },
  completed:  { label: "Completed",  color: "text-green-400",   bg: "bg-green-400/10 border-green-400/20" },
  cancelled:  { label: "Cancelled",  color: "text-white/40",    bg: "bg-white/5 border-white/10" },
};

function StatusBadge({ status }: { status: AcquisitionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border", cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
}

function RequestCard({
  request,
  onComplete,
  onStatusChange,
}: {
  request: AcquisitionRequest;
  onComplete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: AcquisitionStatus) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try { await onComplete(request._id); } finally { setLoading(false); }
  };

  const handleStatus = async (status: AcquisitionStatus) => {
    setLoading(true);
    try { await onStatusChange(request._id, status); } finally { setLoading(false); }
  };

  const isTerminal = request.status === "completed" || request.status === "cancelled";
  const formattedDate = new Date(request.createdAt).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5 flex items-start gap-4">
        {/* Product image */}
        <img
          src={request.productImage}
          alt={request.productName}
          className="w-16 h-14 object-cover rounded-xl flex-shrink-0 bg-white/5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-white font-medium text-sm truncate">{request.productName}</p>
              <p className="text-subtle text-xs">{request.productPrice} · {request.productMake}</p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-subtle">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="font-medium text-white/60">{request.customerName}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-2 text-white/40 hover:text-white transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-5">
              {/* Customer Contact */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">Customer Contact</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${request.customerEmail}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {request.customerEmail}
                  </a>
                  {request.customerPhone && (
                    <a
                      href={`tel:${request.customerPhone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:border-accent/40 hover:text-accent transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {request.customerPhone}
                    </a>
                  )}
                </div>
              </div>

              {/* Customer Message */}
              {request.message && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Message</p>
                  <div className="flex gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <MessageSquare className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-relaxed">{request.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isTerminal && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {request.status === "pending" && (
                    <button
                      onClick={() => handleStatus("accepted")}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                    >
                      Accept Request
                    </button>
                  )}
                  {(request.status === "accepted" || request.status === "pending") && (
                    <button
                      onClick={() => handleStatus("in_progress")}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                  )}
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent/20 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleStatus("cancelled")}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              )}

              {request.status === "completed" && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed {request.completedAt ? new Date(request.completedAt).toLocaleDateString() : ""}
                  {request.hasReview && <span className="ml-2 text-white/40">· Customer left a review</span>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<AcquisitionRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AcquisitionStatus | "all">("all");

  useEffect(() => {
    async function load() {
      try {
        const [reqs, count] = await Promise.all([
          getVendorRequests(),
          getVendorRequestCount(),
        ]);
        setRequests(reqs);
        setPendingCount(count);
      } catch (_) {
        // handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const VENDOR_NAV = [
    { name: "Overview",     href: "/vendor/dashboard",      icon: LayoutDashboard },
    { name: "My Products",  href: "/vendor/products",       icon: Package },
    { name: "Add Product",  href: "/vendor/products/add",   icon: PlusCircle },
    { name: "Profile",      href: "/vendor/profile",        icon: User },
    { name: "Requests",     href: "/vendor/requests",       icon: ShoppingCart, badge: pendingCount },
    { name: "Settings",     href: "/vendor/settings",       icon: Settings },
  ];

  const handleComplete = async (id: string) => {
    const updated = await completeTransaction(id);
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, ...updated } : r)));
    setPendingCount((c) => Math.max(0, c - 1));
  };

  const handleStatusChange = async (id: string, status: AcquisitionStatus) => {
    const updated = await updateRequestStatus(id, status);
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, ...updated } : r)));
    if (status === "cancelled" || status === "completed") {
      setPendingCount((c) => Math.max(0, c - 1));
    }
  };

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const filterTabs: { label: string; value: AcquisitionStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <DashboardLayout navItems={VENDOR_NAV} role="vendor" title="Vendor Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">Acquisition Requests</h1>
          <p className="text-subtle text-sm">
            {requests.length === 0
              ? "No requests yet — your listings are live."
              : `${requests.length} total request${requests.length !== 1 ? "s" : ""}, ${pendingCount} pending`}
          </p>
        </header>

        {/* Filter tabs */}
        {requests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => {
              const count =
                tab.value === "all"
                  ? requests.length
                  : requests.filter((r) => r.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                    filter === tab.value
                      ? "bg-white/10 text-white border-white/20"
                      : "text-white/40 border-white/5 hover:text-white hover:border-white/20"
                  )}
                >
                  {tab.label} {count > 0 && <span className="opacity-60">({count})</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Car className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-xl font-display text-white mb-3">No requests yet</h2>
            <p className="text-subtle text-sm max-w-xs">
              When customers express interest in your listings, their requests will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-subtle text-sm">No requests match this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  onComplete={handleComplete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
