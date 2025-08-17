-- Essential Tables Only - Recipe Creation Feature
-- Run this in your Supabase SQL Editor for a minimal setup

-- Users table (essential for recipe creators)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  cooking_level INTEGER DEFAULT 1,
  cooking_level_title VARCHAR(100) DEFAULT 'Beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table (main recipe data)
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  cuisine VARCHAR(100),
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  servings INTEGER,
  difficulty VARCHAR(50),
  language VARCHAR(50) DEFAULT 'English',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table (recipe ingredients)
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  step_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Method steps table (cooking instructions)
CREATE TABLE IF NOT EXISTS method_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_creator_id ON recipes(creator_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_method_steps_recipe_id ON method_steps(recipe_id);

-- Insert a default user for testing (you can delete this later)
INSERT INTO users (id, email, name, cooking_level_title) 
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@cookbook.com',
  'Test Chef',
  'Expert'
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE method_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for development (allow all operations)
CREATE POLICY "Allow all operations for development" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for development" ON recipes FOR ALL USING (true);
CREATE POLICY "Allow all operations for development" ON ingredients FOR ALL USING (true);
CREATE POLICY "Allow all operations for development" ON method_steps FOR ALL USING (true);

-- For production, you would use these more restrictive policies:
-- CREATE POLICY "Users can view all recipes" ON recipes FOR SELECT USING (true);
-- CREATE POLICY "Users can create recipes" ON recipes FOR INSERT WITH CHECK (auth.uid()::text = creator_id::text);
-- CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid()::text = creator_id::text);
-- CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid()::text = creator_id::text);
