import HeroSection from "@/components/sections/HeroSection";
import {
  SchoolIntro,
  PublicationPreview,
} from "@/components/sections/SchoolSections";
import StaffSection from "@/components/sections/StaffSection";
export default function Home() {
  return (
    <>
      <HeroSection />
      <SchoolIntro />
      <StaffSection showPrincipalWelcome showButton limit={5} />
      <PublicationPreview />
    </>
  );
}
