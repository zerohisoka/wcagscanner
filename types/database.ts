export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          stripe_customer_id: string | null;
          subscription_status: 'free' | 'pro' | 'agency';
          subscription_id: string | null;
          current_period_end: string | null;
          scans_used_this_month: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: 'free' | 'pro' | 'agency';
          subscription_id?: string | null;
          current_period_end?: string | null;
          scans_used_this_month?: number;
          updated_at?: string;
        };
      };
      scans: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          status: string;
          pages_scanned: number;
          pages_requested: number;
          compliance_score: number | null;
          total_violations: number;
          critical_count: number;
          serious_count: number;
          moderate_count: number;
          minor_count: number;
          wcag_level: string;
          big_six: Record<string, number> | null;
          error_message: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
      };
    };
  };
}
