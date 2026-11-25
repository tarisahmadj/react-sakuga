# Sakuga VFX × React (Next.js 14) + PostgreSQL CRUD Studio

Aplikasi web fullstack **React (Next.js 14 App Router, TypeScript, Tailwind CSS)** yang mengintegrasikan ke-12 komponen UI anime **[Sakuga VFX](https://github.com/finktheartist/sakuga-vfx.git)** dengan database **PostgreSQL 15** di dalam lingkungan Docker container.

---

## Fitur Utama

1. **Autentikasi Halaman Login (`/login`) & Route Guard ke Halaman Utama (`/`)**:
   - Proteksi Server-Side pada halaman utama (`/`) dan endpoint API CRUD (`/api/missions`).
   - Mendukung **Login** & **Registrasi User Baru** langsung ke tabel `sakuga_users` di PostgreSQL dengan *signed HTTP-only session cookie* (`sakuga_session`).
   - Tersedia tombol *Quick Fill* akun demo (`admin` / `admin123` dan `animator` / `sakuga123`).
2. **Arsitektur Modular Layout dengan Fixed Sidebar**:
   - `SakugaSidebar` (`<aside>`): Fixed sidebar (`fixed inset-y-0 left-0 w-[270px]`) dengan navigasi menu, filter cepat departemen, progress bar produksi, dan backdrop mobile.
   - `SakugaHeader` (`<header>`): Sticky header dengan toggle sidebar, status real-time container PostgreSQL + latensi (`ms`), `<sakuga-tabs>`, dan kontrol profil/logout.
   - `SakugaMain` (`<main>`): Area konten utama dengan kartu ringkasan KPI dan workspace dinamis.
   - `SakugaFooter` (`<footer>`): Informasi canvas Sakuga VFX dan status infrastruktur container.
3. **Responsive Modal with Scrollable Body untuk Form CRUD**:
   - Struktur 3 bagian: **Pinned Header (`shrink-0`)** + **Scrollable Body (`flex-1 min-h-0 overflow-y-auto`)** + **Pinned Footer (`shrink-0`)** dengan *background scroll lock*.
   - Mendukung **Mode Tambah (`INSERT`)** dan **Mode Edit (`UPDATE`)** menggunakan komponen `<sakuga-input>`, `<sakuga-radio>`, `<sakuga-slider>`, `<sakuga-rating>`, `<sakuga-toggle>`, `<sakuga-checkbox>`, `<sakuga-progress>`, `<sakuga-tooltip>`, dan `<sakuga-button>`.
4. **Tampilan Tabel Data Interaktif & Galeri 12 Komponen Sakuga VFX**:
   - Tabel produksi full-width dengan fitur pencarian, filter kategori (`VFX`, `KEYFRAME`, `COMPOSITING`), filter status (`Selesai`, `Proses`), update inline (status, bintang rating, VFX layer, kudos `♥`), serta switcher **Tampilan Tabel** / **Tampilan Kartu**.
   - Galeri interaktif seluruh 12 komponen asli dari template `finktheartist/sakuga-vfx`.

---

## Struktur Direktori

```text
.
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
├── .env.example
├── .gitignore
├── public/
│   └── sakuga-vfx/               # 12 Web Components Sakuga VFX + core.js + gallery
├── skills/
│   └── sakuga-vfx/               # Sakuga VFX agent skill & starter
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/             # Endpoint login, register, logout, me
    │   │   ├── health/           # Endpoint healthcheck & reseed PostgreSQL
    │   │   └── missions/         # REST API CRUD (GET, POST, PATCH, DELETE)
    │   ├── login/page.tsx        # Halaman Login (/login)
    │   ├── page.tsx              # Halaman Utama (/) dengan auth guard
    │   ├── layout.tsx            # Root layout & pemuat script Sakuga VFX
    │   └── globals.css           # Variabel CSS --sk-* & custom scrollbar modal
    ├── components/
    │   ├── layout/               # SakugaSidebar, SakugaHeader, SakugaMain, SakugaFooter
    │   ├── modals/               # SakugaCrudModal (Responsive Scrollable Body)
    │   ├── SakugaApp.tsx         # Orchestrator dashboard utama
    │   └── SakugaLogin.tsx       # Komponen halaman login & registrasi
    ├── lib/
    │   ├── auth.ts               # HMAC-SHA256 session signer & verifier
    │   └── db.ts                 # Koneksi Pool PostgreSQL, auto-migration & seeder
    └── types/
        └── sakuga.d.ts           # Deklarasi TypeScript JSX untuk <sakuga-*>
```

---

## Cara Menjalankan dengan Docker Compose

1. Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Pastikan container PostgreSQL (`postgres15` pada network `docker-infra_default`) sudah berjalan, lalu jalankan container React:
   ```bash
   docker compose up -d --build
   ```
3. Buka di browser:
   - **Halaman Login**: `http://localhost:3000/login`
   - **Halaman Utama (Studio CRUD & Tabel)**: `http://localhost:3000`
   - **Healthcheck API**: `http://localhost:3000/api/health`
