-- INIT SCHEMA: PennyWings

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bank Cards
CREATE TABLE IF NOT EXISTS public.bank_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_name TEXT NOT NULL,
  card_type TEXT CHECK (card_type IN ('credit', 'debit', 'savings')) NOT NULL,
  last_four TEXT,
  balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  color TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. E-Wallets
CREATE TABLE IF NOT EXISTS public.e_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_name TEXT NOT NULL,
  wallet_type TEXT NOT NULL, -- 'paypal', 'gcash', 'venmo', etc.
  account_identifier TEXT, -- Email or phone
  balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  color TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for default system categories
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  icon TEXT,
  color TEXT,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.bank_cards(id) ON DELETE SET NULL,
  wallet_id UUID REFERENCES public.e_wallets(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('income', 'expense', 'withdrawal')) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'ewallet')) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  limit_amount DECIMAL(15, 2) NOT NULL,
  period TEXT DEFAULT 'monthly' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Goals
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.e_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Bank Cards: Users can manage their own cards
CREATE POLICY "Users can manage own cards" ON public.bank_cards FOR ALL USING (auth.uid() = user_id);

-- E-Wallets: Users can manage their own wallets
CREATE POLICY "Users can manage own wallets" ON public.e_wallets FOR ALL USING (auth.uid() = user_id);

-- Categories: Users can see default categories and their own custom ones
CREATE POLICY "Users can view categories" ON public.categories FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can manage own categories" ON public.categories FOR ALL USING (auth.uid() = user_id);

-- Transactions: Users can manage their own transactions
CREATE POLICY "Users can manage own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Budgets: Users can manage their own budgets
CREATE POLICY "Users can manage own budgets" ON public.budgets FOR ALL USING (auth.uid() = user_id);

-- Goals: Users can manage their own goals
CREATE POLICY "Users can manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- SEED DEFAULT CATEGORIES
INSERT INTO public.categories (name, type, icon, color, is_default) VALUES
('Salary', 'income', 'briefcase', '#4ADE80', true),
('Business', 'income', 'trending-up', '#22C55E', true),
('Investment', 'income', 'pie-chart', '#16A34A', true),
('Gift', 'income', 'gift', '#86EFAC', true),
('Food & Dining', 'expense', 'utensils', '#FB7185', true),
('Shopping', 'expense', 'shopping-bag', '#F43F5E', true),
('Transportation', 'expense', 'truck', '#FDA4AF', true),
('Entertainment', 'expense', 'film', '#E11D48', true),
('Utilities', 'expense', 'zap', '#FB7185', true),
('Health', 'expense', 'heart', '#F43F5E', true),
('Travel', 'expense', 'plane', '#FDA4AF', true),
('Education', 'expense', 'book', '#E11D48', true),
('Allowance', 'expense', 'wallet', '#FBBF24', true),
('Gifts', 'expense', 'gift', '#EC4899', true),
('Salary', 'expense', 'banknote', '#10B981', true),
('Family', 'expense', 'home', '#6366F1', true),
('Bills', 'expense', 'receipt', '#EF4444', true),
('Groceries', 'expense', 'shopping-cart', '#F97316', true),
('Others', 'expense', 'more-horizontal', '#94A3B8', true);

-- 8. Enable Real-time for specific tables
-- This allows the Supabase client to listen for changes to these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bank_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.e_wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
