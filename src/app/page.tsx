import HeroScroll from "@/components/home/HeroScroll";
import WhyGreenRev from "@/components/home/WhyGreenRev";
import ServicesGrid from "@/components/home/ServicesGrid";
import CompareDecide from "@/components/home/CompareDecide";
import RelinquishMachine from "@/components/home/RelinquishMachine";
import Testimonials from "@/components/home/Testimonials";
import GlobalPresence from "@/components/home/GlobalPresence";
import Footer from "@/components/layout/Footer";
import CarMorph from "@/components/home/CarMorph";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-black">
      <HeroScroll />
      <WhyGreenRev />
      
      {/* Grouped High-Fidelity Sections */}
      <ServicesGrid />
      <CompareDecide />
      <RelinquishMachine />
      
      <CarMorph />
      <Testimonials />
      <GlobalPresence />
      <Footer />
    </main>
  );
}
