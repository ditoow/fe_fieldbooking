import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Exploration from "./components/Exploration";
import Steps from "./components/Steps";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF5] text-slate-800 font-manrope">
      <Navbar />
      <Hero />
      <Stats />
      <Exploration />
      <Steps />
      <CTA />
      <Footer />
    </main>
  );
}