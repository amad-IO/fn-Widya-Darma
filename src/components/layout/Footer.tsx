import Link from "next/link";
export default function Footer() {
  return (
    <footer className="relative border-t border-blue-100 bg-white/55 pb-24 pt-10 text-xs text-muted">
      <div className="container-width flex flex-wrap items-start justify-between gap-8">
        <div>
          <p className="font-semibold text-ink">SMA Widya Darma</p>
          <p className="mt-3">© 2026 · Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {[
            { href: "/profil", label: "Profil sekolah" },
            { href: "/struktur-organisasi", label: "Organisasi" },
            { href: "/guru", label: "Guru" },
            { href: "/spmb", label: "SPMB" },
            { href: "/publikasi", label: "Publikasi & galeri" },
            { href: "/kontak", label: "Kontak" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
