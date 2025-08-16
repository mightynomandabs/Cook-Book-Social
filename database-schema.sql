-- CookBook App Database Schema
-- Run this in your Supabase SQL Editor

-- Note: This schema creates all tables and relationships for the CookBook app
-- RLS policies are set up to allow public read access and user-specific modifications
-- 
-- ⚠️  DEVELOPMENT MODE: All operations are currently allowed for development purposes
--     Once authentication is implemented, these policies should be updated for production

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  cooking_level INTEGER DEFAULT 1,
  cooking_level_title VARCHAR(100) DEFAULT 'Beginner',
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  saved_recipes_count INTEGER DEFAULT 0,
  interests TEXT[],
  dietary_preferences TEXT[],
  preferred_languages TEXT[],
  location VARCHAR(255),
  is_restaurant BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  video_url TEXT,
  teaser TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  tags TEXT[],
  cuisine VARCHAR(100),
  dietary_tags TEXT[],
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  servings INTEGER,
  difficulty VARCHAR(50),
  language VARCHAR(50) DEFAULT 'English',
  translations JSONB,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2),
  unit VARCHAR(50),
  price DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Method steps table
CREATE TABLE method_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  time INTEGER,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutrition info table
CREATE TABLE nutrition_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  fiber DECIMAL(5,2),
  sugar DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  video_url TEXT,
  caption TEXT,
  views_count INTEGER DEFAULT 0,
  is_viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, user_id)
);

-- Saves table
CREATE TABLE saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, user_id)
);

-- Groups table
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  avatar TEXT,
  cover_image TEXT,
  creator_id UUID REFERENCES users(id),
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  tags TEXT[],
  location VARCHAR(255),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members table
CREATE TABLE group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Contests table
CREATE TABLE contests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  prize TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  participants_count INTEGER DEFAULT 0,
  rules TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contest submissions table
CREATE TABLE contest_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  video_url TEXT,
  description TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurants table
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  cover_image TEXT,
  address TEXT,
  coordinates JSONB,
  phone VARCHAR(50),
  website TEXT,
  cuisine TEXT[],
  price_range VARCHAR(50),
  rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,
  delivery_available BOOLEAN DEFAULT TRUE,
  delivery_partners TEXT[],
  opening_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured dishes table
CREATE TABLE featured_dishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  is_vegetarian BOOLEAN DEFAULT FALSE,
  spice_level INTEGER,
  allergens TEXT[],
  order_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pantry items table
CREATE TABLE pantry_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  expiry_date DATE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_low_stock BOOLEAN DEFAULT FALSE
);

-- Meal plans table
CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_user_id UUID REFERENCES users(id),
  related_recipe_id UUID REFERENCES recipes(id),
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  delivery_time VARCHAR(100),
  min_order_amount DECIMAL(10,2),
  delivery_fee DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart table
CREATE TABLE shopping_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES shopping_cart(id) ON DELETE CASCADE,
  ingredient_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  price DECIMAL(10,2),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_creator_id ON recipes(creator_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_saves_recipe_id ON saves(recipe_id);
CREATE INDEX idx_saves_user_id ON saves(user_id);
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_created_at ON stories(created_at);
CREATE INDEX idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_pantry_items_user_id ON pantry_items(user_id);
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE method_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your needs)
-- Users can read all public data
CREATE POLICY "Allow public read access" ON recipes FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON stories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON groups FOR SELECT USING (is_public = true);
CREATE POLICY "Allow public read access" ON contests FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON restaurants FOR SELECT USING (true);

-- Users can only modify their own data (temporarily disabled for development)
-- These policies will be enabled once authentication is set up
-- CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
-- CREATE POLICY "Users can insert own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = creator_id);
-- CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid() = creator_id);
-- CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid() = creator_id);

-- For now, allow all operations (development mode)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON recipes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON ingredients FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON method_steps FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON nutrition_info FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON stories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON likes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON saves FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON groups FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON group_members FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON contests FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON contest_submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON restaurants FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON featured_dishes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON pantry_items FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON meal_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON shopping_cart FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON cart_items FOR ALL USING (true);

-- Insert sample data
INSERT INTO suppliers (name, logo, delivery_time, min_order_amount, delivery_fee) VALUES
('Blinkit', '🛒', '10 minutes', 0, 0),
('Swiggy Instamart', '🛒', '15 minutes', 0, 0),
('Zepto', '🛒', '10 minutes', 0, 0);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
