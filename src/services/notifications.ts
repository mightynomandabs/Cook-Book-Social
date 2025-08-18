import { supabase } from '../lib/supabase';

export interface Notification {
  id?: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at?: Date;
}

export type NotificationType = 
  | 'new_follower'
  | 'comment_on_recipe'
  | 'like_on_recipe'
  | 'recipe_saved'
  | 'welcome'
  | 'system';

class NotificationService {
  async createNotification(notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          is_read: false
        });

      if (error) {
        console.error('Notification creation failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Notification service error:', error);
      return { success: false, error: 'Failed to create notification' };
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Notification service error:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to mark notification as read:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Notification service error:', error);
      return { success: false, error: 'Failed to mark notification as read' };
    }
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Failed to mark all notifications as read:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Notification service error:', error);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Failed to get unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Notification service error:', error);
      return 0;
    }
  }

  async deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to delete notification:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Notification service error:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  }

  // Convenience methods for common notification types
  async notifyNewFollower(followerId: string, followedId: string, followerName: string): Promise<void> {
    await this.createNotification({
      user_id: followedId,
      type: 'new_follower',
      title: 'New Follower',
      message: `${followerName} started following you`,
      data: { follower_id: followerId, follower_name: followerName }
    });
  }

  async notifyCommentOnRecipe(recipeId: string, commenterId: string, commenterName: string, recipeTitle: string): Promise<void> {
    // Get recipe creator
    const { data: recipe } = await supabase
      .from('recipes')
      .select('creator_id')
      .eq('id', recipeId)
      .single();

    if (recipe && recipe.creator_id !== commenterId) {
      await this.createNotification({
        user_id: recipe.creator_id,
        type: 'comment_on_recipe',
        title: 'New Comment',
        message: `${commenterName} commented on your recipe "${recipeTitle}"`,
        data: { recipe_id: recipeId, commenter_id: commenterId, commenter_name: commenterName }
      });
    }
  }

  async notifyLikeOnRecipe(recipeId: string, likerId: string, likerName: string, recipeTitle: string): Promise<void> {
    // Get recipe creator
    const { data: recipe } = await supabase
      .from('recipes')
      .select('creator_id')
      .eq('id', recipeId)
      .single();

    if (recipe && recipe.creator_id !== likerId) {
      await this.createNotification({
        user_id: recipe.creator_id,
        type: 'like_on_recipe',
        title: 'New Like',
        message: `${likerName} liked your recipe "${recipeTitle}"`,
        data: { recipe_id: recipeId, liker_id: likerId, liker_name: likerName }
      });
    }
  }

  async notifyRecipeSaved(recipeId: string, saverId: string, saverName: string, recipeTitle: string): Promise<void> {
    // Get recipe creator
    const { data: recipe } = await supabase
      .from('recipes')
      .select('creator_id')
      .eq('id', recipeId)
      .single();

    if (recipe && recipe.creator_id !== saverId) {
      await this.createNotification({
        user_id: recipe.creator_id,
        type: 'recipe_saved',
        title: 'Recipe Saved',
        message: `${saverName} saved your recipe "${recipeTitle}"`,
        data: { recipe_id: recipeId, saver_id: saverId, saver_name: saverName }
      });
    }
  }

  async sendWelcomeNotification(userId: string, userName: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'welcome',
      title: 'Welcome to CookBook! 🍳',
      message: `Hi ${userName}! We're excited to see your culinary creations. Start by exploring recipes or sharing your own!`,
      data: { user_name: userName }
    });
  }
}

export const notifications = new NotificationService();
export default notifications;
