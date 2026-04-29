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

## 🔥 Firebase Setup (Step-by-Step)

The app currently uses a **mock auth service** that mimics Firebase's API exactly. Swapping to real Firebase takes about 10 minutes.

### Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it `clinic-sage` (or anything you like)
4. Disable Google Analytics (not needed) → Click **"Create project"**
5. Wait ~30 seconds for it to provision

### Step 2 — Register Your Web App

1. On the project overview page, click the **`</>`** (Web) icon
2. Give it a nickname: `clinic-sage-web`
3. Check **"Also set up Firebase Hosting"** if you want Firebase hosting (optional)
4. Click **"Register app"**
5. You'll see a `firebaseConfig` object — **copy it**, you'll need it in Step 4

It looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "clinic-sage.firebaseapp.com",
  projectId: "clinic-sage",
  storageBucket: "clinic-sage.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

### Step 3 — Enable Email/Password Authentication

1. In the Firebase console sidebar, go to **Build → Authentication**
2. Click **"Get started"**
3. Under **"Sign-in providers"**, click **"Email/Password"**
4. Toggle **"Enable"** ON
5. Click **"Save"**

### Step 4 — Create a Test User

1. Still in Authentication, go to the **"Users"** tab
2. Click **"Add user"**
3. Enter:
   - Email: `doctor@clinicsage.com`
   - Password: `clinic123`
4. Click **"Add user"**

### Step 5 — Install Firebase SDK

```bash
npm install firebase
```

### Step 6 — Create Firebase Config File

Create `src/utils/firebase.ts`:

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Step 7 — Swap the Auth Service

Open `src/utils/authService.ts` and **replace the entire file** with:

```ts
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { User } from "../types";

// Map Firebase user to our User type
const mapUser = (
  firebaseUser: import("firebase/auth").User | null,
): User | null => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? firebaseUser.email ?? "Doctor",
  };
};

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(result.user)!;
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  getCurrentUser(): User | null {
    return mapUser(auth.currentUser);
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      callback(mapUser(firebaseUser));
    });
  },
};
```

That's it. The rest of the app (Redux, components, pages) doesn't change at all — they all go through `authService`.

### Step 8 — Environment Variables (Important for Security)

Never commit your Firebase config to a public repo. Move it to environment variables:

1. Create `.env.local` in the project root:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=clinic-sage.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=clinic-sage
VITE_FIREBASE_STORAGE_BUCKET=clinic-sage.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

2. Update `src/utils/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

3. Add `.env.local` to your `.gitignore` (it's there by default in Vite projects)

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/rubeshajith/clinic-sage.git
git push -u origin main
```

2. Go to [https://vercel.com](https://vercel.com) → Sign in with GitHub

3. Click **"New Project"** → Import your `clinic-sage` repo

4. Vercel auto-detects Vite. Settings will be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add your environment variables:
   - Go to **Settings → Environment Variables**
   - Add each `VITE_FIREBASE_*` key from your `.env.local`

6. Click **"Deploy"** — live in ~60 seconds ✅

### Deploy to Netlify

1. Go to [https://netlify.com](https://netlify.com) → New site from Git

2. Connect GitHub → select your repo

3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. Go to **Site settings → Environment variables** → add all `VITE_FIREBASE_*` keys

5. Create `public/_redirects` file (for client-side routing):

```
/*  /index.html  200
```

6. Deploy ✅

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
- features/patients
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
