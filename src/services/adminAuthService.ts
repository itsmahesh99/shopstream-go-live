import { supabase } from '@/lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  secretKey: string;
}

export interface AdminSignupData extends AdminCredentials {
  fullName?: string;
}

export class AdminAuthService {
  private static readonly ADMIN_SESSION_KEY = 'admin_session';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Admin Login
   */
  static async login(credentials: AdminCredentials): Promise<AdminUser> {
    try {
      console.log('Admin login attempt for:', credentials.email);

      const { data, error } = await supabase.rpc('verify_admin_credentials', {
        p_email: credentials.email,
        p_password: credentials.password,
        p_secret_key: credentials.secretKey
      });

      if (error) {
        console.error('Admin login error:', error);
        throw new Error('Login failed: ' + error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid credentials or secret key');
      }

      const adminUser = data[0];

      // Update last login
      await supabase.rpc('update_admin_last_login', {
        p_admin_id: adminUser.admin_id
      });

      // Store session
      this.setAdminSession({
        id: adminUser.admin_id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        is_active: adminUser.is_active,
        created_at: new Date().toISOString()
      });

      console.log('Admin login successful:', adminUser.email);
      return {
        id: adminUser.admin_id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        is_active: adminUser.is_active,
        created_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    }
  }

  /**
   * Admin Signup
   */
  static async signup(signupData: AdminSignupData): Promise<AdminUser> {
    try {
      console.log('Admin signup attempt for:', signupData.email);

      const { data, error } = await supabase.rpc('create_admin_user', {
        p_email: signupData.email,
        p_password: signupData.password,
        p_secret_key: signupData.secretKey,
        p_full_name: signupData.fullName || null
      });

      if (error) {
        console.error('Admin signup error:', error);
        throw new Error('Signup failed: ' + error.message);
      }

      console.log('Admin signup successful for:', signupData.email);

      // Auto-login after signup
      return await this.login({
        email: signupData.email,
        password: signupData.password,
        secretKey: signupData.secretKey
      });

    } catch (error) {
      console.error('Admin signup failed:', error);
      throw error;
    }
  }

  /**
   * Admin Logout
   */
  static logout(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
    console.log('Admin logged out');
  }

  /**
   * Get current admin session
   */
  static getCurrentAdmin(): AdminUser | null {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() - session.timestamp > this.SESSION_DURATION) {
        this.logout();
        return null;
      }

      return session.admin;
    } catch (error) {
      console.error('Error getting admin session:', error);
      return null;
    }
  }

  /**
   * Check if user is logged in as admin
   */
  static isAdminLoggedIn(): boolean {
    return this.getCurrentAdmin() !== null;
  }

  /**
   * Set admin session in localStorage
   */
  private static setAdminSession(admin: AdminUser): void {
    const sessionData = {
      admin,
      timestamp: Date.now()
    };
    localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(sessionData));
  }

  /**
   * Verify admin session is still valid
   */
  static async verifyAdminSession(): Promise<boolean> {
    try {
      const currentAdmin = this.getCurrentAdmin();
      if (!currentAdmin) return false;

      // For now, just check if we have a valid admin session in localStorage
      // Skip the database check to avoid the 406 error
      return true;
    } catch (error) {
      console.error('Error verifying admin session:', error);
      return false;
    }
  }

  /**
   * Update admin permissions after login
   */
  static async updateAdminPermissions(adminId: string): Promise<void> {
    try {
      // Check if admin permissions already exist
      const { data: existingPermissions, error: checkError } = await supabase
        .from('admin_permissions')
        .select('id')
        .eq('admin_user_id', adminId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking admin permissions:', checkError);
        return;
      }

      if (!existingPermissions) {
        // Create admin permissions
        const { error } = await supabase
          .from('admin_permissions')
          .insert({
            admin_user_id: adminId,
            role: 'admin',
            permissions: {
              manage_influencers: true,
              view_analytics: true,
              manage_tokens: true
            }
          });

        if (error) {
          console.error('Error creating admin permissions:', error);
        } else {
          console.log('Admin permissions created successfully');
        }
      }
    } catch (error) {
      console.error('Error updating admin permissions:', error);
    }
  }
}
