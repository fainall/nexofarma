import HeroSection from "@/components/home/HeroSection";
import AnnouncementRibbon from "@/components/home/AnnouncementRibbon";
import TrustBar from "@/components/home/TrustBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NexoNaturalSection from "@/components/home/NexoNaturalSection";
import SociosSection from "@/components/home/SociosSection";
import LocationSection from "@/components/home/LocationSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import WelcomePopup from "@/components/home/WelcomePopup";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AnnouncementRibbon />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <NexoNaturalSection />
      <SociosSection />
      <LocationSection />
      <NewsletterSection />
      <WelcomePopup />
    </>
  );
}
