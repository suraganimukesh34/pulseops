export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department_id: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  notes: string | null;
}

export interface AppointmentCreate {
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department_id: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  notes: string | null;
}
