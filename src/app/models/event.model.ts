export interface Event {
  id: number;

  lotId: number;
  lotName: string;

  type: string;
  category: string;

  userId: number;
  userName: string;

  timestamp: string;
  description: string;

  createdAt: string;
}
