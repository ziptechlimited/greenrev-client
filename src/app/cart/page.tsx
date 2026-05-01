"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Package, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const vehicleItems = cartItems.filter(item => item.type === 'vehicle');
  const partItems = cartItems.filter(item => item.type === 'part');

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-subtle hover:text-white transition-colors mb-8 text-xs font-bold tracking-[0.2em] uppercase">
          <ArrowLeft className="w-4 h-4" />
          Continue Browsing
        </Link>
        
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 border-b border-white/10 pb-6 gap-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display text-white"
          >
            Your <span className="text-accent italic">Selection.</span>
          </motion.h1>
          <div className="text-subtle uppercase tracking-widest text-xs font-bold">
            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Selected
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center border border-white/5 rounded-3xl bg-white/[0.02]">
            <Package className="w-12 h-12 text-white/20 mb-6" />
            <h3 className="text-2xl text-white mb-2 font-display">Your selection is empty.</h3>
            <p className="text-subtle mb-8 max-w-sm">You haven't added any vehicles or parts to your cart yet.</p>
            <Link 
              href="/shop"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform"
            >
              Explore Inventory
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-12">
              
              {/* Vehicles Section */}
              {vehicleItems.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold pb-2 border-b border-accent/20">Machines</h3>
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {vehicleItems.map(item => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col sm:flex-row gap-6 p-4 bg-white/[0.02] border border-white/10 rounded-2xl group relative"
                        >
                          <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-black">
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill 
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-2">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{item.vendor}</p>
                                <h4 className="text-2xl font-display text-white">{item.name}</h4>
                                <div className="flex gap-4 mt-2 text-subtle text-[10px] tracking-widest uppercase">
                                  <span>{item.originalData.year}</span>
                                  <span>{item.originalData.specs.horsepower} HP</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="mt-6 flex justify-between items-end">
                              <span className="text-[10px] text-white/40 tracking-widest uppercase">Qty: 1</span>
                              <span className="text-2xl font-display text-accent">{item.price}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Parts Section */}
              {partItems.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold pb-2 border-b border-white/10">Components & Upgrades</h3>
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {partItems.map(item => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col sm:flex-row gap-6 p-4 bg-white/[0.02] border border-white/10 rounded-2xl group"
                        >
                          <div className="relative w-full sm:w-32 aspect-square shrink-0 rounded-xl overflow-hidden bg-white/5 p-4 flex items-center justify-center">
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill 
                              className="object-contain p-4"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-2">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{item.vendor}</p>
                                <h4 className="text-xl font-display text-white">{item.name}</h4>
                                <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-[8px] text-white/60 uppercase tracking-widest">
                                  {item.originalData.category}
                                </span>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="mt-6 flex justify-between items-end gap-4 flex-wrap">
                              <div className="flex items-center gap-4 bg-white/5 rounded-full p-1 border border-white/10">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                >-</button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                >+</button>
                              </div>
                              <span className="text-xl font-display text-white">{item.price}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 bg-white/[0.02] border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-display text-white mb-6">Acquisition Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-subtle">Subtotal</span>
                    <span className="text-white font-display tracking-wider">{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-subtle">Taxes & Logistics</span>
                    <span className="text-white/40 italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Total Value</span>
                    <span className="text-3xl font-display text-accent tracking-wider">{cartTotal}</span>
                  </div>
                </div>

                <Link 
                  href="/order"
                  className="w-full py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:scale-105 transition-transform mb-4"
                >
                  Proceed to Secure Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/10 rounded-xl mt-6">
                  <Tag className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] text-accent/80 uppercase tracking-widest leading-relaxed">
                    Authentication is required to finalize your acquisition. You will be prompted during checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
