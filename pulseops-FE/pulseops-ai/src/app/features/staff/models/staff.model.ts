export interface Staff {
  id: string;
  name: string;
  role: string;
  department_id: string;
  specialization: string | null;
  shift: string;
  status: string;
  email: string;
  phone: string;
  joined_date: string;
}

export interface StaffCreate {
  name: string;
  role: string;
  department_id: string;
  specialization?: string | null;
  shift: string;
  status: string;
  email: string;
  phone: string;
  joined_date: string;
}
