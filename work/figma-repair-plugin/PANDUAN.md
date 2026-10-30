# Perbaikan Beranda dan Profil desktop

Status: draf Figma telah dibuat, tetapi foto dan beberapa kotak teks belum benar.
Konektor Figma mencapai batas penggunaan sebelum perbaikan dapat dijalankan.
Plugin lokal ini sudah berisi lima foto asli dari frontend dan kode perbaikan.
Kode belum dijalankan atau diverifikasi secara visual di Figma.

## Menyiapkan plugin

1. Buka file **SMA Widya Darma** di aplikasi Figma desktop.
2. Pilih **Plugins → Development → New plugin**. Pilih Figma Design, beri nama
   **Widya Darma Desktop**, pilih template **Run once** bila tersedia, lalu simpan
   ke folder baru. Jika hanya Custom UI tersedia, pilih itu; kode perbaikan tidak
   membutuhkan UI.
3. Beri tahu Codex lokasi folder yang baru disimpan. Codex akan menyalin `code.js`
   dan menyesuaikan manifest, dengan mempertahankan ID yang diberikan Figma.
4. Jalankan **Plugins → Development → Widya Darma Desktop** di file SMA Widya Darma.

Tidak perlu npm install atau kompilasi TypeScript. `code.js` sudah siap dijalankan.
Setelah berhasil, cek frame **Beranda · Desktop 1440** dan
**Profil Sekolah · Desktop 1440** pada halaman **Beranda & Profil · Desktop**.
Laporkan pesan hasil plugin supaya Codex dapat memeriksa ulang tampilannya.

## Yang diperbaiki

- Foto siswa, kampus, kelas, perpustakaan, dan potret guru pada dua halaman.
- Tinggi kotak teks mengikuti isi sehingga paragraf dan judul tidak bertumpuk.
- Warna biru pada bagian judul yang sesuai dengan website.
- Tautan Struktur organisasi, Semua guru, dan Semua publikasi.

Plugin memeriksa ID halaman dan nama kedua frame sebelum mengubah desain.
Kode menggunakan API plugin native Figma. Tidak mengakses jaringan, menghapus
halaman, atau mengubah kode website.

Panduan resmi: https://developers.figma.com/docs/plugins/plugin-quickstart-guide/
Manifest: https://developers.figma.com/docs/plugins/manifest/
