import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FreeGiftsSection } from "@/components/home/free-gifts-section";
import { PremiumSection } from "@/components/home/premium-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";

export default function HomePage() {
  return (
    <main className="relative">
      <FloatingElements density="low" />
      <Navigation />
      <HeroSection />
      <FreeGiftsSection />
      <PremiumSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
