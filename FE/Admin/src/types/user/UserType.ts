export interface UserType {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}
