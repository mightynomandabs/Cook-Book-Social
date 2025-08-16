# 🚀 **CookBook App - Supabase Integration Guide**

## **📋 Overview**
This guide will help you set up Supabase as the backend for your CookBook app, replacing mock data with a real database and enabling features like user authentication, real-time updates, and data persistence.

---

## **🔧 Setup Steps**

### **1. Database Schema Setup**
1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to SQL Editor** in your project
3. **Copy and paste** the contents of `database-schema.sql`
4. **Run the SQL script** to create all tables and relationships

### **2. Environment Configuration**
The Supabase configuration is already set up in `src/lib/supabase.ts` with your credentials:
- **URL**: `https://cxkllgtahdbrkkgphqql.supabase.co`
- **Anon Key**: Already configured

### **3. Data Migration**
1. **Navigate to** `/database-setup` in your app
2. **Click "Check Data"** to see current database status
3. **Click "Run Migration"** to import sample data
4. **Monitor the console** for migration logs

---

## **🗄️ Database Schema**

### **Core Tables**
- **`users`** - User profiles and preferences
- **`recipes`** - Recipe information and metadata
- **`ingredients`** - Recipe ingredients with pricing
- **`method_steps`** - Step-by-step cooking instructions
- **`nutrition_info`** - Nutritional breakdown
- **`stories`** - User stories and content
- **`likes`** - User likes on recipes
- **`saves`** - User saved recipes
- **`comments`** - Recipe comments
- **`groups`** - Food communities
- **`contests`** - Cooking competitions
- **`restaurants`** - Restaurant profiles
- **`pantry_items`** - User pantry management
- **`meal_plans`** - Weekly meal planning
- **`notifications`** - User notifications
- **`suppliers`** - Quick commerce partners
- **`shopping_cart`** - Shopping cart management

### **Key Features**
- **Row Level Security (RLS)** enabled for data protection
- **Automatic timestamps** for created_at/updated_at
- **Foreign key relationships** for data integrity
- **Indexes** for optimal query performance
- **JSONB fields** for flexible data storage

---

## **🔌 Integration Points**

### **1. Supabase Client**
```typescript
import { supabase, supabaseHelpers } from '../lib/supabase'

// Basic operations
const recipes = await supabaseHelpers.getRecipes()
const user = await supabaseHelpers.getUser(userId)
```

### **2. Custom Hook**
```typescript
import { useSupabaseData } from '../hooks/useSupabaseData'

const { recipes, loading, toggleLike, searchRecipes } = useSupabaseData()
```

### **3. Real-time Subscriptions**
```typescript
// Subscribe to recipe updates
const subscription = supabase
  .channel('recipes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'recipes' },
    (payload) => console.log('Recipe changed:', payload)
  )
  .subscribe()
```

---

## **📱 Component Updates**

### **Current Status**
- ✅ **DatabaseSetup** - Setup and migration component
- ✅ **Supabase client** - Configuration and helpers
- ✅ **Data migration service** - Sample data import
- ✅ **Custom hook** - Data management hook

### **Next Steps**
1. **Update KitchenFeed** to use `useSupabaseData`
2. **Update RecipeFeed** to fetch from Supabase
3. **Update FeaturedStories** to use real data
4. **Add authentication** to user flows
5. **Implement real-time updates**

---

## **🔐 Authentication Setup**

### **Enable Auth in Supabase**
1. Go to **Authentication > Settings**
2. Enable **Email confirmations** if needed
3. Configure **OAuth providers** (Google, GitHub)
4. Set up **email templates**

### **Auth Integration**
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()
```

---

## **🚀 Advanced Features**

### **1. Real-time Updates**
- **Live recipe updates** when users like/save
- **Real-time notifications** for social interactions
- **Live chat** in community groups
- **Live cooking sessions** with real-time comments

### **2. File Storage**
- **Recipe images** stored in Supabase Storage
- **Video uploads** for recipe demonstrations
- **User avatars** and profile pictures
- **Restaurant logos** and cover images

### **3. Edge Functions**
- **Image processing** and optimization
- **AI-powered** ingredient detection
- **Recipe recommendations** based on preferences
- **Automated notifications** and reminders

---

## **📊 Monitoring & Analytics**

### **Supabase Dashboard**
- **Database performance** metrics
- **API usage** and rate limits
- **Error logs** and debugging
- **User analytics** and insights

### **Custom Analytics**
- **Recipe engagement** tracking
- **User behavior** analysis
- **Content performance** metrics
- **Conversion tracking** for shopping

---

## **🛠️ Development Workflow**

### **Local Development**
1. **Start the app**: `npm start`
2. **Navigate to** `/database-setup`
3. **Run migrations** to populate data
4. **Test components** with real data
5. **Monitor console** for errors

### **Testing**
- **Unit tests** for data services
- **Integration tests** for Supabase operations
- **E2E tests** for user workflows
- **Performance tests** for database queries

---

## **🚨 Troubleshooting**

### **Common Issues**
1. **Connection errors** - Check Supabase URL and key
2. **RLS policy errors** - Verify table permissions
3. **Migration failures** - Check console for detailed errors
4. **Type mismatches** - Ensure TypeScript interfaces match schema

### **Debug Tools**
- **Supabase Dashboard** - Real-time logs
- **Browser Console** - Client-side errors
- **Network Tab** - API request/response inspection
- **Database Inspector** - Table structure verification

---

## **📚 Resources**

### **Documentation**
- [Supabase Docs](https://supabase.com/docs)
- [React Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [TypeScript Guide](https://supabase.com/docs/guides/api/typescript-support)

### **Examples**
- [Real-time Chat](https://supabase.com/docs/guides/realtime/tutorials/chat-app)
- [File Uploads](https://supabase.com/docs/guides/storage/upload)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## **🎯 Next Steps**

1. **Complete database setup** using the migration tool
2. **Update components** to use Supabase data
3. **Implement authentication** flows
4. **Add real-time features** for social interactions
5. **Set up file storage** for media uploads
6. **Deploy to production** with proper environment variables

---

**Happy coding! 🍽️✨**
