import ShowcaseSection from "@/components/sections/ShowcaseSection";
import HeroSpotlight from "@/components/shared/HeroSpotlight";

export default function HeroSection() {
  return (
    <HeroSpotlight>
      <div className="px-5 text-center sm:px-8">
        <h1
          id="hero-heading"
          className="hero-title mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-[-.055em]"
        >
          Lorem ipsum dolor sit
          <br className="hidden sm:block" /> amet,{" "}
          <span className="hero-highlight ml-2 inline-block rounded-2xl px-3.5 pb-1 pt-0 leading-none tracking-tight text-primary sm:px-4">
            consectetur.
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-ink/75 sm:text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <br className="hidden sm:block" /> Sed do eiusmod tempor incididunt ut
          labore et dolore.
        </p>
      </div>
      <ShowcaseSection />
    </HeroSpotlight>
  );
}
