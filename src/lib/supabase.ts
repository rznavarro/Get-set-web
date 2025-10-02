import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      investors: {
        Row: {
          id: string
          full_name: string
          experience_years: number
          primary_market: string
          main_objective: 'cash_flow' | 'appreciation' | 'both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          experience_years: number
          primary_market: string
          main_objective: 'cash_flow' | 'appreciation' | 'both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          experience_years?: number
          primary_market?: string
          main_objective?: 'cash_flow' | 'appreciation' | 'both'
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          investor_id: string
          property_name: string
          property_type: 'multifamiliar' | 'single_family' | 'comercial'
          total_units: number
          year_built: number
          purchase_date: string
          purchase_price: number
          down_payment: number
          capital_improvements: number
          current_value: number
          mortgage_balance: number
          monthly_payment: number
          interest_rate: number
          remaining_years: number
          property_taxes: number
          insurance: number
          property_management: number
          maintenance: number
          utilities: number
          marketing: number
          other_expenses: number
          leases_expiring_3_months: boolean
          expiring_leases_count: number | null
          late_payment_tenants: boolean
          late_payment_count: number | null
          reported_complaints: boolean
          hvac_age: number
          hvac_condition: 'good' | 'fair' | 'needs_replacement'
          roof_age: number
          roof_condition: 'good' | 'fair' | 'needs_replacement'
          plumbing_condition: 'good' | 'fair' | 'needs_update'
          deferred_repairs: number
          planned_renovations: number
          below_market_rents: boolean
          consider_refinance: boolean
          plan_improvements: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          property_name: string
          property_type: 'multifamiliar' | 'single_family' | 'comercial'
          total_units: number
          year_built: number
          purchase_date: string
          purchase_price: number
          down_payment: number
          capital_improvements: number
          current_value: number
          mortgage_balance: number
          monthly_payment: number
          interest_rate: number
          remaining_years: number
          property_taxes: number
          insurance: number
          property_management: number
          maintenance: number
          utilities: number
          marketing: number
          other_expenses: number
          leases_expiring_3_months?: boolean
          expiring_leases_count?: number | null
          late_payment_tenants?: boolean
          late_payment_count?: number | null
          reported_complaints?: boolean
          hvac_age: number
          hvac_condition: 'good' | 'fair' | 'needs_replacement'
          roof_age: number
          roof_condition: 'good' | 'fair' | 'needs_replacement'
          plumbing_condition: 'good' | 'fair' | 'needs_update'
          deferred_repairs: number
          planned_renovations: number
          below_market_rents?: boolean
          consider_refinance?: boolean
          plan_improvements?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          property_name?: string
          property_type?: 'multifamiliar' | 'single_family' | 'comercial'
          total_units?: number
          year_built?: number
          purchase_date?: string
          purchase_price?: number
          down_payment?: number
          capital_improvements?: number
          current_value?: number
          mortgage_balance?: number
          monthly_payment?: number
          interest_rate?: number
          remaining_years?: number
          property_taxes?: number
          insurance?: number
          property_management?: number
          maintenance?: number
          utilities?: number
          marketing?: number
          other_expenses?: number
          leases_expiring_3_months?: boolean
          expiring_leases_count?: number | null
          late_payment_tenants?: boolean
          late_payment_count?: number | null
          reported_complaints?: boolean
          hvac_age?: number
          hvac_condition?: 'good' | 'fair' | 'needs_replacement'
          roof_age?: number
          roof_condition?: 'good' | 'fair' | 'needs_replacement'
          plumbing_condition?: 'good' | 'fair' | 'needs_update'
          deferred_repairs?: number
          planned_renovations?: number
          below_market_rents?: boolean
          consider_refinance?: boolean
          plan_improvements?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_units: {
        Row: {
          id: string
          property_id: string
          unit_number: string
          current_rent: number
          is_occupied: boolean
          vacant_days: number | null
          market_rent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          unit_number: string
          current_rent: number
          is_occupied?: boolean
          vacant_days?: number | null
          market_rent: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          unit_number?: string
          current_rent?: number
          is_occupied?: boolean
          vacant_days?: number | null
          market_rent?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals_priorities: {
        Row: {
          id: string
          investor_id: string
          noi_target: number
          available_capital: number
          main_priority: 'increase_rent' | 'reduce_vacancy' | 'refinance' | 'expand_portfolio'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          noi_target: number
          available_capital: number
          main_priority: 'increase_rent' | 'reduce_vacancy' | 'refinance' | 'expand_portfolio'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          noi_target?: number
          available_capital?: number
          main_priority?: 'increase_rent' | 'reduce_vacancy' | 'refinance' | 'expand_portfolio'
          created_at?: string
          updated_at?: string
        }
      }
      market_info: {
        Row: {
          id: string
          investor_id: string
          avg_rent_1br: number
          avg_rent_2br: number
          avg_rent_3br: number
          current_interest_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          avg_rent_1br: number
          avg_rent_2br: number
          avg_rent_3br: number
          current_interest_rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          avg_rent_1br?: number
          avg_rent_2br?: number
          avg_rent_3br?: number
          current_interest_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      analysis_data: {
        Row: {
          id: string
          investor_id: string
          executive_summary: string | null
          critical_actions: any
          metrics: any
          next_30_days: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          executive_summary?: string | null
          critical_actions?: any
          metrics?: any
          next_30_days?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          executive_summary?: string | null
          critical_actions?: any
          metrics?: any
          next_30_days?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
