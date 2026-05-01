import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import CartSidebar from "@/components/layout/CartSidebar";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "GreenRev Motors | Elevated Automotive Experience",
  description: "Curated performance machines for those who move differently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("bg-background text-foreground antialiased selection:bg-accent selection:text-black")}>
        <AuthProvider>
          <CompareProvider>
            <CartProvider>
              <SmoothScroll>
                <Navbar />
                {children}
              </SmoothScroll>
              <CartSidebar />
            </CartProvider>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
