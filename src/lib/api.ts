// API service for Supabase database operations
import { supabase } from './supabase';

export interface AnalysisData {
  analysis: {
    executive_summary: string;
    critical_actions: Array<{
      action: string;
      impact: string;
      urgency: 'high' | 'medium' | 'low';
      details: string;
    }>;
  };
  metrics: {
    reach: string;
    interactions: string;
    followers: string;
    follower_growth: string;
    reel_views: string;
    profile_clicks: string;
  };
  next_30_days: string[];
}

const WEBHOOK_URL = 'https://n8n.srv880021.hstgr.cloud/webhook-test/CeoPremium';

export interface CriticalAction {
  id: string;
  action: string;
  impact: string;
  urgency: 'high' | 'medium' | 'low';
  details: string;
}

export interface QuickAction {
  id: string;
  action: string;
}

export async function getLatestAnalysis(): Promise<AnalysisData | null> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as AnalysisData;
  } catch (error) {
    console.error('Error fetching analysis from webhook:', error);
    
    // Fallback data for development/demo purposes
    return {
      analysis: {
        executive_summary: "Tu portfolio tiene 3 oportunidades inmediatas que pueden generar $156K adicionales este año.",
        critical_actions: [
          {
            action: "Aumentar rentas en Oak Street Apartments",
            impact: "+$28K anuales",
            urgency: "high",
            details: "14 unidades están $200 bajo mercado. Enviar avisos de 60 días esta semana."
          },
          {
            action: "Reducir precio Downtown Loft 3B",
            impact: "+$18K anuales",
            urgency: "medium",
            details: "Unidad vacante 90 días. Reducir $150/mes para ocupar rápido."
          },
          {
            action: "Refinanciar Maple Heights Complex",
            impact: "+$110K anuales",
            urgency: "high",
            details: "Tasas bajaron 1.2%. Refinanciar ahora ahorra $9.2K/mes."
          }
        ]
      },
      metrics: {
        reach: "50K",
        interactions: "5.2K",
        followers: "25K",
        follower_growth: "+150",
        reel_views: "120K",
        profile_clicks: "850"
      },
      next_30_days: [
        "Enviar avisos aumento renta Oak Street",
        "Reducir precio Downtown Loft 3B",
        "Llamar inquilinos para renovaciones",
        "Programar mantenimiento HVAC Maple Heights"
      ]
    };
  }
}

export async function sendPlanToWebhook(data: {
  metrics: AnalysisData['metrics'];
  critical_actions: CriticalAction[];
  quick_actions: QuickAction[];
  executive_summary: string;
}): Promise<boolean> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'create_plan',
        timestamp: new Date().toISOString(),
        data: data
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending plan to webhook:', error);
    return false;
  }
}

// Supabase database operations
export interface FormData {
  investorInfo: {
    fullName: string;
    experienceYears: string;
    primaryMarket: string;
    mainObjective: 'cash_flow' | 'appreciation' | 'both';
  };
  properties: any[];
  goalsAndPriorities: {
    noiTarget: string;
    availableCapital: string;
    mainPriority: string;
  };
  marketInfo: {
    avgRent1BR: string;
    avgRent2BR: string;
    avgRent3BR: string;
    currentInterestRate: string;
  };
}

export async function saveFormDataToSupabase(formData: FormData): Promise<{ success: boolean; investorId?: string; error?: string }> {
  try {
    // First, create or update investor
    const { data: investor, error: investorError } = await supabase
      .from('investors')
      .upsert({
        full_name: formData.investorInfo.fullName,
        experience_years: parseInt(formData.investorInfo.experienceYears),
        primary_market: formData.investorInfo.primaryMarket,
        main_objective: formData.investorInfo.mainObjective
      })
      .select()
      .single();

    if (investorError) {
      console.error('Error saving investor:', investorError);
      return { success: false, error: investorError.message };
    }

    const investorId = investor.id;

    // Save properties
    for (const property of formData.properties) {
      const { data: savedProperty, error: propertyError } = await supabase
        .from('properties')
        .upsert({
          investor_id: investorId,
          property_name: property.propertyName,
          property_type: property.propertyType,
          total_units: parseInt(property.totalUnits),
          year_built: parseInt(property.yearBuilt),
          purchase_date: property.purchaseDate,
          purchase_price: parseFloat(property.purchasePrice),
          down_payment: parseFloat(property.downPayment),
          capital_improvements: parseFloat(property.capitalImprovements),
          current_value: parseFloat(property.currentValue),
          mortgage_balance: parseFloat(property.mortgageBalance),
          monthly_payment: parseFloat(property.monthlyPayment),
          interest_rate: parseFloat(property.interestRate),
          remaining_years: parseInt(property.remainingYears),
          property_taxes: parseFloat(property.propertyTaxes),
          insurance: parseFloat(property.insurance),
          property_management: parseFloat(property.propertyManagement),
          maintenance: parseFloat(property.maintenance),
          utilities: parseFloat(property.utilities),
          marketing: parseFloat(property.marketing),
          other_expenses: parseFloat(property.otherExpenses),
          leases_expiring_3_months: property.leasesExpiring3Months,
          expiring_leases_count: property.expiringLeasesCount ? parseInt(property.expiringLeasesCount) : null,
          late_payment_tenants: property.latePaymentTenants,
          late_payment_count: property.latePaymentCount ? parseInt(property.latePaymentCount) : null,
          reported_complaints: property.reportedComplaints,
          hvac_age: parseInt(property.hvacAge),
          hvac_condition: property.hvacCondition,
          roof_age: parseInt(property.roofAge),
          roof_condition: property.roofCondition,
          plumbing_condition: property.plumbingCondition,
          deferred_repairs: parseFloat(property.deferredRepairs),
          planned_renovations: parseFloat(property.plannedRenovations),
          below_market_rents: property.belowMarketRents,
          consider_refinance: property.considerRefinance,
          plan_improvements: property.planImprovements
        })
        .select()
        .single();

      if (propertyError) {
        console.error('Error saving property:', propertyError);
        continue; // Continue with other properties
      }

      // Save property units
      for (const unit of property.units) {
        await supabase
          .from('property_units')
          .upsert({
            property_id: savedProperty.id,
            unit_number: unit.unitNumber,
            current_rent: parseFloat(unit.currentRent),
            is_occupied: unit.isOccupied,
            vacant_days: unit.vacantDays ? parseInt(unit.vacantDays) : null,
            market_rent: parseFloat(unit.marketRent)
          });
      }
    }

    // Save goals and priorities
    await supabase
      .from('goals_priorities')
      .upsert({
        investor_id: investorId,
        noi_target: parseFloat(formData.goalsAndPriorities.noiTarget),
        available_capital: parseFloat(formData.goalsAndPriorities.availableCapital),
        main_priority: formData.goalsAndPriorities.mainPriority
      });

    // Save market info
    await supabase
      .from('market_info')
      .upsert({
        investor_id: investorId,
        avg_rent_1br: parseFloat(formData.marketInfo.avgRent1BR),
        avg_rent_2br: parseFloat(formData.marketInfo.avgRent2BR),
        avg_rent_3br: parseFloat(formData.marketInfo.avgRent3BR),
        current_interest_rate: parseFloat(formData.marketInfo.currentInterestRate)
      });

    return { success: true, investorId };
  } catch (error) {
    console.error('Error saving form data to Supabase:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

export async function getInvestorData(investorId: string): Promise<FormData | null> {
  try {
    // Get investor info
    const { data: investor, error: investorError } = await supabase
      .from('investors')
      .select('*')
      .eq('id', investorId)
      .single();

    if (investorError || !investor) {
      console.error('Error fetching investor:', investorError);
      return null;
    }

    // Get properties with units
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select(`
        *,
        property_units (*)
      `)
      .eq('investor_id', investorId);

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
      return null;
    }

    // Get goals and priorities
    const { data: goals, error: goalsError } = await supabase
      .from('goals_priorities')
      .select('*')
      .eq('investor_id', investorId)
      .single();

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      return null;
    }

    // Get market info
    const { data: market, error: marketError } = await supabase
      .from('market_info')
      .select('*')
      .eq('investor_id', investorId)
      .single();

    if (marketError) {
      console.error('Error fetching market info:', marketError);
      return null;
    }

    // Transform data to match FormData interface
    const formData: FormData = {
      investorInfo: {
        fullName: investor.full_name,
        experienceYears: investor.experience_years.toString(),
        primaryMarket: investor.primary_market,
        mainObjective: investor.main_objective
      },
      properties: properties.map(prop => ({
        id: prop.id,
        propertyName: prop.property_name,
        propertyType: prop.property_type,
        totalUnits: prop.total_units.toString(),
        yearBuilt: prop.year_built.toString(),
        purchaseDate: prop.purchase_date,
        purchasePrice: prop.purchase_price.toString(),
        downPayment: prop.down_payment.toString(),
        capitalImprovements: prop.capital_improvements.toString(),
        currentValue: prop.current_value.toString(),
        mortgageBalance: prop.mortgage_balance.toString(),
        monthlyPayment: prop.monthly_payment.toString(),
        interestRate: prop.interest_rate.toString(),
        remainingYears: prop.remaining_years.toString(),
        units: prop.property_units.map((unit: any) => ({
          unitNumber: unit.unit_number,
          currentRent: unit.current_rent.toString(),
          isOccupied: unit.is_occupied,
          vacantDays: unit.vacant_days?.toString(),
          marketRent: unit.market_rent.toString()
        })),
        propertyTaxes: prop.property_taxes.toString(),
        insurance: prop.insurance.toString(),
        propertyManagement: prop.property_management.toString(),
        maintenance: prop.maintenance.toString(),
        utilities: prop.utilities.toString(),
        marketing: prop.marketing.toString(),
        otherExpenses: prop.other_expenses.toString(),
        leasesExpiring3Months: prop.leases_expiring_3_months,
        expiringLeasesCount: prop.expiring_leases_count?.toString(),
        latePaymentTenants: prop.late_payment_tenants,
        latePaymentCount: prop.late_payment_count?.toString(),
        reportedComplaints: prop.reported_complaints,
        hvacAge: prop.hvac_age.toString(),
        hvacCondition: prop.hvac_condition,
        roofAge: prop.roof_age.toString(),
        roofCondition: prop.roof_condition,
        plumbingCondition: prop.plumbing_condition,
        deferredRepairs: prop.deferred_repairs.toString(),
        plannedRenovations: prop.planned_renovations.toString(),
        belowMarketRents: prop.below_market_rents,
        considerRefinance: prop.consider_refinance,
        planImprovements: prop.plan_improvements
      })),
      goalsAndPriorities: {
        noiTarget: goals.noi_target.toString(),
        availableCapital: goals.available_capital.toString(),
        mainPriority: goals.main_priority
      },
      marketInfo: {
        avgRent1BR: market.avg_rent_1br.toString(),
        avgRent2BR: market.avg_rent_2br.toString(),
        avgRent3BR: market.avg_rent_3br.toString(),
        currentInterestRate: market.current_interest_rate.toString()
      }
    };

    return formData;
  } catch (error) {
    console.error('Error fetching investor data:', error);
    return null;
  }
}

export async function saveAnalysisData(investorId: string, analysisData: AnalysisData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('analysis_data')
      .upsert({
        investor_id: investorId,
        executive_summary: analysisData.analysis.executive_summary,
        critical_actions: analysisData.analysis.critical_actions,
        metrics: analysisData.metrics,
        next_30_days: analysisData.next_30_days
      });

    if (error) {
      console.error('Error saving analysis data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving analysis data:', error);
    return false;
  }
}

export async function regenerateExecutiveSummary(formData: FormData, investorId?: string): Promise<AnalysisData | null> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'regenerate_executive_summary',
        timestamp: new Date().toISOString(),
        formData: formData,
        investorId: investorId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Save the new analysis data to Supabase if we have an investor ID
    if (investorId) {
      const analysisData: AnalysisData = {
        analysis: {
          executive_summary: result.executiveSummary || result.summary || 'Summary regenerated by AI',
          critical_actions: result.critical_actions || []
        },
        metrics: result.metrics || {},
        next_30_days: result.next_30_days || []
      };

      await saveAnalysisData(investorId, analysisData);
      return analysisData;
    }

    return null;
  } catch (error) {
    console.error('Error regenerating executive summary:', error);
    return null;
  }
}
