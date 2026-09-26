import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ProductProof from "@/components/landing/ProductProof";
import Capabilities from "@/components/landing/Capabilities";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <ProductProof />
        <Capabilities />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
