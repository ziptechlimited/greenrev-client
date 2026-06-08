"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Activity,
  Loader2,
  ShoppingCart,
  Clock,
  ChevronDown,
  ChevronUp,
  Flag,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  adminFlagAcquisition,
  adminGetAcquisitionEvents,
  adminListAcquisitionRequests,
  adminResolveAcquisition,
} from "@/lib/apiAcquisition";
import type {
  AcquisitionEvent,
  AcquisitionRequest,
  AcquisitionStatus,
} from "@/types/acquisition";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users & Vendors", href: "/admin/users", icon: Users },
];

const STATUS_CONFIG: Record<
  AcquisitionStatus,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  accepted: {
    label: "Accepted",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  receipt_uploaded: {
    label: "Receipt Uploaded",
    color: "text-purple-300",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  payment_confirmed: {
    label: "Payment Confirmed",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  completed: {
    label: "Completed",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
};

function StatusBadge({ status }: { status: AcquisitionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
        cfg.bg,
        cfg.color,
      )}
    >
      {cfg.label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<AcquisitionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AcquisitionStatus | "all">(
    "all",
  );
  const [flagFilter, setFlagFilter] = useState<"all" | "flagged" | "unflagged">(
    "all",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [events, setEvents] = useState<AcquisitionEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [resolution, setResolution] = useState("");

  const selectedRequest = useMemo(
    () => requests.find((r) => r._id === selectedId) ?? null,
    [requests, selectedId],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminListAcquisitionRequests({
      status: statusFilter === "all" ? undefined : statusFilter,
      flagged:
        flagFilter === "all" ? undefined : flagFilter === "flagged" ? true : false,
    })
      .then((data) => {
        if (cancelled) return;
        setRequests(data);
        if (selectedId && !data.some((r) => r._id === selectedId)) {
          setSelectedId(null);
          setEvents([]);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setRequests([]);
        setSelectedId(null);
        setEvents([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [statusFilter, flagFilter, selectedId]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedId) {
      setEvents([]);
      return;
    }
    setEventsLoading(true);
    adminGetAcquisitionEvents(selectedId)
      .then((data) => {
        if (cancelled) return;
        setEvents(data);
      })
      .catch(() => {
        if (cancelled) return;
        setEvents([]);
      })
      .finally(() => {
        if (cancelled) return;
        setEventsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const counts = useMemo(() => {
    const byStatus: Record<AcquisitionStatus, number> = {
      pending: 0,
      accepted: 0,
      receipt_uploaded: 0,
      payment_confirmed: 0,
      completed: 0,
    };
    let flagged = 0;
    for (const r of requests) {
      byStatus[r.status] += 1;
      if (r.adminFlaggedAt) flagged += 1;
    }
    return { total: requests.length, flagged, byStatus };
  }, [requests]);

  const statusTabs: { label: string; value: AcquisitionStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Receipt Uploaded", value: "receipt_uploaded" },
    { label: "Payment Confirmed", value: "payment_confirmed" },
    { label: "Completed", value: "completed" },
  ];

  const toggleSelected = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setFlagReason("");
    setResolution("");
  };

  const handleFlag = async () => {
    if (!selectedRequest) return;
    if (flagReason.trim().length < 3) return;
    setActionLoading(true);
    try {
      const updated = await adminFlagAcquisition(selectedRequest._id, flagReason.trim());
      setRequests((prev) =>
        prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)),
      );
      const refreshed = await adminGetAcquisitionEvents(selectedRequest._id);
      setEvents(refreshed);
      setFlagReason("");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedRequest) return;
    if (resolution.trim().length < 3) return;
    setActionLoading(true);
    try {
      const updated = await adminResolveAcquisition(selectedRequest._id, resolution.trim());
      setRequests((prev) =>
        prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)),
      );
      const refreshed = await adminGetAcquisitionEvents(selectedRequest._id);
      setEvents(refreshed);
      setResolution("");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" title="Admin Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">
            Transaction Monitoring
          </h1>
          <p className="text-subtle text-sm">
            Review every acquisition step, receipt evidence, and admin actions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: "Total", value: counts.total },
            { label: "Pending", value: counts.byStatus.pending },
            { label: "Accepted", value: counts.byStatus.accepted },
            { label: "Receipt", value: counts.byStatus.receipt_uploaded },
            { label: "Confirmed", value: counts.byStatus.payment_confirmed },
            { label: "Flagged", value: counts.flagged },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl"
            >
              <p className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-3">
                {stat.label}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-display text-white">
                  {stat.value}
                </span>
                <ShoppingCart className="w-4 h-4 text-white/20" />
              </div>
            </motion.div>
          ))}
        </div>

        {requests.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => {
                const count =
                  tab.value === "all"
                    ? requests.length
                    : requests.filter((r) => r.status === tab.value).length;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                      statusFilter === tab.value
                        ? "bg-white/10 text-white border-white/20"
                        : "text-white/40 border-white/5 hover:text-white hover:border-white/20",
                    )}
                  >
                    {tab.label}{" "}
                    {count > 0 && <span className="opacity-60">({count})</span>}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" as const },
                { label: "Flagged", value: "flagged" as const },
                { label: "Unflagged", value: "unflagged" as const },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFlagFilter(tab.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                    flagFilter === tab.value
                      ? "bg-white/10 text-white border-white/20"
                      : "text-white/40 border-white/5 hover:text-white hover:border-white/20",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-accent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-subtle text-sm">No transactions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {requests.map((req) => {
                  const expanded = selectedId === req._id;
                  return (
                    <motion.div
                      key={req._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "bg-white/[0.02] border rounded-2xl overflow-hidden",
                        expanded ? "border-white/20" : "border-white/5",
                      )}
                    >
                      <button
                        onClick={() => toggleSelected(req._id)}
                        className="w-full text-left p-5 flex items-start gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-white font-medium text-sm">
                                {req.productName}
                              </p>
                              <p className="text-subtle text-xs">
                                {req.customerName} → {req.vendorName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {req.adminFlaggedAt ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-red-500/10 border-red-500/20 text-red-300">
                                  <Flag className="w-3 h-3" />
                                  Flagged
                                </span>
                              ) : null}
                              <StatusBadge status={req.status} />
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-4 text-xs text-subtle">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(req.createdAt).toLocaleDateString(
                                "en-US",
                                { day: "numeric", month: "short", year: "numeric" },
                              )}
                            </span>
                            {req.receiptUrl ? (
                              <span className="text-white/60">Receipt attached</span>
                            ) : null}
                            {typeof req.vendorPaymentAmount === "number" ? (
                              <span className="text-white/60">
                                Amount: {req.vendorPaymentAmount}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex-shrink-0 p-2 text-white/40">
                          {expanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[400px]">
              {!selectedRequest ? (
                <div className="h-full flex items-center justify-center text-center">
                  <p className="text-subtle text-sm">
                    Select a transaction to view its timeline and take action.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-medium">
                        {selectedRequest.productName}
                      </p>
                      <p className="text-subtle text-sm">
                        {selectedRequest.customerName} → {selectedRequest.vendorName}
                      </p>
                      <p className="text-subtle text-xs mt-1">
                        {selectedRequest._id}
                      </p>
                    </div>
                    <StatusBadge status={selectedRequest.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        Evidence
                      </p>
                      {selectedRequest.receiptUrl ? (
                        <a
                          href={selectedRequest.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent text-sm inline-block mt-2"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <p className="text-sm text-white/60 mt-2">
                          No receipt uploaded.
                        </p>
                      )}
                      <p className="text-[11px] text-white/40 mt-3">
                        Vendor amount:{" "}
                        {typeof selectedRequest.vendorPaymentAmount === "number"
                          ? selectedRequest.vendorPaymentAmount
                          : "—"}
                      </p>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        Dispute
                      </p>
                      {selectedRequest.adminFlaggedAt ? (
                        <p className="text-sm text-red-300 mt-2">
                          Flagged: {selectedRequest.adminFlagReason ?? "—"}
                        </p>
                      ) : (
                        <p className="text-sm text-white/60 mt-2">
                          Not flagged.
                        </p>
                      )}
                      {selectedRequest.adminResolvedAt ? (
                        <div className="mt-3 flex items-center gap-2 text-emerald-300 text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          Resolved: {selectedRequest.adminResolution ?? "—"}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                      Timeline
                    </p>
                    {eventsLoading ? (
                      <div className="flex items-center gap-2 text-subtle text-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        Loading events…
                      </div>
                    ) : events.length === 0 ? (
                      <p className="text-subtle text-sm">No events recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {events.map((e) => (
                          <div
                            key={e._id}
                            className="p-3 rounded-xl bg-white/5 border border-white/5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm text-white/80">
                                  {e.action}
                                  {e.fromStatus || e.toStatus
                                    ? ` (${e.fromStatus ?? "—"} → ${e.toStatus ?? "—"})`
                                    : ""}
                                </p>
                                <p className="text-[10px] text-white/40 mt-1">
                                  {new Date(e.createdAt).toLocaleString()} · {e.actorRole}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        Flag
                      </p>
                      <textarea
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        rows={3}
                        placeholder="Reason (min 3 chars)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleFlag}
                        disabled={actionLoading || flagReason.trim().length < 3}
                        className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? "Working…" : "Flag Transaction"}
                      </button>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        Resolve
                      </p>
                      <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        rows={3}
                        placeholder="Resolution (min 3 chars)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleResolve}
                        disabled={actionLoading || resolution.trim().length < 3}
                        className="w-full py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? "Working…" : "Mark Resolved"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
