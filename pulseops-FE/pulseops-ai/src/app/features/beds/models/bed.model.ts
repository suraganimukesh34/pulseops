export interface Bed {
  id: string;
  department_id: string;
  bed_number: string;
  status: string;
  patient_id: string | null;
  admitted_date: string | null;
}

export interface BedCreate {
  department_id: string;
  bed_number: string;
  status: string;
  patient_id?: string | null;
  admitted_date?: string | null;
}

export interface BedAdmitRequest {
  patient_id: string;
  admitted_date: string;
}
