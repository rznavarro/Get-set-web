-- Create investors table
CREATE TABLE investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  primary_market TEXT NOT NULL,
  main_objective TEXT NOT NULL CHECK (main_objective IN ('cash_flow', 'appreciation', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  property_name TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('multifamiliar', 'single_family', 'comercial')),
  total_units INTEGER NOT NULL,
  year_built INTEGER NOT NULL,
  purchase_date DATE NOT NULL,

  -- Financial Purchase Data
  purchase_price DECIMAL(15,2) NOT NULL,
  down_payment DECIMAL(15,2) NOT NULL,
  capital_improvements DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) NOT NULL,

  -- Current Debt
  mortgage_balance DECIMAL(15,2) NOT NULL,
  monthly_payment DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  remaining_years INTEGER NOT NULL,

  -- Operating Expenses
  property_taxes DECIMAL(15,2) NOT NULL,
  insurance DECIMAL(15,2) NOT NULL,
  property_management DECIMAL(15,2) NOT NULL,
  maintenance DECIMAL(15,2) NOT NULL,
  utilities DECIMAL(15,2) NOT NULL,
  marketing DECIMAL(15,2) NOT NULL,
  other_expenses DECIMAL(15,2) NOT NULL,

  -- Operational Status
  leases_expiring_3_months BOOLEAN DEFAULT FALSE,
  expiring_leases_count INTEGER,
  late_payment_tenants BOOLEAN DEFAULT FALSE,
  late_payment_count INTEGER,
  reported_complaints BOOLEAN DEFAULT FALSE,

  -- Maintenance & Capex
  hvac_age INTEGER NOT NULL,
  hvac_condition TEXT NOT NULL CHECK (hvac_condition IN ('good', 'fair', 'needs_replacement')),
  roof_age INTEGER NOT NULL,
  roof_condition TEXT NOT NULL CHECK (roof_condition IN ('good', 'fair', 'needs_replacement')),
  plumbing_condition TEXT NOT NULL CHECK (plumbing_condition IN ('good', 'fair', 'needs_update')),
  deferred_repairs DECIMAL(15,2) NOT NULL,
  planned_renovations DECIMAL(15,2) NOT NULL,

  -- Opportunities
  below_market_rents BOOLEAN DEFAULT FALSE,
  consider_refinance BOOLEAN DEFAULT FALSE,
  plan_improvements BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_units table
CREATE TABLE property_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  current_rent DECIMAL(10,2) NOT NULL,
  is_occupied BOOLEAN DEFAULT TRUE,
  vacant_days INTEGER,
  market_rent DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals_priorities table
CREATE TABLE goals_priorities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  noi_target DECIMAL(15,2) NOT NULL,
  available_capital DECIMAL(15,2) NOT NULL,
  main_priority TEXT NOT NULL CHECK (main_priority IN ('increase_rent', 'reduce_vacancy', 'refinance', 'expand_portfolio')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_info table
CREATE TABLE market_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  avg_rent_1br DECIMAL(10,2) NOT NULL,
  avg_rent_2br DECIMAL(10,2) NOT NULL,
  avg_rent_3br DECIMAL(10,2) NOT NULL,
  current_interest_rate DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_data table for AI-generated insights
CREATE TABLE analysis_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  executive_summary TEXT,
  critical_actions JSONB,
  metrics JSONB,
  next_30_days JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_investor_id ON properties(investor_id);
CREATE INDEX idx_property_units_property_id ON property_units(property_id);
CREATE INDEX idx_goals_priorities_investor_id ON goals_priorities(investor_id);
CREATE INDEX idx_market_info_investor_id ON market_info(investor_id);
CREATE INDEX idx_analysis_data_investor_id ON analysis_data(investor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_data ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - you can customize these based on your auth needs)
CREATE POLICY "Enable all operations for investors" ON investors FOR ALL USING (true);
CREATE POLICY "Enable all operations for properties" ON properties FOR ALL USING (true);
CREATE POLICY "Enable all operations for property_units" ON property_units FOR ALL USING (true);
CREATE POLICY "Enable all operations for goals_priorities" ON goals_priorities FOR ALL USING (true);
CREATE POLICY "Enable all operations for market_info" ON market_info FOR ALL USING (true);
CREATE POLICY "Enable all operations for analysis_data" ON analysis_data FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_investors_updated_at BEFORE UPDATE ON investors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_units_updated_at BEFORE UPDATE ON property_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_priorities_updated_at BEFORE UPDATE ON goals_priorities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_info_updated_at BEFORE UPDATE ON market_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analysis_data_updated_at BEFORE UPDATE ON analysis_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
