export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  profileCompleted: boolean;
  createdAt: string | null;
}
