"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Gauge,
  Zap,
  Cpu,
  ShieldCheck,
  Calendar,
  Layers,
  Scale,
  Loader2,
  X,
  CheckCircle2,
  Send,
} from "lucide-react";
import Link from "next/link";
import InventoryCard from "@/components/shared/InventoryCard";
import { cn } from "@/lib/utils";
import { useCompare } from "@/context/CompareContext";
import { getProduct, getAllProducts } from "@/lib/apiProduct";
import { transformProductToCarEntry } from "@/lib/transformProduct";
import type { CarEntry } from "@/components/shared/InventoryCard";
import { useAuth } from "@/context/AuthContext";
import { createAcquisitionRequest } from "@/lib/apiAcquisition";

function CarDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { addToCompare, compareItems } = useCompare();
  const { user } = useAuth();

  const [car, setCar] = useState<CarEntry | null>(null);
  const [suggestions, setSuggestions] = useState<CarEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Acquisition request modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    async function fetchCarAndSuggestions() {
      setIsLoading(true);
      try {
        const dynamicProduct = await getProduct(id);
        if (dynamicProduct) {
          if (dynamicProduct.category === "vehicle") {
            const carEntry = transformProductToCarEntry(dynamicProduct);
            setCar(carEntry);

            // Fetch suggestions
            const allVehicles = await getAllProducts("vehicle");
            const sameMake = allVehicles
              .filter(
                (v) =>
                  v.make === carEntry.make &&
                  (v._id?.toString() || v.id) !== id,
              )
              .map(transformProductToCarEntry);
            const others = allVehicles
              .filter(
                (v) =>
                  v.make !== carEntry.make &&
                  (v._id?.toString() || v.id) !== id,
              )
              .map(transformProductToCarEntry);

            setSuggestions([...sameMake, ...others].slice(0, 3));
          } else if (dynamicProduct.category === "part") {
            router.replace(`/parts/${id}`);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch car details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchCarAndSuggestions();
    }
  }, [id, router]);

  const isComparing = car
    ? compareItems.some((item) => item.id === car.id)
    : false;

  const handleAcquisitionClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setModalOpen(true);
    setRequestSuccess(false);
    setSubmitError("");
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await createAcquisitionRequest({
        productId: car.id,
        message: message.trim() || undefined,
      });
      setRequestSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-subtle font-display tracking-widest uppercase text-xs">
          Accessing Machine Data...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-4xl font-display mb-4">Machine Not Found.</h1>
        <p className="text-subtle mb-8 max-w-md">
          The requested vehicle is either sold or no longer in our curated
          inventory.
        </p>
        <Link
          href="/shop"
          className="text-accent hover:underline uppercase tracking-widest text-xs font-bold"
        >
          Return to Showroom
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-subtle hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Back
          </span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* Left: Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />

              {/* Color Badge Overlay */}
              <div className="absolute bottom-8 left-8 z-20 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: car.color.hex }}
                />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white">
                  {car.color.name}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Info Section */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase mb-4 block">
                {car.make}
              </span>
              <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
                {car.name}
              </h1>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-3xl font-display text-accent">
                  {car.price}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest text-subtle">
                  Exc. Tax
                </span>
              </div>
            </motion.div>

            {/* Quick Specs Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-12"
            >
              <SpecItem
                icon={<Gauge className="w-4 h-4" />}
                label="0-100 km/h"
                value={`${car.specs["0_100"]}s`}
              />
              <SpecItem
                icon={<Zap className="w-4 h-4" />}
                label="Power"
                value={`${car.specs.horsepower} HP`}
              />
              <SpecItem
                icon={<Layers className="w-4 h-4" />}
                label="Torque"
                value={car.specs.torque}
              />
              <SpecItem
                icon={<Cpu className="w-4 h-4" />}
                label="Gearbox"
                value={car.specs.transmission.split(" ")[0]}
              />
            </motion.div>

            {/* Selection/Order Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-accent/10" />
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-4 text-sm">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span className="text-white">
                    Certified Mechanical Inspection
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="text-white">
                    Ready for Dispatch: 48 Hours
                  </span>
                </div>

                <button
                  onClick={handleAcquisitionClick}
                  className="w-full py-5 bg-accent text-black font-display tracking-widest uppercase text-sm rounded-2xl shadow-[0_10px_30px_rgba(199,164,61,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(199,164,61,0.4)] active:scale-95 flex items-center justify-center gap-3"
                >
                  Place Acquisition Request
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (!isComparing) {
                      addToCompare(car);
                      if (compareItems.length === 1) {
                        router.push("/compare");
                      }
                    }
                  }}
                  className={cn(
                    "w-full py-4 tracking-widest uppercase text-xs font-bold rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 border",
                    isComparing
                      ? "bg-accent/20 border-accent/50 text-accent shadow-[0_0_20px_rgba(199,164,61,0.2)]"
                      : "bg-transparent border-white/20 text-white hover:bg-white/5",
                  )}
                >
                  <Scale className="w-4 h-4" />
                  {isComparing ? "Added to Compare" : "Compare Vehicle"}
                </button>
              </div>
            </motion.div>

            {/* Full Specs Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-6">
                Technical Specifications
              </h3>
              <div className="space-y-4">
                {Object.entries(car.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-white/5"
                  >
                    <span className="text-sm text-subtle capitalize">
                      {key.replace("_", "-")}
                    </span>
                    <span className="text-sm text-white font-medium">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Suggested Machines */}
        <div className="pt-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-accent text-[10px] tracking-[0.3em] uppercase mb-4">
                You Might Also Command
              </h2>
              <h3 className="text-4xl font-display text-white">
                Suggested Machines.
              </h3>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-3 text-subtle hover:text-accent transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                View Full Showroom
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {suggestions.map((s) => (
              <InventoryCard key={s.id} car={s} />
            ))}
          </div>
        </div>
      </div>

      {/* Acquisition Request Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!submitting) setModalOpen(false); }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div>
                    <h2 className="text-xl font-display text-white">Place Acquisition Request</h2>
                    <p className="text-subtle text-xs mt-1">{car?.name} · {car?.price}</p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {!requestSuccess ? (
                    <form onSubmit={handleSubmitRequest} className="space-y-5">
                      <p className="text-sm text-white/70 leading-relaxed">
                        Submitting this request will connect you with the vendor. Their contact details will be revealed so you can coordinate directly.
                      </p>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">
                          Message to Vendor <span className="normal-case tracking-normal opacity-60">(optional)</span>
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Introduce yourself or ask any questions about this vehicle…"
                          rows={4}
                          maxLength={1000}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none transition-all"
                        />
                        <p className="text-right text-[10px] text-white/20 mt-1">{message.length}/1000</p>
                      </div>

                      {submitError && (
                        <p className="text-red-400 text-sm p-3 bg-red-400/10 border border-red-400/20 rounded-xl">
                          {submitError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-accent text-black font-display tracking-widest uppercase text-sm rounded-2xl hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
                      >
                        {submitting
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                          : <><Send className="w-4 h-4" /> Send Request</>
                        }
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-green-400">
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-white">Request sent successfully!</p>
                          <p className="text-subtle text-xs">The vendor has been notified.</p>
                        </div>
                      </div>

                      <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">
                          Next Step
                        </p>
                        <p className="text-sm text-white/70 leading-relaxed">
                          Once the vendor accepts your request, you’ll see their contact details and a payment receipt upload field in your requests page.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setModalOpen(false)}
                          className="flex-1 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 transition-colors"
                        >
                          Close
                        </button>
                        <a
                          href="/acquisitions"
                          className="flex-1 py-3 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors text-center"
                        >
                          View My Requests
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function CarDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
          <p className="text-subtle font-display tracking-widest uppercase text-xs">
            Loading Details...
          </p>
        </div>
      }
    >
      <CarDetailsContent />
    </Suspense>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 transition-colors hover:bg-white/10">
      <div className="p-2 w-fit bg-accent/10 border border-accent/20 rounded-lg text-accent">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-subtle font-bold mb-1">
          {label}
        </p>
        <p className="text-lg text-white font-display uppercase tracking-wider">
          {value}
        </p>
      </div>
    </div>
  );
}
