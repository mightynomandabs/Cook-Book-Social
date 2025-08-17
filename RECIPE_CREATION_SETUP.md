# Recipe Creation Feature Setup Guide

## Overview
The recipe creation feature allows users to create and publish recipes with photos/videos, ingredients, method steps, and metadata. It integrates with Supabase for data storage and file uploads.

## Features
- 📸 Photo/Video upload with preview
- 🏷️ Custom tags and suggested tags
- 📝 Detailed recipe information (title, description, cuisine, difficulty, timing)
- 🥘 Dynamic ingredients list management
- 📋 Step-by-step method instructions
- 👀 Live recipe preview
- 🚀 One-click publishing to Supabase

## Setup Instructions

### 1. Supabase Database Setup
Run the database schema from `database-schema.sql` in your Supabase SQL Editor to create the necessary tables:
- `recipes` - Main recipe data
- `ingredients` - Recipe ingredients
- `method_steps` - Cooking method steps

### 2. Supabase Storage Setup
Run the storage setup script from `supabase-storage-setup.sql` to create:
- `recipe-media` storage bucket for photos/videos
- Storage policies for secure file access
- File size limits (100MB) and allowed MIME types

### 3. Environment Configuration
Ensure your Supabase credentials are properly configured in `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

### 4. Component Integration
The `RecipeCreate` component is already integrated into the app routing at `/create` and accessible via the bottom navigation's Create button.

## Usage Flow

### Creating a Recipe
1. **Media Upload**: Upload a photo or video of the dish
2. **Basic Info**: Fill in title, description, cuisine, difficulty, timing
3. **Tags**: Add custom tags or use suggested tags
4. **Ingredients**: Add ingredients one by one
5. **Method**: Add cooking steps sequentially
6. **Preview**: Review the complete recipe
7. **Publish**: Save to Supabase and share with the community

### Form Validation
- Title is required
- At least one ingredient is required
- At least one method step is required
- Media upload is required
- All fields are validated before publishing

## Database Schema

### Recipes Table
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id),
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  cuisine VARCHAR(100),
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  servings INTEGER,
  difficulty VARCHAR(50),
  language VARCHAR(50),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Ingredients Table
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id),
  name VARCHAR(255) NOT NULL,
  step_number INTEGER
);
```

### Method Steps Table
```sql
CREATE TABLE method_steps (
  id UUID PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id),
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL
);
```

## Storage Structure
```
recipe-media/
├── recipe_1234567890_abc123.jpg
├── recipe_1234567890_def456.mp4
└── ...
```

## Future Enhancements
- [ ] Voice input for ingredients and method
- [ ] AI-powered recipe suggestions
- [ ] Multi-language support
- [ ] Recipe templates
- [ ] Social sharing features
- [ ] Recipe versioning
- [ ] Ingredient substitution suggestions

## Troubleshooting

### Common Issues
1. **Media Upload Fails**: Check storage bucket permissions and file size limits
2. **Database Errors**: Verify table structure and RLS policies
3. **Component Not Loading**: Check routing configuration and imports

### Debug Mode
Enable console logging to see detailed error messages during recipe creation and publishing.

## Security Considerations
- File upload validation (MIME types, file size)
- SQL injection prevention via Supabase client
- Row Level Security (RLS) policies for data access
- User authentication integration (TODO)

## Performance Notes
- Media files are optimized for web delivery
- Database queries use proper indexing
- Component state management for smooth UX
- Lazy loading for large recipe lists
