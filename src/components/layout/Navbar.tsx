"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Close, Ticket, Menu } from "@/components/shared/Svg";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function getScrollSnapshot() {
  return window.scrollY > 64;
}

function getServerScrollSnapshot() {
  return false;
}

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.classList.add("overflow-hidden");
    } else {
      dialog.current?.close();
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const mainLinks = navigation.filter((item) => item.href !== "/kontak");
  const contactLink = navigation.find((item) => item.href === "/kontak");

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/profil") {
      return (
        pathname.startsWith("/profil") ||
        pathname.startsWith("/visi-misi") ||
        pathname.startsWith("/struktur-organisasi") ||
        pathname.startsWith("/guru")
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 px-4 pt-5 transition-[padding] duration-500 motion-reduce:transition-none sm:px-6 sm:pt-6",
          scrolled && "pt-3 sm:pt-4",
        )}
      >
        <nav
          aria-label="Navigasi utama"
          className={cn(
            "school-navbar mx-auto flex w-full items-center justify-between gap-4",
            scrolled && "is-scrolled backdrop-blur-xl",
          )}
        >
          <Link
            href="/"
            aria-label="SMA Widya Darma — beranda"
            className="flex shrink-0 items-center gap-1.5"
          >
            <Ticket className="h-5 w-5" />
            <span className="text-xs font-bold tracking-tight">
              SMA Widya Darma
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {mainLinks.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "school-navbar-link relative whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors",
                    active && "is-active",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {contactLink && (
            <Link
              href={contactLink.href}
              aria-current={pathname === contactLink.href ? "page" : undefined}
              className="school-navbar-contact hidden shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold transition-colors md:inline-flex"
            >
              {contactLink.label}
            </Link>
          )}

          <button
            className="school-navbar-menu flex h-9 w-9 items-center justify-center rounded-full border md:hidden"
            aria-label="Buka navigasi"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </nav>
      </header>
      {pathname !== "/" && <div className="h-20" aria-hidden="true" />}
      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-label="Navigasi mobile"
        onClose={() => setOpen(false)}
        className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-sm overflow-y-auto rounded-3xl border-[3px] border-white bg-mist p-7 text-ink shadow-xl backdrop:bg-ink/25 backdrop:backdrop-blur-md"
      >
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm font-bold"
          >
            <Ticket className="h-5 w-5" />
            SMA Widya Darma
          </Link>
          <button
            aria-label="Tutup navigasi"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
          >
            <Close className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-t border-black/5 py-4 text-base font-medium"
            >
              {item.label}
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </Link>
          ))}
        </div>
      </dialog>
    </>
  );
}
