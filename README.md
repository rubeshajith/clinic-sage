# 🌿 Clinic Sage — B2B Healthcare SaaS UI

A modern, production-ready healthcare platform built with React, TypeScript, and Redux Toolkit. Featuring patient management, analytics, real-time notifications via Service Workers, and Firebase-ready authentication.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo credentials:**

- Email: `doctor@clinicsage.com`
- Password: `clinic123`

- Email: `admin@clinicsage.com`
- Password: `clinic123`

---

## 📁 Project Structure

```
clinic-sage/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── ProtectedRoute.tsx       # Auth guard for routes
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx            # Main shell (sidebar + outlet)
│   │   │   ├── AppLayout.module.css
│   │   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   │   └── Sidebar.module.css
│   │   └── patients/
│   │       ├── PatientCard.tsx          # Grid view card
│   │       ├── PatientCard.module.css
│   │       ├── PatientRow.tsx           # List view row
│   │       ├── PatientRow.module.css
│   │       ├── ViewToggle.tsx           # Grid/List toggle switch
│   │       └── ViewToggle.module.css
│   ├── hooks/
│   │   └── redux.ts                     # Typed useAppDispatch / useAppSelector
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PatientsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── NotificationsPage.tsx
│   ├── store/
│   │   ├── index.ts                     # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.ts             # Auth state + async thunks
│   │       ├── patientSlice.ts          # Patient list, view mode, filters
│   │       └── notificationSlice.ts     # Notification list + permission state
│   ├── styles/
│   │   └── global.css                   # Design tokens (CSS variables) + base styles
│   ├── types/
│   │   └── index.ts                     # All TypeScript interfaces
│   ├── utils/
│   │   ├── authService.ts               # Auth abstraction (swap mock → Firebase here)
│   │   ├── mockData.ts                  # Patient + analytics seed data
│   │   └── notifications.ts             # SW notification helpers
│   ├── sw.ts                            # Service Worker (PWA)
│   ├── App.tsx                          # Router + Provider setup
│   └── main.tsx                         # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

---

## 🛠️ Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server at localhost:5173   |
| `npm run build`   | Type-check + production build        |
| `npm run preview` | Preview the production build locally |

---

## 📋 Features Checklist

- [x] Login page with form validation and error states
- [x] Session persistence (via sessionStorage in mock, Firebase handles in prod)
- [x] Protected routes — redirect to login if not authenticated
- [x] Dashboard with stats, critical patient panel, recent patients table
- [x] Patient list with **Grid View** and **List View**
- [x] Toggle switch to switch between views
- [x] Search patients by name, ID, or condition
- [x] Filter by status (All / Active / Critical / Recovered / Discharged)
- [x] Analytics page with Recharts (Area, Bar, Pie charts)
- [x] Service Worker registered via vite-plugin-pwa
- [x] Push notification permission request
- [x] Local notifications via SW message passing
- [x] Simulate alert button for demo purposes
- [x] Mark notification as read / mark all read
- [x] Redux Toolkit state management across all pages
- [x] Fully responsive layout
- [x] Clinic Sage design system (CSS variables, DM Sans, flat design)
- [x] TypeScript throughout — zero `any` types

---

## Architecture & Scalability

The project currently follows a modular structure separating components, pages, and state.

For scalability and micro-frontend readiness, the application can be refactored into a feature-based architecture:

- features/auth
- features/analytics
- features/notifications

Each feature would encapsulate:

- UI components
- state (Redux slice)
- business logic

This enables future adoption of micro-frontend patterns such as Module Federation, where each feature can be independently developed and deployed.

---

## 🎨 Design System

All tokens are in `src/styles/global.css` as CSS variables:

| Token         | Value     | Usage                         |
| ------------- | --------- | ----------------------------- |
| `--primary`   | `#1B3A2E` | Headlines, sidebar background |
| `--secondary` | `#7A8F85` | Captions, borders, metadata   |
| `--tertiary`  | `#4E8B6A` | CTAs, links, active states    |
| `--neutral`   | `#F4F7F4` | Page background, hover fills  |
| `--surface`   | `#FFFFFF` | Cards, panels                 |

---

## 💡 Architecture Notes

### Why `authService.ts` abstraction?

Firebase is the real target, but you shouldn't need Firebase to develop locally. The abstraction layer means:

- Zero Firebase calls during local dev (faster, no quota)
- Single file to change when going to production
- Easy to test — mock returns predictable data

### Redux slice responsibilities

- **`authSlice`** — user object, loading/error states, async login/logout thunks
- **`patientSlice`** — patient list (could be replaced with RTK Query), view mode, search, filters
- **`notificationSlice`** — notification items, unread count, SW permission state

### Service Worker flow

```
User action → sendLocalNotification() → SW receives 'message' event
                                       → SW calls showNotification()
                                       → Browser shows native notification
```
