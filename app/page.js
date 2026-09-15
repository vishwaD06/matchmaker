import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyDifferent from "@/components/landing/WhyDifferent";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhyDifferent />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
