
export type SupplementCategory = 'vitamin' | 'creatine' | 'other';

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  category: SupplementCategory;
  reminderHour: number; // 24h format, minutes default to 0
  lastTakenDate: string | null; // Stored as 'YYYY-MM-DD'
  history: string[]; // Dates when taken ['YYYY-MM-DD']
}
