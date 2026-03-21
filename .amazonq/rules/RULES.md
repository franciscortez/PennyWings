# Development Workflow Rules

> **Important:** Your task is to work inside this codebase, but **do not start building immediately**.

Before creating the app, writing code, or following the implementation prompt, you must first generate a clear working context for the project.

---

## Phase 1: Codebase Context

Inspect the codebase and produce a structured summary that includes:

- The overall purpose of the project
- The current app architecture and folder structure
- The main technologies, frameworks, libraries, and tools being used
- Existing conventions, patterns, and reusable components
- Environment setup, scripts, and important configuration files
- Areas of the codebase that are relevant to the requested task

---

## Phase 2: Task Understanding

Before making changes, define:

- The task to be completed
- The current state of the relevant feature/module
- Assumptions, dependencies, and possible risks
- Missing information or blockers, if any

---

## Phase 3: Execution Plan

Create a step-by-step implementation plan before coding. The plan should:

- Break the work into clear phases aligned with system architecture
- Identify which files will likely need to be created or modified
- Explain why each step is necessary
- Consider dependencies between modules (e.g., cards/wallets before transactions)
- Include validation steps, testing strategy, and expected outputs
- Reference the system flow to ensure proper integration

---

## Phase 4: Progress Tracking

Maintain a running task progress section throughout execution:

- ⏸️ **Not started**
- 🔄 **In progress**
- ✅ **Completed**
- 🚫 **Blocked**

Update this progress as you move through the work.

---

## Rules

- ❌ Do not write code until the context summary and plan are complete
- ♻️ Prefer reusing existing patterns in the codebase over inventing new ones
- 💬 Be explicit about uncertainties and assumptions
- 📋 Keep output structured and easy to scan
- 🤔 If the task is ambiguous, first infer the most likely intent from the codebase and state your reasoning
    - **Netlify MCP**: Use for managing site deployments (`deploy-site`), configuring environment variables (`manage-env-vars`), and checking deployment status.
- 🍞 **Notifications**: Use the centralized `getToast(theme)` utility from `src/utils/toast.js` for all SweetAlert2 toasts.
- 🌓 **Theme Constraints**: The following pages MUST remain in **Light Mode** only (#FFF0F5 background) and avoid dark mode implementations:
    - `Home.jsx`
    - `Login.jsx`
    - `Signup.jsx`
- ⚛️ **Use TanStack Query (React Query)** for all server state management (fetching, caching, synchronization, and mutations). Avoid complex `useEffect` chains for data fetching.
- ✨ **Framer Motion Convention**: When using Framer Motion, always use the `Motion` alias for consistency: `import { motion as Motion } from 'motion/react'`. Use `AnimatePresence` for exit animations.
- 🎯 **Goals Module**: All savings goals MUST be linked to an account (Bank Card or E-Wallet). The `current_amount` is dynamically derived from the linked account's balance in the `useGoals` hook. Do not implement manual balance entry for goals.
- 💰 **Budget Module**: Budgets are strictly for `expense` categories. When creating or editing a budget, always filter the category list to show only `type === 'expense'`.
- 📊 **Dashboard Stats**: The Dashboard cards for "Budget Status" and "Savings Goals" must use real-time averages from `useBudgets`, `useBudgetStats`, and `useGoals` instead of static placeholders.

---

## Output Format

Return your work in this order:

1. **Codebase Context**
2. **Technologies Used**
3. **Relevant Files / Modules**
4. **Task Definition**
5. **Implementation Plan**
6. **Progress Tracker**

> ⚠️ **Only after all of the above:** proceed with implementation

---

## System Architecture Reference

When planning tasks, always consider the system flow:

### Core Modules

1. **Authentication Layer** - Supabase Auth (login/signup/protected routes)
2. **Accounts Module** - Unified management via `AccountWizard` (Digital/Traditional Banks, E-Wallets)
3. **Transactions Module** - Income/expense tracking linked to accounts
4. **Goals Module** - Savings goals and progress tracking
5. **Dashboard** - Overview and analytics with real-time net worth

### Data Flow Pattern

```
User Action → React Component → Supabase Client → PostgreSQL + RLS → Real-time Sync
```

### Design System

- **Technologies**: React 19, Supabase, Tailwind CSS, TanStack Query, Framer Motion
- **Theme**: Light pink aesthetic (#FFC0CB, #FFB6C1, #FFF0F5)
- **Framework**: Tailwind CSS with custom pink color palette
- **Animations**: Framer Motion (`motion/react`) for all transitions and micro-interactions
- **Icons**: Lucide React for consistent, theme-aware iconography
- **Notifications**: SweetAlert2 for premium, themed dialogs. Always use `getToast(theme)` for non-blocking feedback.
- **Components**: Card-based UI with premium glassmorphism (blur spots, overlays, gradients)
- **Accessibility**: WCAG compliant contrast ratios on pink backgrounds

### Implementation Priority

1. Foundation (Supabase + Tailwind + Structure)
2. Authentication (User access control)
3. Database Schema (Tables + RLS policies)
4. Accounts Module (Unified Wizard for Bank/E-Wallet setup)
5. Transactions (Income/expense with account association)
6. Goals (Financial planning features)
7. Dashboard (Analytics and overview)
8. Enhancements (Charts, export)
