"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    login(email, role);
    setIsSubmitting(false);

    // Redirect based on role
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "vendor") router.push("/vendor/dashboard");
    else if (role === "mechanic") router.push("/mechanic/dashboard");
    else router.push("/shop");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <main className="min-h-screen bg-black flex overflow-hidden selection:bg-accent selection:text-black">
      {/* Left Column: Visual Content */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050505] items-center justify-center overflow-hidden border-r border-white/5">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/images/home/relinquish.png"
            alt="Cinematic automotive detail"
            fill
            className="object-cover grayscale"
            priority
          />
        </motion.div>
        
        {/* Animated Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 bg-[url('/noise.png')] mix-blend-overlay" />
        
        {/* Subtle Glows */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[120px] mix-blend-screen" />

        <div className="relative z-20 p-24 max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-6"
          >
            GreenRev Boutique
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-6xl xl:text-7xl font-display text-white leading-none mb-8"
          >
            Precision <br /> 
            <span className="text-white/40 italic">In Every</span> <br />
            Interaction.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-subtle text-lg font-light leading-relaxed max-w-md"
          >
            Access our private network of performance machines, bespoke components, and master experts.
          </motion.p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
        {/* Mobile-only background hint */}
        <div className="lg:hidden absolute inset-0 z-0 bg-[#050505]">
           <div className="absolute inset-0 opacity-10 bg-[url('/images/home/relinquish.png')] bg-cover bg-center grayscale" />
           <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto lg:mx-0">
          <Link href="/" className="inline-flex items-center gap-2 text-subtle hover:text-white transition-colors mb-16 text-[10px] font-bold tracking-[0.2em] uppercase group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl font-display text-white">Portal.</h1>
              <p className="text-subtle text-sm">Sign in to your GreenRev account.</p>
            </motion.div>

            {/* Role Selector */}
            <motion.div variants={itemVariants} className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Select Identity</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                {(["customer", "vendor", "mechanic", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-500 overflow-hidden ${
                      role === r ? "text-black" : "text-subtle hover:text-white"
                    }`}
                  >
                    {role === r && (
                      <motion.div 
                        layoutId="active-role"
                        className="absolute inset-0 bg-white z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{r}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input 
                    required
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-5 pl-8 focus:outline-none focus:border-accent transition-colors text-lg font-light placeholder:text-white/10"
                  />
                </div>
                
                <div className="group relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input 
                    required
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-5 pl-8 focus:outline-none focus:border-accent transition-colors text-lg font-light placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                disabled={isSubmitting}
                className="group relative w-full py-6 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all duration-500 disabled:opacity-50 disabled:bg-white overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? "Authenticating" : "Enter Portal"}
                  {!isSubmitting && <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
                </div>
              </button>
            </motion.form>

            <motion.div variants={itemVariants} className="pt-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/20">New Here?</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: "Client", href: "/register" },
                  { name: "Vendor", href: "/vendor-signup" },
                  { name: "Expert", href: "/mechanic-signup" }
                ].map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-center py-4 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

