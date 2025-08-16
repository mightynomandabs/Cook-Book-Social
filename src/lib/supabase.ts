import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxkllgtahdbrkkgphqql.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4a2xsZ3RhaGRicmtrZ3BocXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjMyOTEsImV4cCI6MjA3MDgzOTI5MX0.JAXxsK2Jqb7gRqDfny7ZVCDw5LBeTr_gqdfnjGGBSf8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  RECIPES: 'recipes',
  INGREDIENTS: 'ingredients',
  STORIES: 'stories',
  COMMENTS: 'comments',
  LIKES: 'likes',
  SAVES: 'saves',
  GROUPS: 'groups',
  CONTESTS: 'contests',
  RESTAURANTS: 'restaurants',
  PANTRY_ITEMS: 'pantry_items',
  MEAL_PLANS: 'meal_plans',
  NOTIFICATIONS: 'notifications',
  SUPPLIERS: 'suppliers',
  SHOPPING_CART: 'shopping_cart',
  CART_ITEMS: 'cart_items'
} as const

// Helper functions for common operations
export const supabaseHelpers = {
  // User operations
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Recipe operations
  async getRecipes(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from(TABLES.RECIPES)
      .select(`
        *,
        creator:users(*),
        ingredients:ingredients(*)
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Story operations
  async getStories() {
    const { data, error } = await supabase
      .from(TABLES.STORIES)
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  // Like/Save operations
  async toggleLike(recipeId: string, userId: string) {
    const { data: existingLike } = await supabase
      .from(TABLES.LIKES)
      .select('*')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from(TABLES.LIKES)
        .delete()
        .eq('id', existingLike.id)
      
      if (error) throw error
      return { liked: false }
    } else {
      // Like
      const { error } = await supabase
        .from(TABLES.LIKES)
        .insert({
          recipe_id: recipeId,
          user_id: userId
        })
      
      if (error) throw error
      return { liked: true }
    }
  },

  async toggleSave(recipeId: string, userId: string) {
    const { data: existingSave } = await supabase
      .from(TABLES.SAVES)
      .select('*')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .single()

    if (existingSave) {
      // Unsave
      const { error } = await supabase
        .from(TABLES.SAVES)
        .delete()
        .eq('id', existingSave.id)
      
      if (error) throw error
      return { saved: false }
    } else {
      // Save
      const { error } = await supabase
        .from(TABLES.SAVES)
        .insert({
          recipe_id: recipeId,
          user_id: userId
        })
      
      if (error) throw error
      return { saved: true }
    }
  }
}
