"use client";

import { useId, useRef, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useSpring } from "framer-motion";

export default function HeroSpotlight({ children }: { children: ReactNode }) {
  const gradientId = `hero-glow-${useId()}`;
  const active = useRef(false);
  const reducedMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 90, damping: 25, mass: 0.6 });
  const y = useSpring(0, { stiffness: 90, damping: 25, mass: 0.6 });
  const opacity = useSpring(0, { stiffness: 65, damping: 22 });

  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = event.clientX - bounds.left;
    const nextY = event.clientY - bounds.top;

    if (!active.current) {
      x.jump(nextX);
      y.jump(nextY);
      active.current = true;
    } else {
      x.set(nextX);
      y.set(nextY);
    }
    opacity.set(1);
  }

  function hide() {
    opacity.set(0);
    active.current = false;
  }

  return (
    <section
      className="home-hero relative isolate overflow-hidden"
      aria-labelledby="hero-heading"
      onPointerMove={move}
      onPointerLeave={hide}
      onPointerCancel={hide}
    >
      {/* Background foto abu-abu putih & transparan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <Image
          src="/images/14.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale opacity-30 contrast-105"
        />
        {/* Lapisan abu-abu putih transparan + gradasi halus menyatu ke section bawah */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6f7f9]/75 via-white/65 to-[#f6f7f9]" />
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full motion-reduce:hidden"
        width="100%"
        height="100%"
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="#07528c" stopOpacity="0.4" />
            <stop offset="20%" stopColor="#07528c" stopOpacity="0.37" />
            <stop offset="40%" stopColor="#07528c" stopOpacity="0.24" />
            <stop offset="60%" stopColor="#07528c" stopOpacity="0.11" />
            <stop offset="80%" stopColor="#07528c" stopOpacity="0.025" />
            <stop offset="100%" stopColor="#07528c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.circle
          cx={x}
          cy={y}
          r="400"
          className="blur-2xl"
          fill={`url(#${gradientId})`}
          opacity={opacity}
        />
      </svg>
      {children}
    </section>
  );
}
