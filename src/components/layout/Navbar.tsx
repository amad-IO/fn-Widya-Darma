"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { HeadCircuitIcon } from "@phosphor-icons/react";
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

  const mainLinks = navigation.filter((item) => item.href !== "/tanya-ai");
  const aiLink = navigation.find((item) => item.href === "/tanya-ai");

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

  // Halaman yang punya hero full-bleed (tidak perlu spacer, navbar transparan)
  const isHeroPage =
    pathname === "/profil" ||
    pathname === "/publikasi" ||
    pathname === "/guru";

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
            isHeroPage && !scrolled && "is-hero",
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

              if (item.href === "/profil") {
                return (
                  <div key={item.href} className="group/profil relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "school-navbar-link relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors",
                        active && "is-active",
                      )}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform duration-200 group-hover/profil:rotate-180"
                      >
                        <path
                          d="M2.5 4.5L6 8L9.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>

                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover/profil:visible group-hover/profil:translate-y-0 group-hover/profil:opacity-100 group-focus-within/profil:visible group-focus-within/profil:translate-y-0 group-focus-within/profil:opacity-100">
                      <div className="min-w-[180px] rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 text-ink shadow-lg shadow-blue-950/15 backdrop-blur-md">
                        <Link
                          href="/profil"
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-blue-50 hover:text-primary",
                            pathname === "/profil"
                              ? "bg-blue-50 font-semibold text-primary"
                              : "text-ink",
                          )}
                        >
                          Profil Sekolah
                        </Link>
                        <Link
                          href="/guru"
                          className={cn(
                            "mt-0.5 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-blue-50 hover:text-primary",
                            pathname.startsWith("/guru")
                              ? "bg-blue-50 font-semibold text-primary"
                              : "text-ink",
                          )}
                        >
                          Profil Guru
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

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

          {aiLink && (
            <Link
              href={aiLink.href}
              aria-current={pathname === aiLink.href ? "page" : undefined}
              className="school-navbar-contact hidden shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-colors md:inline-flex"
            >
              <HeadCircuitIcon size={18} aria-hidden="true" />
              {aiLink.label}
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
      {/* Spacer hanya untuk halaman non-hero */}
      {pathname !== "/" && !isHeroPage && (
        <div className="h-20" aria-hidden="true" />
      )}

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
            <div key={item.href} className="flex flex-col">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-t border-black/5 py-4 text-base font-medium"
              >
                <span className="flex items-center gap-2">
                  {item.href === "/tanya-ai" && (
                    <HeadCircuitIcon size={18} aria-hidden="true" />
                  )}
                  {item.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </Link>
              {item.href === "/profil" && (
                <Link
                  href="/guru"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-t border-black/5 py-3.5 pl-4 text-sm font-medium text-muted hover:text-primary"
                >
                  <span>↳ Profil Guru</span>
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </dialog>
    </>
  );
}
