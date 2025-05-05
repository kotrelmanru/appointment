Appointment Management System
Sebuah aplikasi manajemen janji temu berbasis web yang dibangun dengan:

Frontend: Next.js, React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Autentikasi: JWT

demo aplikasi dapat dilihat di link berikut : https://www.youtube.com/watch?v=Kyh3FMhe0cs

**Instalasi**
1. Clone Repository
2. Setup Backend
Masuk ke direktori backend dan install dependencies:
cd backend
npm install
Buat file .env di root folder backend dengan konten:

MONGODB_URI=mongodb://localhost:27017/appointment_db
JWT_SECRET=rahasia_anda
PORT=8000

Jalankan server backend:
npm run dev

3. Setup Frontend
Masuk ke direktori frontend dan install dependencies:
cd ../frontend
npm install
Buat file .env.local di root folder frontend dengan konten:

env
VITE_API_BASE_URL=http://localhost:8000/api/v1

Jalankan aplikasi frontend:
npm run dev

    
**Penggunaan**
Buka browser dan akses http://localhost:3000

Login dengan username yang sudah terdaftar

Endpoint API
POST /api/v1/auth/register - Registrasi user baru

POST /api/v1/auth/login - Login user

GET /api/v1/auth/profile - Dapatkan profil user

GET /api/v1/appointments - Dapatkan semua janji temu

POST /api/v1/appointments - Buat janji temu baru

PUT/DELETE /api/v1/appointments/:id - Update/hapus janji temu

Dependencies yang Wajib Diinstal terlebih dahulu
Frontend:

Moment.js (timezone)

SweetAlert2


Backend:

JWT (autentikasi)

Moment-timezone


Lisensi
MIT
