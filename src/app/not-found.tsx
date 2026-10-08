import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flower, Arrow } from "@/components/shared/Svg";
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="hero-wash flex min-h-dvh flex-col items-center justify-center px-6 pb-28 pt-36 text-center"
    >
      <Flower className="mb-8 h-24 w-24 text-primary" />
      <p className="text-xs tracking-widest text-primary">404 / LOREM IPSUM</p>
      <h1 className="mt-5 text-4xl font-medium tracking-tight sm:text-6xl">
        Lorem ipsum dolor.
      </h1>
      <p className="body-copy mt-6">
        Consectetur adipiscing elit. Sed do eiusmod tempor.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">
          Lorem ipsum
          <Arrow className="h-4 w-4" />
        </Link>
      </Button>
    </main>
  );
}
