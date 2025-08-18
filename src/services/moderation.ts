import { supabase } from '../lib/supabase';

export interface Report {
  id?: string;
  reporter_id: string;
  reported_user_id?: string;
  recipe_id?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  created_at?: Date;
}

export type ReportReason = 
  | 'inappropriate_content'
  | 'spam'
  | 'harassment'
  | 'copyright_violation'
  | 'fake_news'
  | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface BlockedUser {
  id?: string;
  user_id: string;
  blocked_user_id: string;
  reason?: string;
  created_at?: Date;
}

class ModerationService {
  async reportUser(report: Omit<Report, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: report.reporter_id,
          reported_user_id: report.reported_user_id,
          recipe_id: report.recipe_id,
          reason: report.reason,
          description: report.description,
          status: 'pending'
        });

      if (error) {
        console.error('Report creation failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Moderation service error:', error);
      return { success: false, error: 'Failed to create report' };
    }
  }

  async reportRecipe(report: Omit<Report, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: report.reporter_id,
          recipe_id: report.recipe_id,
          reason: report.reason,
          description: report.description,
          status: 'pending'
        });

      if (error) {
        console.error('Recipe report creation failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Moderation service error:', error);
      return { success: false, error: 'Failed to create report' };
    }
  }

  async blockUser(userId: string, blockedUserId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          user_id: userId,
          blocked_user_id: blockedUserId,
          reason
        });

      if (error) {
        console.error('User blocking failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Moderation service error:', error);
      return { success: false, error: 'Failed to block user' };
    }
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('user_id', userId)
        .eq('blocked_user_id', blockedUserId);

      if (error) {
        console.error('User unblocking failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Moderation service error:', error);
      return { success: false, error: 'Failed to unblock user' };
    }
  }

  async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to fetch blocked users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Moderation service error:', error);
      return [];
    }
  }

  async isUserBlocked(userId: string, otherUserId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('id')
        .or(`user_id.eq.${userId},user_id.eq.${otherUserId}`)
        .or(`blocked_user_id.eq.${userId},blocked_user_id.eq.${otherUserId}`)
        .limit(1);

      if (error) {
        console.error('Failed to check blocked status:', error);
        return false;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error('Moderation service error:', error);
      return false;
    }
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('reporter_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch user reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Moderation service error:', error);
      return [];
    }
  }
}

export const moderation = new ModerationService();
export default moderation;
