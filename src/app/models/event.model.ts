/**
 * Modelo de datos para Evento.
 * Representa una actividad o acción registrada en un lote del invernadero.
 *
 * Los eventos incluyen: siembras, cosechas, riegos, fertilizaciones, etc.
 *
 * @example
 * ```typescript
 * const event: Event = {
 *   id: 1,
 *   lotId: 1,
 *   lotName: 'Lote A1',
 *   type: 'SIEMBRA',
 *   category: 'PRODUCCION',
 *   userId: 1,
 *   userName: 'Juan Pérez',
 *   timestamp: '2024-01-15T10:30:00Z',
 *   description: 'Siembra de tomate cherry',
 *   createdAt: '2024-01-15T10:30:00Z'
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface Event {
  /** Identificador único del evento */
  id: number;

  /** ID del lote donde se registró el evento */
  lotId: number;
  /** Nombre del lote (para visualización) */
  lotName: string;

  /** Tipo de evento (ej: 'SIEMBRA', 'COSECHA', 'RIEGO', 'FERTILIZACION') */
  type: string;
  /** Categoría del evento (ej: 'PRODUCCION', 'MANTENIMIENTO', 'CONTROL') */
  category: string;

  /** ID del usuario que registró el evento */
  userId: number;
  /** Nombre del usuario que registró el evento */
  userName: string;

  /** Fecha y hora del evento */
  timestamp: string;
  /** Descripción adicional o notas del evento */
  description: string;

  /** Fecha de creación del registro en el sistema */
  createdAt: string;
}
