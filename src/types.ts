export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  time: string; // e.g., "08:00"
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface MedicalCost {
  operationName: string;
  averagePrice: number;
  range: string;
  notes: string;
}

export interface Place {
  name: string;
  description: string;
  category: string;
  uri?: string;
}
