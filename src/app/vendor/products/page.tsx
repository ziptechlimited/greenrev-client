"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { getVendorProducts } from "@/lib/apiProduct";
import type { Product } from "@/types/product";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  User,
  Settings,
  Car,
  Wrench,
  ShoppingCart,
} from "lucide-react";

const VENDOR_NAV = [
  { name: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "My Products", href: "/vendor/products", icon: Package },
  { name: "Add Product", href: "/vendor/products/add", icon: PlusCircle },
  { name: "Profile", href: "/vendor/profile", icon: User },
  { name: "Requests", href: "/vendor/requests", icon: ShoppingCart },
  { name: "Settings", href: "/vendor/settings", icon: Settings },
];

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getVendorProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const vehicles = products.filter((p) => p.category === "vehicle").length;
    const parts = products.filter((p) => p.category === "part").length;
    const inStock = products.filter((p) => p.inStock !== false).length;

    return { vehicles, parts, inStock, total: products.length };
  }, [products]);

  return (
    <DashboardLayout navItems={VENDOR_NAV} role="vendor" title="Vendor Portal">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display text-white mb-2">My Products</h1>
          <p className="text-subtle text-sm">Manage your vehicle and parts inventory.</p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full sm:w-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-2">
                Total
              </p>
              <p className="text-white text-2xl font-display">{stats.total}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-2">
                Vehicles
              </p>
              <p className="text-white text-2xl font-display">{stats.vehicles}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-2">
                Parts
              </p>
              <p className="text-white text-2xl font-display">{stats.parts}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-2">
                In Stock
              </p>
              <p className="text-white text-2xl font-display">{stats.inStock}</p>
            </div>
          </div>

          <Link
            href="/vendor/products/add"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <p className="text-red-200 text-sm font-medium">Error</p>
            <p className="text-red-300/80 text-xs mt-1">{error}</p>
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          {isLoading ? (
            <div className="min-h-[280px] flex items-center justify-center">
              <p className="text-subtle text-sm">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[280px] flex flex-col items-center justify-center text-center gap-4">
              <p className="text-white font-medium">No products yet</p>
              <p className="text-subtle text-sm max-w-md">
                Create your first vehicle or performance part to see it here and in the public
                showroom.
              </p>
              <Link
                href="/vendor/products/add"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, i) => {
                const icon = product.category === "vehicle" ? Car : Wrench;
                const Icon = icon;
                const id = product._id || product.id || `${product.name}-${i}`;
                const inStock = product.inStock !== false;

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <div className="relative w-full h-44">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 text-xs">
                          <Icon className="w-3.5 h-3.5" />
                          {product.category === "vehicle" ? "Vehicle" : "Part"}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs ${
                            inStock
                              ? "bg-accent/10 border-accent/30 text-accent"
                              : "bg-red-500/10 border-red-500/30 text-red-300"
                          }`}
                        >
                          {inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-white font-medium leading-tight">{product.name}</p>
                        <p className="text-subtle text-xs mt-1">{product.make}</p>
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <p className="text-white font-display text-xl">{product.price}</p>
                        <p className="text-subtle text-xs">
                          Qty: {product.stockQuantity ?? 0}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`/vendor/products/add?edit=${encodeURIComponent(id)}`}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest w-full"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
