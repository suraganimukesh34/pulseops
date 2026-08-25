export interface Department {
  id: string;
  name: string;
  floor: number;
  head_doctor_id: string | null;
  head_doctor_name: string | null;
  bed_capacity: number;
  status: string;
}

export interface DepartmentCreate {
  name: string;
  floor: number;
  head_doctor_id?: string | null;
  head_doctor_name?: string | null;
  bed_capacity: number;
  status: string;
}
