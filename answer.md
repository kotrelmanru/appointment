Technical Questions
Answer the following questions in markdown format inside the repository (answers.md):
1. Timezone Conflicts: How would you handle timezone conflicts between participants in an appointment?
2. Database Optimization: How can you optimize database queries to efficiently fetch user-specific appointments?
3. Additional Features: If this application were to become a real product, what additional features would you implement? Why?
4. Session Management: How would you manage user sessions securely while keeping them lightweight (e.g., avoiding large JWT payloads)?


Jawaban:
1. Saat menerima input waktu (format UTC),
Konversi waktu itu ke zona waktu setiap peserta (pakai library seperti moment-timezone).
Periksa apakah hour dari waktu lokal tersebut ≥ 8 dan ≤ 17.
Jika semua peserta “lolos” pengecekan, baru simpan/jadwalkan; kalau ada yang gagal, berikan error.

2. Gunakan index di kolom yang sering dicari kayak user_id atau appointment_date. Ini bikin pencarian data jauh lebih cepat.
Ambil data seperlunya aja, jangan semua kolom. Misalnya, cukup ambil waktu, judul, dan lokasi aja kalau memang itu yang mau ditampilkan.
Gunakan pagination kalau data janji temunya banyak. Daripada ambil 1000 data sekaligus, ambil 10–20 data per halaman.
Join dengan bijak. Kalau harus join tabel user dengan tabel appointment, pastiin struktur tabelnya bagus dan query-nya ditulis efisien.

3. . Notifikasi otomatis: Kirim reminder via email atau WhatsApp sebelum janji temu. Supaya pengguna gak lupa.
   . Integrasi kalender (Google Calendar, Outlook): Jadi user bisa sinkron janji temu dari aplikasi ke kalender pribadi mereka.
   . Timezone detection otomatis: Supaya user gak perlu atur zona waktu manual, apalagi kalau sering ganti lokasi.
   . Role & permission: Misalnya, bedain antara admin (bisa buat semua janji temu) dan user biasa (cuma bisa lihat miliknya sendiri).
   . Fitur reschedule dan cancel: Biar user bisa ubah atau batalkan janji temu dengan mudah tanpa harus hubungi admin.

4. . Gunakan session ID di cookie: Saat login, server kasih cookie kecil berisi session_id. Data user sebenarnya disimpan di server (misal di Redis), bukan di cookie. Jadi cookie tetap ringan dan aman.
   . Set atribut cookie yang aman, seperti HttpOnly, Secure, dan SameSite=Strict supaya gak mudah dicuri lewat JavaScript atau serangan CSRF.
   . Session timeout: Otomatis logout kalau user gak aktif selama X menit. Bisa ditambah refresh token kalau perlu perpanjangan otomatis.
   . Validasi IP atau user-agent: Kalau IP user tiba-tiba berubah drastis, bisa paksa logout. Ini tambahan pengaman dari sesi yang dibajak.
   . Dengan pendekatan ini, kita dapat keamanan setara JWT tapi dengan ukuran payload jauh lebih kecil dan lebih gampang dikontrol di sisi server.
