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
      // For now, use sample data instead of Supabase
      // const data = await supabaseHelpers.getRecipes(limit, offset)
      const data = sampleRecipes.slice(offset, offset + limit).map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        creator: {
          id: recipe.creator.name.toLowerCase().replace(/\s+/g, '-'),
          name: recipe.creator.name,
          email: `${recipe.creator.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          avatar: recipe.creator.avatar || '',
          bio: `Professional chef specializing in ${recipe.tags[0] || 'international'} cuisine`,
          cookingLevel: 5,
          cookingLevelTitle: 'Expert',
          badges: [],
          followers: Math.floor(Math.random() * 1000) + 100,
          following: Math.floor(Math.random() * 500) + 50,
          posts: Math.floor(Math.random() * 100) + 10,
          savedRecipes: [],
          interests: recipe.tags,
          dietaryPreferences: ['Vegetarian', 'Non-Vegetarian'],
          preferredLanguages: ['English'],
          location: 'India',
          isRestaurant: false
        },
        image: recipe.image || '',
        video: undefined,
        teaser: recipe.description.substring(0, 100),
        likes: recipe.likes,
        comments: 0,
        saves: 0,
        isSaved: false,
        isLiked: false,
        tags: recipe.tags,
        cuisine: recipe.tags[0] || 'International',
        dietaryTags: recipe.tags.filter(tag => ['Vegetarian', 'Vegan', 'Gluten-Free'].includes(tag)),
        prepTime: Math.floor(recipe.cookingTime * 0.6),
        cookTime: Math.floor(recipe.cookingTime * 0.4),
        totalTime: recipe.cookingTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        ingredients: [],
        method: [],
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
      })) as Recipe[]
      setRecipes(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stories from Supabase
  const fetchStories = async () => {
    try {
      setLoading(true)
      const data = await supabaseHelpers.getStories()
      setStories(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories')
      console.error('Error fetching stories:', err)
    } finally {
      setLoading(false)
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

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchRecipes(),
          fetchStories()
        ])
      } catch (err) {
        console.error('Error initializing data:', err)
      }
    }

    initializeData()
  }, [])

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
