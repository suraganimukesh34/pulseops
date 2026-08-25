export interface HospitalProfile {
  hospital_name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  app_name: string;
  logo_icon: string;
  accent_color: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  staff_id: string | null;
  active: boolean;
}
