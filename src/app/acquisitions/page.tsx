"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, CheckCircle2, XCircle, Star, Loader2,
  ChevronDown, ChevronUp, Phone, Mail, Car,
  MessageSquare, Send,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { getCustomerRequests, updateRequestStatus, createReview } from "@/lib/apiAcquisition";
import type { AcquisitionRequest, AcquisitionStatus } from "@/types/acquisition";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<AcquisitionStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: "Pending",     color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  accepted:    { label: "Accepted",   color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20" },
  in_progress: { label: "In Progress",color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  completed:   { label: "Completed",  color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20" },
  cancelled:   { label: "Cancelled",  color: "text-white/40",   bg: "bg-white/5 border-white/10" },
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "w-7 h-7 transition-colors",
              (hovered || value) >= star
                ? "text-accent fill-accent"
                : "text-white/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  requestId,
  onSubmit,
}: {
  requestId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating"); return; }
    setLoading(true);
    setError("");
    try {
      await onSubmit(rating, comment);
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
      <p className="text-white text-sm font-medium">Leave a Review</p>
      <StarRating value={rating} onChange={setRating} />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this vendor (optional)…"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 resize-none"
      />
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="flex items-center gap-2 px-5 py-2.5 bg-accent text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        Submit Review
      </button>
    </form>
  );
}

function RequestCard({
  request,
  onStatusChange,
  onReviewSubmit,
}: {
  request: AcquisitionRequest;
  onStatusChange: (id: string, status: AcquisitionStatus) => Promise<void>;
  onReviewSubmit: (id: string, rating: number, comment: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const cfg = STATUS_CONFIG[request.status];
  const isTerminal = request.status === "completed" || request.status === "cancelled";
  const canReview = request.status === "completed" && !request.hasReview && !request.review;
  const formattedDate = new Date(request.createdAt).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

  const handleStatus = async (status: AcquisitionStatus) => {
    setLoading(true);
    try { await onStatusChange(request._id, status); } finally { setLoading(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
    >
      <div className="p-5 flex items-start gap-4">
        <img
          src={request.productImage}
          alt={request.productName}
          className="w-16 h-14 object-cover rounded-xl flex-shrink-0 bg-white/5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-white font-medium text-sm">{request.productName}</p>
              <p className="text-subtle text-xs">{request.productPrice} · {request.productMake}</p>
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border", cfg.bg, cfg.color)}>
              {cfg.label}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-subtle">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="font-medium text-white/60">{request.vendorName}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-2 text-white/40 hover:text-white transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

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
              {/* Vendor Contact */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">Vendor Contact</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${request.vendorEmail}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {request.vendorEmail}
                  </a>
                  {request.vendorPhone && (
                    <a
                      href={`tel:${request.vendorPhone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:border-accent/40 hover:text-accent transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {request.vendorPhone}
                    </a>
                  )}
                </div>
                {request.vendorCompanyName && (
                  <p className="text-xs text-subtle mt-2">{request.vendorCompanyName}</p>
                )}
              </div>

              {/* Your Message */}
              {request.message && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Your Message</p>
                  <div className="flex gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <MessageSquare className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-relaxed">{request.message}</p>
                  </div>
                </div>
              )}

              {/* Status Actions (customer) */}
              {!isTerminal && (
                <div className="flex flex-wrap gap-3">
                  {request.status !== "in_progress" && (
                    <button
                      onClick={() => handleStatus("in_progress")}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                  )}
                  <button
                    onClick={() => handleStatus("cancelled")}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Request
                  </button>
                </div>
              )}

              {/* Completed info */}
              {request.status === "completed" && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Transaction completed {request.completedAt ? new Date(request.completedAt).toLocaleDateString() : ""}
                </div>
              )}

              {/* Existing review */}
              {request.review && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Your Review</p>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={cn("w-4 h-4", s <= request.review!.rating ? "text-accent fill-accent" : "text-white/20")} />
                    ))}
                  </div>
                  {request.review.comment && (
                    <p className="text-sm text-white/70">{request.review.comment}</p>
                  )}
                </div>
              )}

              {/* Review Form */}
              {canReview && (
                <ReviewForm
                  requestId={request._id}
                  onSubmit={(rating, comment) => onReviewSubmit(request._id, rating, comment)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AcquisitionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<AcquisitionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AcquisitionStatus | "all">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user) {
      getCustomerRequests()
        .then(setRequests)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleStatusChange = async (id: string, status: AcquisitionStatus) => {
    const updated = await updateRequestStatus(id, status);
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, ...updated } : r)));
  };

  const handleReviewSubmit = async (id: string, rating: number, comment: string) => {
    await createReview(id, { rating, comment });
    const refreshed = await getCustomerRequests();
    setRequests(refreshed);
  };

  const filterTabs: { label: string; value: AcquisitionStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-display text-white mb-3">My Requests</h1>
            <p className="text-subtle">
              Track your acquisition requests and connect with vendors.
            </p>
          </motion.div>

          {/* Filter tabs */}
          {requests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {filterTabs.map((tab) => {
                const count = tab.value === "all" ? requests.length : requests.filter((r) => r.status === tab.value).length;
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

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-white/20" />
              </div>
              <h2 className="text-2xl font-display text-white mb-3">No requests yet</h2>
              <p className="text-subtle mb-8 max-w-xs">
                Browse the showroom and place your first acquisition request to connect with a vendor.
              </p>
              <a
                href="/shop"
                className="px-8 py-3 border border-white/20 text-white rounded-full uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors"
              >
                Browse Showroom
              </a>
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
                    onStatusChange={handleStatusChange}
                    onReviewSubmit={handleReviewSubmit}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
