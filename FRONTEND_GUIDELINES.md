# 🎓 Frontend Guidelines — Website Profil SMA Widya Darma

> Dokumen ini berisi standar teknologi, aturan pengerjaan, dan panduan performa
> yang **wajib diikuti** oleh seluruh anggota tim frontend.

---

## 📦 Tech Stack

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Framework** | Next.js | 14+ (App Router) | Framework utama |
| **Bahasa** | TypeScript | 5+ | Wajib, bukan JavaScript biasa |
| **Styling** | Tailwind CSS | 3+ | Utility-first CSS |
| **Komponen UI** | shadcn/ui | latest | Copy-paste component system |
| **Animasi** | Framer Motion | 11+ | Animasi halaman & scroll |
| **Icons** | Lucide React | latest | Icon set konsisten |
| **Form** | React Hook Form + Zod | latest | Validasi form yang type-safe |
| **HTTP Client** | Axios | latest | Komunikasi ke backend API |
| **State Management** | Zustand | latest | Untuk state chatbot & global |
| **Package Manager** | npm / pnpm | latest | Gunakan **pnpm** jika bisa (lebih cepat) |

---

## 🗂️ Struktur Folder

```
frontend/
├── app/                        # Next.js App Router
│   ├── (public)/               # Route group halaman publik
│   │   ├── page.tsx            # Homepage
│   │   ├── profil/
│   │   │   └── page.tsx        # Halaman Profil Sekolah
│   │   ├── visi-misi/
│   │   │   └── page.tsx
│   │   ├── kegiatan/
│   │   │   ├── page.tsx        # Daftar kegiatan
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Detail kegiatan
│   │   ├── ekstrakurikuler/
│   │   │   └── page.tsx
│   │   ├── spmb/
│   │   │   └── page.tsx
│   │   ├── berita/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── galeri/
│   │   │   └── page.tsx
│   │   └── kontak/
│   │       └── page.tsx
│   ├── layout.tsx              # Root layout (font, metadata global)
│   ├── globals.css             # Global styles (minimal, utamakan Tailwind)
│   └── not-found.tsx           # Halaman 404 custom
│
├── components/
│   ├── ui/                     # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── sections/               # Bagian-bagian halaman (Hero, About, dll)
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── CTASection.tsx
│   ├── chatbot/
│   │   ├── ChatbotWidget.tsx   # Floating button & container
│   │   ├── ChatbotWindow.tsx   # Jendela chat
│   │   └── ChatMessage.tsx     # Bubble pesan
│   └── shared/                 # Komponen reusable lintas halaman
│       ├── PageHeader.tsx
│       ├── BeritaCard.tsx
│       ├── GaleriGrid.tsx
│       └── LoadingSkeleton.tsx
│
├── lib/
│   ├── api.ts                  # Axios instance & semua fungsi API call
│   ├── utils.ts                # Helper functions (cn, formatDate, dll)
│   └── constants.ts            # Konstanta (URL, teks statis, dll)
│
├── types/
│   └── index.ts                # Semua TypeScript types & interfaces
│
├── hooks/
│   ├── useScrollAnimation.ts   # Custom hook untuk animasi scroll
│   └── useChatbot.ts           # Custom hook untuk state chatbot
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero/
│   │   └── galeri/
│   └── fonts/                  # Jika ada font custom lokal
│
├── .env.local                  # Environment variables (jangan di-commit!)
├── .env.example                # Template .env untuk tim
├── next.config.ts              # Konfigurasi Next.js
├── tailwind.config.ts          # Konfigurasi Tailwind
├── tsconfig.json               # Konfigurasi TypeScript
└── FRONTEND_GUIDELINES.md      # File ini
```

---

## 🚀 Strategi Rendering Per Halaman

> Ini adalah kunci utama performa website. **Wajib dipahami semua anggota frontend.**

| Halaman | Strategi | Alasan |
|---|---|---|
| `/` Homepage | **SSG** | Konten statis, tidak berubah tanpa deploy |
| `/profil` | **SSG** | Data profil sekolah sangat jarang berubah |
| `/visi-misi` | **SSG** | Konten statis |
| `/ekstrakurikuler` | **SSG** | Statis, update saat deploy |
| `/kontak` | **SSG** | Statis |
| `/spmb` | **ISR** `revalidate: 3600` | Bisa berubah tiap tahun ajaran |
| `/kegiatan` | **ISR** `revalidate: 1800` | Update berkala, tidak realtime |
| `/berita` | **ISR** `revalidate: 600` | Lebih sering update |
| `/berita/[slug]` | **ISR** `revalidate: 600` | Per artikel |
| `/galeri` | **ISR** `revalidate: 3600` | Update berkala |
| Chatbot Widget | **CSR** (dynamic import) | Interaktif, harus client-side |

### Cara Implementasi

```typescript
// SSG — tidak perlu tulis apa-apa, default di Next.js App Router
export default function ProfilPage() { ... }

// ISR — tambahkan export ini
export const revalidate = 3600 // detik

// CSR — gunakan dynamic import dengan ssr: false
import dynamic from "next/dynamic"
const ChatbotWidget = dynamic(() => import("@/components/chatbot/ChatbotWidget"), {
  ssr: false,
})
```

---

## ⚡ Aturan Performa (WAJIB DIIKUTI)

### 1. Gambar — Selalu Gunakan `next/image`

```tsx
// ✅ BENAR
import Image from "next/image"
<Image
  src="/images/hero/gedung.jpg"
  alt="Gedung SMA Widya Darma"
  width={1200}
  height={600}
  priority        // tambahkan HANYA untuk gambar above-the-fold
  className="..."
/>

// ❌ SALAH — jangan pernah gunakan <img> biasa
<img src="/images/hero/gedung.jpg" />
```

> `next/image` otomatis: lazy loading, konversi ke WebP, resize sesuai layar.

---

### 2. Font — Selalu Gunakan `next/font`

```tsx
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from "next/font/google"

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",      // penting: mencegah font blocking render
  variable: "--font-sans",
})
```

> Jangan load font langsung dari `<link>` Google Fonts di HTML — ini blocking render!

---

### 3. Komponen Berat — Gunakan Dynamic Import

```tsx
// Komponen yang berat atau hanya muncul di kondisi tertentu
// Jangan di-import biasa, gunakan dynamic import

// ✅ BENAR
const MapEmbed = dynamic(() => import("@/components/shared/MapEmbed"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />,
})

const ChatbotWidget = dynamic(() => import("@/components/chatbot/ChatbotWidget"), {
  ssr: false,
})
```

---

### 4. Tailwind — Jangan Gunakan Inline Style

```tsx
// ✅ BENAR
<div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md">

// ❌ SALAH
<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
```

---

### 5. TypeScript — Selalu Buat Type untuk Data API

```typescript
// types/index.ts

export type Berita = {
  id: number
  judul: string
  slug: string
  ringkasan: string
  konten: string
  thumbnail: string
  tanggal: string
  kategori: string
}

export type Kegiatan = {
  id: number
  nama: string
  deskripsi: string
  tanggal: string
  gambar: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}
```

---

### 6. API Call — Terpusat di `lib/api.ts`

```typescript
// lib/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

// Semua fungsi fetch data ada di sini
export const getBerita = async (): Promise<Berita[]> => {
  const { data } = await api.get("/berita")
  return data
}

export const getBeritaBySlug = async (slug: string): Promise<Berita> => {
  const { data } = await api.get(`/berita/${slug}`)
  return data
}

// ❌ JANGAN fetch langsung di dalam komponen tanpa melalui lib/api.ts
```

---

### 7. Animasi — Gunakan Framer Motion dengan Benar

```tsx
// Selalu gunakan animate on scroll, bukan on load untuk konten bawah
// Gunakan variants agar animasi konsisten di semua halaman

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}  // penting: animasi hanya sekali
>
  ...
</motion.div>
```

> **`viewport={{ once: true }}`** wajib ada agar animasi tidak repeat setiap scroll.

---

## 🎨 Design System

### Warna (sesuaikan dengan brand SMA Widya Darma)

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50:  "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",  // warna utama
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },
  secondary: {
    500: "#f59e0b",  // aksen/highlight
  }
}
```

### Tipografi

```
Heading (h1-h3) : Plus Jakarta Sans, Bold/SemiBold
Body text       : Inter atau Plus Jakarta Sans, Regular
Font size scale : gunakan Tailwind default (text-sm, text-base, text-lg, dst)
```

### Spacing

```
Gunakan kelipatan 4px (Tailwind default)
Jangan gunakan nilai arbitrary kecuali sangat terpaksa:
✅ p-4, p-6, p-8, gap-4
❌ p-[13px], mt-[27px]
```

---

## 📱 Breakpoint Responsif

```
Mobile first! — mulai styling dari mobile, lalu ke atas.

sm  : 640px   → Tablet kecil
md  : 768px   → Tablet
lg  : 1024px  → Laptop
xl  : 1280px  → Desktop
2xl : 1536px  → Desktop besar
```

```tsx
// ✅ Mobile-first approach
<div className="
  grid grid-cols-1      // mobile: 1 kolom
  sm:grid-cols-2        // tablet: 2 kolom
  lg:grid-cols-3        // laptop: 3 kolom
  gap-6
">
```

---

## 🌿 Git Workflow

### Penamaan Branch

```
main          → branch utama, selalu stable & deployable
develop       → branch development, merge kesini dulu sebelum ke main

Fitur baru:
feature/nama-fitur       → contoh: feature/halaman-spmb
feature/chatbot-widget

Perbaikan bug:
fix/nama-bug             → contoh: fix/navbar-mobile-menu
```

### Commit Message Format

```
feat: tambah halaman profil sekolah
feat: integrasi chatbot widget
fix: perbaiki layout navbar di mobile
style: rapikan spacing section hero
refactor: pisahkan BeritaCard ke komponen terpisah
perf: tambah lazy loading galeri foto
docs: update README setup instruksi
```

### Alur Kerja Harian

```
1. Pull develop terbaru     → git pull origin develop
2. Buat branch baru         → git checkout -b feature/nama-fitur
3. Kerjakan fitur
4. Commit dengan pesan jelas
5. Push ke branch kamu      → git push origin feature/nama-fitur
6. Buat Pull Request ke develop
7. Minta review ke anggota lain sebelum merge
```

---

## 🔧 Environment Variables

```bash
# .env.local (JANGAN di-commit ke Git!)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production (isi saat deploy ke Vercel)
NEXT_PUBLIC_API_URL=https://api.widyadarma.sch.id
NEXT_PUBLIC_SITE_URL=https://widyadarma.sch.id
```

---

## ✅ Checklist Sebelum Pull Request

Pastikan semua poin ini terpenuhi sebelum minta review:

- [ ] Tidak ada `console.log()` yang tertinggal
- [ ] Semua gambar menggunakan `next/image`, bukan `<img>`
- [ ] Semua teks hardcoded dicek spelling-nya
- [ ] Halaman sudah responsive (cek di mobile & desktop)
- [ ] Tidak ada TypeScript error (`npm run build` tidak error)
- [ ] Komponen baru sudah dibuat di folder yang sesuai
- [ ] Tidak ada inline style (gunakan Tailwind class)
- [ ] Loading state sudah ada untuk data yang di-fetch dari API
- [ ] Sudah test di browser Chrome & Firefox

---

## 🛠️ Setup Project (Pertama Kali)

```bash
# 1. Clone repo frontend
git clone <url-repo-frontend>
cd frontend

# 2. Install dependencies
npm install        # atau: pnpm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local sesuai kebutuhan lokal kamu

# 4. Jalankan development server
npm run dev

# 5. Buka browser
# http://localhost:3000
```

### Script yang Tersedia

```bash
npm run dev       # Development server (hot reload)
npm run build     # Build production — wajib test sebelum PR
npm run start     # Jalankan production build secara lokal
npm run lint      # Cek code style
```

---

## 📚 Referensi Wajib Baca

- [Next.js Docs — App Router](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)

---

*Dokumen ini dibuat sebagai panduan pengerjaan frontend Website Profil SMA Widya Darma.*
*Update dokumen ini jika ada keputusan teknis baru yang disepakati tim.*
