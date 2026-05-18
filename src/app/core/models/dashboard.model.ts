/**
 * DTOs (Data Transfer Objects) para las respuestas de la API del Dashboard.
 *
 * Estos modelos definen la estructura de datos que el backend envía
 * para las métricas y visualizaciones del dashboard del invernadero.
 *
 * @module Dashboard Models
 * @since 1.0.0
 */

/**
 * DTO para los datos del gráfico de eventos.
 * Representa la actividad de eventos por fecha.
 *
 * @example
 * ```typescript
 * const eventChart: EventChartDTO = {
 *   labels: ['2024-01-01', '2024-01-02', '2024-01-03'],
 *   values: [5, 8, 3]
 * };
 * ```
 */
export interface EventChartDTO {
  /** Fechas en formato ISO (yyyy-MM-dd) */
  labels: string[];
  /** Cantidad de eventos por cada fecha */
  values: number[];
}

/**
 * DTO para el estado de un lote.
 * Muestra el estado actual y nivel de inactividad.
 *
 * @example
 * ```typescript
 * const lotStatus: LotStatusDTO = {
 *   lotId: 1,
 *   lotName: 'Lote A1',
 *   status: 'GREEN',
 *   inactivityLevel: 'GREEN'
 * };
 * ```
 */
export interface LotStatusDTO {
  /** ID único del lote */
  lotId: number;
  /** Nombre descriptivo del lote */
  lotName: string;
  /** Estado del lote (CREATED | IN_PRODUCTION | FINISHED) */
  status: 'CREATED' | 'IN_PRODUCTION' | 'FINISHED';
  /** Nivel de inactividad del lote */
  inactivityLevel: 'GREEN' | 'YELLOW' | 'RED';
}

/**
 * DTO para el progreso de un lote.
 * Muestra información de avance y fechas estimadas.
 *
 * @example
 * ```typescript
 * const lotProgress: LotProgressDTO = {
 *   lotId: 1,
 *   lotName: 'Lote A1',
 *   progress: 45,
 *   estimatedHarvestDate: '2024-05-15T00:00:00Z',
 *   sowingDate: '2024-01-15T00:00:00Z',
 *   totalDays: 120,
 *   daysElapsed: 54,
 *   daysRemaining: 66
 * };
 * ```
 */
export interface LotProgressDTO {
  /** ID único del lote */
  lotId: number;
  /** Nombre del lote */
  lotName: string;
  /** Porcentaje de progreso (0-100) */
  progress: number;
  /** Fecha estimada de cosecha */
  estimatedHarvestDate: string;
  /** Fecha de siembra */
  sowingDate: string;
  /** Total de días del ciclo */
  totalDays: number;
  /** Días transcurridos desde la siembra */
  daysElapsed: number;
  /** Días restantes hasta la cosecha */
  daysRemaining: number;
}

export interface UpcomingHarvestDTO {
  lotId: number;
  lotName: string;
  estimatedHarvestDate: string;
  daysRemaining: number;
}

/**
 * Respuesta completa del endpoint de dashboard.
 * Combina todos los DTOs en una sola respuesta.
 *
 * @example
 * ```typescript
 * const dashboard: DashboardResponse = {
 *   eventChart: { labels: [...], values: [...] },
 *   lotStatuses: [
 *     { lotId: 1, lotName: 'Lote A1', status: 'GREEN', inactivityLevel: 'GREEN' }
 *   ],
 *   lotProgress: [
 *     { lotId: 1, lotName: 'Lote A1', progress: 45, ... }
 *   ]
 * };
 * ```
 */
export interface DashboardResponse {
  /** Datos del gráfico de eventos */
  eventChart: EventChartDTO;
  /** Lista de estados de lotes */
  lotStatuses: LotStatusDTO[];
  /** Lista de progreso de lotes */
  lotProgress: LotProgressDTO[];
  /** Lista de próximas cosechas */
  upcomingHarvests: UpcomingHarvestDTO[];
}

/**
 * Tipo helper para el color de estado visual.
 * Utilizado en el componente para aplicar estilos.
 */
export type StatusColor = 'green' | 'yellow' | 'red';

/**
 * Mapeo de códigos de estado a colores CSS.
 *
 * @example
 * ```typescript
 * const color = STATUS_COLORS['GREEN']; // 'green'
 * ```
 */
export const STATUS_COLORS: Record<'GREEN' | 'YELLOW' | 'RED', StatusColor> = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

/**
 * Mapeo de códigos de estado a etiquetas legibles.
 * Las etiquetas están en español.
 *
 * @example
 * ```typescript
 * const label = STATUS_LABELS['GREEN']; // 'Activo'
 * ```
 */
export const STATUS_LABELS: Record<'GREEN' | 'YELLOW' | 'RED', string> = {
  GREEN: 'Activo',
  YELLOW: 'Inactividad moderada',
  RED: 'Inactividad crítica',
};

/**
 * Mapeo de códigos de estado a iconos de Material Icons.
 *
 * @example
 * ```typescript
 * const icon = STATUS_ICONS['GREEN']; // 'check_circle'
 * ```
 */
export const STATUS_ICONS: Record<'GREEN' | 'YELLOW' | 'RED', string> = {
  GREEN: 'check_circle',
  YELLOW: 'warning',
  RED: 'error',
};
