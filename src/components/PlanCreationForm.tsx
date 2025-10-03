import React, { useState } from 'react';

interface PlanFormData {
  nombrePlan: string;
  duracion: string;
  roiEsperado: string;
  especificaciones: string;
  numeroPlanes: string;
}

interface PlanCreationFormProps {
  onSubmit: (formData: PlanFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PlanCreationForm({ onSubmit, onCancel, isSubmitting }: PlanCreationFormProps) {
  const [formData, setFormData] = useState<PlanFormData>({
    nombrePlan: '',
    duracion: '',
    roiEsperado: '',
    especificaciones: '',
    numeroPlanes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-black mb-6">Crear Nuevo Plan</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombrePlan" className="block text-sm font-medium text-gray-700 mb-2">
              1. Nombre del Plan *
            </label>
            <input
              type="text"
              id="nombrePlan"
              name="nombrePlan"
              value={formData.nombrePlan}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="Ej: Plan de Expansión Miami"
            />
          </div>

          <div>
            <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-2">
              2. Duración *
            </label>
            <input
              type="text"
              id="duracion"
              name="duracion"
              value={formData.duracion}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Ej: 4 meses"
            />
          </div>

          <div>
            <label htmlFor="roiEsperado" className="block text-sm font-medium text-gray-700 mb-2">
              3. ROI Esperado *
            </label>
            <input
              type="text"
              id="roiEsperado"
              name="roiEsperado"
              value={formData.roiEsperado}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="Ej: 300%"
            />
          </div>

          <div>
            <label htmlFor="especificaciones" className="block text-sm font-medium text-gray-700 mb-2">
              4. Especificaciones *
            </label>
            <textarea
              id="especificaciones"
              name="especificaciones"
              value={formData.especificaciones}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="Ej: Quiero que mi plan para mi inmobiliaria sea para aumentar mi ROI en específico en Miami, Estados Unidos y Ohio para aumentar mi presencia. Créame un plan por favor."
            />
          </div>

          <div>
            <label htmlFor="numeroPlanes" className="block text-sm font-medium text-gray-700 mb-2">
              5. Número de Planas
            </label>
            <input
              type="number"
              id="numeroPlanes"
              name="numeroPlanes"
              value={formData.numeroPlanes}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              placeholder="Ej: 5"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}