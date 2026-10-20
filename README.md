# Frontend SMA Widya Darma

Prototipe frontend berdasarkan `../FRONTEND_GUIDELINES.md` dan revisi pengguna. Palet biru-putih, navbar fixed transparan, hero selayar berisi tiga kartu foto, serta animasi Framer Motion yang menghormati reduced motion. Tidak memakai emotikon; simbol antarmuka berupa SVG. Isi contoh memakai Lorem Ipsum, sedangkan label section, navigasi, kategori, dan fungsi tombol memakai bahasa Indonesia agar tujuan setiap bagian jelas.

Navbar di bagian atas tampil lebar tanpa latar. Setelah scroll melebihi 64px, navbar merapat ke tengah menjadi kapsul biru transparan dengan blur dan bayangan halus. Transisi mengikuti preferensi reduced motion; menu mobile dipakai di bawah 768px.

Latar hero memiliki cahaya radial biru lembut yang mengikuti mouse dengan spring Framer Motion, lalu memudar saat pointer keluar. Efek memakai SVG tanpa menutupi interaksi konten, tidak aktif untuk sentuhan atau preferensi reduced motion.

## Menjalankan

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

Preview development berada di http://localhost:3000. Jika worker Turbopack gagal pada lingkungan Windows lokal, build dapat diverifikasi menggunakan bundler Webpack:

```bash
node node_modules/next/dist/bin/next build --webpack
```

## Halaman utama

| Route | Isi | Rendering |
| --- | --- | --- |
| `/` | Beranda: hero, sekilas sekolah, kepala sekolah/guru, publikasi, SPMB, kontak | SSG |
| `/profil` | Identitas dan sejarah, visi-misi, fasilitas | SSG |
| `/struktur-organisasi` | Bagan kepala sekolah, wakil kepala sekolah, guru/tenaga kependidikan | SSG |
| `/guru` | Enam kartu profil guru contoh | SSG |
| `/spmb` | Jadwal, persyaratan, dokumen, alur, FAQ, WhatsApp | ISR 3600 detik |
| `/publikasi` | Filter Berita, Jurnal, Karya, Prestasi, Ekstrakurikuler | ISR 600 detik |
| `/publikasi/[slug]` | Lima belas halaman detail konten contoh | ISR 600 detik |
| `/kontak` | Kontak sekolah dan tombol WhatsApp | SSG |
| `/admin/login` | Form username/password dengan validasi input | SSG |

Halaman dari prototipe sebelumnya tetap tersedia pada route lama. Navigasi utama fokus pada ruang lingkup versi awal yang disepakati pengguna.

## Data dan komponen

- `src/lib/school.ts`: data organisasi, guru, publikasi, kategori, dan kontak WhatsApp.
- `src/lib/constants.ts`: teks contoh dan empat menu utama.
- `src/components/sections/SchoolSections.tsx`: section beranda yang dapat digunakan ulang.
- `src/components/shared/SectionLabel.tsx`: label penanda isi section.
- `src/components/shared/PublicationGrid.tsx`: filter kategori dan tautan detail.
- `src/components/shared/StaffCard.tsx`: kartu guru dan pimpinan sekolah.
- `src/components/shared/WhatsAppButton.tsx`: tombol kontak dan dialog nomor contoh.
- `public/images/` dan `public/fonts/`: aset lokal. Sumber aset tercatat pada `ASSETS.md`.

Teknologi: Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion, dan Button berbasis Radix Slot/CVA. Font lokal memakai `next/font/local`; gambar memakai `next/image`.

## WhatsApp

Nomor contoh yang tampil adalah **0812 0000 0000**. Dalam mode contoh, tombol membuka dialog informasi dan tidak membuka kontak milik orang lain. Setelah nomor resmi tersedia, isi `NEXT_PUBLIC_SCHOOL_WHATSAPP` di `.env.local` dengan angka berkode negara `62`, kemudian restart development atau rebuild produksi. Tombol akan membuka `wa.me` di tab baru tanpa mengirim pesan otomatis. Template tersedia pada `.env.example`.

## Batas prototipe dan verifikasi

### Login admin

`/admin/login` memakai layout tersendiri tanpa navbar/footer publik. React Hook Form dan Zod memvalidasi username wajib diisi, 3–50 karakter, huruf/angka/titik/garis bawah/tanda hubung; password wajib diisi, 8–128 karakter. Password tidak di-trim. Pesan kesalahan terhubung ke field, field pertama yang salah menerima fokus, dan tersedia tombol tampilkan/sembunyikan password.

Halaman ini masih frontend: belum ada pemeriksaan akun, sesi, atau akses dashboard. Submit dengan input valid menampilkan pesan layanan login belum tersedia; tidak membuat sesi palsu atau menyimpan kredensial. Integrasi autentikasi nantinya perlu validasi server serta pemeriksaan izin pada setiap endpoint admin. Skema input berada di `src/lib/login.ts`, form di `src/components/admin/LoginForm.tsx`.

Nama guru, struktur jabatan, foto, artikel, kontak, serta informasi SPMB adalah placeholder. Belum ada koneksi backend/CMS atau pendaftaran online. Jurnal dan karya menggunakan halaman konten contoh; belum menyediakan berkas dokumen asli.

Verifikasi versi ini: ESLint dan build produksi via Webpack; pemeriksaan browser Chromium desktop/mobile untuk hero, navigasi/dropdown, halaman guru/organisasi, filter publikasi, detail konten, FAQ SPMB, dan dialog WhatsApp. Firefox belum diuji karena tidak tersedia melalui browser pengujian sesi ini.
