"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Info, Wrench, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import partsData from "@/data/parts.json";
import { useCart } from "@/context/CartContext";

export default function PartDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [part, setPart] = useState<typeof partsData[0] | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const foundPart = partsData.find((p) => p.id === params.id);
    if (foundPart) {
      setPart(foundPart);
    }
  }, [params.id]);

  if (!part) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display text-white mb-4">Component Not Found</h1>
        <p className="text-subtle mb-8">The requested performance part could not be located.</p>
        <Link href="/parts" className="px-8 py-4 border border-white/20 text-white rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-black transition-colors">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: part.id,
      name: part.name,
      price: `$${part.price.toLocaleString()}`,
      image: part.image,
      type: 'part',
      quantity: 1,
      vendor: part.brand,
      originalData: part
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedParts = partsData.filter(p => p.category === part.category && p.id !== part.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Link href="/parts" className="inline-flex items-center gap-2 text-subtle hover:text-white transition-colors mb-12 text-[10px] font-bold tracking-[0.2em] uppercase">
          <ArrowLeft className="w-4 h-4" />
          Back to Boutique
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column: Media */}
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-8 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image 
                src={part.image}
                alt={part.name}
                fill
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-110 z-0"
              />
              <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/60">
                {part.category}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-3">{part.brand}</p>
                <h1 className="text-5xl md:text-6xl font-display text-white mb-6">{part.name}</h1>
                <p className="text-3xl font-display text-accent">${part.price.toLocaleString()}</p>
              </div>

              <div className="w-full h-px bg-white/10" />

              <p className="text-subtle text-lg font-light leading-relaxed">
                {part.description}
              </p>

              {/* Specs */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold flex items-center gap-2">
                  <Wrench className="w-3 h-3" />
                  Technical Specifications
                </h3>
                <ul className="space-y-3">
                  {part.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full h-px bg-white/10" />

              {/* Vendor & Trust */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <p className="text-xs text-white/60">Verified Vendor</p>
                  <p className="text-sm text-white font-bold">{part.brand}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                  <Info className="w-5 h-5 text-accent" />
                  <p className="text-xs text-white/60">Compatibility</p>
                  <p className="text-sm text-white font-bold">Universal Fit / Spec</p>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="pt-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:bg-accent disabled:text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Selection
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Acquire Component
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Parts */}
        {relatedParts.length > 0 && (
          <div className="mt-32 border-t border-white/5 pt-16">
            <h2 className="text-2xl font-display text-white mb-12 text-center">Similar Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedParts.map(related => (
                <Link key={related.id} href={`/parts/${related.id}`} className="group relative bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden hover:border-accent/30 transition-all duration-500 block">
                  <div className="relative aspect-video overflow-hidden bg-white/5 p-8 flex items-center justify-center">
                    <Image 
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{related.brand}</p>
                    <h3 className="text-lg font-display text-white">{related.name}</h3>
                    <p className="text-white/60 mt-2">${related.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
