import { supabase, TABLES } from '../lib/supabase'
import { sampleUser, sampleRecipes, sampleStories, sampleSuppliers } from '../data/sampleRecipe'

export class DataMigrationService {
  // Migrate sample users
  static async migrateUsers() {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([
          {
            id: sampleUser.id,
            email: sampleUser.email,
            name: sampleUser.name,
            avatar_url: sampleUser.avatar,
            bio: sampleUser.bio,
            cooking_level: sampleUser.cookingLevel,
            cooking_level_title: sampleUser.cookingLevelTitle,
            followers_count: sampleUser.followers,
            following_count: sampleUser.following,
            posts_count: sampleUser.posts,
            interests: sampleUser.interests,
            dietary_preferences: sampleUser.dietaryPreferences,
            preferred_languages: sampleUser.preferredLanguages,
            location: sampleUser.location,
            is_restaurant: sampleUser.isRestaurant
          }
        ])
        .select()

      if (error) throw error
      console.log('Users migrated successfully:', data)
      return data
    } catch (error) {
      console.error('Error migrating users:', error)
      throw error
    }
  }

  // Migrate sample recipes
  static async migrateRecipes() {
    try {
      const recipesToInsert = sampleRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        creator_id: recipe.creator.id,
        image_url: recipe.image,
        video_url: recipe.video,
        teaser: recipe.teaser,
        likes_count: recipe.likes,
        comments_count: recipe.comments,
        saves_count: recipe.saves,
        tags: recipe.tags,
        cuisine: recipe.cuisine,
        dietary_tags: recipe.dietaryTags,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        total_time: recipe.totalTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        language: recipe.language,
        translations: recipe.translations
      }))

      const { data, error } = await supabase
        .from(TABLES.RECIPES)
        .insert(recipesToInsert)
        .select()

      if (error) throw error
      console.log('Recipes migrated successfully:', data)
      return data
    } catch (error) {
      console.error('Error migrating recipes:', error)
      throw error
    }
  }

  // Migrate sample stories
  static async migrateStories() {
    try {
      const storiesToInsert = sampleStories.map(story => ({
        id: story.id,
        user_id: story.user.id,
        image_url: story.image,
        video_url: story.video,
        caption: story.caption,
        views_count: story.views,
        is_viewed: story.isViewed
      }))

      const { data, error } = await supabase
        .from(TABLES.STORIES)
        .insert(storiesToInsert)
        .select()

      if (error) throw error
      console.log('Stories migrated successfully:', data)
      return data
    } catch (error) {
      console.error('Error migrating stories:', error)
      throw error
    }
  }

  // Migrate sample suppliers
  static async migrateSuppliers() {
    try {
      const suppliersToInsert = sampleSuppliers.map(supplier => ({
        name: supplier.name,
        logo: supplier.logo,
        delivery_time: supplier.deliveryTime,
        min_order_amount: supplier.price,
        delivery_fee: 0
      }))

      const { data, error } = await supabase
        .from(TABLES.SUPPLIERS)
        .insert(suppliersToInsert)
        .select()

      if (error) throw error
      console.log('Suppliers migrated successfully:', data)
      return data
    } catch (error) {
      console.error('Error migrating suppliers:', error)
      throw error
    }
  }

  // Run all migrations
  static async runAllMigrations() {
    try {
      console.log('Starting data migration...')
      
      await this.migrateUsers()
      await this.migrateRecipes()
      await this.migrateStories()
      await this.migrateSuppliers()
      
      console.log('All migrations completed successfully!')
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }

  // Check if data exists
  static async checkDataExists() {
    try {
      const [users, recipes, stories, suppliers] = await Promise.all([
        supabase.from(TABLES.USERS).select('count', { count: 'exact', head: true }),
        supabase.from(TABLES.RECIPES).select('count', { count: 'exact', head: true }),
        supabase.from(TABLES.STORIES).select('count', { count: 'exact', head: true }),
        supabase.from(TABLES.SUPPLIERS).select('count', { count: 'exact', head: true })
      ])

      return {
        users: users.count || 0,
        recipes: recipes.count || 0,
        stories: stories.count || 0,
        suppliers: suppliers.count || 0
      }
    } catch (error) {
      console.error('Error checking data:', error)
      return { users: 0, recipes: 0, stories: 0, suppliers: 0 }
    }
  }
}
