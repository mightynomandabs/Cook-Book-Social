# CookBook MVP - Recipe Discovery & Creation App

## 🎯 Overview

CookBook is a React + TypeScript + Supabase social food app that has been refactored for MVP to focus on three core priorities:

1. **Main Feed** - TikTok-style vertical scroll of recipes (highest priority)
2. **Streamlined Recipe Creation** - 3-step stepper interface
3. **Simplified Profile Page** - Essential features only

## ✨ Key Features

### 🍳 Main Feed (KitchenFeed.tsx)
- **TikTok-style vertical scrolling** with smooth navigation
- **10 sample recipes** from diverse cuisines (Indian, Italian, Thai, French, Mexican, Japanese, Mediterranean, Korean, American, Moroccan)
- **Search functionality** across recipes, cuisines, and tags
- **Recipe cards** showing:
  - Creator avatar and name
  - Recipe media (image/video)
  - Caption/teaser text
  - Like, comment, and save counts
  - Action buttons (like, comment, save, share)
- **Navigation dots** for quick recipe jumping
- **Progress bar** showing feed position
- **Tap to view** recipe details

### 📝 Recipe Creation (RecipeCreate.tsx)
- **3-step stepper interface**:
  1. **Details**: Title, cuisine, difficulty, prep/cook time, description, tags
  2. **Ingredients**: Smart suggestions with common ingredients
  3. **Steps & Media**: Method steps and recipe media upload
- **Progress indicator** with visual feedback
- **Field validation** before advancing steps
- **Smart ingredient suggestions** (typeahead functionality)
- **Media upload** support for images and videos
- **Responsive design** with mobile-first approach

### 👤 Profile Page (Profile.tsx)
- **Essential information only**:
  - Profile picture and name
  - Bio and location
  - Follower/Following counts
  - Grid of posted recipes
- **Removed advanced features**:
  - Cooking level and achievements
  - Foodie resume
  - Creator tools
  - Saved recipes tab
- **Clean, minimal UI** focused on core functionality

### 🔍 Recipe Detail View (RecipeDetail.tsx)
- **Comprehensive recipe information**:
  - Full recipe media (image/video)
  - Creator details
  - Recipe stats (likes, comments, saves, views)
  - Cooking time, servings, difficulty
  - Tags and description
  - Ingredients list
  - Method steps
  - Nutrition information
- **Interactive elements**:
  - Like and save functionality
  - Share recipe
  - Create similar recipe button

## 🛠️ Technical Implementation

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router** for navigation

### Database Schema (Supabase)
- **Users table** with essential profile information
- **Recipes table** with comprehensive recipe data
- **Ingredients table** for recipe ingredients
- **Method steps table** for cooking instructions
- **Nutrition info table** for dietary information
- **Engagement tables** (likes, saves, comments, follows)
- **Row Level Security (RLS)** policies for data protection

### Sample Data
- **10 diverse recipes** from different cuisines
- **5 sample users** with realistic profiles
- **Complete recipe data** including ingredients, methods, and nutrition
- **Engagement data** (likes, saves, comments) for realistic feel

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase environment variables
4. Run the database schema: `database-schema.sql`
5. Start the development server: `npm start`

### Environment Variables
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 User Experience

### Feed Navigation
- **Vertical scroll** with mouse wheel or touch gestures
- **Navigation dots** for quick recipe jumping
- **Progress bar** showing current position
- **Search bar** for filtering recipes

### Recipe Creation Flow
- **Step-by-step guidance** with clear progress indication
- **Validation feedback** before proceeding
- **Smart suggestions** for common ingredients
- **Media upload** with preview

### Profile Management
- **Clean interface** focused on essential information
- **Recipe grid** showing user's posts
- **Floating action button** for quick recipe creation

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#f97316) for main actions and highlights
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Red for likes, green for saves

### Typography
- **Headings**: Bold, large text for hierarchy
- **Body**: Regular weight for readability
- **Captions**: Smaller text for secondary information

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean inputs with focus states
- **Navigation**: Intuitive icons and labels

## 🔒 Security & Performance

### Security
- **Row Level Security (RLS)** on all tables
- **User authentication** required for modifications
- **Public read access** for recipe discovery
- **User-specific permissions** for content management

### Performance
- **Optimized images** with proper sizing
- **Lazy loading** for recipe media
- **Efficient database queries** with proper indexing
- **Responsive design** for all screen sizes

## 📊 Database Structure

### Core Tables
- `users` - User profiles and statistics
- `recipes` - Recipe information and metadata
- `ingredients` - Recipe ingredients with amounts
- `method_steps` - Cooking instructions
- `nutrition_info` - Dietary information

### Engagement Tables
- `likes` - User recipe likes
- `saves` - User recipe saves
- `comments` - User recipe comments
- `follows` - User relationships
- `recipe_views` - Recipe view tracking

### Storage
- **Recipe media bucket** for images and videos
- **Public access** for recipe discovery
- **User-specific permissions** for uploads

## 🚧 Future Enhancements

### Phase 2 Features
- **Advanced search** with filters and sorting
- **Recipe recommendations** based on user preferences
- **Social features** like following and notifications
- **Recipe collections** and meal planning

### Phase 3 Features
- **Creator tools** and analytics
- **Monetization** features
- **Multi-language support**
- **Advanced nutrition tracking**

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement responsive design
- Add proper error handling
- Include loading states

### Code Quality
- ESLint configuration for code consistency
- Prettier for code formatting
- TypeScript strict mode enabled
- Component prop validation

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Unsplash** for recipe images
- **Supabase** for backend infrastructure
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons

---

**Built with ❤️ for food lovers and creators**
