/**
 * Modelo de datos para Cultivo.
 * Representa un cultivo agrícola en el sistema del invernadero.
 *
 * @example
 * ```typescript
 * const crop: Crop = {
 *   id: 1,
 *   name: 'Tomate',
 *   description: 'Tomate cherry variedad',
 *   inactivityDaysThreshold: 30,
 *   estimatedGrowthDays: 90
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface Crop {
  /** Identificador único del cultivo */
  id: number;
  /** Nombre del cultivo (ej: 'Tomate', 'Lechuga', 'Pimiento') */
  name: string;
  /** Descripción detallada del cultivo */
  description: string;
  /** Días de inactividad permitidos antes de marcar como inactivo */
  inactivityDaysThreshold: number;
  /** Días estimados de crecimiento hasta cosecha */
  estimatedGrowthDays: number;
  /** Frecuencia de riego automático en horas */
  irrigationFrequencyHours?: number;
  /** Días recomendados entre fertilizaciones */
  recommendedFertilizationDays?: number;
  /** Días recomendados entre controles de plagas */
  recommendedPestControlDays?: number;
}
