import { useState, useEffect } from 'react'
import { supabase, supabaseHelpers } from '../lib/supabase'
import { Recipe, User, Story } from '../types'
import { sampleRecipes } from '../data/sampleRecipes'

export const useSupabaseData = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch recipes from Supabase
  const fetchRecipes = async (limit = 20, offset = 0) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          creator:users(id, name, avatar_url, cooking_level_title),
          ingredients:ingredients(*),
          method_steps:method_steps(*)
        `)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })
        .eq('is_published', true)
      
      if (error) throw error
      
      // Transform data to match Recipe interface
      const transformedRecipes = data?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        creator: {
          id: recipe.creator?.id || 'unknown',
          name: recipe.creator?.name || 'Unknown Chef',
          email: `${recipe.creator?.name?.toLowerCase().replace(/\s+/g, '.')}@example.com` || 'unknown@example.com',
          avatar: recipe.creator?.avatar_url || '',
          bio: `Professional chef specializing in ${recipe.cuisine || 'international'} cuisine`,
          cookingLevel: 5,
          cookingLevelTitle: recipe.creator?.cooking_level_title || 'Expert',
          badges: [],
          followers: Math.floor(Math.random() * 1000) + 100,
          following: Math.floor(Math.random() * 500) + 50,
          posts: Math.floor(Math.random() * 100) + 10,
          savedRecipes: [],
          interests: recipe.tags || [],
          dietaryPreferences: ['Vegetarian', 'Non-Vegetarian'],
          preferredLanguages: ['English'],
          location: 'India',
          isRestaurant: false
        },
        image: recipe.image_url || '',
        video: recipe.video_url,
        teaser: recipe.description?.substring(0, 100) || '',
        likes: recipe.likes_count || 0,
        comments: recipe.comments_count || 0,
        saves: recipe.saves_count || 0,
        isSaved: false,
        isLiked: false,
        tags: recipe.tags || [],
        cuisine: recipe.cuisine || 'International',
        dietaryTags: (recipe.tags || []).filter((tag: string) => ['Vegetarian', 'Vegan', 'Gluten-Free'].includes(tag)),
        prepTime: recipe.prep_time || 0,
        cookTime: recipe.cook_time || 0,
        totalTime: (recipe.prep_time || 0) + (recipe.cook_time || 0),
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || 'Easy',
        ingredients: recipe.ingredients?.map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          amount: 1,
          unit: 'piece',
          price: 0,
          suppliers: [],
          isAvailable: true,
          userHas: false
        })) || [],
        method: recipe.method_steps?.map((step: any) => ({
          id: step.id,
          stepNumber: step.step_number,
          description: step.description,
          image: undefined,
          time: 0,
          tips: undefined
        })) || [],
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0
        },
        language: recipe.language || 'English',
        translations: {},
        createdAt: new Date(recipe.created_at),
        views: recipe.views_count || 0,
        cookingTime: (recipe.prep_time || 0) + (recipe.cook_time || 0)
      })) || []
      
      setRecipes(transformedRecipes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
      console.error('Error fetching recipes:', err)
      // Fallback to sample data if Supabase fails
      setRecipes(sampleRecipes.slice(offset, offset + limit).map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        creator: recipe.creator,
        image: recipe.image,
        video: recipe.video,
        teaser: recipe.description.substring(0, 100),
        likes: recipe.likes,
        comments: recipe.comments,
        saves: recipe.saves,
        isSaved: false,
        isLiked: false,
        tags: recipe.tags,
        cuisine: recipe.cuisine,
        dietaryTags: recipe.tags.filter(tag => ['Vegetarian', 'Vegan', 'Gluten-Free'].includes(tag)),
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        totalTime: recipe.prepTime + recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients,
        method: recipe.method,
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0
        },
        language: 'English',
        translations: {},
        createdAt: new Date(),
        views: recipe.views,
        cookingTime: recipe.cookingTime
      })))
    } finally {
      setLoading(false)
    }
  }

  // Fetch stories from Supabase
  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          creator:users(id, name, avatar_url, cooking_level_title)
        `)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      
      // Transform data to match Story interface
      const transformedStories = data?.map(story => ({
        id: story.id,
        user: {
          id: story.creator?.id || 'unknown',
          name: story.creator?.name || 'Unknown Chef',
          email: `${story.creator?.name?.toLowerCase().replace(/\s+/g, '.')}@example.com` || 'unknown@example.com',
          avatar: story.creator?.avatar_url || '',
          bio: `Professional chef specializing in ${story.cuisine || 'international'} cuisine`,
          cookingLevel: 5,
          cookingLevelTitle: story.creator?.cooking_level_title || 'Expert',
          badges: [],
          followers: Math.floor(Math.random() * 1000) + 100,
          following: Math.floor(Math.random() * 500) + 50,
          posts: Math.floor(Math.random() * 100) + 10,
          savedRecipes: [],
          interests: [],
          dietaryPreferences: ['Vegetarian', 'Non-Vegetarian'],
          preferredLanguages: ['English'],
          location: 'India',
          isRestaurant: false
        },
        image: story.image_url || '',
        video: story.video_url,
        caption: story.description || '',
        createdAt: new Date(story.created_at),
        views: story.views_count || 0,
        isViewed: false
      })) || []
      
      setStories(transformedStories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories')
      console.error('Error fetching stories:', err)
      // Fallback to empty array if Supabase fails
      setStories([])
    }
  }

  // Toggle like for a recipe
  const toggleLike = async (recipeId: string, userId: string) => {
    try {
      const result = await supabaseHelpers.toggleLike(recipeId, userId)
      
      // Update local state
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.id === recipeId 
            ? { 
                ...recipe, 
                likes: result.liked ? recipe.likes + 1 : recipe.likes - 1,
                isLiked: result.liked
              }
            : recipe
        )
      )
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like')
      console.error('Error toggling like:', err)
      throw err
    }
  }

  // Toggle save for a recipe
  const toggleSave = async (recipeId: string, userId: string) => {
    try {
      const result = await supabaseHelpers.toggleSave(recipeId, userId)
      
      // Update local state
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.id === recipeId 
            ? { 
                ...recipe, 
                saves: result.saved ? recipe.saves + 1 : recipe.saves - 1,
                isSaved: result.saved
              }
            : recipe
        )
      )
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle save')
      console.error('Error toggling save:', err)
      throw err
    }
  }

  // Search recipes
  const searchRecipes = async (query: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          creator:users(*),
          ingredients:ingredients(*)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search recipes')
      console.error('Error searching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter recipes by cuisine
  const filterRecipesByCuisine = async (cuisine: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          creator:users(*),
          ingredients:ingredients(*)
        `)
        .eq('cuisine', cuisine)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter recipes')
      console.error('Error filtering recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get user profile
  const getUserProfile = async (userId: string) => {
    try {
      const data = await supabaseHelpers.getUser(userId)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
      console.error('Error fetching user profile:', err)
      throw err
    }
  }

  // Fetch initial data when hook is initialized
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        await Promise.all([
          fetchRecipes(),
          fetchStories()
        ])
      } catch (err) {
        console.error('Error initializing data:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, []) // Empty dependency array means this runs once on mount

  return {
    // Data
    recipes,
    stories,
    
    // State
    loading,
    error,
    
    // Actions
    fetchRecipes,
    fetchStories,
    toggleLike,
    toggleSave,
    searchRecipes,
    filterRecipesByCuisine,
    getUserProfile,
    
    // Utilities
    refreshData: () => {
      fetchRecipes()
      fetchStories()
    }
  }
}
