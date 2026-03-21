# 🦋 PennyWings Budget Tracker

> A beautiful, pink-themed personal finance management application built with React, Supabase, and Tailwind CSS.

**Live Demo:** [penny-wings.netlify.app](https://penny-wings.netlify.app)

---

## 🚀 Overview

**PennyWings** is a personal finance management tool designed for users who appreciate a premium aesthetic while tracking their financial health. It provides real-time synchronization across devices, automated goal tracking, and detailed spending insights.

### ✨ Key Features

- ✅ **Unified Accounts Management**: Support for Digital/Traditional Banks and E-Wallets with a 3-step creation wizard.
- ✅ **Dynamic Transfers**: Move funds between accounts (Bank, E-Wallet, or physical Cash) with atomic balance updates.
- ✅ **Automated Goal Tracking**: Savings goals are linked directly to account balances, updating progress automatically without manual logging.
- ✅ **Smart Budgets**: Category-based budget limits for expenses with real-time visualization of spending pulse.
- ✅ **Transaction Insights**: Comprehensive history with advanced filtering (by account, category, or payment method).
- ✅ **Real-time Sync**: Powered by Supabase Realtime and TanStack Query for seamless data consistency.
- ✅ **Premium UI/UX**: High-fidelity glassmorphism design with Framer Motion animations and custom pink color palette.

---

## 🏗️ Project Architecture

### Core Modules

1. **Authentication Layer**: Secure email/password login and signup powered by Supabase Auth with protected route wrappers.
2. **Accounts Module**: Unified management via `AccountWizard` (Digital/Traditional Banks, E-Wallets).
3. **Transactions Module**: Full CRUD for income, expenses, and withdrawals/transfers linked to accounts.
4. **Goals Module**: Financial planning with real-time progress derived from linked account balances.
5. **Dashboard**: Centralized hub with financial pulse reports, net worth tracking, and interactive analytics.

### Data Flow

```
User Action → React Component → Supabase RPC/PostgreSQL → Real-time Sync (TanStack Query)
```

---

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2.4**: Modern UI library with hooks and code-splitting.
- **TanStack Query (React Query) v5**: Asynchronous state management and caching.
- **Vite 8.0.0**: High-performance build tool and dev server.
- **Supabase**: Backend-as-a-Service (PostgreSQL, Auth, Real-time).
- **Tailwind CSS 3.4**: Utility-first styling with custom pink palette.
- **Motion (Framer Motion)**: Production-ready animations and transitions.
- **Lucide React**: Consistent, theme-aware iconography.
- **SweetAlert2**: Premium themed notifications and dialogs.
- **Recharts**: Interactive data visualization for spending reports.

### Development Tools
- **ESLint**: Code linting for React standards.
- **Netlify**: CI/CD and production hosting.

---

## 📁 Project Structure

```
PennyWings/
├── public/                 # Static assets and SVG icons
├── src/
│   ├── assets/             # Images and brand graphics
│   ├── components/         # Reusable UI (Accounts, Budgets, Goals, etc.)
│   ├── contexts/           # Auth and Theme providers
│   ├── hooks/              # Custom TanStack Query and data hooks
│   ├── lib/                # Supabase and QueryClient config
│   ├── pages/              # Routed page components (Dashboard, Transactions, etc.)
│   ├── utils/              # Helper functions (Toasts, Confirms, Math)
│   ├── App.jsx             # Main router and provider configuration
│   └── index.css           # Global Tailwind and premium animation styles
├── netlify.toml            # Netlify deployment configuration
├── tailwind.config.js      # Custom pink palette and animations
└── vite.config.js          # Vite optimization settings
```

---

## ⚙️ Environment Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PennyWings
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

---

## 🎨 Design Guidelines

### Pink Color Palette

```css
/* Custom PennyWings Palette */
--pink-50: #fff0f5;   /* Lavender Blush - Backgrounds */
--pink-100: #ffe4e9;  /* Very Light Pink - Cards */
│                     ...
--pink-500: #ff7a93;  /* Deep Pink - Accents */
--pink-600: #e85d7a;  /* Rose - Primary CTAs */
```

### UI Patterns
- **Glassmorphism**: Components feature white backdrops with 80% opacity and subtle backdrop blur.
- **Animations**: Page transitions and button interactions utilize the `Motion` alias for Framer Motion.
- **Icons**: Branded Lucide icons styled with custom colors and opacity levels.

---

## ⚡ Performance & Optimization

PennyWings is engineered for speed and responsiveness through several key architectural decisions:

- **Code Splitting**: Routes are lazy-loaded using `React.lazy()` and `Suspense`, reducing the initial bundle size and speeding up the first meaningful paint.
- **TanStack Query (React Query) v5**: Implements sophisticated caching, background data fetching, and optimistic updates to eliminate redundant network requests.
- **Atomic Balance Updates**: Uses Supabase RPC (Stored Procedures) to handle complex financial logic on the server, ensuring data integrity and reducing client-side processing.
- **Real-time Subscriptions**: Leverages Supabase Realtime to keep the UI in sync across multiple devices without manual page refreshes.
- **Asset Optimization**: Uses SVG sprites and optimized PNG assets to minimize load times.

---

## 🚀 Deployment

The project is hosted on **Netlify** with continuous deployment.

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **SPA Redirects**: Handled via `netlify.toml` for React Router compatibility.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [Netlify](https://www.netlify.com/)
