import HeroSection from "@/components/sections/HeroSection";
import {
  SchoolIntro,
  StaffPreview,
  PublicationPreview,
  SpmbPreview,
  ContactSection,
} from "@/components/sections/SchoolSections";
export default function Home() {
  return (
    <>
      <HeroSection />
      <SchoolIntro />
      <StaffPreview />
      <PublicationPreview />
      <SpmbPreview />
      <ContactSection />
    </>
  );
}
