# ShipFlow — Shipping Management System

Aplikasi web desktop-style untuk modul shipping e-commerce, dibuat menggunakan HTML, CSS, dan JavaScript murni. Tidak memerlukan instalasi framework atau database.

## Menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser (Chrome/Edge disarankan).
3. Pilih mode **Admin Shipping** atau **Customer** pada menu kiri.

## Fitur
### Admin Shipping
- Dashboard ringkasan pengiriman.
- Membuat pengiriman dengan data penerima, alamat, telepon, kurir, layanan, berat, ongkos kirim, nomor resi, catatan, dan status.
- Melihat, mencari, dan memfilter data pengiriman.
- Mengedit pengiriman dan memperbarui status.
- Menghapus data dengan konfirmasi.
- Tracking paket dan riwayat status.
- Ekspor laporan ke CSV.

### Customer
- Mengakses dashboard dan daftar pengiriman.
- Melacak paket berdasarkan ID pengiriman atau nomor resi.
- Tidak memiliki akses untuk membuat, mengedit, atau menghapus pengiriman.

## Penyimpanan data
Data tersimpan di `localStorage` browser, jadi data tetap ada di browser yang sama setelah halaman ditutup. Data contoh akan muncul saat pertama kali aplikasi dibuka. Ini adalah prototype frontend: belum ada autentikasi sungguhan, sinkronisasi antarperangkat, integrasi API kurir, atau database server.

## Rancangan halaman
1. Dashboard — statistik dan pengiriman terbaru.
2. Data Pengiriman — tabel data, pencarian, filter, aksi admin.
3. Tracking Paket — input ID/resi, status, riwayat timeline.
4. Laporan Pengiriman — ringkasan status dan ekspor CSV.

## Struktur file
- `index.html` — struktur halaman.
- `style.css` — desain responsif.
- `app.js` — logika, data contoh, CRUD, tracking, ekspor CSV.
