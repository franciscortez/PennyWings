# Budget Tracker - Project Context

## Project Overview

**Budget Tracker** is a personal finance management application built with React, Supabase (free tier), and Tailwind CSS. The app enables users to track income, expenses, budgets, financial goals, and account balances (bank cards and e-wallets) with real-time data synchronization and user authentication.

---

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACCESS                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Authentication  │
                    │  (Supabase Auth) │
                    └──────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
            Logged Out                Logged In
                 │                         │
                 ▼                         ▼
        ┌─────────────────┐      ┌─────────────────┐
        │  Login/Signup   │      │    Dashboard    │
        │      Page       │      │   (Overview)    │
        └─────────────────┘      └─────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
          ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
          │   Bank Cards &   │  │  Transactions    │  │     Budgets      │
          │   E-Wallets      │  │   Management     │  │   Management     │
          │   Management     │  │                  │  │                  │
          │                  │  │ • Add Income     │  │ • Set Limits     │
          │ • Add/Edit Card  │  │ • Add Expense    │  │ • Track Spending │
          │ • Add/Edit Wallet│  │ • Add Withdrawal │  │ • Visual Progress│
          │ • View Balance   │  │ • Categorize     │  └──────────────────┘
          │ • Account Types  │  │ • Link to Card/  │           │
          └──────────────────┘  │   Wallet/Cash    │           │
                    │            │ • View History   │           │
                    │            └──────────────────┘           │
                    │                     │                     │
                    └─────────────────────┼─────────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────┐
                              │   Goals Tracking     │
                              │                      │
                              │ • Savings Goals      │
                              │ • Progress Monitor   │
                              │ • Target Dates       │
                              └──────────────────────┘
                                          │
                                          ▼
                    ┌─────────────────────────────────────┐
                    │      Supabase Backend (BaaS)        │
                    │                                     │
                    │  • PostgreSQL Database              │
                    │  • Real-time Subscriptions          │
                    │  • Row Level Security (RLS)         │
                    │  • Storage (Receipts/Attachments)   │
                    └─────────────────────────────────────┘
```

### Data Flow

1. **User Authentication** → Supabase Auth validates credentials
2. **Dashboard Load** → Fetch user's cards, e-wallets, transactions, budgets, goals
3. **Real-time Updates** → Supabase subscriptions sync data across devices
4. **User Actions** → CRUD operations on cards, e-wallets, transactions, budgets, goals
5. **Data Persistence** → All changes saved to Supabase PostgreSQL with RLS

### Transaction Flow (Income/Expense/Withdrawal)

```
User adds transaction
    ↓
Select transaction type:
    • Income (adds to balance)
    • Expense (deducts from balance)
    • Withdrawal (transfers between accounts or to cash)
    ↓
Select payment method:
    • Cash (no account linked)
    • [Card 1] - Chase Sapphire (Credit)
    • [Card 2] - Wells Fargo Checking (Debit)
    • [Card 3] - Savings Account (Savings)
    • [E-Wallet 1] - PayPal
    • [E-Wallet 2] - GCash
    • [E-Wallet 3] - Venmo
    ↓
Enter amount & details
    ↓
Save transaction
    ↓
Auto-update account balance:
    • Income → balance increases
    • Expense → balance decreases
    • Withdrawal → source account balance decreases
    ↓
Update budget tracking
    ↓
Real-time sync across devices
```

---

## Tech Stack

### Core Technologies

- **React 19.2.4** - UI library with hooks and modern features
- **Vite 8.0.0** - Fast build tool and dev server with HMR
- **Supabase** - Backend-as-a-Service (BaaS) for:
  - PostgreSQL database
  - Authentication (email/password, OAuth)
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Storage for receipts/attachments
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - High-quality, consistent icon library
- **SweetAlert2** - Premium, customizable notification and dialog system

### Development Tools

- **ESLint** - Code linting with React-specific rules
- **@vitejs/plugin-react** - React Fast Refresh support
- **Node.js** - Runtime environment

---

## Project Structure

```
BudgetTrackerSuperbase/
├── .amazonq/
│   └── rules/              # AI assistant rules and context
├── public/
│   ├── favicon.svg
│   └── icons.svg           # SVG sprite for icons
├── src/
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main app component (currently boilerplate)
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles and CSS variables
│   └── main.jsx            # React entry point
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md
```

---

## Current State

### Existing Setup

- ✅ React + Vite boilerplate initialized
- ✅ ESLint configured with React hooks and refresh plugins
- ✅ Basic CSS with light/dark mode support via CSS variables
- ✅ Development scripts ready (`npm run dev`, `npm run build`)
- ✅ Supabase client setup and configuration (`src/lib/supabase.js`)
- ✅ Tailwind CSS installation and configuration (`tailwind.config.js` and `src/index.css`)
- ✅ Custom Pink Color Palette defined in Tailwind
- ✅ Authentication system (Login, Signup, Forgot Password, Reset Password)
- ✅ Modernized Icon System (Lucide React)
- ✅ Premium Notification System (SweetAlert2)

### Missing/To Be Implemented

- ❌ Budget tracking features
- ❌ Component architecture (Dashboard, etc.)
- ❌ Routing (Initial React Router setup exists but needs more pages)
- ❌ State management approach (AuthContext started)

---

## Supabase Integration Guide

### Free Tier Limitations

- Database: Nano compute on the free plan; avoid relying on the old “500 MB” figure
- Auth: 50,000 monthly active users
- Storage: 1 GB file storage
- Realtime: 2 million messages + 200 peak connections
- Edge Functions: 500,000 invocations/month

### Required Setup Steps

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Install Supabase client: `npm install @supabase/supabase-js`
3. Configure environment variables (`.env.local`):
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Initialize Supabase client in `src/lib/supabase.js`
5. Set up database tables via Supabase Dashboard or migrations
6. Configure Row Level Security (RLS) policies

### Recommended Database Schema

```sql
-- Users table (handled by Supabase Auth)
-- profiles table for extended user data
-- bank_cards table for user's bank/credit cards
-- e_wallets table for digital wallets (PayPal, GCash, Venmo, etc.)
-- categories table for expense/income categories
-- transactions table for all financial entries (linked to cards/wallets)
-- budgets table for budget limits per category
-- goals table for savings goals
```

### Database Tables Detail

#### bank_cards

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `card_name` (text) - e.g., "Chase Sapphire", "Wells Fargo Checking"
- `card_type` (text) - "credit", "debit", "savings"
- `last_four` (text) - Last 4 digits for identification
- `balance` (decimal) - Current balance
- `credit_limit` (decimal, nullable) - For credit cards
- `color` (text) - Background color code for visual identification
- `text_color` (text) - Text color code for optimal contrast
- `is_active` (boolean) - Active/archived status
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### e_wallets

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `wallet_name` (text) - e.g., "PayPal", "GCash", "Venmo"
- `wallet_type` (text) - "paypal", "gcash", "venmo", "cashapp", "other"
- `account_identifier` (text) - Email or phone number
- `balance` (decimal) - Current balance
- `color` (text) - Background color code for visual identification
- `text_color` (text) - Text color code for optimal contrast
- `is_active` (boolean) - Active/archived status
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### transactions

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `card_id` (uuid, foreign key to bank_cards, nullable) - NULL for cash/e-wallet transactions
- `wallet_id` (uuid, foreign key to e_wallets, nullable) - NULL for cash/card transactions
- `category_id` (uuid, foreign key to categories)
- `type` (text) - "income", "expense", or "withdrawal"
- `payment_method` (text) - "cash", "card", or "ewallet"
- `amount` (decimal)
- `description` (text)
- `transaction_date` (date)
- `receipt_url` (text, nullable) - Link to uploaded receipt
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Transaction Type Logic:**

- **Income**: Adds to account balance (if card/wallet selected) or tracked separately (if cash)
- **Expense**: Deducts from account balance (if card/wallet selected) or tracked separately (if cash)
- **Withdrawal**: Deducts from source account balance (e.g., ATM withdrawal, transfer to cash)

**Payment Method Logic:**

- **Cash**: `payment_method = "cash"`, both `card_id` and `wallet_id` are NULL
- **Card**: `payment_method = "card"`, `card_id` is set, `wallet_id` is NULL
- **E-Wallet**: `payment_method = "ewallet"`, `wallet_id` is set, `card_id` is NULL

---

## Tailwind CSS Setup

### Installation Required

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration Files Needed

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- Update `src/index.css` with Tailwind directives

---

## Development Conventions

### Code Style

- **ES6+ syntax** with modern JavaScript features
- **Functional components** with React hooks
- **JSX** for component markup
- **camelCase** for variables and functions
- **PascalCase** for component names
- **Modular imports** - one component per file

### File Organization

- Components in `src/components/`
- Pages/views in `src/pages/` (if using routing)
- Utilities in `src/utils/`
- Supabase config in `src/lib/`
- Hooks in `src/hooks/`
- Constants in `src/constants/`

### State Management

- React hooks (useState, useEffect, useContext) for local state
- Context API for global state (auth, theme)
- Supabase real-time for data synchronization

### Styling Approach

- Tailwind utility classes for styling
- CSS modules or scoped styles for complex components
- Maintain existing CSS variables for theming
- Support light/dark mode

---

## Environment Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Git

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables

Create `.env.local` file (not committed to Git):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Key Features to Implement

### Authentication

- Email/password signup and login
- OAuth providers (Google, GitHub)
- Password reset
- Protected routes
- User profile management

### Bank Cards Management

- Add/edit/delete bank cards (credit, debit, savings)
- Track card balances in real-time
- Visual card display with custom background and text colors
- Credit limit tracking for credit cards
- Link transactions to specific cards
- Archive/activate cards
- Total balance overview across all cards

### E-Wallet Management

- Add/edit/delete e-wallets (PayPal, GCash, Venmo, CashApp, Cash on Hand, etc.)
- Track e-wallet balances in real-time
- Visual wallet display with custom background and text colors
- Link transactions to specific e-wallets
- Archive/activate e-wallets
- Total balance overview across all e-wallets

### Budget Tracking

- Add/edit/delete transactions (income/expenses/withdrawals)
- Payment method selection (cash, specific card, or e-wallet)
- Link transactions to bank cards or e-wallets
- Categorize transactions
- Set monthly budgets per category
- Visual budget vs. actual spending
- Transaction history with filters
- Filter by card, e-wallet, category, date range, payment method

### Dashboard

- Overview of financial health
- Total balance across all bank cards and e-wallets
- Quick view of all cards and e-wallets with balances
- Charts and graphs (income vs. expenses)
- Budget progress indicators
- Recent transactions with card/wallet info
- Savings goals progress
- Monthly spending by card/wallet

### Data Management

- Real-time updates across devices
- Offline support (optional)
- Export data (CSV/PDF)
- Receipt/attachment uploads

---

## Design Considerations

### Design Theme

- **Primary Color Scheme**: Light pink aesthetic
- **Base Colors**: Soft pink tones (#FFC0CB, #FFB6C1, #FFF0F5)
- **Accent Colors**: Deeper pink/rose for CTAs and highlights
- **Background**: Light pink gradient or solid with white cards
- **Text**: Dark gray/charcoal for readability on pink backgrounds
- **Cards/Components**: White or very light pink with subtle shadows
- **Dark Mode**: Muted pink/mauve tones with dark backgrounds

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Card-based layout for bank cards (swipeable on mobile)

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance (ensure pink backgrounds meet WCAG standards)

### Performance

- Code splitting
- Lazy loading for routes
- Optimized images
- Minimal bundle size

---

## Security Best Practices

### Supabase Security

- Enable Row Level Security (RLS) on all tables
- Use service role key only on server-side
- Validate user input
- Sanitize data before database operations

### Authentication

- Secure token storage
- Session management
- HTTPS only in production
- Environment variables for secrets

---

## References

### Documentation

- [React Docs](https://react.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vite.dev/)

### Supabase Key Resources

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Authentication](https://supabase.com/docs/guides/auth)
- [Database](https://supabase.com/docs/guides/database)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## User Flow Examples

### Adding a Transaction

1. User navigates to Transactions page
2. Clicks "Add Transaction" button
3. Selects transaction type:
   - **Income** (salary, refund, etc.)
   - **Expense** (purchase, bill payment, etc.)
   - **Withdrawal** (ATM withdrawal, cash out, transfer)
4. Selects payment method from dropdown:
   - **Cash** (no account linked, card_id = NULL, wallet_id = NULL)
   - **[Card Name]** (e.g., "Chase Sapphire", "Wells Fargo Checking")
   - **[E-Wallet Name]** (e.g., "PayPal", "GCash", "Venmo")
5. Selects category (e.g., Food, Transport, Salary)
6. Enters amount and description
7. Sets transaction date
8. Optionally uploads receipt
9. Saves transaction
10. System automatically:
    - Updates account balance (if card/wallet selected):
      - Income: `balance = balance + amount`
      - Expense: `balance = balance - amount`
      - Withdrawal: `balance = balance - amount`
    - Updates budget tracking for the category
    - Syncs data in real-time

### Cash vs Card vs E-Wallet Transactions

**Cash Transactions:**

- `payment_method = "cash"`
- `card_id = NULL` and `wallet_id = NULL`
- No account balance affected
- Still tracked in budget and reports
- Useful for tracking cash spending

**Card Transactions:**

- `payment_method = "card"`
- `card_id = [selected card UUID]`, `wallet_id = NULL`
- Card balance automatically updated
- Linked to specific card for tracking
- Shows in card transaction history

**E-Wallet Transactions:**

- `payment_method = "ewallet"`
- `wallet_id = [selected wallet UUID]`, `card_id = NULL`
- E-wallet balance automatically updated
- Linked to specific e-wallet for tracking
- Shows in e-wallet transaction history

### Withdrawal Flow Example

**Scenario:** User withdraws $100 from ATM using Chase Sapphire card

1. Select transaction type: **Withdrawal**
2. Select payment method: **Chase Sapphire**
3. Select category: **ATM Withdrawal** or **Cash Out**
4. Enter amount: **$100**
5. Description: "ATM withdrawal at Main St."
6. Save
7. Result:
   - Chase Sapphire balance: `$1,500 → $1,400`
   - Transaction recorded with type "withdrawal"
   - User now has $100 cash (can track separately)

**Scenario 2:** User transfers $50 from PayPal to bank account

1. Select transaction type: **Withdrawal**
2. Select payment method: **PayPal**
3. Select category: **Transfer Out**
4. Enter amount: **$50**
5. Description: "Transfer to bank account"
6. Save
7. Result:
   - PayPal balance: `$200 → $150`
   - Transaction recorded with type "withdrawal"
   - Can add corresponding income transaction to bank card if needed

### Managing Bank Cards

1. User navigates to Cards page
2. Views all cards with current balances
3. Can add new card with details (name, type, balance, limit)
4. Edit existing card information
5. Archive unused cards
6. View transaction history per card

### Managing E-Wallets

1. User navigates to E-Wallets page (or Cards page with tabs)
2. Views all e-wallets with current balances
3. Can add new e-wallet (name, type, account identifier, balance)
4. Edit existing e-wallet information
5. Archive unused e-wallets
6. View transaction history per e-wallet

### Budget Monitoring

1. Dashboard shows budget progress bars
2. Color-coded indicators (green = under budget, red = over budget)
3. Click category to see detailed transactions
4. Adjust budget limits as needed
5. Real-time updates as transactions are added

---

## Notes

- Project uses Vite's React plugin with Fast Refresh (HMR)
- ESLint configured to ignore unused variables starting with uppercase or underscore
- Current boilerplate includes light/dark mode CSS variables (will be adapted for pink theme)
- No TypeScript - using JavaScript (.jsx files)
- No testing framework configured yet
- Design will feature light pink color scheme throughout the application
- Bank cards and e-wallets will be visually represented with card-like UI components
- Transaction forms will have clear dropdown for payment method (Cash, Card, or E-Wallet selection)
- Withdrawal transactions will be clearly distinguished from regular expenses
- Account balances (cards and e-wallets) update automatically based on transaction type
- E-wallets and bank cards can coexist in the same interface with visual differentiation
