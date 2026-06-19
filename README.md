# SchoolEvents

School event management system for students, teachers, and admins.

**Stack:** Vue 3 + Vite + Three.js (frontend) · Fastify + Prisma + PostgreSQL (backend) · Resend (email) · Google OAuth

## Features
- Role-based auth: Student / Teacher / Admin
- Email + Google OAuth registration with 6-digit email verification
- Event creation with approval workflow (teacher creates → admin approves)
- Calendar view (FullCalendar) + grid view
- Event registration + waitlist
- QR check-in system
- Admin panel: user management, analytics

## Setup

### Backend
```bash
cd backend
cp .env.example .env   # fill in values
npm install
npm run db:push
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

See `.env.example` files in root and `frontend/`.

### Required
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — random secret for JWT signing
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google OAuth app credentials
- `RESEND_API_KEY` — [resend.com](https://resend.com) API key

## Project Structure

```
school-events/
├── frontend/          # Vue 3 + Vite SPA
│   └── src/
│       ├── views/     # Landing, Auth, Dashboard, Events, Admin
│       ├── components/three/  # Three.js hero scene
│       ├── stores/    # Pinia (auth, events)
│       ├── router/
│       └── api/       # Axios client
└── backend/           # Fastify REST API
    ├── src/
    │   ├── routes/    # auth, events, admin
    │   └── lib/       # prisma, email
    └── prisma/
        └── schema.prisma
```
