-- CookBook App Database Schema - MVP Version
-- Run this in your Supabase SQL Editor

-- Note: This schema creates all tables and relationships for the CookBook MVP
-- RLS policies are set up to allow public read access and user-specific modifications

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
  views_count INTEGER DEFAULT 0
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- MVP: Analytics Events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MVP: Reports table for moderation
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MVP: Blocked Users table
CREATE TABLE blocked_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

-- MVP: Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_recipes_creator_id ON recipes(creator_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX idx_saves_user_id ON saves(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- RLS Policies (Development Mode - Allow All)
-- TODO: Update these policies for production

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can delete own data" ON users FOR DELETE USING (true);

-- Recipes table policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipes are viewable by everyone" ON recipes FOR SELECT USING (true);
CREATE POLICY "Users can insert recipes" ON recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (true);
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (true);

-- Comments table policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (true);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (true);

-- Likes table policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert likes" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (true);

-- Saves table policies
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Saves are viewable by owner" ON saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saves" ON saves FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own saves" ON saves FOR DELETE USING (true);

-- Follows table policies
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can insert follows" ON follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own follows" ON follows FOR DELETE USING (true);

-- Analytics events policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics events are insertable by everyone" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Analytics events are viewable by admins only" ON analytics_events FOR SELECT USING (false);

-- Reports policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- Blocked users policies
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own blocks" ON blocked_users FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Sample data for testing
INSERT INTO users (id, email, name, avatar_url, bio, interests, dietary_preferences) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'chef.priya@example.com', 'Chef Priya', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Passionate home chef sharing authentic Indian recipes', ARRAY['Indian', 'Vegetarian', 'Spicy'], ARRAY['Vegetarian']),
('550e8400-e29b-41d4-a716-446655440002', 'marco.pizza@example.com', 'Pizza Master Marco', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Italian pizza enthusiast and dough master', ARRAY['Italian', 'Pizza', 'Dough'], ARRAY['Non-Vegetarian']),
('550e8400-e29b-41d4-a716-446655440003', 'sarah.health@example.com', 'Health Coach Sarah', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Creating healthy, delicious meals for busy lifestyles', ARRAY['Healthy', 'Meal Prep', 'Quick'], ARRAY['Vegetarian', 'Gluten-Free']);

INSERT INTO recipes (id, title, description, creator_id, image_url, teaser, cuisine, difficulty, prep_time, cook_time, servings, tags) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Spicy Paneer Tikka', 'A delicious vegetarian appetizer with marinated paneer cubes grilled to perfection', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 'Crispy, spicy paneer tikka that will make you forget meat!', 'Indian', 'Medium', 30, 20, 4, ARRAY['Vegetarian', 'Appetizer', 'Spicy', 'Paneer']),
('660e8400-e29b-41d4-a716-446655440002', 'Classic Margherita Pizza', 'Authentic Neapolitan-style pizza with fresh mozzarella and basil', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 'The perfect pizza - simple, classic, and absolutely delicious', 'Italian', 'Hard', 45, 15, 2, ARRAY['Pizza', 'Italian', 'Cheese', 'Basil']),
('660e8400-e29b-41d4-a716-446655440003', 'Quinoa Buddha Bowl', 'Nutritious and colorful bowl packed with protein and vegetables', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 'A healthy, protein-rich meal that looks as good as it tastes', 'International', 'Easy', 20, 25, 1, ARRAY['Healthy', 'Quinoa', 'Vegetarian', 'Protein']);

-- Sample ingredients
INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Paneer', 200, 'g'),
('660e8400-e29b-41d4-a716-446655440001', 'Yogurt', 100, 'ml'),
('660e8400-e29b-41d4-a716-446655440001', 'Garam Masala', 1, 'tsp'),
('660e8400-e29b-41d4-a716-446655440002', 'Pizza Dough', 250, 'g'),
('660e8400-e29b-41d4-a716-446655440002', 'Fresh Mozzarella', 150, 'g'),
('660e8400-e29b-41d4-a716-446655440002', 'Fresh Basil', 10, 'leaves'),
('660e8400-e29b-41d4-a716-446655440003', 'Quinoa', 100, 'g'),
('660e8400-e29b-41d4-a716-446655440003', 'Chickpeas', 100, 'g'),
('660e8400-e29b-41d4-a716-446655440003', 'Cherry Tomatoes', 150, 'g');

-- Sample method steps
INSERT INTO method_steps (recipe_id, step_number, description, time) VALUES
('660e8400-e29b-41d4-a716-446655440001', 1, 'Cut paneer into 1-inch cubes', 5),
('660e8400-e29b-41d4-a716-446655440001', 2, 'Mix yogurt with spices to make marinade', 10),
('660e8400-e29b-41d4-a716-446655440001', 3, 'Marinate paneer for 30 minutes', 30),
('660e8400-e29b-41d4-a716-446655440001', 4, 'Grill until golden brown', 20),
('660e8400-e29b-41d4-a716-446655440002', 1, 'Preheat oven to 500°F (260°C)', 15),
('660e8400-e29b-41d4-a716-446655440002', 2, 'Stretch dough into 12-inch circle', 10),
('660e8400-e29b-41d4-a716-446655440002', 3, 'Add toppings and bake for 12-15 minutes', 15),
('660e8400-e29b-41d4-a716-446655440003', 1, 'Cook quinoa according to package instructions', 20),
('660e8400-e29b-41d4-a716-446655440003', 2, 'Assemble bowl with quinoa, vegetables, and protein', 5);

-- Sample comments
INSERT INTO comments (recipe_id, user_id, text) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'This looks amazing! I love paneer tikka.'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Great recipe! I added some extra chili powder.'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Perfect pizza! The crust looks so crispy.'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Healthy and delicious! Perfect for meal prep.');

-- Sample likes
INSERT INTO likes (user_id, recipe_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003');

-- Sample follows
INSERT INTO follows (follower_id, following_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');

-- Update counts
UPDATE recipes SET 
  likes_count = (SELECT COUNT(*) FROM likes WHERE recipe_id = recipes.id),
  comments_count = (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id);

UPDATE users SET 
  followers_count = (SELECT COUNT(*) FROM follows WHERE following_id = users.id),
  following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = users.id),
  posts_count = (SELECT COUNT(*) FROM recipes WHERE creator_id = users.id);
