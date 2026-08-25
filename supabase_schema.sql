-- ====================================================================
-- AlgoLens (PyDSA) Multi-Device Cloud Persistence Schema (Supabase)
-- Execute this script in your Supabase Project's SQL Editor
-- ====================================================================

-- 1. Profiles Table (Automatically synced from GitHub OAuth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Progress Table (Solved & Bookmarked Problems)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  completed_problem_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  bookmarked_problem_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  last_active_pattern_id TEXT,
  last_active_problem_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_progress UNIQUE (user_id)
);

-- 3. User Code Drafts Table (Custom Python solutions per problem)
CREATE TABLE IF NOT EXISTS public.user_code_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  code TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_problem_draft UNIQUE (user_id, problem_id)
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_code_drafts ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies (Users can only read and modify their OWN records)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own progress" ON public.user_progress;
CREATE POLICY "Users can upsert own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own drafts" ON public.user_code_drafts;
CREATE POLICY "Users can view own drafts" ON public.user_code_drafts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own drafts" ON public.user_code_drafts;
CREATE POLICY "Users can upsert own drafts" ON public.user_code_drafts FOR ALL USING (auth.uid() = user_id);

-- 6. Trigger: Auto-populate profiles table upon GitHub OAuth sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, github_username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'user_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    github_username = EXCLUDED.github_username,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
