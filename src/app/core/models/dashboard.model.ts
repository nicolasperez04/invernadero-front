/**
 * DTOs for Dashboard API responses
 */

export interface EventChartDTO {
  labels: string[]; // Fechas en formato ISO (yyyy-MM-dd)
  values: number[]; // Cantidad de eventos por día
}

export interface LotStatusDTO {
  lotId: number;
  lotName: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  inactivityLevel: 'GREEN' | 'YELLOW' | 'RED';
}

export interface LotProgressDTO {
  lotId: number;
  lotName: string;
  progress: number;
  estimatedHarvestDate: string;
  sowingDate: string;
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
}

export interface DashboardResponse {
  eventChart: EventChartDTO;
  lotStatuses: LotStatusDTO[];
  lotProgress: LotProgressDTO[];
}

// Helper type para status visual
export type StatusColor = 'green' | 'yellow' | 'red';

export const STATUS_COLORS: Record<'GREEN' | 'YELLOW' | 'RED', StatusColor> = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

export const STATUS_LABELS: Record<'GREEN' | 'YELLOW' | 'RED', string> = {
  GREEN: 'Activo',
  YELLOW: 'Inactividad moderada',
  RED: 'Inactividad crítica',
};

export const STATUS_ICONS: Record<'GREEN' | 'YELLOW' | 'RED', string> = {
  GREEN: 'check_circle',
  YELLOW: 'warning',
  RED: 'error',
};
