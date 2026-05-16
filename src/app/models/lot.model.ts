/**
 * Modelo de datos para Lote.
 * Representa un lote del invernadero donde se cultivan plantas.
 *
 * @example
 * ```typescript
 * const lot: Lot = {
 *   id: 1,
 *   name: 'Lote A1',
 *   cropId: 1,
 *   cropName: 'Tomate',
 *   startDate: '2024-01-15T00:00:00Z',
 *   endDate: undefined // Aún en producción
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface Lot {
  /** Identificador único del lote */
  id: number;
  /** Nombre descriptivo del lote (ej: 'Lote A1', 'Invernadero Principal') */
  name: string;
  /** ID del cultivo asociado a este lote */
  cropId: number;
  /** Nombre del cultivo asociado (para visualización) */
  cropName: string;
  /** Fecha de inicio del lote (inicio de cultivo) */
  startDate: string;
  /** Fecha de fin del lote (cosecha/terminación), undefined si está activo */
  endDate?: string;
  /** Estado persistido del lote: CREATED, IN_PRODUCTION, FINISHED */
  status?: string;
}

/**
 * Modelo de datos para el resumen de métricas de un lote.
 * Provee información de estado, progreso y estadísticas de eventos.
 *
 * @example
 * ```typescript
 * const summary: LotSummary = {
 *   lotId: 1,
 *   lotName: 'Lote A1',
 *   status: 'IN_PRODUCTION',
 *   inactivityStatus: 'GREEN',
 *   totalEvents: 15,
 *   durationDays: 90,
 *   eventFrequency: 6.0,
 *   sowingDate: '2024-01-15T00:00:00Z',
 *   totalDays: 120,
 *   daysElapsed: 45,
 *   daysRemaining: 75,
 *   estimatedHarvestDate: '2024-05-15T00:00:00Z',
 *   lastEventDate: '2024-03-01T00:00:00Z',
 *   lastEventType: 'RIEGO'
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface LotSummary {
  /** ID del lote */
  lotId: number;
  /** Nombre del lote */
  lotName: string;
  /** Estado actual del lote */
  status: 'CREATED' | 'IN_PRODUCTION' | 'FINISHED';
  /** Estado de inactividad (verde=activo, amarillo=advertencia, rojo=inactivo) */
  inactivityStatus: 'GREEN' | 'YELLOW' | 'RED';
  /** Total de eventos registrados en el lote */
  totalEvents: number;
  /** Duración total planificada del lote en días */
  durationDays: number;
  /** Frecuencia promedio de eventos (días entre eventos) */
  eventFrequency: number;
  /** Fecha de siembra */
  sowingDate: string;
  /** Total de días del ciclo */
  totalDays: number;
  /** Días transcurridos desde el inicio */
  daysElapsed: number;
  /** Días restantes hasta cosecha */
  daysRemaining: number;
  /** Fecha estimada de cosecha */
  estimatedHarvestDate: string;
  /** Fecha del último evento registrado */
  lastEventDate: string | null;
  /** Tipo del último evento */
  lastEventType: string | null;
}
