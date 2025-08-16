import { useState, useEffect } from 'react'
import { supabase, supabaseHelpers } from '../lib/supabase'
import { Recipe, User, Story } from '../types'

export const useSupabaseData = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch recipes from Supabase
  const fetchRecipes = async (limit = 20, offset = 0) => {
    try {
      setLoading(true)
      const data = await supabaseHelpers.getRecipes(limit, offset)
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
