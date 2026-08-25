export interface DepartmentLoadItem {
  department_id: string;
  department_name: string;
  patient_count: number;
  bed_capacity: number;
  occupied_beds: number;
  load_percentage: number;
}

export interface DashboardSummary {
  total_patients: number;
  critical_patients: number;
  total_beds: number;
  available_beds: number;
  occupied_beds: number;
  bed_occupancy_rate: number;
  staff_total: number;
  staff_on_duty: number;
  appointments_today: number;
  active_alerts: number;
  critical_alerts: number;
  er_queue: number;
  pending_billing_total: number;
  overdue_invoices: number;
  low_stock_items: number;
  hospital_status: 'Normal' | 'Elevated' | 'Critical';
  department_load: DepartmentLoadItem[];
}

export interface DashboardAlertPreview {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: string;
}
