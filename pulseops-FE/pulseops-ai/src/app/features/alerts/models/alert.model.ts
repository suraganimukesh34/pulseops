export interface Alert {
  id: string;
  severity: string;
  category: string;
  message: string;
  source: string;
  department_id: string | null;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by: string | null;
}

export interface AlertCreate {
  severity: string;
  category: string;
  message: string;
  source: string;
  department_id: string | null;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by: string | null;
}
