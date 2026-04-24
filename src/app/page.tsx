import Hero from "@/components/LandingPage/Hero";
import Stats from "@/components/LandingPage/Stats";
import Exploration from "@/components/LandingPage/Exploration";
import Steps from "@/components/LandingPage/Steps";
import CTA from "@/components/LandingPage/CTA";
import Footer from "@/components/LandingPage/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF5] text-slate-800 font-manrope">
      <Hero />
      <Stats />
      <Exploration />
      <Steps />
      <CTA />
      <Footer />
    </main>
  );
}
