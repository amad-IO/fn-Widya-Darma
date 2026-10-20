# Aset website

Foto dokumentasi sekolah disimpan di `public/images/` dengan nama berurutan `01.webp`, `02.webp`, dan seterusnya. Lihat [`public/images/IMAGE-INDEX.md`](public/images/IMAGE-INDEX.md) untuk mencocokkan nomor file dengan nama aslinya.

Pemanggilan path gambar dapat memakai helper `imageAsset()` dari `src/lib/media.ts`, misalnya `imageAsset(31)` menghasilkan `/images/31.webp`.

Font Plus Jakarta Sans dari Google Fonts disimpan lokal dan dimuat melalui `next/font/local`.
Sumber: https://github.com/google/fonts/tree/main/ofl/plusjakartasans. Lisensi SIL Open Font License tersedia di `public/fonts/OFL.txt`.

Semua simbol antarmuka dan dekorasi adalah SVG lokal pada `src/components/shared/Svg.tsx`.
