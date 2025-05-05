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



Project Implementation
1. Authentication
• Login: Implement simple login using only the username.
• Authentication Method: Use JWT or session-based authentication.
• Session Expiry: Sessions should expire after 1 hour.
<img width="1428" alt="Jepretan Layar 2025-05-05 pukul 23 27 57" src="https://github.com/user-attachments/assets/6b2cb854-8140-4424-8198-14f3e7c6bd40" />

2. User Management
• User Model: Implement a User model with the following attributes:
• id (UUID or auto-increment)
• name (String)
• username (String, unique)
• preferred_timezone (e.g., Asia/Jakarta, Pacific/Auckland)
• Database: Use a relational database (PostgreSQL/MySQL) or NoSQL (MongoDB).
• API Endpoint: Provide an API endpoint to fetch user data.
<img width="833" alt="Jepretan Layar 2025-05-05 pukul 23 31 53" src="https://github.com/user-attachments/assets/f08398c7-c585-4252-aec6-4d83470b4a3b" />

3. Appointment System
• Appointment Model: Implement an Appointment model with:
• id (UUID or auto-increment)
• title (String)
• creator_id (User relationship)
• start (Datetime)
• end (Datetime)
• User Actions: Users should be able to:
• Create appointments and invite other users.
• View a list of their upcoming appointments.
<img width="1267" alt="Jepretan Layar 2025-05-05 pukul 23 33 17" src="https://github.com/user-attachments/assets/eae8b215-6e35-49db-b8cc-23713084fc02" />
<img width="466" alt="Jepretan Layar 2025-05-05 pukul 23 33 58" src="https://github.com/user-attachments/assets/0e3846c0-80bd-4b6a-81ad-a67c6485e898" />

4. Timezone Handling
• Scheduling: Ensure the time falls within working hours (08:00 - 17:00) of all participants.
• Display: Adjust times according to the logged-in user's preferred timezone.
<img width="326" alt="Jepretan Layar 2025-05-05 pukul 23 35 02" src="https://github.com/user-attachments/assets/bac4c0f3-db17-435a-b485-77afbc7fd985" />
<img width="451" alt="Jepretan Layar 2025-05-05 pukul 23 36 33" src="https://github.com/user-attachments/assets/6952979e-36af-4339-9bc4-bbe9805ca4e6" />

5. User Interface
• Login Page: Minimalistic design for user login.
• Appointment List Page: Display a list of upcoming appointments.
• Appointment Creation Form: Form for creating new appointments.
<img width="974" alt="Jepretan Layar 2025-05-05 pukul 23 38 27" src="https://github.com/user-attachments/assets/bd58d773-d44f-4c23-990a-3a8652ad6bef" />
<img width="1267" alt="Jepretan Layar 2025-05-05 pukul 23 33 17" src="https://github.com/user-attachments/assets/249e9f3a-a983-4548-b2cb-33f9efd0792a" />
<img width="466" alt="Jepretan Layar 2025-05-05 pukul 23 33 58" src="https://github.com/user-attachments/assets/2d7d8c52-8e2b-45ac-8b57-81993a6fe08f" />


Lisensi
MIT
