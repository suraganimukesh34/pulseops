export type Role = 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
