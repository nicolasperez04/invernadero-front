export interface Lot {
  id: number;
  name: string;
  cropId: number;
  cropName: string;
  startDate: string;
  endDate?: string;
}

export interface LotSummary {
  lotId: number;
  lotName: string;
  status: 'CREATED' | 'IN_PRODUCTION' | 'FINISHED';
  inactivityStatus: 'GREEN' | 'YELLOW' | 'RED';
  totalEvents: number;
  durationDays: number;
  eventFrequency: number;
  sowingDate: string;
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  estimatedHarvestDate: string;
  lastEventDate: string | null;
  lastEventType: string | null;
}