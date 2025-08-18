import { supabase } from '../lib/supabase';

export interface AnalyticsEvent {
  event_type: string;
  user_id?: string;
  recipe_id?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface AnalyticsData {
  id?: string;
  event_type: string;
  user_id?: string;
  recipe_id?: string;
  metadata?: Record<string, any>;
  created_at?: Date;
}

class AnalyticsService {
  private isEnabled: boolean = true;

  constructor() {
    // Check if analytics should be enabled (could be based on environment)
    this.isEnabled = process.env.NODE_ENV === 'production' || true;
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isEnabled) {
      console.log('Analytics Event:', event);
      return;
    }

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: event.event_type,
          user_id: event.user_id,
          recipe_id: event.recipe_id,
          metadata: event.metadata,
          created_at: event.timestamp.toISOString()
        });

      if (error) {
        console.error('Analytics tracking failed:', error);
      }
    } catch (error) {
      console.error('Analytics service error:', error);
    }
  }

  // Core user journey events
  async trackUserOnboarded(userId: string, interests: string[]): Promise<void> {
    await this.trackEvent({
      event_type: 'user_onboarded',
      user_id: userId,
      metadata: { interests },
      timestamp: new Date()
    });
  }

  async trackRecipeViewed(userId: string, recipeId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'recipe_viewed',
      user_id: userId,
      recipe_id: recipeId,
      timestamp: new Date()
    });
  }

  async trackRecipeCreated(userId: string, recipeId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'recipe_created',
      user_id: userId,
      recipe_id: recipeId,
      timestamp: new Date()
    });
  }

  async trackRecipeLiked(userId: string, recipeId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'recipe_liked',
      user_id: userId,
      recipe_id: recipeId,
      timestamp: new Date()
    });
  }

  async trackRecipeSaved(userId: string, recipeId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'recipe_saved',
      user_id: userId,
      recipe_id: recipeId,
      timestamp: new Date()
    });
  }

  async trackCommentPosted(userId: string, recipeId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'comment_posted',
      user_id: userId,
      recipe_id: recipeId,
      timestamp: new Date()
    });
  }

  async trackUserFollowed(followerId: string, followedId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'user_followed',
      user_id: followerId,
      metadata: { followed_user_id: followedId },
      timestamp: new Date()
    });
  }

  async trackFeedScrolled(userId: string, scrollDepth: number): Promise<void> {
    await this.trackEvent({
      event_type: 'feed_scrolled',
      user_id: userId,
      metadata: { scroll_depth: scrollDepth },
      timestamp: new Date()
    });
  }

  // Error tracking
  async trackError(error: Error, userId?: string, context?: string): Promise<void> {
    await this.trackEvent({
      event_type: 'error_occurred',
      user_id: userId,
      metadata: {
        error_message: error.message,
        error_stack: error.stack,
        context
      },
      timestamp: new Date()
    });
  }

  // Performance tracking
  async trackPerformance(metric: string, value: number, userId?: string): Promise<void> {
    await this.trackEvent({
      event_type: 'performance_metric',
      user_id: userId,
      metadata: { metric, value },
      timestamp: new Date()
    });
  }

  // Disable analytics (for testing or user preference)
  disable(): void {
    this.isEnabled = false;
  }

  // Enable analytics
  enable(): void {
    this.isEnabled = true;
  }
}

export const analytics = new AnalyticsService();
export default analytics;
