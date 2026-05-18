export interface NotificationDTO {
  id: number;
  lotId: number;
  lotName: string;
  type:
    | 'HARVEST_7_DAYS'
    | 'HARVEST_3_DAYS'
    | 'HARVEST_1_DAY'
    | 'HARVEST_OVERDUE'
    | 'INACTIVITY_WARNING'
    | 'INACTIVITY_CRITICAL';
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  createdAt: string;
  read: boolean;
}
