import React, { useState } from 'react';
import { ArrowRight, Plus, X, Check } from 'lucide-react';

interface InvestorInfo {
  fullName: string;
  experienceYears: string;
  primaryMarket: string;
  mainObjective: 'cash_flow' | 'appreciation' | 'both';
}

interface PropertyUnit {
  unitNumber: string;
  currentRent: string;
  isOccupied: boolean;
  vacantDays?: string;
  marketRent: string;
}

interface PropertyData {
  id: string;
  // Basic Info
  propertyName: string;
  propertyType: 'multifamiliar' | 'single_family' | 'comercial';
  totalUnits: string;
  yearBuilt: string;
  purchaseDate: string;

  // Financial Purchase Data
  purchasePrice: string;
  downPayment: string;
  capitalImprovements: string;
  currentValue: string;

  // Current Debt
  mortgageBalance: string;
  monthlyPayment: string;
  interestRate: string;
  remainingYears: string;

  // Current Income
  units: PropertyUnit[];

  // Operating Expenses
  propertyTaxes: string;
  insurance: string;
  propertyManagement: string;
  maintenance: string;
  utilities: string;
  marketing: string;
  otherExpenses: string;

  // Operational Status
  leasesExpiring3Months: boolean;
  expiringLeasesCount: string;
  latePaymentTenants: boolean;
  latePaymentCount: string;
  reportedComplaints: boolean;

  // Maintenance & Capex
  hvacAge: string;
  hvacCondition: 'good' | 'fair' | 'needs_replacement';
  roofAge: string;
  roofCondition: 'good' | 'fair' | 'needs_replacement';
  plumbingCondition: 'good' | 'fair' | 'needs_update';
  deferredRepairs: string;
  plannedRenovations: string;

  // Opportunities
  belowMarketRents: boolean;
  considerRefinance: boolean;
  planImprovements: boolean;
}

interface GoalsAndPriorities {
  noiTarget: string;
  availableCapital: string;
  mainPriority: 'increase_rent' | 'reduce_vacancy' | 'refinance' | 'expand_portfolio';
}

interface MarketInfo {
  avgRent1BR: string;
  avgRent2BR: string;
  avgRent3BR: string;
  currentInterestRate: string;
}

interface FormData {
  investorInfo: InvestorInfo;
  properties: PropertyData[];
  goalsAndPriorities: GoalsAndPriorities;
  marketInfo: MarketInfo;
}

interface PropertyInvestmentFormProps {
  onSubmit: (data: FormData) => void;
}

export function PropertyInvestmentForm({ onSubmit }: PropertyInvestmentFormProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 4;

  const [formData, setFormData] = useState<FormData>({
    investorInfo: {
      fullName: '',
      experienceYears: '',
      primaryMarket: '',
      mainObjective: 'both'
    },
    properties: [],
    goalsAndPriorities: {
      noiTarget: '',
      availableCapital: '',
      mainPriority: 'increase_rent'
    },
    marketInfo: {
      avgRent1BR: '',
      avgRent2BR: '',
      avgRent3BR: '',
      currentInterestRate: ''
    }
  });

  const addProperty = () => {
    const newProperty: PropertyData = {
      id: `property-${Date.now()}`,
      propertyName: '',
      propertyType: 'multifamiliar',
      totalUnits: '',
      yearBuilt: '',
      purchaseDate: '',
      purchasePrice: '',
      downPayment: '',
      capitalImprovements: '',
      currentValue: '',
      mortgageBalance: '',
      monthlyPayment: '',
      interestRate: '',
      remainingYears: '',
      units: [],
      propertyTaxes: '',
      insurance: '',
      propertyManagement: '',
      maintenance: '',
      utilities: '',
      marketing: '',
      otherExpenses: '',
      leasesExpiring3Months: false,
      expiringLeasesCount: '',
      latePaymentTenants: false,
      latePaymentCount: '',
      reportedComplaints: false,
      hvacAge: '',
      hvacCondition: 'good',
      roofAge: '',
      roofCondition: 'good',
      plumbingCondition: 'good',
      deferredRepairs: '',
      plannedRenovations: '',
      belowMarketRents: false,
      considerRefinance: false,
      planImprovements: false
    };
    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty]
    }));
  };

  const removeProperty = (propertyId: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.filter(p => p.id !== propertyId)
    }));
  };

  const updateProperty = (propertyId: string, updates: Partial<PropertyData>) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.map(p =>
        p.id === propertyId ? { ...p, ...updates } : p
      )
    }));
  };

  const addUnit = (propertyId: string) => {
    const property = formData.properties.find(p => p.id === propertyId);
    if (!property) return;

    const unitNumber = (property.units.length + 1).toString();
    const newUnit: PropertyUnit = {
      unitNumber,
      currentRent: '',
      isOccupied: true,
      marketRent: ''
    };

    updateProperty(propertyId, {
      units: [...property.units, newUnit]
    });
  };

  const updateUnit = (propertyId: string, unitIndex: number, updates: Partial<PropertyUnit>) => {
    const property = formData.properties.find(p => p.id === propertyId);
    if (!property) return;

    const updatedUnits = [...property.units];
    updatedUnits[unitIndex] = { ...updatedUnits[unitIndex], ...updates };

    updateProperty(propertyId, { units: updatedUnits });
  };

  const removeUnit = (propertyId: string, unitIndex: number) => {
    const property = formData.properties.find(p => p.id === propertyId);
    if (!property) return;

    const updatedUnits = property.units.filter((_, index) => index !== unitIndex);
    updateProperty(propertyId, { units: updatedUnits });
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return !!(
          formData.investorInfo.fullName.trim() &&
          formData.investorInfo.experienceYears.trim() &&
          formData.investorInfo.primaryMarket.trim()
        );
      case 2:
        return formData.properties.length > 0 && formData.properties.every(property => {
          // Basic validation for each property
          return !!(
            property.propertyName.trim() &&
            property.totalUnits.trim() &&
            property.purchasePrice.trim() &&
            property.units.length > 0 &&
            property.propertyTaxes.trim()
          );
        });
      case 3:
        return !!(
          formData.goalsAndPriorities.noiTarget.trim() &&
          formData.goalsAndPriorities.availableCapital.trim()
        );
      case 4:
        return !!(
          formData.marketInfo.avgRent1BR.trim() &&
          formData.marketInfo.currentInterestRate.trim()
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < totalSections) {
        setCurrentSection(currentSection + 1);
      } else {
        onSubmit(formData);
      }
    } else {
      alert('Por favor completa todos los campos obligatorios de esta sección.');
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2 font-dancing-script">PORTFOLIO CEO</h1>
          <p className="text-gray-600 font-dancing-script">Cuestionario de Inversión Inmobiliaria</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSections }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i + 1 <= currentSection
                    ? 'bg-navy text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Sección {currentSection} de {totalSections}
          </div>
        </div>

        {/* Form Sections */}
        <div className="min-h-96">
          {currentSection === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center mb-6 font-dancing-script">
                SECCIÓN 1: INFORMACIÓN DEL INVERSIONISTA
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.investorInfo.fullName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      investorInfo: { ...prev.investorInfo, fullName: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Años de experiencia en bienes raíces *
                  </label>
                  <input
                    type="number"
                    value={formData.investorInfo.experienceYears}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      investorInfo: { ...prev.investorInfo, experienceYears: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mercado principal (ciudad/estado) *
                  </label>
                  <input
                    type="text"
                    value={formData.investorInfo.primaryMarket}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      investorInfo: { ...prev.investorInfo, primaryMarket: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo principal *
                  </label>
                  <select
                    value={formData.investorInfo.mainObjective}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      investorInfo: { ...prev.investorInfo, mainObjective: e.target.value as any }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                  >
                    <option value="cash_flow">Cash Flow</option>
                    <option value="appreciation">Apreciación</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentSection === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center mb-6 font-dancing-script">
                SECCIÓN 2: INVENTARIO DE PROPIEDADES
              </h2>

              <p className="text-gray-600 text-center mb-6">
                "¿Cuántas propiedades tienes? Vamos a capturar cada una..."
              </p>

              {formData.properties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No has agregado ninguna propiedad aún</p>
                  <button
                    onClick={addProperty}
                    className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-gray-600 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar primera propiedad</span>
                  </button>
                </div>
              )}

              {formData.properties.map((property, propertyIndex) => (
                <div key={property.id} className="border border-gray-200 rounded-lg p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-navy">
                      Propiedad #{propertyIndex + 1}
                    </h3>
                    <button
                      onClick={() => removeProperty(property.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* A. INFORMACIÓN BÁSICA */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">A. INFORMACIÓN BÁSICA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre/Dirección de la propiedad *
                        </label>
                        <input
                          type="text"
                          value={property.propertyName}
                          onChange={(e) => updateProperty(property.id, { propertyName: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo *
                        </label>
                        <select
                          value={property.propertyType}
                          onChange={(e) => updateProperty(property.id, { propertyType: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                        >
                          <option value="multifamiliar">Multifamiliar</option>
                          <option value="single_family">Single Family</option>
                          <option value="comercial">Comercial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número total de unidades *
                        </label>
                        <input
                          type="number"
                          value={property.totalUnits}
                          onChange={(e) => updateProperty(property.id, { totalUnits: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Año de construcción *
                        </label>
                        <input
                          type="number"
                          value={property.yearBuilt}
                          onChange={(e) => updateProperty(property.id, { yearBuilt: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de compra *
                        </label>
                        <input
                          type="date"
                          value={property.purchaseDate}
                          onChange={(e) => updateProperty(property.id, { purchaseDate: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* B. DATOS FINANCIEROS DE COMPRA */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">B. DATOS FINANCIEROS DE COMPRA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio de compra original: $ *
                        </label>
                        <input
                          type="number"
                          value={property.purchasePrice}
                          onChange={(e) => updateProperty(property.id, { purchasePrice: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Down payment invertido: $ *
                        </label>
                        <input
                          type="number"
                          value={property.downPayment}
                          onChange={(e) => updateProperty(property.id, { downPayment: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mejoras de capital realizadas: $ *
                        </label>
                        <input
                          type="number"
                          value={property.capitalImprovements}
                          onChange={(e) => updateProperty(property.id, { capitalImprovements: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor estimado actual: $ *
                        </label>
                        <input
                          type="number"
                          value={property.currentValue}
                          onChange={(e) => updateProperty(property.id, { currentValue: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* C. DEUDA ACTUAL */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">C. DEUDA ACTUAL</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Balance pendiente del mortgage: $ *
                        </label>
                        <input
                          type="number"
                          value={property.mortgageBalance}
                          onChange={(e) => updateProperty(property.id, { mortgageBalance: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pago mensual de mortgage: $ *
                        </label>
                        <input
                          type="number"
                          value={property.monthlyPayment}
                          onChange={(e) => updateProperty(property.id, { monthlyPayment: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tasa de interés actual: % *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={property.interestRate}
                          onChange={(e) => updateProperty(property.id, { interestRate: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Años restantes del loan: *
                        </label>
                        <input
                          type="number"
                          value={property.remainingYears}
                          onChange={(e) => updateProperty(property.id, { remainingYears: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* D. INGRESOS ACTUALES */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800 font-dancing-script">D. INGRESOS ACTUALES</h4>
                      <button
                        onClick={() => addUnit(property.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Unidad</span>
                      </button>
                    </div>

                    {property.units.map((unit, unitIndex) => (
                      <div key={unitIndex} className="border border-gray-200 rounded p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">Unidad #{unit.unitNumber}</h5>
                          <button
                            onClick={() => removeUnit(property.id, unitIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Renta actual $ *
                            </label>
                            <input
                              type="number"
                              value={unit.currentRent}
                              onChange={(e) => updateUnit(property.id, unitIndex, { currentRent: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Estado *
                            </label>
                            <select
                              value={unit.isOccupied ? 'occupied' : 'vacant'}
                              onChange={(e) => updateUnit(property.id, unitIndex, { isOccupied: e.target.value === 'occupied' })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                            >
                              <option value="occupied">Ocupada</option>
                              <option value="vacant">Vacante</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Renta de mercado $ *
                            </label>
                            <input
                              type="number"
                              value={unit.marketRent}
                              onChange={(e) => updateUnit(property.id, unitIndex, { marketRent: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                              required
                            />
                          </div>
                        </div>

                        {!unit.isOccupied && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ¿Cuántos días vacante? *
                            </label>
                            <input
                              type="number"
                              value={unit.vacantDays || ''}
                              onChange={(e) => updateUnit(property.id, unitIndex, { vacantDays: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                              required
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* E. GASTOS OPERATIVOS MENSUALES */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">E. GASTOS OPERATIVOS MENSUALES</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Impuestos prediales: $ *
                        </label>
                        <input
                          type="number"
                          value={property.propertyTaxes}
                          onChange={(e) => updateProperty(property.id, { propertyTaxes: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seguro: $ *
                        </label>
                        <input
                          type="number"
                          value={property.insurance}
                          onChange={(e) => updateProperty(property.id, { insurance: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Property management: $ *
                        </label>
                        <input
                          type="number"
                          value={property.propertyManagement}
                          onChange={(e) => updateProperty(property.id, { propertyManagement: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mantenimiento promedio: $ *
                        </label>
                        <input
                          type="number"
                          value={property.maintenance}
                          onChange={(e) => updateProperty(property.id, { maintenance: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Servicios (agua, gas, etc.): $ *
                        </label>
                        <input
                          type="number"
                          value={property.utilities}
                          onChange={(e) => updateProperty(property.id, { utilities: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marketing/advertising: $ *
                        </label>
                        <input
                          type="number"
                          value={property.marketing}
                          onChange={(e) => updateProperty(property.id, { marketing: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Otros gastos: $ *
                        </label>
                        <input
                          type="number"
                          value={property.otherExpenses}
                          onChange={(e) => updateProperty(property.id, { otherExpenses: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* F. ESTADO OPERATIVO */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">F. ESTADO OPERATIVO</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`expiring-${property.id}`}
                          checked={property.leasesExpiring3Months}
                          onChange={(e) => updateProperty(property.id, { leasesExpiring3Months: e.target.checked })}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300 rounded"
                        />
                        <label htmlFor={`expiring-${property.id}`} className="text-sm font-medium text-gray-700">
                          ¿Hay leases que vencen en próximos 3 meses?
                        </label>
                      </div>

                      {property.leasesExpiring3Months && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Si sí, ¿cuántos?: *
                          </label>
                          <input
                            type="number"
                            value={property.expiringLeasesCount}
                            onChange={(e) => updateProperty(property.id, { expiringLeasesCount: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                            required
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`late-${property.id}`}
                          checked={property.latePaymentTenants}
                          onChange={(e) => updateProperty(property.id, { latePaymentTenants: e.target.checked })}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300 rounded"
                        />
                        <label htmlFor={`late-${property.id}`} className="text-sm font-medium text-gray-700">
                          ¿Tienes inquilinos con pagos tardíos recurrentes?
                        </label>
                      </div>

                      {property.latePaymentTenants && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Si sí, ¿cuántos?: *
                          </label>
                          <input
                            type="number"
                            value={property.latePaymentCount}
                            onChange={(e) => updateProperty(property.id, { latePaymentCount: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                            required
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`complaints-${property.id}`}
                          checked={property.reportedComplaints}
                          onChange={(e) => updateProperty(property.id, { reportedComplaints: e.target.checked })}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300 rounded"
                        />
                        <label htmlFor={`complaints-${property.id}`} className="text-sm font-medium text-gray-700">
                          ¿Hay quejas o problemas reportados?
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* G. MANTENIMIENTO Y CAPEX */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">G. MANTENIMIENTO Y CAPEX</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Edad del HVAC: años *
                        </label>
                        <input
                          type="number"
                          value={property.hvacAge}
                          onChange={(e) => updateProperty(property.id, { hvacAge: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado del HVAC *
                        </label>
                        <select
                          value={property.hvacCondition}
                          onChange={(e) => updateProperty(property.id, { hvacCondition: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                        >
                          <option value="good">Bueno</option>
                          <option value="fair">Regular</option>
                          <option value="needs_replacement">Requiere reemplazo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Edad del techo: años *
                        </label>
                        <input
                          type="number"
                          value={property.roofAge}
                          onChange={(e) => updateProperty(property.id, { roofAge: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado del techo *
                        </label>
                        <select
                          value={property.roofCondition}
                          onChange={(e) => updateProperty(property.id, { roofCondition: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                        >
                          <option value="good">Bueno</option>
                          <option value="fair">Regular</option>
                          <option value="needs_replacement">Requiere reemplazo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plomería *
                        </label>
                        <select
                          value={property.plumbingCondition}
                          onChange={(e) => updateProperty(property.id, { plumbingCondition: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                        >
                          <option value="good">Bueno</option>
                          <option value="fair">Regular</option>
                          <option value="needs_update">Requiere actualización</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reparaciones diferidas estimadas: $ *
                        </label>
                        <input
                          type="number"
                          value={property.deferredRepairs}
                          onChange={(e) => updateProperty(property.id, { deferredRepairs: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Renovaciones planeadas (próximos 12 meses): $ *
                        </label>
                        <input
                          type="number"
                          value={property.plannedRenovations}
                          onChange={(e) => updateProperty(property.id, { plannedRenovations: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-navy focus:border-navy"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* H. OPORTUNIDADES IDENTIFICADAS */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 font-dancing-script">H. OPORTUNIDADES IDENTIFICADAS</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`below-market-${property.id}`}
                          checked={property.belowMarketRents}
                          onChange={(e) => updateProperty(property.id, { belowMarketRents: e.target.checked })}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300 rounded"
                        />
                        <label htmlFor={`below-market-${property.id}`} className="text-sm font-medium text-gray-700">
                          ¿Hay unidades con renta bajo mercado?
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`refinance-${property.id}`}
                          checked={property.considerRefinance}
                          onChange={(e) => updateProperty(property.id, { considerRefinance: e.target.checked })}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300 rounded"
                        />
                        <label htmlFor={`refinance-${property.id}`} className="text-sm font-medium text-gray-700">
                          ¿Consideras refinanciar esta propiedad?
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`improvements-${property.id}`}
                          checked={property.planImprovements}
                          onChange={(e) => updateProperty(property.id, { planImprovements: e.target.checked })}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300 rounded"
                        />
                        <label htmlFor={`improvements-${property.id}`} className="text-sm font-medium text-gray-700">
                          ¿Planeas mejoras para aumentar renta?
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {formData.properties.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={addProperty}
                    className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-gray-600 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar otra propiedad</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {currentSection === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center mb-6 font-dancing-script">
                SECCIÓN 3: OBJETIVOS Y PRIORIDADES
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuál es tu meta de NOI este año? $ *
                  </label>
                  <input
                    type="number"
                    value={formData.goalsAndPriorities.noiTarget}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      goalsAndPriorities: { ...prev.goalsAndPriorities, noiTarget: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Tienes capital disponible para inversiones? $ *
                  </label>
                  <input
                    type="number"
                    value={formData.goalsAndPriorities.availableCapital}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      goalsAndPriorities: { ...prev.goalsAndPriorities, availableCapital: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad #1 *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'increase_rent', label: 'Aumentar renta' },
                      { value: 'reduce_vacancy', label: 'Reducir vacantes' },
                      { value: 'refinance', label: 'Refinanciar' },
                      { value: 'expand_portfolio', label: 'Expandir portfolio' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={option.value}
                          name="mainPriority"
                          value={option.value}
                          checked={formData.goalsAndPriorities.mainPriority === option.value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            goalsAndPriorities: { ...prev.goalsAndPriorities, mainPriority: e.target.value as any }
                          }))}
                          className="w-4 h-4 text-navy focus:ring-navy border-gray-300"
                        />
                        <label htmlFor={option.value} className="text-sm font-medium text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSection === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center mb-6 font-dancing-script">
                SECCIÓN 4: INFORMACIÓN DE MERCADO
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renta promedio 1BR en tu área: $ *
                  </label>
                  <input
                    type="number"
                    value={formData.marketInfo.avgRent1BR}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      marketInfo: { ...prev.marketInfo, avgRent1BR: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renta promedio 2BR en tu área: $ *
                  </label>
                  <input
                    type="number"
                    value={formData.marketInfo.avgRent2BR}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      marketInfo: { ...prev.marketInfo, avgRent2BR: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renta promedio 3BR en tu área: $ *
                  </label>
                  <input
                    type="number"
                    value={formData.marketInfo.avgRent3BR}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      marketInfo: { ...prev.marketInfo, avgRent3BR: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de interés actual disponible: % *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.marketInfo.currentInterestRate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      marketInfo: { ...prev.marketInfo, currentInterestRate: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentSection === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentSection === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Atrás
          </button>
          <button
            onClick={handleNext}
            disabled={!validateSection(currentSection)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              validateSection(currentSection)
                ? 'bg-navy text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{currentSection === totalSections ? 'Completar Formulario' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
