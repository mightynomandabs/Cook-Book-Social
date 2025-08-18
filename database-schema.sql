-- CookBook App Database Schema - MVP Version
-- Run this in your Supabase SQL Editor

-- Note: This schema creates all tables and relationships for the CookBook MVP
-- RLS policies are set up to allow public read access and user-specific modifications

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS recipe_views CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS saves CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS nutrition_info CASCADE;
DROP TABLE IF EXISTS method_steps CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Saves table
CREATE TABLE saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Follows table
CREATE TABLE follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Recipe views table
CREATE TABLE recipe_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_creator_id ON recipes(creator_id);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_method_steps_recipe_id ON method_steps(recipe_id);
CREATE INDEX idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX idx_saves_recipe_id ON saves(recipe_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE method_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Recipes are publicly readable" ON recipes;
DROP POLICY IF EXISTS "Users can create recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON recipes;
DROP POLICY IF EXISTS "Ingredients are publicly readable" ON ingredients;
DROP POLICY IF EXISTS "Users can manage ingredients for own recipes" ON ingredients;
DROP POLICY IF EXISTS "Method steps are publicly readable" ON method_steps;
DROP POLICY IF EXISTS "Users can manage method steps for own recipes" ON method_steps;
DROP POLICY IF EXISTS "Nutrition info is publicly readable" ON nutrition_info;
DROP POLICY IF EXISTS "Users can manage nutrition info for own recipes" ON nutrition_info;
DROP POLICY IF EXISTS "Stories are publicly readable" ON stories;
DROP POLICY IF EXISTS "Users can manage own stories" ON stories;
DROP POLICY IF EXISTS "Comments are publicly readable" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Likes are publicly readable" ON likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON likes;
DROP POLICY IF EXISTS "Saves are publicly readable" ON saves;
DROP POLICY IF EXISTS "Users can manage own saves" ON saves;
DROP POLICY IF EXISTS "Follows are publicly readable" ON follows;
DROP POLICY IF EXISTS "Users can manage own follows" ON follows;
DROP POLICY IF EXISTS "Recipe views are publicly readable" ON recipe_views;
DROP POLICY IF EXISTS "Users can create own recipe views" ON recipe_views;

-- RLS Policies for public read access and user-specific modifications
-- Users can read all users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Recipes are publicly readable
CREATE POLICY "Recipes are publicly readable" ON recipes FOR SELECT USING (true);

-- Users can create recipes
CREATE POLICY "Users can create recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Users can update their own recipes
CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid() = creator_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid() = creator_id);

-- Ingredients are publicly readable
CREATE POLICY "Ingredients are publicly readable" ON ingredients FOR SELECT USING (true);

-- Users can manage ingredients for their recipes
CREATE POLICY "Users can manage ingredients for own recipes" ON ingredients FOR ALL USING (
  EXISTS (
    SELECT 1 FROM recipes WHERE recipes.id = ingredients.recipe_id AND recipes.creator_id = auth.uid()
  )
);

-- Method steps are publicly readable
CREATE POLICY "Method steps are publicly readable" ON method_steps FOR SELECT USING (true);

-- Users can manage method steps for their recipes
CREATE POLICY "Users can manage method steps for own recipes" ON method_steps FOR ALL USING (
  EXISTS (
    SELECT 1 FROM recipes WHERE recipes.id = method_steps.recipe_id AND recipes.creator_id = auth.uid()
  )
);

-- Nutrition info is publicly readable
CREATE POLICY "Nutrition info is publicly readable" ON nutrition_info FOR SELECT USING (true);

-- Users can manage nutrition info for their recipes
CREATE POLICY "Users can manage nutrition info for own recipes" ON nutrition_info FOR ALL USING (
  EXISTS (
    SELECT 1 FROM recipes WHERE recipes.id = nutrition_info.recipe_id AND recipes.creator_id = auth.uid()
  )
);

-- Stories are publicly readable
CREATE POLICY "Stories are publicly readable" ON stories FOR SELECT USING (true);

-- Users can manage their own stories
CREATE POLICY "Users can manage own stories" ON stories FOR ALL USING (auth.uid() = user_id);

-- Comments are publicly readable
CREATE POLICY "Comments are publicly readable" ON comments FOR SELECT USING (true);

-- Users can create comments
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes are publicly readable
CREATE POLICY "Likes are publicly readable" ON likes FOR SELECT USING (true);

-- Users can manage their own likes
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Saves are publicly readable
CREATE POLICY "Saves are publicly readable" ON saves FOR SELECT USING (true);

-- Users can manage their own saves
CREATE POLICY "Users can manage own saves" ON saves FOR ALL USING (auth.uid() = user_id);

-- Follows are publicly readable
CREATE POLICY "Follows are publicly readable" ON follows FOR SELECT USING (true);

-- Users can manage their own follows
CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- Recipe views are publicly readable
CREATE POLICY "Recipe views are publicly readable" ON recipe_views FOR SELECT USING (true);

-- Users can create their own recipe views
CREATE POLICY "Users can create own recipe views" ON recipe_views FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for recipe media (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recipe-media', 'recipe-media', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Recipe media is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload recipe media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their recipe media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their recipe media" ON storage.objects;

-- Storage policies for recipe media
CREATE POLICY "Recipe media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-media');
CREATE POLICY "Users can upload recipe media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-media' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their recipe media" ON storage.objects FOR UPDATE USING (bucket_id = 'recipe-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their recipe media" ON storage.objects FOR DELETE USING (bucket_id = 'recipe-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ========================================
-- SEED DATA FOR MVP
-- ========================================

-- Insert sample users
INSERT INTO users (id, email, name, avatar_url, bio, cooking_level, cooking_level_title, followers_count, following_count, posts_count, location, interests, dietary_preferences, preferred_languages) VALUES
('11111111-1111-1111-1111-111111111111', 'priya@cookbook.com', 'Chef Priya', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', 'Passionate home chef from Mumbai', 85, 'Master Chef', 15420, 892, 156, 'Mumbai, India', ARRAY['Indian', 'Fusion'], ARRAY['Non-Vegetarian'], ARRAY['English', 'Hindi']),
('22222222-2222-2222-2222-222222222222', 'marco@cookbook.com', 'Marco Rossi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Italian chef passionate about authentic recipes', 90, 'Master Chef', 8920, 456, 89, 'Rome, Italy', ARRAY['Italian', 'Mediterranean'], ARRAY['Vegetarian'], ARRAY['English', 'Italian']),
('33333333-3333-3333-3333-333333333333', 'somchai@cookbook.com', 'Somchai Thai', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Thai chef bringing authentic flavors to your kitchen', 85, 'Master Chef', 9876, 234, 67, 'Bangkok, Thailand', ARRAY['Thai', 'Southeast Asian'], ARRAY['Vegetarian', 'Non-Vegetarian'], ARRAY['English', 'Thai']),
('44444444-4444-4444-4444-444444444444', 'marie@cookbook.com', 'Marie Dubois', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'French pastry chef with 20 years of experience', 95, 'Master Chef', 23400, 123, 234, 'Paris, France', ARRAY['French', 'Pastry', 'Baking'], ARRAY['Vegetarian'], ARRAY['English', 'French']),
('55555555-5555-5555-5555-555555555555', 'carlos@cookbook.com', 'Carlos Mendoza', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Mexican chef sharing authentic family recipes', 80, 'Expert Chef', 12340, 567, 89, 'Mexico City, Mexico', ARRAY['Mexican', 'Latin American'], ARRAY['Non-Vegetarian'], ARRAY['English', 'Spanish'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample recipes
INSERT INTO recipes (id, title, description, creator_id, image_url, video_url, teaser, likes_count, comments_count, saves_count, views_count, tags, cuisine, dietary_tags, prep_time, cook_time, total_time, servings, difficulty, language) VALUES
('11111111-1111-1111-1111-111111111111', 'Butter Chicken - The Ultimate Indian Classic', 'Creamy, rich, and perfectly spiced butter chicken that will transport you straight to India. This recipe features tender chicken in a luscious tomato-based gravy.', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'Learn the secret to making restaurant-style butter chicken at home!', 1247, 89, 456, 8923, ARRAY['Indian', 'Chicken', 'Creamy', 'Spicy'], 'Indian', ARRAY['Non-Vegetarian'], 20, 25, 45, 4, 'Medium', 'English'),
('22222222-2222-2222-2222-222222222222', 'Homemade Pizza Margherita', 'Learn to make authentic Italian pizza from scratch with this classic Margherita recipe. Perfect crispy crust, fresh mozzarella, and basil.', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 'Master the art of homemade pizza with this authentic Margherita recipe!', 892, 67, 234, 6541, ARRAY['Italian', 'Pizza', 'Vegetarian', 'Homemade'], 'Italian', ARRAY['Vegetarian'], 30, 30, 60, 2, 'Medium', 'English'),
('33333333-3333-3333-3333-333333333333', 'Spicy Thai Green Curry', 'Aromatic and flavorful Thai green curry with coconut milk, fresh vegetables, and your choice of protein. Perfect balance of heat and creaminess.', '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800', NULL, 'Experience authentic Thai flavors with this aromatic green curry!', 1567, 123, 567, 11234, ARRAY['Thai', 'Curry', 'Spicy', 'Coconut'], 'Thai', ARRAY['Vegetarian'], 15, 20, 35, 6, 'Easy', 'English'),
('44444444-4444-4444-4444-444444444444', 'Classic French Croissants', 'Flaky, buttery croissants that rival any Parisian bakery. This recipe takes time but delivers authentic French pastry perfection.', '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1555507036-ab1f40388010?w=800', NULL, 'Master the art of French pastry with these flaky, buttery croissants!', 2341, 156, 789, 15678, ARRAY['French', 'Pastry', 'Breakfast', 'Buttery'], 'French', ARRAY['Vegetarian'], 45, 25, 70, 8, 'Hard', 'English'),
('55555555-5555-5555-5555-555555555555', 'Mexican Street Tacos', 'Authentic Mexican street tacos with tender carne asada, fresh cilantro, onions, and lime. Simple yet incredibly flavorful.', '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', NULL, 'Bring the flavors of Mexico to your kitchen with these authentic street tacos!', 1892, 134, 445, 9876, ARRAY['Mexican', 'Tacos', 'Street Food', 'Beef'], 'Mexican', ARRAY['Non-Vegetarian'], 25, 15, 40, 6, 'Easy', 'English')
ON CONFLICT (id) DO NOTHING;

-- Insert sample ingredients for Butter Chicken
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
('11111111-1111-1111-1111-111111111111', 'Chicken Breast', 500, 'g'),
('11111111-1111-1111-1111-111111111111', 'Yogurt', 200, 'ml'),
('11111111-1111-1111-1111-111111111111', 'Garam Masala', 2, 'tsp'),
('11111111-1111-1111-1111-111111111111', 'Tomato Puree', 400, 'ml'),
('11111111-1111-1111-1111-111111111111', 'Heavy Cream', 200, 'ml'),
('11111111-1111-1111-1111-111111111111', 'Butter', 50, 'g')
ON CONFLICT DO NOTHING;

-- Insert sample method steps for Butter Chicken
INSERT INTO method_steps (recipe_id, step_number, description) VALUES
('11111111-1111-1111-1111-111111111111', 1, 'Marinate chicken in yogurt and spices for 2 hours'),
('11111111-1111-1111-1111-111111111111', 2, 'Grill chicken until charred and cooked through'),
('11111111-1111-1111-1111-111111111111', 3, 'Prepare tomato-based gravy with spices'),
('11111111-1111-1111-1111-111111111111', 4, 'Add grilled chicken and cream to gravy'),
('11111111-1111-1111-1111-111111111111', 5, 'Simmer for 10 minutes and finish with butter')
ON CONFLICT DO NOTHING;

-- Insert sample nutrition info for Butter Chicken
INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fat, fiber, sugar) VALUES
('11111111-1111-1111-1111-111111111111', 450, 35, 15, 28, 3, 8)
ON CONFLICT DO NOTHING;

-- Insert sample ingredients for Pizza Margherita
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
('22222222-2222-2222-2222-222222222222', 'All-Purpose Flour', 300, 'g'),
('22222222-2222-2222-2222-222222222222', 'Fresh Mozzarella', 200, 'g'),
('22222222-2222-2222-2222-222222222222', 'Fresh Basil', 20, 'g'),
('22222222-2222-2222-2222-222222222222', 'Tomato Sauce', 150, 'ml'),
('22222222-2222-2222-2222-222222222222', 'Olive Oil', 30, 'ml')
ON CONFLICT DO NOTHING;

-- Insert sample method steps for Pizza Margherita
INSERT INTO method_steps (recipe_id, step_number, description) VALUES
('22222222-2222-2222-2222-222222222222', 1, 'Prepare pizza dough and let it rise for 1 hour'),
('22222222-2222-2222-2222-222222222222', 2, 'Roll out dough and add tomato sauce'),
('22222222-2222-2222-2222-222222222222', 3, 'Add fresh mozzarella and basil'),
('22222222-2222-2222-2222-222222222222', 4, 'Bake at 450°F for 12-15 minutes until crispy')
ON CONFLICT DO NOTHING;

-- Insert sample nutrition info for Pizza Margherita
INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fat, fiber, sugar) VALUES
('22222222-2222-2222-2222-222222222222', 380, 18, 45, 16, 4, 6)
ON CONFLICT DO NOTHING;

-- Insert sample ingredients for Thai Green Curry
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
('33333333-3333-3333-3333-333333333333', 'Green Curry Paste', 3, 'tbsp'),
('33333333-3333-3333-3333-333333333333', 'Coconut Milk', 400, 'ml'),
('33333333-3333-3333-3333-333333333333', 'Mixed Vegetables', 300, 'g'),
('33333333-3333-3333-3333-333333333333', 'Fish Sauce', 2, 'tbsp'),
('33333333-3333-3333-3333-333333333333', 'Palm Sugar', 1, 'tbsp')
ON CONFLICT DO NOTHING;

-- Insert sample method steps for Thai Green Curry
INSERT INTO method_steps (recipe_id, step_number, description) VALUES
('33333333-3333-3333-3333-333333333333', 1, 'Fry green curry paste in oil until fragrant'),
('33333333-3333-3333-3333-333333333333', 2, 'Add coconut milk and bring to simmer'),
('33333333-3333-3333-3333-333333333333', 3, 'Add vegetables and cook until tender'),
('33333333-3333-3333-3333-333333333333', 4, 'Season with fish sauce and palm sugar'),
('33333333-3333-3333-3333-333333333333', 5, 'Serve hot with steamed rice')
ON CONFLICT DO NOTHING;

-- Insert sample nutrition info for Thai Green Curry
INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fat, fiber, sugar) VALUES
('33333333-3333-3333-3333-333333333333', 320, 12, 25, 22, 8, 6)
ON CONFLICT DO NOTHING;

-- Insert sample ingredients for French Croissants
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
('44444444-4444-4444-4444-444444444444', 'All-Purpose Flour', 500, 'g'),
('44444444-4444-4444-4444-444444444444', 'Butter', 300, 'g'),
('44444444-4444-4444-4444-444444444444', 'Active Dry Yeast', 7, 'g'),
('44444444-4444-4444-4444-444444444444', 'Milk', 250, 'ml'),
('44444444-4444-4444-4444-444444444444', 'Sugar', 50, 'g')
ON CONFLICT DO NOTHING;

-- Insert sample method steps for French Croissants
INSERT INTO method_steps (recipe_id, step_number, description) VALUES
('44444444-4444-4444-4444-444444444444', 1, 'Prepare dough and let it rise for 1 hour'),
('44444444-4444-4444-4444-444444444444', 2, 'Roll out dough and fold in butter layers'),
('44444444-4444-4444-4444-444444444444', 3, 'Chill and repeat folding process 3 times'),
('44444444-4444-4444-4444-444444444444', 4, 'Shape into croissants and let rise'),
('44444444-4444-4444-4444-444444444444', 5, 'Bake at 400°F for 15-20 minutes')
ON CONFLICT DO NOTHING;

-- Insert sample nutrition info for French Croissants
INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fat, fiber, sugar) VALUES
('44444444-4444-4444-4444-444444444444', 280, 6, 32, 16, 1, 4)
ON CONFLICT DO NOTHING;

-- Insert sample ingredients for Mexican Street Tacos
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
('55555555-5555-5555-5555-555555555555', 'Beef Flank Steak', 500, 'g'),
('55555555-5555-5555-5555-555555555555', 'Corn Tortillas', 12, 'pieces'),
('55555555-5555-5555-5555-555555555555', 'Fresh Cilantro', 50, 'g'),
('55555555-5555-5555-5555-555555555555', 'White Onion', 1, 'piece'),
('55555555-5555-5555-5555-555555555555', 'Lime', 3, 'pieces')
ON CONFLICT DO NOTHING;

-- Insert sample method steps for Mexican Street Tacos
INSERT INTO method_steps (recipe_id, step_number, description) VALUES
('55555555-5555-5555-5555-555555555555', 1, 'Marinate beef with lime, garlic, and spices'),
('55555555-5555-5555-5555-555555555555', 2, 'Grill beef to medium-rare and slice thinly'),
('55555555-5555-5555-5555-555555555555', 3, 'Warm corn tortillas on griddle'),
('55555555-5555-5555-5555-555555555555', 4, 'Assemble tacos with beef, onion, and cilantro'),
('55555555-5555-5555-5555-555555555555', 5, 'Serve with lime wedges and salsa')
ON CONFLICT DO NOTHING;

-- Insert sample nutrition info for Mexican Street Tacos
INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fat, fiber, sugar) VALUES
('55555555-5555-5555-5555-555555555555', 320, 28, 22, 18, 3, 2)
ON CONFLICT DO NOTHING;

-- Update user post counts
UPDATE users SET posts_count = 1 WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE users SET posts_count = 1 WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE users SET posts_count = 1 WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE users SET posts_count = 1 WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE users SET posts_count = 1 WHERE id = '55555555-5555-5555-5555-555555555555';

-- Insert some sample likes and saves to make the feed feel more engaging
INSERT INTO likes (user_id, recipe_id) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333'),
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

-- Insert some sample saves
INSERT INTO saves (user_id, recipe_id) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- Insert some sample comments
INSERT INTO comments (recipe_id, user_id, content) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'This looks absolutely delicious! Can''t wait to try it.'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Perfect pizza recipe! The crust looks amazing.'),
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Love Thai food! This curry looks perfect.'),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Beautiful croissants! French pastry at its best.'),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Authentic Mexican flavors! These tacos look amazing.')
ON CONFLICT DO NOTHING;

-- Update recipe engagement counts based on inserted data
UPDATE recipes SET likes_count = (SELECT COUNT(*) FROM likes WHERE recipe_id = recipes.id);
UPDATE recipes SET saves_count = (SELECT COUNT(*) FROM saves WHERE recipe_id = recipes.id);
UPDATE recipes SET comments_count = (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id);

-- Update user follower counts (create some sample follows)
INSERT INTO follows (follower_id, following_id) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- Update follower/following counts
UPDATE users SET followers_count = (SELECT COUNT(*) FROM follows WHERE following_id = users.id);
UPDATE users SET following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = users.id);

-- Insert some sample recipe views
INSERT INTO recipe_views (recipe_id, user_id) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111'),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- Update recipe view counts
UPDATE recipes SET views_count = (SELECT COUNT(*) FROM recipe_views WHERE recipe_id = recipes.id);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_recipe_counts();
DROP FUNCTION IF EXISTS update_user_counts();
DROP FUNCTION IF EXISTS update_post_counts();

-- Create a function to update recipe engagement counts automatically
CREATE OR REPLACE FUNCTION update_recipe_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'likes' THEN
    UPDATE recipes SET likes_count = (SELECT COUNT(*) FROM likes WHERE recipe_id = NEW.recipe_id) WHERE id = NEW.recipe_id;
  ELSIF TG_TABLE_NAME = 'saves' THEN
    UPDATE recipes SET saves_count = (SELECT COUNT(*) FROM saves WHERE recipe_id = NEW.recipe_id) WHERE id = NEW.recipe_id;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    UPDATE recipes SET comments_count = (SELECT COUNT(*) FROM comments WHERE recipe_id = NEW.recipe_id) WHERE id = NEW.recipe_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update user follower counts automatically
CREATE OR REPLACE FUNCTION update_user_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'follows' THEN
    UPDATE users SET followers_count = (SELECT COUNT(*) FROM follows WHERE following_id = NEW.following_id) WHERE id = NEW.following_id;
    UPDATE users SET following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = NEW.follower_id) WHERE id = NEW.follower_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update user post counts automatically
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'recipes' THEN
    UPDATE users SET posts_count = (SELECT COUNT(*) FROM recipes WHERE creator_id = NEW.creator_id) WHERE id = NEW.creator_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_likes_count ON likes;
DROP TRIGGER IF EXISTS update_saves_count ON saves;
DROP TRIGGER IF EXISTS update_comments_count ON comments;
DROP TRIGGER IF EXISTS update_follower_counts ON follows;
DROP TRIGGER IF EXISTS update_post_counts ON recipes;

-- Create triggers to automatically update counts
CREATE TRIGGER update_likes_count AFTER INSERT OR DELETE ON likes FOR EACH ROW EXECUTE FUNCTION update_recipe_counts();
CREATE TRIGGER update_saves_count AFTER INSERT OR DELETE ON saves FOR EACH ROW EXECUTE FUNCTION update_recipe_counts();
CREATE TRIGGER update_comments_count AFTER INSERT OR DELETE ON comments FOR EACH ROW EXECUTE FUNCTION update_recipe_counts();

-- Create trigger to automatically update follower counts
CREATE TRIGGER update_follower_counts AFTER INSERT OR DELETE ON follows FOR EACH ROW EXECUTE FUNCTION update_user_counts();

-- Create trigger to automatically update post counts
CREATE TRIGGER update_post_counts AFTER INSERT OR DELETE ON recipes FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Enable realtime for tables that need it
ALTER PUBLICATION supabase_realtime ADD TABLE recipes, users, likes, saves, comments;
